//sara logic yaha hai hum bus UI main ussse paste karenge

import { createSlice } from"@reduxjs/toolkit";
import {getAboutUser, getAllUsers, getConnectionRequest, getMyconnectionRequest, loginUser, registerUser} from "../../action/authAction/index.js"

const initialState={
    user:undefined,
    isError:false,
    isSucees:false,
    isLoading:false,
    loggedIn:false,
    isTokenThere:false,
    message:"",
    profileFetched:false,
    connections:[],    //maine kisi kise bheja hai request that hold connections
    all_users_profiles:[],     
    connectionRequests:[],   //mere pass kon kon se connection hai hold karega
    allUsersProfilesFetched:false,
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage:(state)=>{
            state.message=""
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere=true;
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere=false;
        }

    },
    extraReducers:(builder)=>{
        builder.
        addCase(loginUser.pending,(state)=>{
            state.isLoading=true,
            state.message="Knocking the door..."
        })
        .addCase(loginUser.fulfilled,(state,action)=>{  // action is a payload ,payload is a message, technical word is payload
            state.isLoading=false,
            state.isError=false,
            state.isSucees=true,
            state.loggedIn=true,
            state.message="Login is Successfull"
        })
        .addCase(loginUser.rejected,(state,action)=>{  // action is a payload ,payload is a message, technical word is payload
            state.isLoading=false,
            state.isError=true,
            state.message=action.payload
        })
        .addCase(registerUser.pending,(state)=>{
             state.isLoading=true,
            state.message="Registering now..."
        })
        .addCase(registerUser.fulfilled,(state)=>{
            state.isLoading=false,
            state.isError=false,
            state.isSucees=true,
            state.loggedIn=true,
            // state.message={
            //    message: "Registration is Successfull, Please Login!"
            // }
            state.message="Registration is Successfull, Please Login!"
       })
       .addCase(registerUser.rejected,(state,action)=>{
        state.isLoading=false,
        state.isError=true,
        state.message=action.payload
       })
       .addCase(getAboutUser.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.isError=true,
        state.profileFetched=true,
        state.user=action.payload.userProfile
       })
       .addCase(getAllUsers.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.isError=true,
        state.allUsersProfilesFetched=true,
        state.all_users_profiles=action.payload
        
       })
       .addCase(getConnectionRequest.fulfilled,(state,action)=>{
       state.connections=action.payload
       console.log("inside reducer",state.connections)
       })
       .addCase(getConnectionRequest.rejected,(state,action)=>{
        state.message=action.payload
        })
        .addCase(getMyconnectionRequest.fulfilled,(state,action)=>{
            state.connectionRequests=action.payload
        })
        .addCase(getMyconnectionRequest.rejected,(state,action)=>{
            state.message=action.payload
        })
    }
})

export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere}=authSlice.actions;

export default authSlice.reducer;