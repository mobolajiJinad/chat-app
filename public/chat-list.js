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

    const form = document.createElement("form");
    form.action = `/chat/${roomUUID}`;
    form.method = "POST";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "otherParticipantID";
    input.value = user.otherParticipantID;

    const a = document.createElement("a");
    a.href = "#";

    const innerHTML = `
    <div class="chat">
      <img class="profile-pic" src="/profile_pics/profile_pic.jpg" alt="Profile Picture">
      <div class="chat-details">
        <h3 class="username">${user.username}</h3>
      </div>
    </div>
    `;

    a.innerHTML = innerHTML;
    form.appendChild(input);
    form.appendChild(a);
    section.appendChild(form);

    a.addEventListener("click", (e) => {
      e.preventDefault();
      form.submit();
    });
  });

  return section;
};
