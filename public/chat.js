const chatForm = document.querySelector(".chat_container");
const chatsContainer = document.getElementById("main_chat");
const verticalDots = document.getElementById("vertical_dots");

const chatID = window.location.pathname.split("/")[2].split("&&&")[1];

const socket = io();

socket.emit("joinChat", chatID);

socket.emit("seen");

socket.on("status", (msg) => {
  document.getElementById("status").textContent = msg;
});

socket.on("message", (message) => {
  outputMessage(message, "received");
  document.getElementById("status").textContent = "online";
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const chatBox = e.target.elements.chat_box;

  const msg = chatBox.value.trim();

  if (msg) {
    socket.emit("chatMessage", {
      msg,
      id: { userID: IDs.userID, otherParticipantID: IDs.otherParticipantID },
    });
    outputMessage(msg, "sent");
  }

  chatBox.value = "";
  chatBox.focus();
});

const outputMessage = (message, status) => {
  const div = document.createElement("div");
  div.style.whiteSpace = "pre-line";

  if (status === "sent") {
    div.classList.add("message_container", "sender");
  } else if (status === "received") {
    div.classList.add("message_container", "receiver");
  }

  div.textContent = message;

  chatsContainer.appendChild(div);
  chatsContainer.scrollTop = chatsContainer.scrollHeight;
};

messages.forEach((message) => {
  if (message.from === IDs.userID) {
    outputMessage(message.messageText, "sent");
  } else if (message.from === IDs.otherParticipantID) {
    outputMessage(message.messageText, "received");
  }
});

verticalDots.addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("show_menu");
});
