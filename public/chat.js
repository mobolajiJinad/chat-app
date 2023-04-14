const chatForm = document.querySelector(".chat_container");
const chatsContainer = document.getElementById("main_chat");

const chatID = window.location.pathname.split("/")[2];
console.log(chatID);
const socket = io();

socket.on("status", (msg) => {
  if (msg === "undefined") {
    document.getElementById("status").innerText = "offline";
  } else {
    document.getElementById("status").innerText = msg;
  }
});

socket.on("message", (message) => {
  outputMessage(message, "received");
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const chatBox = e.target.elements.chat_box;

  const msg = chatBox.value;

  socket.emit("chatMessage", { msg, chatID });
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
