import { DEFAULT_RESULTS_PER_PAGE } from "../constants/constants.js";
import { getPosts,deletePost, getOnePost } from "../database/post.database.js";
import { CloudinaryService } from "../services/cloudinary.service.js";
import KafkaService from "../services/kafka.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespones.js";

const kafkaService = new KafkaService();
const cloudinaryService = new CloudinaryService();
const topic = process.env.KAFKA_TOPIC;

const fetchPosts = async (req, res) => {
    const {page_no=1,results_per_page=DEFAULT_RESULTS_PER_PAGE} = req.query;
    const posts = await getPosts(page_no,results_per_page);
    res.status(200).json( 
        new ApiResponse(
        200,
        { posts: posts===null ? [] : posts},
        "Posts Fetched Successfully."
      ));
}

const generatePresignedUrl = async (req, res) => {
    const presignedUrl = cloudinaryService.presignedUploadUrl();
    res.status(200).json(new ApiResponse(200, { presignedUrl }, "Presigned Url generated successfully."));
}

const fetchPostDetail = async (req,res)=>{
    const {postId} = req.params;
    const post = await getOnePost(postId);
    if (!post){
        throw new ApiError(500, `Unable to get post with id : ${postId}.`);
    }
    res.status(200).json(new ApiResponse(200, { post }, "Post fetched successfully."));
}

const createPost = async (req, res) => {
    const {image_url,description,userId,username,fullname,avatar_url} = req.body;
    
    const message = {
        image_url,
        description,
        userId,
        username,
        fullname,
        avatar_url
    }
    const sendRes = kafkaService.send(topic,message);
    if(sendRes===false){
        throw new ApiError(500, "Unable to send message to kafka.");
    }
    res.status(200).json(new ApiResponse(200, {}, "Post created successfully."));
}

const deleteOnePost = async (req, res) => {
    const { postId } = req.params;
    const result = await deletePost(postId);
    if(result===null){
        throw new ApiError(500, "Something went wrong while deleting post.");
    }else{
        res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully."));
    }
}

export { fetchPosts,deleteOnePost,createPost,generatePresignedUrl,fetchPostDetail };