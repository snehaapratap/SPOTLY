import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "react-toastify/dist/ReactToastify.css";
import signupImgae from "./waterfalls.jpeg";
import leftImage from "./left.jpg";
import axios from "axios";

const LoginSignupForm = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  axios.defaults.withcredentials = true;

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("name, email and password are required");
    }
    try {
      const url = "https://star-light-web-dev.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/LoginSignupForm");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {
      const url = "https://star-light-web-dev.vercel.app/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/Home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div
      className="min-h-screen w-full grid place-items-center bg-[#e9e9e9] p-4"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dci1eujqw/image/upload/v1616769558/Codepen/waldemar-brandt-aThdSdgx0YM-unsplash_cnq4sb.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#e9e9e9", // Fallback color
      }}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[758px] min-h-[480px] overflow-hidden"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dci1eujqw/image/upload/v1616769558/Codepen/waldemar-brandt-aThdSdgx0YM-unsplash_cnq4sb.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e9e9e9", // Fallback color
        }}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0
            ${
              isRightPanelActive
                ? "translate-x-[100%] opacity-100 z-20"
                : "translate-x-[-100%] opacity-0 z-10"
            }`}
          style={{
            width: "50%",
            backgroundImage:
              "url(https://res.cloudinary.com/dci1eujqw/image/upload/v1616769558/Codepen/waldemar-brandt-aThdSdgx0YM-unsplash_cnq4sb.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#e9e9e9", // Fallback color
          }}
        >
          <form
            onSubmit={handleSignup}
            className="flex flex-col items-center justify-center h-full px-8 lg:px-12 py-8 space-y-4 bg-white"
          >
            <h2 className="text-2xl font-light mb-2">Sign Up</h2>
            <input
              onChange={handleSignUpChange}
              type="text"
              name="name"
              autoFocus
              placeholder="Enter your name..."
              value={signupInfo.name}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              onChange={handleSignUpChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              onChange={handleSignUpChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-[#0367a6] to-[#008997] text-white rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0
            ${
              isRightPanelActive
                ? "translate-x-[100%] opacity-0 z-10"
                : "translate-x-[0] opacity-100 z-20"
            }`}
          style={{ width: "50%" }}
        >
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center h-full px-8 lg:px-12 py-8 space-y-4 bg-white"
          >
            <h2 className="text-2xl font-light mb-2">Sign In</h2>
            <input
              onChange={handleLoginChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              onChange={handleLoginChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Forgot your password?
            </a>
            <button className="mt-4 bg-gradient-to-r from-[#0367a6] to-[#008997] text-white rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500">
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-[50%] w-[50%] h-full overflow-hidden transition-transform duration-500 ease-in-out z-30
            ${isRightPanelActive ? "-translate-x-full" : ""}`}
        >
          <div
            className={`bg-gradient-to-r from-[#0367a6] to-[#008997] relative -left-full h-full w-[200%] transform transition-transform duration-500 ease-in-out
              ${isRightPanelActive ? "translate-x-[50%]" : ""}`}
          >
            {/* Left Overlay Panel */}
            <div
              className={`absolute top-0 flex flex-col items-center justify-center h-full w-[50%] p-8 text-center text-white
                transform transition-transform duration-500 ease-in-out
                ${isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"}`}
              style={{
                backgroundImage: `url(${leftImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#e9e9e9", // Fallback color
              }}
            >
              <h2 className="text-3xl font-light mb-4">Welcome Back!</h2>
              <p className="mb-8 text-sm opacity-80">
                Already have an account? Sign in to access your dashboard.
              </p>
              <button
                onClick={() => setIsRightPanelActive(false)}
                className="border-2 border-white text-white rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#0367a6] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel */}
            <div
              className={`absolute top-0 right-0 flex flex-col items-center justify-center h-full w-[50%] p-8 text-center text-white
                transform transition-transform duration-500 ease-in-out
                ${isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"}`}
              style={{
                backgroundImage: `url(${signupImgae})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#e9e9e9", // Fallback color
              }}
            >
              <h2 className="text-3xl font-light mb-4">Hello, Friend!</h2>
              <p className="mb-8 text-sm opacity-80">
                Enter your details and start your journey with us today.
              </p>
              <button
                onClick={() => setIsRightPanelActive(true)}
                className="border-2 border-white text-white rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#0367a6] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignupForm;
