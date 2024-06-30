import { MailData } from "@types";
import { createTransport } from "nodemailer";

const mailTransporter = createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const verifySMTP = (
  callback: (err: Error | null, success: true) => void
) => {
  mailTransporter.verify(callback);
};

/**
 *
 * @param param.to Email address of recipient
 * @param param.subject Subject line of the Email
 * @param param.html HTML body of the email
 * @param param.sender Sender info @default sender hd.mailer <${process.env.EMAIL_USERNAME}>
 * @returns
 */
const sendEmail = async ({
  toEmail,
  subject,
  fromName = "HD Mailer",
  html,
  allowReply,
}: MailData) => {
  const sender = allowReply
    ? `${fromName} <${process.env.SMTP_USERNAME}>`
    : `${fromName} <noreply@${process.env.EMAIL_DOMAIN}`;
  return mailTransporter.sendMail({
    from: sender,
    to: toEmail,
    subject,
    html,
  });
};

export default sendEmail;
