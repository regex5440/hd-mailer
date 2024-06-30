import http from "http";
import express from "express";
import cors from "cors";
import { default as authMiddleware } from "./middleware/auth.js";
import { connectProducer, disconnectProducer } from "./lib/kafka/produce.js";
import sendEmail, { verifySMTP } from "./lib/mailer.js";
import { consumeMessage } from "./lib/kafka/consume.js";
import router from "./routes/index.js";
const app = express();
const PORT = process.env.HTTP_PORT || 6543;

app.use(cors({ origin: "*" }));
app.use(authMiddleware);
app.use(express.json());
app.use(router);

const httpServer = http.createServer(app);

httpServer
  .listen(PORT, async () => {
    console.log(`HTTP SERVER PORT: ${PORT}`);
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
