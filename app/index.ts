import express from "express";
import cors from "cors";
import { default as authMiddleware } from "./middleware/auth.js";
import {
  connectProducer,
  disconnectProducer,
  produceMessage,
} from "./lib/kafka/produce.js";
import sendEmail, { verifySMTP } from "./lib/mailer.js";
import { consumeMessage } from "./lib/kafka/consume.js";
import { MAIL_DATA_SCHEMA } from "./lib/zod.js";
import { MailData } from "@types";
const app = express();
const PORT = process.env.PORT || 6543;

app.use(cors({ origin: "*" }));
app.use(authMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/mail", async (req, res) => {
  // Produce the message to kafka queue
  try {
    const parsedData = MAIL_DATA_SCHEMA.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ error: parsedData.error.flatten().fieldErrors });
    }
    const data: MailData = {
      fromName: parsedData.data.fromService,
      toEmail: parsedData.data.toEmail,
      subject: parsedData.data.subject,
      html: parsedData.data.html,
      allowReply: parsedData.data.allowReply,
    };
    await produceMessage(data);
    res.json({ message: "Queued" });
  } catch (error) {
    console.error("Error while producing message", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app
  .listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`);
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
