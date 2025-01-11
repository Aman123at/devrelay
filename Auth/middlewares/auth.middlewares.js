import { findUserById } from "../database/user.database.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await findUserById(decodedToken?.id);
      if (user===null) {
        throw new ApiError(401, "Invalid access token");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });


export const grpcAuthCheck = async (token) => {
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if(!decodedToken || !decodedToken.hasOwnProperty("id")){
        return null
      }else{
        const user = await findUserById(decodedToken?.id);
        return user;
      }
    } catch (error) {
      console.error(error);
      return null
    }
  };


  export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await findUserById(decodedToken?.id);
      req.user = user;
      next();
    } catch (error) {
      // Fail silently with req.user being falsy
      next();
    }
  });