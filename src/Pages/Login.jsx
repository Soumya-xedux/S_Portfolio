import { auth, provider, signInWithPopup } from "../firebase";

import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      if (
        user.email !==
        "luckyssoumya719@gmail.com"
      ) {
        alert("Unauthorized User");
        return;
      }

      localStorage.setItem(
        "admin-auth",
        "true"
      );

      navigate("/commander");

    } catch (err) {
      console.error(err);

      alert("Google Login Failed");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Glow Background */}
        <div className={styles.glow1}></div>
        <div className={styles.glow2}></div>

        {/* Login Card */}
        <div className={styles.card}>
          {/* Icon */}
          <div className={styles.iconWrapper}>
            <ShieldCheck
              size={60}
              className={styles.icon}
            />
          </div>

          {/* Heading */}
          <h1 className={styles.title}>
            Admin Login
          </h1>

          <p className={styles.subtitle}>
            Secure access to portfolio dashboard
          </p>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Fake Inputs */}
          <div className={styles.inputBox}>
            <Mail size={20} />

            <input
              type="text"
              placeholder="Email Address"
              disabled
            />
          </div>

          <div className={styles.inputBox}>
            <Lock size={20} />

            <input
              type="password"
              placeholder="Password"
              disabled
            />
          </div>

          {/* Login Button */}
          <button
            className={styles.loginBtn}
            onClick={handleGoogleLogin}
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="google"
            />

            Continue with Google

            <ArrowRight size={20} />
          </button>

          {/* Footer */}
          <p className={styles.footer}>
            Authorized admin access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;