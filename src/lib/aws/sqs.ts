import { AWSError } from "aws-sdk/lib/error";
import SQS, { SendMessageResult } from "aws-sdk/clients/sqs";

export const sendMessageToSQS = async (
  data: object
): Promise<AWSError | SendMessageResult> => {
  const sqs = new SQS();

  return new Promise((resolve, reject) => {
    sqs.sendMessage(
      {
        QueueUrl: process.env.SQS_URL as string,
        MessageBody: JSON.stringify(data),
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};
