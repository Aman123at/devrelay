package middleware

import (
	"log"
	"net/http"

	"github.com/Aman123at/devrelay/useraffinity/grpc"
	"github.com/gin-gonic/gin"
)

func IsUserLoggedIn(c *gin.Context) {
	cToken, cookieErr := c.Request.Cookie("accessToken")
	if cookieErr != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "No authorization token found"})
		c.Abort()
		return
	}

	response, err := grpc.UserAuthResponse(cToken.Value)
	if err != nil {
		log.Fatalf("Error calling auth service %v", err.Error())
	}
	if !response.Authenticated {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not authenticated"})
		c.Abort()
		return
	}

	c.Set("userId", response.UserId)

	c.Next()
}
