import { MailData } from "@types";
import { produceMessage } from "../lib/kafka/produce.js";
import { MAIL_DATA_SCHEMA } from "../lib/zod.js";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hi, I am a mailer service.");
});

router.post("/mail", async (req, res) => {
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

router.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default router;
