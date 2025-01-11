package services

import (
	"os"

	"github.com/IBM/sarama"
)

func InitiKafkaProducer() (sarama.SyncProducer, error) {
	brokerurl := os.Getenv("KAFKA_BROKER_URL")
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5
	config.Producer.Return.Successes = true
	brokers := []string{brokerurl}

	return sarama.NewSyncProducer(brokers, config)
}
