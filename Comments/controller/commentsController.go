package controller

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"github.com/Aman123at/devrelay/comments/database"
	"github.com/Aman123at/devrelay/comments/models"
	"github.com/Aman123at/devrelay/comments/services"
	"github.com/IBM/sarama"
	"github.com/gin-gonic/gin"
)

func GetComments(c *gin.Context) {
	postIdstr := c.Param("postId")
	page_no_str := c.Query("page_no")
	results_per_page_str := c.Query("results_per_page")
	page_no, err := strconv.Atoi(page_no_str)
	if err != nil {
		page_no = 1
	}
	results_per_page, err := strconv.Atoi(results_per_page_str)
	if err != nil {
		results_per_page = 10
	}
	postId, converr := strconv.Atoi(postIdstr)
	if converr != nil {
		c.JSON(400, gin.H{"error": "Invalid postId"})
		return
	}
	comments, err := database.GetCommentsForPost(postId, page_no, results_per_page)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"comments": comments})
}

func AddNewComment(c *gin.Context) {
	var requestBody models.CommentRequest
	if userId, isexists := c.Get("userId"); !isexists {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not authenticated or userId not found"})
		c.Abort()
		return
	} else {
		requestBody.UserID = int(userId.(int64))
		username, _ := c.Get("username")
		fullname, _ := c.Get("fullname")
		avatar_url, _ := c.Get("avatar_url")
		requestBody.UserName = username.(string)
		requestBody.FullName = fullname.(string)
		requestBody.AvatarUrl = avatar_url.(string)
	}
	if binderr := c.BindJSON(&requestBody); binderr != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	if requestBody.ParentID == 0 {
		requestBody.IsTopLevel = true
	} else {
		requestBody.IsTopLevel = false
	}

	producer, connerr := services.InitiKafkaProducer()
	if connerr != nil {
		c.JSON(500, gin.H{"error": "Unable to connect to kafka"})
		return
	}
	defer producer.Close()
	messageBytes, err := json.Marshal(requestBody)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal request body"})
		return
	}

	topic := os.Getenv("KAFKA_TOPIC")
	kafkaMessage := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder(messageBytes),
	}

	_, _, err = producer.SendMessage(kafkaMessage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message to Kafka: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment Added successfully",
	})
}

func DeleteOneComment(c *gin.Context) {
	cIdStr := c.Param("commentId")
	cId, converr := strconv.Atoi(cIdStr)
	if converr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Comment ID"})
	}
	err := database.DeleteComment(cId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong while deleting comment ID" + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully."})
}
