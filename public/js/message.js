/*eslint-disable */
const closeButton = document.querySelector(".close-message");
const message = document.querySelector(".message-box");
const wait = (ms) => new Promise(reslove => {
  setTimeout(reslove,ms);
})

async function closeMessage() {
  console.log("closed");
  message.classList.add("none");
}

closeButton.addEventListener("click", closeMessage);

setTimeout(closeMessage, 1500);