module.exports = {
    apps: [
      {
        name: "http-server",
        script: "npm",
        args: "start",
      },
      {
        name: "grpc-server",
        script: "npm",
        args: "run grpc",
      },
    ],
  };