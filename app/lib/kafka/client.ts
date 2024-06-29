import { Kafka } from "kafkajs";

export const kafkaInstance = new Kafka({
  clientId: "mailer-service",
  brokers: ["localhost:9092"],
});
