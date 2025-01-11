import { Kafka } from "kafkajs";
import { bulkInsertPosts } from "../utils/helper.js";
import dotenv from "dotenv";
dotenv.config()

const topic = process.env.KAFKA_TOPIC;

export default class KafkaService {
    constructor () {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER_URL]
        });

        this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP_ID });
    }

    async initConsumer() {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic, fromBeginning: true });
            await this.consumer.run({
                eachBatch: async ({
                    batch,
                    heartbeat,
                    commitOffsetsIfNecessary,
                    resolveOffset,
                }) => {
                    const posts = batch.messages;
                    console.log("Received Messages In Kafka: ", posts.length);
                    bulkInsertPosts(posts.map((post) => post.value.toString()));
                    for (const post of posts) {
                        try {
                            await commitOffsetsIfNecessary(post.offset);
                            resolveOffset(post.offset);
                            await heartbeat();
                        } catch (error) {
                            console.log("Error commiting offset", error);
                        }
                    }
                }
            });
        } catch (error) {
            console.log("Error Connecting Kafka: ", error);
        }
    }
}