export const initPostsTable = async (pgClient) =>{
    const query = `CREATE TABLE IF NOT EXISTS posts (
                postId SERIAL PRIMARY KEY,
                image_url TEXT DEFAULT '',
                description TEXT DEFAULT '',
                userId INT NOT NULL,
                username VARCHAR(255) NOT NULL,
                likes INT DEFAULT 0,
                comments INT DEFAULT 0,
                is_deleted BOOLEAN DEFAULT false,
                fullname VARCHAR(255) DEFAULT '',
                avatar_url TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`
    try {
        await pgClient.query(query);
    } catch (error) {
        console.error(`Unable to create or check existing table in database: ${error}`)
    }
    pgClient.release(); // Release the client back to the pool
}