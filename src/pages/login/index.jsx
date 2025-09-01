import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/userLayout/index'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import styles from "./style.module.css"
import { loginUser,registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
  const authState=useSelector((state)=>state.auth);
  const router=useRouter();
  const dispatch=useDispatch();
  const [isLoggedInMethode,setIsLoggedInMethode]=useState(false);
  const [username,setUsername]=useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleRegister=()=>{
    console.log("Registering");
    dispatch(registerUser({username,name,password,email}))
  }
  const handleLogin=()=>{
    console.log("Logging");
    dispatch(loginUser({email,password}));
  }
  // useEffect(()=>{
  //   if(authState.loggedIn){
  //     router.push("/dashboard");
  //   }
  // },[authState.loggedIn])

  useEffect(()=>{
   dispatch( emptyMessage());
  },[isLoggedInMethode])

  useEffect(()=>{
   if(localStorage.getItem("token")){
    router.push("/dashboard")
   }
   })

  return (
    <UserLayout>
      <div className={styles.Container}>
    <div className={styles. cardContainer}>
    <div className={styles. cardContainerLeft}>
      <p className={styles.cardLeftHeading}>{isLoggedInMethode?"Sign In":"Signu Up"}</p>
     <p style={{color: authState.isError?"red":"green", marginTop:"10px"} }> {authState.message}</p>
      <div className={styles.inputContainer}>
       {!isLoggedInMethode &&
        <div className={styles.inputRow}>
        <input required onChange={(e)=>setUsername(e.target.value)} className={styles.inputField} type='text' placeholder='Username'/>
        <input required onChange={(e)=>setName(e.target.value)}  className={styles.inputField} type='text' placeholder='Name'/>
        </div>
       }
        <input required onChange={(e)=>setEmail(e.target.value)}  className={styles.inputField} type='email' placeholder='Email'/>
        <input required onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} type='password' placeholder='Password'/>
        <div
        onClick={()=>{
          if(isLoggedInMethode){
            handleLogin();
          }else{
            handleRegister();
          }
        }}
        className={styles.buttonWithoutOutline}>
         {isLoggedInMethode?"Login":"Sign Up"}
        </div>
      </div>
    </div>
    <div className={styles. cardContainerRight} >
      {isLoggedInMethode?<p>Don't have an account</p>:
      <p>Already have an account!</p>
      }
      <div  
        onClick={()=>{
          setIsLoggedInMethode(!isLoggedInMethode)
        }}
        className={styles.rightContainerBtn}>
         {isLoggedInMethode?"Sign Up":"Login In"}
        </div>
    </div>
    </div>
    </div>
    </UserLayout>
  )
}

export default LoginComponent
