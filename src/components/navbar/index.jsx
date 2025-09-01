import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import Image from "next/image";

function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
                {/* Optimized Next.js Image */}
                <div
                    className={styles.logo}
                    onClick={() => router.push("/")}
                    style={{ cursor: "pointer" }}
                >
                    <Image
                        src="/images/linkify-logo.png"
                        alt="Linkify Logo"
                        width={120}  // adjust size as needed
                        height={40}
                        priority
                    />
                </div>

                <div className={styles.navBarOptionContainer}>
                    {authState.profileFetched ? (
                        <div className={styles.menu}>
                            <p
                                className={styles.navLink}
                                onClick={() => router.push("/profile")}
                            >
                                Profile
                            </p>
                            <p
                                className={styles.navLink}
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    router.push("/login");
                                    dispatch(reset());
                                }}
                            >
                                Logout
                            </p>
                        </div>
                    ) : (
                        <div
                            onClick={() => router.push("/login")}
                            className={styles.btnJoin}
                        >
                            Be a part
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
