/*eslint-disable*/
const overlay = document.querySelector(".overlay");
const menuBtn = document.querySelector(".hamburger-menu");
const postBtn = document.querySelector("#dropdown p");
const dropdown = document.querySelector(".dropdown-menu");

const openMenu = (e) => {
  menuBtn.classList.toggle("open");
  overlay.classList.toggle("open-menu");
};

const openDropdown = (e) => {
  const open = !dropdown.classList.contains("open");
  if(open){
    dropdown.classList.add("open");
    postBtn.textContent = "x close";
    postBtn.style.color = "tomato";
  }else{
    postBtn.textContent = "posts";
    dropdown.classList.remove("open");
    postBtn.style.color = "var(--light-grey)";
  }
}

menuBtn.addEventListener("click", openMenu);
postBtn.addEventListener("click", openDropdown);