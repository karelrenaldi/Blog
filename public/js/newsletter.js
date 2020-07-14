/*eslint-disable*/
const newsButton = document.querySelector(".newsletter-button");
const newsEmail = document.querySelector(".newsletter-email");
const newsHeader = document.querySelector(".newsletter-header");
const newsBody = document.querySelector(".newsletter-body");

newsButton.addEventListener("click", async(e) => {
  e.preventDefault();
  await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: newsEmail.value })
  });
  newsBody.innerHTML = '<h2 style="padding: 2em 0">Thank You For Subscribe</h2>';
  newsEmail.value = "";
  console.log(pages);
})