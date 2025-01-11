import { authGRPCClient } from "../grpcCalls.js";

export const verifyJWT = (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    authGRPCClient.IsUserAuthenticated({token},(err,response)=>{
        if (err){
            console.log(err)
            return res.status(401).json({message:"Unauthorized"})
        }
        if (response.authenticated){
            req.user = response
            next()
        } else {
            return res.status(401).json({message:"Unauthorized"})
        }
    });
}