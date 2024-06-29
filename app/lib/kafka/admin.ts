import { kafkaInstance } from "./client.js";
import KAFKA_CONFIG from "./enum.js";

export async function setupKafkaTopics() {
  const admin = kafkaInstance.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: KAFKA_CONFIG.TOPIC.MAIL_QUEUE,
        numPartitions: 1,
      },
    ],
  });
  await admin.disconnect();
}
