import { DB_TABLE_NAME } from "../constants/constants.js";
import { objectToInsertQuery } from "../utils/helper.js";
import { pgPool } from "./connection.js";

const executeQuery = async (callback) => {
    let client = null;
    try {
        client = await pgPool.connect();
        return await callback(client);
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        if (client) {
            client.release();
        }
    }
};

const findUserById = async(userId)=>{
    return await executeQuery(async (client)=>{
        const result = await client.query('SELECT id,avatar_url,username,fullname,role,email,country,city,state,login_type,created_at,updated_at FROM users WHERE id=$1',[userId]);
        return result.rows && result.rowCount ? result.rows[0] : null;
    });
}

const createNewUser = async(payload)=>{
    const query = objectToInsertQuery(DB_TABLE_NAME,payload)
    return await executeQuery(async (client)=>{
        await client.query(query);
        return true;
    });
}

const findUserByEmailOrUsername = async (email,username,checking=false) => {
    return await executeQuery(async (client)=>{
        const result = await client.query(`SELECT id,login_type,email,username,fullname,avatar_url,country,city,state,dob,created_at,updated_at,password FROM users WHERE email=$1 OR username=$2`,[email,username])
        return checking ? (result.rowCount && result.rowCount > 0) : result.rows[0];
    });
}

export {findUserById,createNewUser,findUserByEmailOrUsername}
