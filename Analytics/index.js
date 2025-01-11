import express from "express";
import { connectWithDb } from "./database/connection.js";
import cookieParser from "cookie-parser";
const app = express()
const PORT = process.env.PORT

app.use(cookieParser())
app.use(express.json())
app.get("/",(req,res)=>{
    res.json({
        "message":"Welcome to Analytics Service"
    })
})

const dbConn = await connectWithDb()

const server = app.listen(PORT,()=>console.log("Analytics Service is running on port : ",PORT))

// Gracefully shut down the server and pool
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      // Close the database connection
      await dbConn.connection.close()
      console.log('Database connection closed.');
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