import pg from "pg";
import { initPostsTable } from "../utils/helper.js";
import { DB_TYPE } from "../constants/constants.js";
const {Pool} = pg;

export const pgPoolMaster = new Pool({
    user: process.env.MASTER_PG_USER,
    host: process.env.MASTER_PG_HOST,
    database: process.env.MASTER_DB_NAME,
    password: process.env.MASTER_DB_PASS,
    port: process.env.MASTER_DB_PORT
});

export const pgPoolReplica = new Pool({
    user: process.env.REPLICA_PG_USER,
    host: process.env.REPLICA_PG_HOST,
    database: process.env.REPLICA_DB_NAME,
    password: process.env.REPLICA_DB_PASS,
    port: process.env.REPLICA_DB_PORT
});

export const checkDatabaseConnection = async (type) => {
    try {
      const client = type===DB_TYPE.MASTER ? await pgPoolMaster.connect() : await pgPoolReplica.connect(); // Attempt to connect to the master database
      console.log(`📀 📀 Connected to the ${type} database successfully!`);
      
      // initialize master posts table
      if(type===DB_TYPE.MASTER){
        initPostsTable(client)
      }
    } catch (err) {
      console.error(`Error connecting to the ${type} database:`, err.message);
      process.exit(1); // Exit the process if the database is not reachable
    }
};