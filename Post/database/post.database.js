import { DEFAULT_RESULTS_PER_PAGE } from "../constants/constants.js";
import { pgPoolMaster,pgPoolReplica } from "./connection.js";

const getPgPoolClientForRead = async() =>{
    try {
        // try to get replica as priority, if replica not available then connect to master
        return await pgPoolReplica.connect();
    } catch (error) {
        console.error("Can't connect to replica, connecting to master");
        console.error(error);
        try {
            return await pgPoolMaster.connect();
        } catch (error) {
            console.error("Can't connect to master");
            console.error(error);
            return null
        }
    }
}

const getPosts = async(page_no,results_per_page=DEFAULT_RESULTS_PER_PAGE)=>{
    let client = null;
    try {
        client = await getPgPoolClientForRead();
        const result = await client.query(`SELECT * FROM posts WHERE is_deleted=false ORDER BY updated_at DESC LIMIT $1 OFFSET $2`,[results_per_page,(page_no-1)*results_per_page]);
        return result.rows;
    } catch (error) {
        console.error(error);
        return null
    }finally {
        if(client){
            client.release()
        }
    }
}

const deletePost = async(postId)=>{
    let client = null;
    try {
        client = await pgPoolMaster.connect();
        const result = await client.query(`UPDATE posts SET is_deleted=true WHERE postid=$1`,[postId]);
        return result.rowCount;
    } catch (error) {
        console.error(error);
        return null
    }finally {
        if(client){
            client.release()
        }
    }
}

const getOnePost = async(postId)=>{
    let client = null;
    try {
        client = await pgPoolMaster.connect();
        const result = await client.query(`SELECT * FROM posts WHERE postid=$1`,[postId]);
        return result.rows && result.rows.length>0 ? result.rows[0] : {};
    } catch (error) {
        console.error(error);
        return null
    }finally {
        if(client){
            client.release()
        }
    }
}



export {getPosts,deletePost,getOnePost}
