// import React, { useEffect } from 'react'
// import UserLayout from "../../layout/userLayout/index"
// import DashBoardLayout from '@/layout/dashboardLayout'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllUsers } from '@/config/redux/action/authAction';
// import styles from "./index.module.css"
// import { BASE_URL } from '@/config';
// import { useRouter } from 'next/router';

// function Discover() {
//   const router=useRouter();
//     const authState=useSelector((state)=>state.auth)
//     const dispatch=useDispatch();
//     useEffect(()=>{
//         if(!authState.allProfilesFetched){
//             dispatch(getAllUsers());
//         }
//     },[])
//   return (
//     <UserLayout>
//     <DashBoardLayout>
//      <div>
//       <h1>Discover</h1>
//       <div className={styles.allUserProfile}>
//         {authState.allUsersProfilesFetched && 
//         authState.all_users_profiles.map((user,indx)=>(
          
//           <div
//           onClick={()=>{
//             router.push(`/viewProfile/${user.userId.username}`)
//           }}
//           key={user._id} className={styles.userCard}>
//             {console.log(user)}
//             <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
//             <div>
//             <h1>{user.userId.name}</h1>
//             <p>{user.userId.username}</p>
//             </div>
//           </div>
//         ))

//         }
//       </div>
//      </div>
//     </DashBoardLayout>
//     </UserLayout>
//   )
// }

// export default Discover







import React, { useEffect } from 'react'
import UserLayout from "../../layout/userLayout/index"
import DashBoardLayout from '@/layout/dashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import styles from "./index.module.css"
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

function Discover() {
  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUsers())
    }
  }, [])

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Discover</h1>
          <div className={styles.allUserProfile}>
            {authState.allUsersProfilesFetched &&
              authState.all_users_profiles.map((user) => (
                <div
                  onClick={() => {
                    router.push(`/viewProfile/${user.userId.username}`)
                  }}
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    className={styles.userCard_image}
                    src={`${BASE_URL}/${user.userId.profilePicture}`}
                    alt={user.userId.name}
                  />
                  <div className={styles.userInfo}>
                    <h2>{user.userId.name}</h2>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}

export default Discover
