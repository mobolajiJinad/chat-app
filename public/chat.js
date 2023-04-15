const chatForm = document.querySelector(".chat_container");
const chatsContainer = document.getElementById("main_chat");

const chatID = window.location.pathname.split("/")[2];

const socket = io();

socket.emit("joinChat", chatID);

socket.on("status", (msg) => {
  document.getElementById("status").innerText = msg;
});

socket.on("message", (message) => {
  outputMessage(message, "received");
  document.getElementById("status").innerText = "online";
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const chatBox = e.target.elements.chat_box;

  const msg = chatBox.value;

  socket.emit("chatMessage", msg);
  outputMessage(msg, "sent");

  chatBox.value = "";
  chatBox.focus();
});

const outputMessage = (message, status) => {
  const div = document.createElement("div");

  if (status === "sent") {
    div.classList.add("message_container", "sender");
  } else if (status === "received") {
    div.classList.add("message_container", "receiver");
  }

  div.innerText = message;

  chatsContainer.appendChild(div);
  chatsContainer.scrollTop = chatsContainer.scrollHeight;
};
