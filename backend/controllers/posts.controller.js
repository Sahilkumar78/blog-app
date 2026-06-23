
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

 const updatePost = asyncHandler(async (req, res) => {
       

    // find post by id
        const {id} = req.params;

        // check post exist
        const post = await Post.findById(id);

        if(!post){
             throw new ApiError(404, "post not found");
        }


        // update title content if present
       
        if(post.author.toString() !== req.user._id){
             throw new ApiError(403 , "unauthorized access");
        }

        const {title, content} = req.body;
         
        post.title = title || post.title;
        post.content = content || post.content

        // if new image uploaded
          // replace coudinary link to db

          if(req.file){
             const uploadedImage = await cloudinary.uploader.upload(req.file.path,
                {
                     folder: "posts",
                }
             )
             post.image = uploadedImage.secure_url
          }

          // save blog

          await post.save();


          // return response

          return res 
                 .status(200)
                 .json(new ApiResponse(200, post, "post updated successfully"));

       
 })

 // read blog



 // delete blog




 export {
       createPost,
       updatePost,
 }