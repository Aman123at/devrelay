package main

import (
	"context"
	"log"
	"os"

	"github.com/Aman123at/devrelay/commentsconsumer/database"
	"github.com/Aman123at/devrelay/commentsconsumer/services"
)

func main() {
	log.Println("Welcome to Comments Consumer")
	groupID := os.Getenv("KAFKA_CONSUMER_GROUP")
	topic := os.Getenv("KAFKA_TOPIC")
	brokerurl := os.Getenv("KAFKA_BROKER_URL")
	brokers := []string{brokerurl}

	// Initialize the Kafka consumer
	consumer, err := services.NewKafkaConsumer(brokers, groupID, topic)
	if err != nil {
		log.Fatalf("Failed to create Kafka consumer: %v", err)
	}
	defer consumer.ConsumerGroup.Close()

	// Consume messages in batches
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log.Println("Starting Kafka consumer...")
	if err := consumer.ConsumeMessages(ctx); err != nil {
		log.Fatalf("Error consuming messages: %v", err)
	}

}

func init() {
	pool, err := database.NewConnectionPool(10)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Successfully connected to Database and initiated connection pool")
	database.DbConnPool = pool
}
