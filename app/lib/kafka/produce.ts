import { nanoid } from "nanoid";
import { kafkaInstance } from "./client.js";
import KAFKA_CONFIG from "./enum.js";

const producer = kafkaInstance.producer();
export async function connectProducer() {
  await producer.connect();
}

export async function produceMessage(data: Record<string, any>) {
  await producer.send({
    topic: KAFKA_CONFIG.TOPIC.MAIL_QUEUE,
    messages: [
      {
        key: KAFKA_CONFIG.MESSAGE_KEY.MAIL_DATA,
        value: JSON.stringify(data),
      },
    ],
  });
}

export async function disconnectProducer() {
  await producer.disconnect();
}
