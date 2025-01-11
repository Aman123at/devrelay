// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');

function serialize_auth_AuthReply(arg) {
  if (!(arg instanceof auth_pb.AuthReply)) {
    throw new Error('Expected argument of type auth.AuthReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_AuthReply(buffer_arg) {
  return auth_pb.AuthReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_UserRequest(arg) {
  if (!(arg instanceof auth_pb.UserRequest)) {
    throw new Error('Expected argument of type auth.UserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_UserRequest(buffer_arg) {
  return auth_pb.UserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthServiceService = exports.AuthServiceService = {
  isUserAuthenticated: {
    path: '/auth.AuthService/IsUserAuthenticated',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.UserRequest,
    responseType: auth_pb.AuthReply,
    requestSerialize: serialize_auth_UserRequest,
    requestDeserialize: deserialize_auth_UserRequest,
    responseSerialize: serialize_auth_AuthReply,
    responseDeserialize: deserialize_auth_AuthReply,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService);
