export type MailData = {
  fromName: string;
  toEmail: string;
  subject: string;
  html: string;
  allowReply?: boolean;
};
