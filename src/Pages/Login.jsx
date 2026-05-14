import { auth, provider, signInWithPopup } from "../firebase";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      if (user.email !== "luckyssoumya719@gmail.com") {
        alert("Unauthorized User");
        return;
      }

      console.log(user);

      localStorage.setItem("admin-auth", "true");

      navigate("/commander");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
