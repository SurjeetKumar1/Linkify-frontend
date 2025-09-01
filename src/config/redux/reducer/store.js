// steps for state management
// step1: submit action
// handle action in its reducers
// register here-> Reducer


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducer/authReducer/index.js"
import postsReducer from "../reducer/postReducer/index.js"

const store=configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer
    }
});

export default store;

