import { checkDatabaseConnection, pgPool } from "./database/connection.js";
import KafkaService from "./services/kafka.service.js";

const kafkaService = new KafkaService();

// check database connection
await checkDatabaseConnection();

// kafka consumer initialized
kafkaService.initConsumer();

// Gracefully shut down the server and pool
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      // Close the pool
      await pgPool.end();
      console.log('Database connection pool closed.');
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };
  
  // Listen for termination signals
  process.on('SIGTERM', gracefulShutdown); // Kubernetes or similar
  process.on('SIGINT', gracefulShutdown);  // Ctrl+C