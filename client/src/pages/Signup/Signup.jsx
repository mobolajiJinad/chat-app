import { useState, useEffect } from "react";
import axios from "axios";

import FlashContainer from "../../components/FlashContainer";

const Signup = () => {
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [data, setData] = useState({
    username: "",
    initialPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem("token", JSON.stringify(token));
    } catch (error) {
      console.error("Error storing token in localStorage:", error);
    }
  }, [token]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, initialPassword, confirmPassword } = data;

    if (initialPassword !== confirmPassword) {
      return setFlashMessage("Passwords do not match");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@_#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/;
    if (!passwordRegex.test(initialPassword)) {
      return setFlashMessage(
        "Password must contain at least one digit and one special character",
      );
    }

    const usernameRegex = /^[a-zA-Z0-9\- ]{5,12}$/;
    if (!usernameRegex.test(username)) {
      return setFlashMessage(
        "Username must be between 5 and 12 characters and only contain alphanumeric characters, or hyphens",
      );
    }

    try {
      const apiURL = "http://localhost:5000/auth/signup";

      const response = await axios.post(apiURL, {
        username,
        password: initialPassword,
      });

      if (response.status === 409) {
        return setFlashMessage("Username already exists. Please pick another");
      }

      if (response.status === 200 && response.data.token) {
        setToken(response.data.token);
      }

      setFlashMessage("Sign up successful.");
    } catch (err) {
      if (err.request) {
        return setFlashMessage("Network Error");
      } else {
        return setFlashMessage("Something went wrong. Please try again");
      }
    }

    setData({
      username: "",
      initialPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      {flashMessage && <FlashContainer message={flashMessage} />}

      <div className="flex h-screen items-center justify-center">
        <div className="w-5/6 rounded-xl border border-solid border-[#ccc] bg-white px-4 py-5 shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-1 text-lg sm:text-xl" htmlFor="username">
              Enter a username
            </label>
            <input
              type="text"
              className="mb-4 rounded-md border border-solid border-[#ccc] px-3 py-2 text-lg sm:text-xl"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              required
            />

            <label className="mb-1 text-lg sm:text-xl" htmlFor="password">
              Enter password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="initialPassword"
              className="mb-4 rounded-md border border-solid border-[#ccc] px-3 py-2 text-lg sm:text-xl"
              id="password"
              value={data.initialPassword}
              onChange={handleChange}
              required
            />

            <label
              className="mb-1 text-lg sm:text-xl"
              htmlFor="confirm_password"
            >
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="mb-4 rounded-md border border-solid border-[#ccc] px-3 py-2 text-lg sm:text-xl"
              id="confirm_password"
              value={data.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="mr-1">
              <input
                className="mx-2 my-0"
                type="checkbox"
                name="show_password"
                id="show_password"
                checked={showPassword}
                onChange={handleShowPassword}
              />
              <label
                className="mb-1 text-lg sm:text-xl"
                htmlFor="show_password"
              >
                Show password
              </label>
            </div>

            <input
              type="submit"
              className="mt-2 cursor-pointer rounded-md border-none bg-[#4caf50] p-3 text-base text-white transition-all duration-300 ease-in hover:bg-[#37813a]"
              value="Sign up"
            />
          </form>

          <p className="mt-4 text-lg sm:text-xl">
            Already have an account?{" "}
            <a href="#" className="text-[#4caf50]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
