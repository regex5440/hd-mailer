import { MailData } from "@types";
import { sendMessageToSQS } from "src/lib/aws/sqs.js";
import { MAIL_DATA_SCHEMA } from "src/lib/zod.js";
import { APIGatewayEvent, Handler } from "aws-lambda";
import { isTokenValid } from "src/lib/jwt";

export const handler: Handler = async (
  event: APIGatewayEvent,
  context,
  callback
) => {
  try {
    const authToken = event.headers.Authorization?.split(" ")[1] ?? "";
    const isTokenValidResult = await isTokenValid(authToken);
    if (!isTokenValidResult) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized",
        }),
      };
    }
    const body = event.body;

    // Check if the payload is valid
    if (!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing payload!" }),
      };
    }

    let messageData: MailData;
    try {
      const bodyJson = JSON.parse(body);
      const parsedData = MAIL_DATA_SCHEMA.safeParse(bodyJson);
      if (!parsedData.success) {
        console.error(
          "Invalid payload",
          parsedData.error.flatten().fieldErrors
        );
        throw new Error("Invalid payload");
      }
      messageData = {
        fromName: parsedData.data.fromService,
        toEmail: parsedData.data.toEmail,
        subject: parsedData.data.subject,
        html: parsedData.data.html,
        allowReply: parsedData.data.allowReply,
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid payload" }),
      };
    }

    // Send the message to SQS
    const sqsResult = await sendMessageToSQS(messageData);
    if (sqsResult instanceof Error) {
      throw sqsResult;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Queued",
        messageId: sqsResult.MessageId,
      }),
    };
  } catch (error) {
    callback(error as Error, null);
    console.log(error as string, null);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
