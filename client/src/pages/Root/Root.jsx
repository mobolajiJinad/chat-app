import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

import FlashContainer from "../../components/FlashContainer";
import ContactList from "./ContactList";
import { getToken } from "../../functions";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

const Root = () => {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [data, setData] = useState([]);

  const [token, setToken] = useState(getToken());

  const socket = io(URL, {
    autoConnect: false,
  });

  const [flashMessage, setFlashMessage] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!token || token.length <= 0) {
        navigate("/auth/login");
        setFlashMessage("Please log in again");
        return;
      }

      const fetchData = async () => {
        try {
          const response = await getData(token);
          if (response && response.data) {
            const { username, userID, data } = response.data;
            setUsername(username);
            setUserID(userID);
            setData(data);

            socket.connect();
          } else {
            navigate("/auth/login");
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [navigate, token]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup event listeners when the component unmounts
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const getData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const screenSize = window.innerWidth;
  const urlPath = window.location.pathname;

  return (
    <>
      {flashMessage && <FlashContainer message={flashMessage} />}

      <div className="flex">
        <div
          className={`${
            screenSize < 767 && urlPath.startsWith("/chat")
              ? "hidden"
              : "w-screen"
          } md:w-1/2 lg:w-2/5`}
        >
          <ContactList username={username} data={data} />
        </div>

        <div
          className={`${
            screenSize < 767 && urlPath.startsWith("/chat")
              ? "w-screen"
              : "hidden"
          } md:block md:w-1/2 lg:w-3/5`}
        >
          <Outlet context={[socket, token, username, userID]} />
        </div>
      </div>
    </>
  );
};

export default Root;
