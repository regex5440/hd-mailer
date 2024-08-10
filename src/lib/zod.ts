import z from "zod";

export const MAIL_DATA_SCHEMA = z.object({
  fromService: z.string({ message: "Invalid Service Name" }).min(1),
  toEmail: z.string().email("Invalid email"),
  subject: z.string({ message: "Subject is required" }).min(1),
  html: z.string({ message: "HTML body is required" }).min(1),
  allowReply: z.boolean().optional().default(false),
});
