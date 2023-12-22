import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import { v5 as uuidv5 } from "uuid";

import { Header } from "./ContactList";

const UUID_NAMESPACE_URL = "1b671a64-40d5-491e-99b0-da01ff1f3341";

const NewContacts = () => {
  const [socket, token, username, userID] = useOutletContext();

  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    axios
      .post(
        "http://localhost:5000/contacts/getAll",
        { userID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        setAllUsers(response.data.otherUsersData);
      })
      .catch((error) => console.error(error));
  }, [token]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const filteredUsers = allUsers.filter((user) =>
    user.otherParticipantUsername.toLowerCase().includes(searchInput),
  );
  return (
    <>
      <Header
        username={username}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchInputChange={handleSearchInputChange}
      />

      <div style={{ height: "calc(100vh - 72px)" }} className="relative">
        <section className="flex flex-col">
          {filteredUsers.map((user) => {
            const sortedIDs = [userID, user.otherParticipantID].sort();
            const idString = sortedIDs.join("");

            const roomUUID = uuidv5(idString, UUID_NAMESPACE_URL);

            return (
              <Link
                className="flex items-center justify-between border-b border-solid border-b-[#ccc] px-4 py-3 hover:bg-[#f2f2f2]"
                key={user.otherParticipantID}
                to={`/chat/${user.otherParticipantID}&&&${roomUUID}`}
              >
                <img
                  src={user.otherParticipantProfilePic}
                  alt="Profile Picture"
                  className="mr-4 h-14 w-14 rounded-[50%] border border-solid border-[#f2f2f2]"
                />

                <div className="flex flex-1 flex-col">
                  <h3 className="m-0 text-xl">
                    {user.otherParticipantUsername}
                  </h3>
                  <p className="m-0 text-[#888]">{user.lastMessage}</p>{" "}
                </div>

                <div className="flex flex-col items-end">
                  <p className="m-0 text-sm text-[#888]">
                    {user.timeLastMessage}
                  </p>
                  {user.unreadMessages && (
                    <span className="mt-2 rounded-[50%] bg-[#128c7e] px-2 py-1 text-sm text-white">
                      {user.unreadMessages}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </>
  );
};
export default NewContacts;
