package router

import (
	"github.com/Aman123at/devrelay/comments/controller"
	"github.com/Aman123at/devrelay/comments/middleware"
	"github.com/gin-gonic/gin"
)

func CommentRoutes(router *gin.Engine) {
	router.Use(middleware.IsUserLoggedIn)
	api := router.Group("/")
	{
		api.POST("/add", controller.AddNewComment)
		api.GET("/:postId", controller.GetComments)
		api.GET("/delete/:commentId", controller.DeleteOneComment)
		// api.GET("/fetch/:parentId", controller.GetNestedComments)
	}
}
