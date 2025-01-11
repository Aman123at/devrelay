package router

import (
	"github.com/Aman123at/devrelay/useraffinity/controller"
	"github.com/Aman123at/devrelay/useraffinity/middleware"
	"github.com/gin-gonic/gin"
)

func UserAffinityRoutes(router *gin.Engine) {
	router.Use(middleware.IsUserLoggedIn)
	api := router.Group("/api")
	{
		api.POST("/user/follow", controller.Follow)
		api.POST("/user/unfollow", controller.Unfollow)
		api.GET("/user/:userId/followings", controller.GetFollowings)
		api.GET("/user/:userId/followers", controller.GetFollowers)
	}
}
