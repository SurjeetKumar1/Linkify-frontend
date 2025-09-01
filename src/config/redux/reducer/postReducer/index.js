import { createSlice } from "@reduxjs/toolkit";

import { getAllComments, getAllPosts } from "../../action/postAction";

const initialState={
    posts:[],
    isError:false,
    postFetch:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:""
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:(state)=>initialState,
        resetPostId:(state)=>{
            state.postId="";
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading=true;
            state.message="fetching all the posts";

        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError=false;
            state.posts = action.payload;
            state.postFetch = true;
            state.message = "Posts fetched successfully";
            // console.log("user post",state.posts)

        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // state.message = action.error?.message || "Failed to fetch posts";
            state.message = action.payload;
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.postId=action.payload.post_id;
            state.comments=action.payload.comments.comments ;

        })
    }
})
export const {reset,resetPostId}=postSlice.actions;

export default postSlice.reducer;