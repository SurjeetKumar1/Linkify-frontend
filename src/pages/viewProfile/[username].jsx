

import clientServer, { BASE_URL } from "@/config";
import DashBoardLayout from "@/layout/dashboardLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequest,
  getMyconnectionRequest,
  sendConnectionRequest
} from "@/config/redux/action/authAction";
import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function ViewProfilePage({ userProfile }) {
  console.log("user profile",userProfile);
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [userPosts, setUserPost] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
    dispatch(getMyconnectionRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    const posts = postReducer.posts.filter(
      (post) => post.userId.username === router.query.username
    );
    setUserPost(posts);
  }, [postReducer.posts]);

  useEffect(() => {
    const isInConnections = authState.connections.some(
      (user) => user.connectionId === userProfile.userId._id
    );
    if (isInConnections) {
      setIsConnected(true);
      const status = authState.connections.find(
        (u) => u.connectionId === userProfile.userId._id
      );
      if (status?.status_Accepted) setIsPending(false);
    }
  }, [authState.connections, authState.connectionRequests]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.profileWrapper}>
          {/* Banner + Avatar */}
          <div className={styles.banner}>
            <img
              className={styles.avatar}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="Profile"
            />
          </div>

          {/* Profile Info */}
          <div className={styles.profileInfo}>
            <div className={styles.nameSection}>
              <h2>{userProfile.userId.name}</h2>
              <span>@{userProfile.userId.username}</span>
            </div>

            <div className={styles.actions}>
              {isConnected ? (
                <button className={styles.connectedBtn}>
                  {isPending ? "Pending" : "Connected"}
                </button>
              ) : (
                <button
                  className={styles.connectBtn}
                  onClick={() =>
                    dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        user_id: userProfile.userId,
                      })
                    )
                  }
                >
                  Connect
                </button>
              )}

              <button
                className={styles.downloadBtn}
                onClick={async () => {
                  const res = await clientServer.get(
                    `/user/download_resume?id=${userProfile.userId._id}`
                  );
                  window.open(`${BASE_URL}/${res.data.Message}`, "_blank");
                }}
              >
                Download Resume
              </button>
            </div>

            <p className={styles.bio}>{userProfile.bio}</p>
          </div>

          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <h3>Recent Activity</h3>
            <div className={styles.postList}>
              {userPosts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  {post.media && (
                    <img
                      className={styles.postImage}
                      src={`${BASE_URL}/${post.media}`}
                      alt="Post"
                    />
                  )}
                  <p>{post.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workList}>
              {userProfile.pastWork.map((work, i) => (
                <div key={i} className={styles.workCard}>
                  <strong>
                    {work.company} - {work.position}
                  </strong>
                  <span>Years - {work.years}</span>
                </div>
              ))}
            </div>
          </div>


           {/* Education History */}
           <div className={styles.workHistory}>
            <h4>Education</h4>
            <div className={styles.workList}>
              {userProfile.education.map((education, i) => (
                <div key={i} className={styles.workCard} style={{display:"flex", flexDirection:"column",gap:"0.7rem"}}>
                  <strong>
                    College : {education.school}
                  </strong>
                  {/* <span>Years - {work.years}</span> */}
                  <span >Degree: {education.degree }</span>
                  <span>Course: {education.fieldOfStudy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default ViewProfilePage;

export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_user_based_on_username", {
    params: { username: context.query.username },
  });
  return { props: { userProfile: request.data.Profile } };
}
