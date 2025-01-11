import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from "dotenv";
dotenv.config()

const authPackageDefinition = protoLoader.loadSync("proto/auth.proto",{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })

const authProto = grpc.loadPackageDefinition(authPackageDefinition).auth;
export const authGRPCClient = new authProto.AuthService(`0.0.0.0:${process.env.GRPC_AUTH_PORT}`,grpc.credentials.createInsecure());

