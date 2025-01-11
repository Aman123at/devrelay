import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { grpcAuthCheck } from './middlewares/auth.middlewares.js';
import { sendGRPCResponse } from './utils/helper.js';

const authPackageDefinition = protoLoader.loadSync("proto/auth.proto",{});

const authProto = grpc.loadPackageDefinition(authPackageDefinition).auth;

const server = new grpc.Server();

const address = `0.0.0.0:${process.env.GRPC_AUTH_PORT}`;

server.addService(authProto.AuthService.service, {
    IsUserAuthenticated: async(call, callback) => {
      const token = call.request.token;
      const user = await grpcAuthCheck(token);
      const response = sendGRPCResponse(user);
      callback(null, response);
    },
  })
  
server.bindAsync(address,grpc.ServerCredentials.createInsecure(),(err,port)=>{
    if (err) {
        console.error(err);
        return;
    }
    console.log(`gRPC server running at ${address} and port ${port}`);
})