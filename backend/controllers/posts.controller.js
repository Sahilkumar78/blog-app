
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

 // getAll posts

 const getAllPosts = asyncHandler(async (req, res) => {
     
      // find all posts
        const posts = await Post.find()
                                .populate("author", "name")
                                .sort({createdAt: -1}); // sort in descending


      // populate author name


      // latest post first


      // return them
      return res 
            .status(200)
            .json(new ApiResponse(200, posts, "All posts fetched"));

 })

  // get post by id

  const getPostById = asyncHandler(async (req, res) => {
        
         // get id of post

         const {id} = req.params;


         // find post

          const post = await Post.findById(id)
                                  .populate("author", "name email");

         // if not found then throw error
         if(!post){
             throw new ApiError(404, "Post not found");
         }

         // return post
       return res 
              .status(200)
              .json(new ApiResponse(200, post, "post fetched successfully"));

  })
 



 // delete blog

 const deletePostById = asyncHandler(async(req, res) => {
      
         // find post

         const {id} = req.params; 

         // check if exist
         const post = await Post.findById(id);
           
         if(!post){
             throw new ApiError(404, "post not found");
         }

         // check ownership
          if(post.author.toString() !== req.user._id){
              throw new ApiError(403, "UnAuthorised Access")
          }

         //delete post

          await Post.deleteOne();

         // return success

         return res 
               .status(200)
               .json(new ApiErrorr(200, {}, "post Deleted SuccessFully"));
 })



 export {
       createPost,
       updatePost,
       getAllPosts,
       getPostById,
       deletePostById,
 }