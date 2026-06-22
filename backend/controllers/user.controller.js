
import mongoose  from "mongoose";
import { User } from "../models/user.model";
import jsonwebtoken from "jsonwebtoken"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";



const userRegister = asyncHandler(async (req, res) => {
      
        const {name, email, password} = req.body;

        if(!name || !email || !password){
              throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
             throw new ApiError(400, "User already exists");
        }

        // password hash

        const hashedPassword = bcrypt.hash(password, 10);



        // user create 
          const user = await User.create({
             name,
             email,
             password: hashedPassword
          })

        // generate token 

        const token = jwt.sign(
            {
                id: user._id
            },

            process.env.JWT_SECRET,
            {
                expiressIn: "7d"
            }
        )


        //send response

        return res 
               .status(201)
               .json(new ApiResponse(201, {user, token}, "User created Successfully"));

})


const userLogin = asyncHandler(async (req, res) => {
      
        // get data 

        const {email, password} = req.body;

        if(!email || !password){
             throw new ApiError(400, "All feilds are required");
        }

        
        // find user
        const user = await User.findOne({email});
        if(!user){
             throw new ApiError(404, "User not found");
        }

        // compare password
   
        const isPasswordCorrect =  await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
             throw new ApiError(400, "Invalid credentials");
        }


        // generate token
        const token = await jwt.sign(
             {
                 id: user._id
             },

             process.env.JWT_SECRET,
             {
                expiressIn: "7d"
             }
        )

        //send response

        return res 
               .status(200)
               .json(new ApiResponse(200, {user, token}, "User logged in successfully"));
})


export {
       userRegister,
       userLogin
}