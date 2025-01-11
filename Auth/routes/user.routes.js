import {Router} from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/user.controllers.js';
import { validate } from '../validators/validate.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { userLoginValidator, userRegisterValidator } from '../validators/user.validators.js';
const router = Router();
// welcome route
router.route("/").get((req,res)=>{
    res.json({
        message:"👋🏻 Hello welcome to DevRelay Auth Service"
    })
})

// Unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);

// Secured route
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/loggedIn").get(verifyJWT, getCurrentUser);
export default router;