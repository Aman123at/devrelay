import express from "express";
import cors from "cors";

import { DB_TYPE } from "./constants/constants.js";
import { checkDatabaseConnection, pgPoolMaster, pgPoolReplica } from "./database/connection.js";
import { CloudinaryService } from "./services/cloudinary.service.js";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config()

const app = express();
const PORT = process.env.POST_PORT;
const origin = process.env.CORS_ORIGIN;
const cloudinaryService = new CloudinaryService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: origin ? origin : true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// intialize cloudinary
cloudinaryService.initConfig();

// connect master DB
await checkDatabaseConnection(DB_TYPE.MASTER);

// connect replica DB
await checkDatabaseConnection(DB_TYPE.REPLICA);

//api
app.use("/", postRouter);

const server = app.listen(PORT,()=>console.log(`🖥️  Post Service is running on Port ${PORT}`))

// Gracefully shut down the server and pool
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      // Close the pool
      await pgPoolMaster.end();
      console.log('Master Database connection pool closed.');

      await pgPoolReplica.end();
      console.log('Replica Database connection pool closed.');
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

