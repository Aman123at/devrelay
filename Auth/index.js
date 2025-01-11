import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pgPool, checkDatabaseConnection } from "./database/connection.js";
import userRouter from "./routes/user.routes.js";
const app = express();
const PORT = process.env.AUTH_PORT;
const origin = process.env.CORS_ORIGIN;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cross-origin
app.use(
    cors({
      origin: origin ? origin : true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
);

// connect DB
await checkDatabaseConnection()

//api
app.use("/", userRouter);

const server = app.listen(PORT,()=>console.log(`🖥️  Auth Service is running on Port ${PORT}`))

// Gracefully shut down the server and pool
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      // Close the pool
      await pgPool.end();
      console.log('Database connection pool closed.');
      // Stop the server
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };
  
  // Listen for termination signals
  process.on('SIGTERM', gracefulShutdown); // Kubernetes or similar
  process.on('SIGINT', gracefulShutdown);  // Ctrl+C