import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { v5 as uuidv5 } from "uuid";

import SearchImg from "../../assets/search.svg";
import KebabMenuImg from "../../assets/kebab-menu.png";

const UUID_NAMESPACE_URL = "1b671a64-40d5-491e-99b0-da01ff1f3341";

const ContactList = ({ data, username, userID, token, socket }) => {
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const handleShowNewContacts = () => {
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
        setShowAllUsers((prev) => !prev);
      })
      .catch((error) => console.error(error));
  };

  const filteredUsers = showAllUsers
    ? allUsers.filter((user) =>
        user.otherParticipantUsername.toLowerCase().includes(searchInput),
      )
    : data.filter((user) =>
        user.otherParticipantUsername.toLowerCase().includes(searchInput),
      );

  if (showAllUsers) {
    return (
      <div className="h-screen w-full">
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

          <NewChatButton handleShowNewContacts={handleShowNewContacts} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <Header
        username={username}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchInputChange={handleSearchInputChange}
      />

      <div style={{ height: "calc(100vh - 72px)" }} className="relative">
        <section className="flex flex-col">
          {data.length <= 0 && (
            <p className="mt-5 text-center text-xl text-[#888]">
              You don't have any recent chats
            </p>
          )}

          {filteredUsers.map((user) => {
            return (
              <Link
                className="flex items-center justify-between border-b border-solid border-b-[#ccc] px-4 py-3 hover:bg-[#f2f2f2]"
                key={user.otherParticipantID}
                to={`/chat/${user.otherParticipantID}&&&${user.id}`}
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

        <NewChatButton handleShowNewContacts={handleShowNewContacts} />
      </div>
    </div>
  );
};

const Header = ({ username, searchInput, handleSearchInputChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchBarOpen(false);
  };

  const handleToggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
    setIsMenuOpen(false);
  };

  const handleProfilePicUpload = (e) => {
    try {
      const file = profilePic.files[0];

      const formData = new FormData();
      formData.append("profilePic", file);

      axios
        .post("http://localhost:5000/chat-list/upload-profile-pic", formData)
        .then((res) => res.json())
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="relative flex items-center justify-between bg-[#4caf50] px-1 py-3 pr-2 text-white">
      <span className="ml-6 text-3xl font-bold">{username}</span>

      <div className="flex w-[27%] items-center justify-between">
        <img
          onClick={() => handleToggleSearchBar()}
          src={SearchImg}
          className="md:block"
        />

        <input
          className={`absolute ${
            isSearchBarOpen ? "top-[4.5rem]" : "-top-60"
          } left-1 right-1 z-50 w-full rounded-lg border border-solid border-[#4caf50] px-2 py-3 text-lg text-black
          `}
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Search"
        />

        <nav
          onClick={() => handleToggleMenu()}
          className="flex cursor-pointer flex-col"
        >
          <img width="40px" height="40px" src={KebabMenuImg} />

          <ul
            className={`absolute ${
              isMenuOpen ? "top-[4.5rem]" : "-top-60"
            } right-1 z-50 w-3/5 list-none rounded-lg bg-[#4caf50] px-3 py-3 text-center transition-all duration-300 `}
          >
            <li>
              <a
                className="block cursor-pointer px-0.5 py-2 text-xl text-white no-underline"
                href="#"
              >
                Logout
              </a>
              <label
                className="block cursor-pointer px-0.5 py-2 text-xl text-white no-underline"
                htmlFor="profilePic"
              >
                Change profile pic
              </label>
              <input
                className="hidden"
                type="file"
                name="profilePic"
                onChange={handleProfilePicUpload}
              />
              <a
                href="#"
                className="block cursor-pointer px-0.5 py-2 text-xl text-white no-underline"
              >
                Delete account
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const NewChatButton = ({ handleShowNewContacts }) => {
  return (
    <div
      onClick={() => handleShowNewContacts()}
      className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-[50%] bg-[#4caf50]"
    >
      <p className="cursor-pointer pb-3 text-7xl leading-10 text-white">+</p>
    </div>
  );
};

export default ContactList;
