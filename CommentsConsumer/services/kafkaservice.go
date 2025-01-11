package services

import (
	"context"
	"encoding/json"
	"log"

	"github.com/Aman123at/devrelay/commentsconsumer/database"
	"github.com/Aman123at/devrelay/commentsconsumer/models"
	"github.com/IBM/sarama"
)

// KafkaConsumer is a batch consumer for Kafka messages.
type KafkaConsumer struct {
	ConsumerGroup sarama.ConsumerGroup
	Topic         string
}

type ConsumerGroupHandler struct {
	kc *KafkaConsumer
}

// NewKafkaConsumer initializes a Kafka consumer group.
func NewKafkaConsumer(brokers []string, groupID string, topic string) (*KafkaConsumer, error) {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	config.Consumer.Offsets.Initial = sarama.OffsetOldest // Start from the oldest message

	consumerGroup, err := sarama.NewConsumerGroup(brokers, groupID, config)
	if err != nil {
		return nil, err
	}

	return &KafkaConsumer{
		ConsumerGroup: consumerGroup,
		Topic:         topic,
	}, nil
}
func (h *ConsumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (h *ConsumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (kc *KafkaConsumer) ConsumeMessages(ctx context.Context) error {
	handler := &ConsumerGroupHandler{kc: kc}
	for {
		err := kc.ConsumerGroup.Consume(ctx, []string{kc.Topic}, handler)
		if err != nil {
			return err
		}

		// Check for context cancellation (e.g., when shutting down the application)
		if ctx.Err() != nil {
			return ctx.Err()
		}
	}
}

// ConsumeClaim processes messages from the Kafka topic.
func (h *ConsumerGroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {

	for message := range claim.Messages() {
		var comment models.Comment
		unmarshalerr := json.Unmarshal(message.Value, &comment)
		if unmarshalerr != nil {
			log.Println("Unable to unmarshal message")
			// Mark the message as processed
			session.MarkMessage(message, "")
			continue
		}
		database.InsertComment(comment)
		// Mark the message as processed
		session.MarkMessage(message, "")
	}

	return nil
}
