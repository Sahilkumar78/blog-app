
 // create blog

import { Post } from "../models/post.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

 const createPost = asyncHandler(async (req, res) => {
      
       // get title and content from body
       const {title, content} = req.body;



       // check if they exist

       if(!title || !content){
         throw new ApiError(404, "All feilds are required");
       }

       //if image exist, upload on cloudinary
       let imageUrl = "";

       if(req.file){
        const uploadedImage =  await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "blogs"
            }
        )
          imageUrl= uploadedImage.secure_url
       }

       // create blog in db
       const post = await Post.create({
           title,
           content,
           image: imageUrl,
           author: req.user._id
       })

       // return created blog

       return res 
             .status(201)
             .json(new ApiResponse(201, post, "Post created successfully"));

 })


 // update blog 


 // read blog



 // delete blog




 export {
       createPost
 }