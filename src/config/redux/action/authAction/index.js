import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connection } from "next/server";
import { use } from "react";
import { connect } from "react-redux";

export const loginUser=createAsyncThunk("user/login",async (user,thunkAPI)=>{
    try{
        const response=await clientServer.post(`/login`,{
            email:user.email,
            password:user.password
        });

        if(response.data.token){
        localStorage.setItem("token",response.data.token)
        }
        else{
            return thunkAPI.rejectWithValue({
                message:"token not provided"
            })
        }
        return thunkAPI.fulfillWithValue(response.data.Message);

    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data.Message);
    }
    }
)

export const registerUser=createAsyncThunk("user/register",async(user,thunkAPI)=>{
    try{
        const response=await clientServer.post(`/register`,{
            username:user.username,
            name:user.name,
            email:user.email,
            password:user.password
        });
        return thunkAPI.fulfillWithValue(response.data.Message);

    }catch(err){
        console.log(err);
        return thunkAPI.rejectWithValue(err.response.data.Message);
    }
})

export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
     try{
       const response=await clientServer.get("/user_get_and_profile",{
          params:{
            token:user.token
          }
       })
       return thunkAPI.fulfillWithValue(response.data)
     }catch(err){
        return thunkAPI.rejectWithValue("err.response.data")
     }
    }
)

export const getAllUsers=createAsyncThunk("user/getAllusers",async(_,thunkAPI)=>{
    try{
        const response=await clientServer.get("/user/get_all_user_profile");
        return thunkAPI.fulfillWithValue(response.data);

    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data);

    }

})


//mere pass thirf mera token hai aur jisko request bhej raha hu uska user_id hai
export const sendConnectionRequest=createAsyncThunk("user/sendConnectionRequest",async(user,thunkAPI)=>{
      try{
       const response=await clientServer.post("/user/send_connection_request",{
        token:user.token,
        connectionId:user.user_id
       })

       thunkAPI.dispatch(getConnectionRequest({token:user.token}));

       return thunkAPI.fulfillWithValue(response.data);
      }catch(err){
       return thunkAPI.rejectWithValue(err.response.data.message);
      }
})

export const getConnectionRequest=createAsyncThunk("user/getConnectionRequest",async(user,thunkAPI)=>{
       try{
         const response=await clientServer.get("/user/getConnectionRequests",{
            params:{
                token:user.token
            }
         })   
         console.log("get connection",response.data.connection);
         return thunkAPI.fulfillWithValue(response.data.connection);     
       }catch(err){
           console.log(err);
           return thunkAPI.rejectWithValue(err.response.data.message);
       }
})

//mere ko kis kisne bheja hai request;
export const getMyconnectionRequest=createAsyncThunk("user/getMyConnectionRequest",async(user,thunkAPI)=>{
    try{
    const response=await clientServer.get("/user/user_connection_request",{
        params:{
            token:user.token
        }
    })

    return thunkAPI.fulfillWithValue(response.data.connection
    );
    }catch(err){
     return thunkAPI.rejectWithValue(err.response.data.Message);
    }
})

export const acceptConnection=createAsyncThunk("user/acceptConnection",async(user,thunkAPI)=>{
    try{
        const response=await clientServer.post("/user/accept_connection_request",{
            //mera token id chahiye aur main kiski request accept kar raha hu uska connectionID id,aur sth main
            //uska action chahiye,accept or reject
            token:user.token,
            requestId:user.connectionId,
            action_type:user.action
        })
        thunkAPI.dispatch(getConnectionRequest({token:user.token}));
        thunkAPI.dispatch(getMyconnectionRequest({token:user.token}));
        return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
      return thunkAPI.rejectWithValue(err.response.data.Message);
    }
})