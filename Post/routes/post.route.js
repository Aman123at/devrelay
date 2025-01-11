import {Router} from 'express';
import { verifyJWT } from '../middlewares/post.middlewares.js';
import { createPost, fetchPostDetail, fetchPosts, generatePresignedUrl } from '../controllers/post.controller.js';
const router = Router();
// Welcome route
router.route("/").get((req,res)=>{
    res.json({
        message:"👋🏻 Hello welcome to DevRelay Post Service"
    })
})
// Secured route
router.route("/create").post(verifyJWT, createPost);
router.route("/all").get(verifyJWT, fetchPosts);
router.route("/detail/:postId").get(verifyJWT, fetchPostDetail);
router.route("/getPreSignedUrl").get(verifyJWT, generatePresignedUrl);
export default router;