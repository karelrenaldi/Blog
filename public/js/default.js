/*eslint-disable*/
const overlay = document.querySelector(".overlay");
const menuBtn = document.querySelector(".hamburger-menu");
const dropdown = document.querySelector(".dropdown-menu");
const postBtnMini = document.querySelector(".dropdown-mini p");
const dropdownMini = document.querySelector(".dropdown-mini > *:last-child");

const openMenu = (e) => {
  menuBtn.classList.toggle("open");
  overlay.classList.toggle("open-menu");
};

const openDropdownMini = (e) => {
  const open = !dropdownMini.classList.contains("open-mini");
  if(open){
    dropdownMini.classList.add("open-mini");
    postBtnMini.textContent = "x close";
    postBtnMini.style.color = "crimson";
  }else{
    postBtnMini.textContent = "Projects >";
    dropdownMini.classList.remove("open-mini");
    postBtnMini.style.color = "var(--blue)";
  }
}

menuBtn.addEventListener("click", openMenu);
postBtnMini.addEventListener("click", openDropdownMini);