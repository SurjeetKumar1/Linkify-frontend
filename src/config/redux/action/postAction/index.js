import clientServer from "@/config";
import {createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts=createAsyncThunk("post/getAllposts",async(_,thunkAPI)=>{
        try{
            const response=await clientServer.get(("/post"));
            // return thunkAPI.fulfillWithValue(response.data.post);
           
            return response.data.post.reverse();
        }catch(err){
            return thunkAPI.rejectWithValue(response.data);

        }
    }
)

export const createdPost=createAsyncThunk("post/createPost",async(userData,thunkAPI)=>{
    const {file,body}=userData;
    try{
      const formData=new FormData();
      formData.append('token',localStorage.getItem('token'));
      formData.append('body',body);
      formData.append('media',file);

      const response=await clientServer.post("/post",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
      })
      if(response.status===200){
        return thunkAPI.fulfillWithValue("Post Uploaded");
      }else{
        return thunkAPI.rejectWithValue("Post not uploaded");
      }
    }catch(err){

    }
})

export const deleletPost=createAsyncThunk("post/deletePost",async(post_id,thunkAPI)=>{
      try{
         const response=await clientServer.delete("/delete_post",{
            data:{
                token:localStorage.getItem("token"),
                post_id:post_id
            }
         })
         return thunkAPI.fulfillWithValue(response.data);
      }catch(err){
         return thunkAPI.rejectWithValue("It's a invalid data")
      }
})

export const likePost=createAsyncThunk("post/likePost",async({post_id,userId},thunkAPI)=>{
    try{
      console.log(post_id,userId)
      const response=await clientServer.post("increment_post_like",{
        post_Id: post_id,
        userId: userId
      })
      return response.data;
    }catch(err){
        return thunkAPI.rejectWithValue(response.data);
    }
})

export const getAllComments=createAsyncThunk("post/getAllComments",async(postData,thunkAPI)=>{
    try{
        const response=await clientServer.get("/get_comments",{
            params:{
                post_id:postData.post_id
            }
        })
        console.log(response.data)
        return thunkAPI.fulfillWithValue({comments:response.data,post_id:postData.post_id})

    }catch(err){
      return thunkAPI.rejectWithValue("something went wrong");
    }
})

export const postComment=createAsyncThunk("post/postComment",async(commetData,thunkAPI)=>{
  try{
    const response=await clientServer.post("/comment",{
       token:localStorage.getItem("token"),
       post_id:commetData.post_id,
       commentBody:commetData.body
    })
    return thunkAPI.fulfillWithValue(response.data)

  }catch(err){
      return thunkAPI.rejectWithValue("Something went wrong");
  }
})

export const deleteComment=createAsyncThunk("post/deleteComment",async(commentData,thunkAPI)=>{
  try{
    console.log(commentData.token,"token");
    const response=await clientServer.delete("/delete_comment",{
      data: {
        token: commentData.token,
        comment_id: commentData.comment_id
      }
    })

    return thunkAPI.fulfillWithValue(response.data);

  }catch(err){
       return thunkAPI.rejectWithValue(err.response.data);
  }
})