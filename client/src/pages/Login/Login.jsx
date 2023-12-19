import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import FlashContainer from "../../components/FlashContainer";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newUser = Object.fromEntries(formData);

    try {
      const apiURL = "http://localhost:5000/auth/login";

      const response = await axios.post(apiURL, newUser);

      if (response.status === 404) {
        return setFlashMessage("Invalid username or password");
      } else if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));

        formRef.current.reset();
        return navigate("/");
      }
    } catch (err) {
      if (err.request) {
        return setFlashMessage("Network Error");
      } else {
        console.error(err);
        return setFlashMessage("Something went wrong. Please try again");
      }
    }
  };

  return (
    <>
      {flashMessage && <FlashContainer message={flashMessage} />}

      <div className="flex h-screen items-center justify-center">
        <div className="w-5/6 rounded-xl border border-solid border-[#ccc] bg-white px-4 py-5 shadow-md">
          <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
            <label htmlFor="username">Username</label>
            <input
              className="mb-4 rounded border border-solid border-[#ccc] px-3 py-2 text-xl"
              type="text"
              name="username"
              id="username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              className="mb-4 rounded border border-solid border-[#ccc] px-3 py-2 text-xl"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              required
            />

            <div className="mr-1">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={handleShowPassword}
                name="show_password"
                id="show_password"
                className="mx-2 my-0"
              />
              <label htmlFor="show_password">Show password</label>
            </div>

            <input
              type="submit"
              className="mt-2 cursor-pointer rounded-md border-none bg-[#4caf50] p-3 text-base text-white transition-all duration-300 ease-in hover:bg-[#37813a]"
              value="Log in"
            />

            <p className="mt-4 text-base sm:text-lg">
              Don&apos;t have an account yet?{" "}
              <Link className="text-[#4caf50]" to="/auth/signup">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
