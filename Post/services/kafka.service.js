import { Kafka } from "kafkajs";

export default class KafkaService {
    constructor () {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER_URL]
        });

        this.producer = this.kafka.producer();
    }

    async send(topic, message) {
        try {
            await this.producer.connect();
            await this.producer.send({
                topic,
                messages: [
                    { value: JSON.stringify(message) }
                ]
            });
            return true;
        } catch (error) {
            console.error("Can't send message to kafka",error);
            return false;
        }
    }
}