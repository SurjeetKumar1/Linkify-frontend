import React, { useEffect } from 'react'
import UserLayout from '@/layout/userLayout'
import DashBoardLayout from '@/layout/dashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { acceptConnection, getMyconnectionRequest } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

function MyConnectionsPage() {

  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);
  const router=useRouter();

  useEffect(()=>{
     dispatch(getMyconnectionRequest({token:localStorage.getItem("token")}));
  },[])

  useEffect(()=>{
     if(authState.connectionRequests.length!==0){
      console.log(authState.connectionRequests);
     }
  },[authState.connectionRequests])
  return (
    <UserLayout>
    <DashBoardLayout>
     <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
      <h4>My Connections</h4>
      {authState.connectionRequests.length===0 &&<h1>No Connection Request Pending</h1>}
      {
        authState.connectionRequests.length!==0 && authState.connectionRequests.filter((connection)=>connection.status_Accepted===null).map((user)=>{
          return(
            <div 
            onClick={()=>{
             router.push(`/viewProfile/${user.userId.username}`)
            }}
            key={user._id} className={styles.userCrad}>
             <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
              <div className={styles.profilePicture}>
                <img src={`${BASE_URL}/${user.userId.profilePicture}`}/>
              </div>

               <div className={styles.userInfo}>
                <h3>{user.userId.name}</h3>
                <p>{user.userId.username}</p>
               </div>
               <button
               onClick={(e)=>{
                e.stopPropagation();
                      dispatch(acceptConnection({
                        connectionId:user._id,
                        token:localStorage.getItem("token"),
                        action:"accept"
                      }))
               }}
               className={styles.connectedBtn}>Accept</button>

             </div>
            </div>
          )
        })
      }

    <h4>My Network</h4>
  {authState.connectionRequests.filter((connection)=>connection.status_Accepted!==null).map((user,index)=>{
    return(
      <div 
      onClick={()=>{
       router.push(`/viewProfile/${user.userId.username}`)
      }}
      key={user._id} className={styles.userCrad}>
       <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
        <div className={styles.profilePicture}>
          <img src={`${BASE_URL}/${user.userId.profilePicture}`}/>
        </div>

         <div className={styles.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>{user.userId.username}</p>
         </div>
       </div>
      </div>
    )
  })}

     </div>
    </DashBoardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage
