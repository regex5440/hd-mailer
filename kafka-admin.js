import { kafkaInstance } from "./build/lib/kafka/client.js";
import { KAFKA_CONFIG } from "./build/lib/kafka/enum.js";

function setupKafkaTopics() {
  console.log("Initializing Kafka topics");
  const admin = kafkaInstance.admin({
    retry: {
      maxRetryTime: 30000,
    },
  });
  admin
    .connect()
    .then(async () => {
      console.log("Connected to Kafka");
      const availableTopics = await admin.listTopics();
      if (availableTopics.includes(KAFKA_CONFIG.TOPIC.MAIL_QUEUE)) {
        console.log("Kafka topics already created");
        return;
      } else {
        await admin.createTopics({
          topics: [
            {
              topic: KAFKA_CONFIG.TOPIC.MAIL_QUEUE,
              numPartitions: 1,
            },
          ],
        });
        console.log("Kafka topics created successfully");
      }
      console.log("Topics Available: ", await admin.listTopics());
    })
    .then(async () => {
      return admin.disconnect();
    });
}

export { setupKafkaTopics };
