import { MailData } from "@types";
import { kafkaInstance } from "./client.js";
import KAFKA_CONFIG from "./enum.js";

export async function consumeMessage(messageHandler: (data: MailData) => void) {
  const consumer = kafkaInstance.consumer({
    groupId: KAFKA_CONFIG.CONSUMER_GROUP.MAILER_CONSUMER,
  });
  consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_CONFIG.TOPIC.MAIL_QUEUE,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value?.toString();
      if (!messageValue) {
        return;
      }
      // messageHandler(messageValue as MailData);
      console.log({
        key: message.key,
        value: message.value?.toString(),
      });
    },
  });
}
