import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { v5 as uuidv5 } from "uuid";
import axios from "axios";

import BackBtn from "../../assets/back_btn.jpg";
import KebabMenu from "../../assets/kebab-menu.png";
import MicrophoneBtn from "../../assets/microphone_btn.jpg";
import SendBtn from "../../assets/send_btn.jpg";

const UUID_NAMESPACE_URL = "3ef1bf3a-3fd5-471c-94d3-83423c9a08f1";

const Chat = () => {
  const [socket, token] = useOutletContext();
  const urlParam = window.location.pathname.split("/")[2];
  const chatID = urlParam.split("&&&")[1];

  const [showMenu, setShowMenu] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [otherParticipantData, setOtherParticipantData] = useState({});
  const [IDs, setIDs] = useState({});
  const [messages, setMessages] = useState([]);
  const [statusText, setStatusText] = useState("");
  const [messageID, setMessageID] = useState("");

  useEffect(() => {
    socket.emit("joinChat", chatID);

    socket.on("status", (msg) => {
      setStatusText(msg);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { messageText: message, from: IDs.otherParticipantID },
      ]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/${urlParam}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response && response.data) {
          const { otherParticipantData, IDs, messages } = response.data;
          setOtherParticipantData(otherParticipantData);
          setIDs(IDs);
          setMessages(messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [urlParam, token]);

  const handleSendChat = (e) => {
    e.preventDefault();

    if (chatMessage.trim()) {
      socket.emit(
        "chatMessage",
        {
          chatMessage,
          id: {
            userID: IDs.userID,
            otherParticipantID: IDs.otherParticipantID,
          },
          messageID,
        },
        () => {
          console.log("It worked");
        },
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageText: chatMessage,
          from: IDs.userID,
          messageID: createNewID(chatMessage),
        },
      ]);

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }

    setChatMessage("");
    inputRef.current.focus();
  };

  const createNewID = (arg) => {
    const message_ID = uuidv5(arg + Date.now(), UUID_NAMESPACE_URL);
    setMessageID(message_ID);
    return message_ID;
  };

  return (
    <div className="bg-[#e5ddd5]">
      <header
        id="chat_header"
        className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#4caf50] p-5 text-white"
      >
        <div className="flex items-center">
          <Link to="/" className="mr-6 cursor-pointer">
            <img src={BackBtn} alt="" className="h-6 w-6 rounded-[50%]" />
          </Link>
          <img
            src={otherParticipantData.profilePic}
            alt="profile picture"
            className="mr-2 h-10 w-10 rounded-[50%]"
          />

          <div>
            <h2 className="text-xl font-medium">
              {otherParticipantData.username}
            </h2>
            <p className="text-base">{statusText}</p>
          </div>
        </div>

        <nav>
          <div id="vertical_dots">
            <img
              src={KebabMenu}
              alt=""
              onClick={() => setShowMenu(!showMenu)}
            />

            <ul
              className={`absolute ${
                showMenu ? "top-[75px]" : "-top-full"
              } right-1 w-1/2 list-none rounded-lg bg-[#4d744f] px-5 py-2 text-center transition-all duration-300`}
            >
              <li>
                <Link
                  href={`/chat/${urlParam}/delete`}
                  className="block p-2 text-xl text-white no-underline"
                >
                  Delete chat
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main
        id="main_chat"
        style={{ height: "calc(100vh - 8rem)" }}
        className={`flex flex-col overflow-x-hidden overflow-y-scroll`}
        ref={chatContainerRef}
      >
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              style={{ whiteSpace: "pre-line" }}
              className={
                message.from === IDs.userID
                  ? "m-1 max-w-[50%] self-end break-words rounded-lg bg-[#dcf8c6] p-2 text-base font-medium"
                  : "m-1 max-w-[50%] self-start break-words rounded-lg bg-white p-2 text-base font-medium"
              }
              key={index}
              // key={message.messageID}
            >
              {message.messageText}
            </div>
          ))}
      </main>

      <form
        className="sticky bottom-0 left-0 flex h-14 w-full items-center bg-white px-2 py-1"
        onSubmit={(e) => handleSendChat(e)}
      >
        <img src={MicrophoneBtn} alt="" className="h-6 w-6 rounded-[50%]" />
        <textarea
          name="chat"
          id="chat_box"
          style={{ width: "calc(100% - 82px)" }}
          cols="45"
          rows="1"
          placeholder="Text..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          ref={inputRef}
          className="mx-2 my-0 h-[90%] flex-1 rounded-xl border-none bg-[#e7e7e7] px-2 py-1 text-xl"
        ></textarea>
        <button type="submit" className="h-8 w-8 border-none bg-transparent">
          <img
            src={SendBtn}
            className="h-8 w-8 cursor-pointer rounded-[50%]"
            id="send_btn"
          />
        </button>
      </form>
    </div>
  );
};
export default Chat;
