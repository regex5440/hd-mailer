import express from "express";
import cors from "cors";
import { default as authMiddleware } from "./middleware/auth.js";
import sendEmail from "@lib/mailer.js";
import { consumeMessage } from "@lib/kafka/consume.js";
import { connectProducer, disconnectProducer } from "@lib/kafka/produce.js";
const app = express();
const PORT = process.env.PORT || 6543;

app.use(cors({ origin: "*" }));
app.use(authMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/mail", (req, res) => {
  // Produce the message to kafka queue
  console.log(req.body);
  // await produceMessage()
  res.json({ message: "Queued" });
});

app
  .listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`);
    await connectProducer();
    console.log("Producer is connected");
    await consumeMessage(sendEmail);
    console.log("Consumer is connected");
  })
  .on("close", async () => {
    console.log("Server is closing");
    await disconnectProducer();
  });
