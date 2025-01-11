import pg from "pg";
const {Pool} = pg;

export const pgPool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

export const checkDatabaseConnection = async () => {
    try {
      const client = await pgPool.connect(); // Attempt to connect to the database
      console.log('📀 📀 Connected to the database successfully!');
    } catch (err) {
      console.error('Error connecting to the database:', err.message);
      process.exit(1); // Exit the process if the database is not reachable
    }
};