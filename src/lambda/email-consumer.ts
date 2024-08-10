import { MailData } from "@types";
import sendEmail from "src/lib/mailer.js";
import type { Handler, SQSEvent } from "aws-lambda";
import decryptEnvVar from "src/lib/aws/env-decrypt";

export const handler: Handler = async (event: SQSEvent) => {
  process.env.SMTP_PASSWORD.endsWith("=")
    ? await decryptEnvVar("SMTP_PASSWORD")
    : null;
  if (event.Records.length === 0) {
    return;
  }
  console.log("Received event", event);
  try {
    for (const record of event.Records) {
      const messageData: MailData = JSON.parse(record.body);
      const x = await sendEmail(messageData);
      console.log("EmailSent", x.messageId);
    }
  } catch (error) {
    console.error("Error while processing message", error);
  }
  return;
};
