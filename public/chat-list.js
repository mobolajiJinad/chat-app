const newChatBtn = document.getElementById("new_chat");
const body = document.querySelector("body");
const verticalDots = document.getElementById("vertical_dots");
const profilePic = document.getElementById("profilePic");
const wrapper = document.getElementById("wrapper");

const UUID_NAMESPACE_URL = "1b671a64-40d5-491e-99b0-da01ff1f3341";

verticalDots.addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("show_menu");
});

profilePic.addEventListener("change", async (e) => {
  try {
    const file = profilePic.files[0];

    const form = new FormData();
    form.append("profilePic", file);

    fetch("/chat-list/upload-profile-pic", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((response) => console.log(response));
  } catch (err) {
    console.log(err);
  }
});

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
