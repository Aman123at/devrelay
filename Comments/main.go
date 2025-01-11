package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Aman123at/devrelay/comments/database"
	"github.com/Aman123at/devrelay/comments/router"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("Welcome to Comments service")

	// start http server for regular REST api's
	go startHttpServer()

	// Block main thread
	select {}
}

func init() {
	pool, err := database.NewConnectionPool(10)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Successfully connected to Database and initiated connection pool")
	database.DbConnPool = pool
	database.InitializeTables()
}

func startHttpServer() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Unable to load env file")
		log.Fatal(err.Error())
	}

	port := os.Getenv("COMMENTS_PORT")
	httpPort := fmt.Sprintf(":%s", port)
	router := router.Router()
	router.Run(httpPort)
}
