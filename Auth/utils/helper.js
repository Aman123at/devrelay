import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export const initUsersTable = async (pgClient) =>{
    const query = `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                avatar_url TEXT DEFAULT 'https://via.placeholder.com/200x200.png',
                avatar_local_path TEXT DEFAULT '',
                username VARCHAR(255) NOT NULL UNIQUE,
                fullname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                country VARCHAR(100),
                city VARCHAR(100),
                state VARCHAR(100),
                dob DATE,
                login_type VARCHAR(50) DEFAULT 'EMAIL_PASSWORD',
                is_deleted BOOLEAN DEFAULT false,
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

export const objectToInsertQuery = (tableName, dataObject) => {
    const columns = Object.keys(dataObject).join(", ");
    const values = Object.values(dataObject)
        .map(value => (typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value))
        .join(", ");

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;

    return query;
}

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

export const isPasswordCorrect = (password,existingPass) => {
    return bcrypt.compareSync(password,existingPass)
}

export const generateAccessToken = (id,email,username) => {
    return jwt.sign(
        {id,email,username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}


export const sendGRPCResponse = (user) =>{
    if(user===null){
        return {
            authenticated: false,
            userId: -1,
            role: "",
            avatar_url: "",
            username: "",
            email: "",
            fullname: "",
            country: "",
            city: "",
            state: ""
        }
    }else{
        return {
            authenticated: true,
            userId: user.id,
            role: user.role,
            avatar_url: user.avatar_url,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            country: user.country,
            city: user.city,
            state: user.state
        }
    }
}
