const newChatBtn = document.getElementById("new_chat");
const body = document.querySelector("body");
const wrapper = document.getElementById("wrapper");

const UUID_NAMESPACE_URL = "1b671a64-40d5-491e-99b0-da01ff1f3341";

newChatBtn.addEventListener("click", (e) => {
  fetch(`/contacts/getList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: userID }),
  })
    .then((res) => res.json())
    .then((data) => createBody(data.otherUsersData))
    .then((section) => body.replaceChild(section, wrapper))
    .catch((err) => console.log(err));
});

const createBody = (data) => {
  const section = document.createElement("section");
  section.classList.add("chats");

  data.forEach((user) => {
    const sortedIDs = [userID, user.otherParticipantID].sort();
    const idString = sortedIDs.join("");

    const roomUUID = uuid.v5(idString, UUID_NAMESPACE_URL);

    const a = document.createElement("a");
    a.classList.add("chat");
    a.href = `/chat/${user.otherParticipantID}&&&${roomUUID}`;

    const innerHTML = `
      <img class="profile-pic" src="/profile_pics/profile_pic.jpg" alt="Profile Picture">
      <div class="chat-details">
        <h3 class="username">${user.username}</h3>
      </div>
    `;

    a.innerHTML = innerHTML;
    section.appendChild(a);
  });

  return section;
};
