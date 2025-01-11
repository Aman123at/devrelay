package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Aman123at/devrelay/useraffinity/database"
	"github.com/Aman123at/devrelay/useraffinity/router"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("Welcome to User Affinity service")

	// start http server for regular REST api's
	go startHttpServer()

	// Block main thread, so that both HTTP listens
	select {}
}

func init() {
	pool, err := database.NewConnectionPool(10)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Successfully connected to Database and initiated connection pool")
	database.DbConnPool = pool
	database.InitializeUserAffTable()
}

func startHttpServer() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Unable to load env file")
		log.Fatal(err.Error())
	}

	port := os.Getenv("USER_AFF_PORT")
	httpPort := fmt.Sprintf(":%s", port)
	router := router.Router()
	router.Run(httpPort)
}
