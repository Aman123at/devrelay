import { pgPool } from "../database/connection.js";

export const bulkInsertPosts = async (postsArr) => {
    try {
      // Parse Kafka messages
      const posts = postsArr.map((post) => JSON.parse(post));
  
      // Prepare values and placeholders
      const values = [];
      const placeholders = posts
        .map((post, index) => {
          const offset = index * 6; // 4 columns in the table
          values.push(post.image_url, post.description, post.userId, post.username, post.fullname, post.avatar_url);
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
        })
        .join(", ");
  
      // Construct query
      const query = `
        INSERT INTO posts (image_url, description, userId, username, fullname, avatar_url)
        VALUES ${placeholders}
        RETURNING *;
      `;
  
      // Execute query
      const result = await pgPool.query(query, values);
      console.log("Inserted Rows:", result.rows.length);
      return result.rows;
    } catch (error) {
      console.error("Error inserting posts:", error);
    }
    //  finally {
    //   // Close the pool if no more queries are expected
    //   await pgPool.end();
    // }
  };
  