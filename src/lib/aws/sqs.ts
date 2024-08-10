import { SQS, config as AWSConfig, AWSError } from "aws-sdk";

AWSConfig.update({ region: process.env.AWS_REGION });

export const sendMessageToSQS = async (
  data: object
): Promise<AWSError | SQS.SendMessageResult> => {
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
