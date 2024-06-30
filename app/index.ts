import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import cors from "cors";
import { default as authMiddleware } from "./middleware/auth.js";
import { connectProducer, disconnectProducer } from "./lib/kafka/produce.js";
import sendEmail, { verifySMTP } from "./lib/mailer.js";
import { consumeMessage } from "./lib/kafka/consume.js";
import router from "./routes/index.js";
const app = express();
const PORT = process.env.HTTP_PORT || 80;

app.use(cors({ origin: "*" }));
app.use(authMiddleware);
app.use(express.json());
app.use(router);

async function startServer() {
  const privateKey = await fetch(process.env.CERTIFICATE_KEY).then((res) =>
    res.text()
  );
  const certificate = await fetch(process.env.CERTIFICATE).then((res) =>
    res.text()
  );

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(
    {
      key: privateKey,
      passphrase: process.env.CERTIFICATE_PASSPHRASE,
      cert: certificate,
    },
    app
  );

  httpsServer
    .listen(443, async () => {
      console.log(`HTTPS SERVER STARTED AT :443`);
      verifySMTP(async (err, success) => {
        if (!err) {
          await connectProducer();
          console.log("Producer is connected");
          await consumeMessage(sendEmail);
          console.log("Consumer is connected");
        } else {
          console.error("SMTP Server is not connected", err);
        }
      });
    })
    .on("close", async () => {
      console.log("Server is closing");
      await disconnectProducer();
    });

  httpServer
    .listen(PORT, async () => {
      console.log(`HTTP SERVER PORT: ${PORT}`);
      if (PORT === 80) {
        verifySMTP(async (err, success) => {
          if (!err) {
            await connectProducer();
            console.log("Producer is connected");
            await consumeMessage(sendEmail);
            console.log("Consumer is connected");
          } else {
            console.error("SMTP Server is not connected", err);
          }
        });
      }
    })
    .on("close", async () => {
      if (PORT === 80) {
        console.log("Server is closing");
        await disconnectProducer();
      }
    });
}

startServer();
