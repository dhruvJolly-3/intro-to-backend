import mongoose from "mongoose";
import {Post} from "../models/post.model.js";

// Create and Save a new Post
const createPost = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body must be JSON (Content-Type: application/json)"
            });
        }

        const { name, description, age } = req.body;

        if(!name || !description || !age) {
            return res.status(400).json({
                 message: "All fields are required"
                 });
        }

        const post = await Post.create({ name, description, age });

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    }catch (error) {
        console.log("Error creating post:", error);
        res.status(500).json({
            message: "Error creating post",
            error: error.message
        });
    }
};
//Read all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({posts});

    }
    
    catch (error) {

        res.status(500).json({
        message: "Internal server error",
        error: error.message

    });

    }
}

//Update posts

const updatePost = async (req, res) => {
    try{
        //basic validation to check if the request body is empty
        
        
        //{name: "x", description: "y", age: z} -> ["name", "description", "age"] ->{array of key-value pairs}
        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({
                message: "No data provided for update"
            });
        }

        //reject malformed ids before querying, otherwise mongoose throws a CastError
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        //runValidators makes the update respect schema rules (required, min, max)
        const post = await Post.findByIdAndUpdate(req.params.id, req.body,
            {new: true, runValidators: true});

          if(!post){
            return res.status(404).json({
                message: "Post not found"
            });
          }

          res.status(200).json({
            message: "Post updated successfully",
            post
          });  


    }
    catch(error){
        if(error.name === "ValidationError"){
            return res.status(400).json({
                message: "Validation failed",
                error: error.message
            });
        }

         res.status(500).json({
        message: "Internal server error",
        error: error.message
    });
}
}

//Delete the Posts

const deletePost = async (req, res) => {
    try{
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({
                message: "Post not found!!"
            });
        }
        res.status(200).json({
            message: "Post deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
        
}


export { 
    createPost,
    getAllPosts,
    updatePost,
    deletePost
 };