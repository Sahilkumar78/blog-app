import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";



const verifyJWT = asyncHandler(async (req, res) => {
       
       const token =  req.header("Authorization")?.replace("Bearer ", "");
       
       if(!token){
         throw new ApiError(401, "Unauthorized request")
       }
     
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(
             decodedToken.id
        ).select("-password");
       
      if(!user){
          throw new ApiError(401, "Invalid token");
      }

      req.user = user;
      next();
    })


    export {verifyJWT}