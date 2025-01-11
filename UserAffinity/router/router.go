package router

import "github.com/gin-gonic/gin"

func Router() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Welcome to User Affinity Service"})
	})
	UserAffinityRoutes(router)
	return router
}
