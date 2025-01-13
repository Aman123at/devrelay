import { UserLoginType } from "../constants/constants.js";
import { createNewUser, findUserByEmailOrUsername, findUserById } from "../database/user.database.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, hashPassword, isPasswordCorrect } from "../utils/helper.js";
import dotenv from "dotenv";
dotenv.config()

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, username, password, city="", country="", state="", fullname=""} = req.body;

  const userExists = await findUserByEmailOrUsername(email,username,true);

  if(userExists===null){
    throw new ApiError(500, "Something is went wrong while finding user existence", []);
  }

  if (userExists) {
    throw new ApiError(409, "User with this email or username already exists", []);
  }
  const user = await createNewUser({
    email,
    password: hashPassword(password),
    username,
    city,
    country,
    state,
    fullname
  });

  if (user === null){
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const createdUser = await findUserByEmailOrUsername(email,username);

  if (createdUser === null) {
    throw new ApiError(500, "Unable to find newly registered user");
  }

  delete createdUser.password
  
  const  accessToken  = generateAccessToken(createdUser.id,createdUser.email,createdUser.username);

  let options = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "prod",
    // secure: false,
    sameSite: process.env.NODE_ENV === "prod" ? "None" : "",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser,accessToken},
        "Users registered successfully and verification email has been sent on your email."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email="", username="", password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await findUserByEmailOrUsername(email,username);
  if(user===null){
    throw new ApiError(500, "Something went wrong while finding user");
  }

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (user.login_type !== UserLoginType.EMAIL_PASSWORD) {
    throw new ApiError(
      400,
      "You have previously registered using " +
        user.login_type?.toLowerCase() +
        ". Please use the " +
        user.login_type?.toLowerCase() +
        " login option to access your account."
    );
  }

  const isPasswordValid = isPasswordCorrect(password,user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const  accessToken  = generateAccessToken(user.id,user.email,user.username);

  const loggedInUser = await findUserById(user.id);

  const options = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "prod",
    // secure: false,
    sameSite: process.env.NODE_ENV === "prod" ? "None" : "",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken }, // send access and refresh token in response if client decides to save them by themselves
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: process.env.NODE_ENV === "prod" ? "None" : "",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {user:req.user}, "Current user fetched successfully"));
});

// const handleSocialLogin = asyncHandler(async (req, res) => {
//   const user = await findUserById(req.user?._id);

//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   const { accessToken } = await generateAccessToken(user._id);

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   };

//   return res
//     .status(301)
//     .cookie("accessToken", accessToken, options) // set the access token in the cookie
//     .redirect(
//       // redirect user to the frontend with access and refresh token in case user is not using cookies
//       `${process.env.CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}`
//     );
// });

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
//   handleSocialLogin,
};