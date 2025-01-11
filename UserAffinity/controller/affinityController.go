package controller

import (
	"strconv"

	"github.com/Aman123at/devrelay/useraffinity/database"
	"github.com/Aman123at/devrelay/useraffinity/models"
	"github.com/Aman123at/devrelay/useraffinity/utils"
	"github.com/gin-gonic/gin"
)

func GetFollowings(c *gin.Context) {
	userIdStr := c.Param("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid userId"})
		return
	}

	followings, err := database.GetCountOfUsers(userId, utils.AffinityEnums["followings"])
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"followings": followings})
}

func GetFollowers(c *gin.Context) {
	userIdStr := c.Param("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid userId"})
		return
	}

	followers, err := database.GetCountOfUsers(userId, utils.AffinityEnums["followers"])
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"followers": followers})
}

func Unfollow(c *gin.Context) {
	var requestBody models.Affinity

	if binderr := c.BindJSON(&requestBody); binderr != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	err := database.DeleteUserAffinity(requestBody.SourceUserID, requestBody.TargetUserID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Unfollowed successfully"})
}

func Follow(c *gin.Context) {
	var requestBody models.Affinity

	if binderr := c.BindJSON(&requestBody); binderr != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	err := database.InsertUserAffinity(requestBody.SourceUserID, requestBody.TargetUserID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Followed successfully"})
}
