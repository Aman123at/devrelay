package grpc

import (
	"context"
	"log"
	"os"

	"github.com/Aman123at/devrelay/useraffinity/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func GetConnection() *grpc.ClientConn {
	authport := os.Getenv("GRPC_AUTH_PORT")
	authhost := os.Getenv("GRPC_AUTH_HOST")
	connStr := authhost + ":" + authport
	conn, err := grpc.NewClient(connStr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Unable to connect grpc auth service: %v", err)
	}
	return conn
}

func UserAuthResponse(token string) (*proto.AuthReply, error) {
	connection := GetConnection()
	defer connection.Close()
	client := proto.NewAuthServiceClient(connection)
	response, error := client.IsUserAuthenticated(context.Background(), &proto.UserRequest{Token: token})
	return response, error
}
