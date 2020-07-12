/*eslint-disable*/
const overlay = document.querySelector(".overlay");
const menuBtn = document.querySelector(".hamburger-menu");
const postBtn = document.querySelector("#dropdown p");
const dropdown = document.querySelector(".dropdown-menu");
const postBtnMini = document.querySelector(".dropdown-mini p");
const dropdownMini = document.querySelector(".dropdown-mini > *:last-child");

const openMenu = (e) => {
  menuBtn.classList.toggle("open");
  overlay.classList.toggle("open-menu");
};

const openDropdownBig = (e) => {
  const open = !dropdown.classList.contains("open");
  if(open){
    dropdown.classList.add("open");
    postBtn.textContent = "x close";
    postBtn.style.color = "tomato";
  }else{
    postBtn.textContent = "projects";
    dropdown.classList.remove("open");
    postBtn.style.color = "var(--light-grey)";
  }
}

const openDropdownMini = (e) => {
  const open = !dropdownMini.classList.contains("open-mini");
  if(open){
    dropdownMini.classList.add("open-mini");
    postBtnMini.textContent = "x close";
    postBtnMini.style.color = "tomato";
  }else{
    postBtnMini.textContent = "Projets >";
    dropdownMini.classList.remove("open-mini");
    postBtnMini.style.color = "var(--light-grey)";
  }
}

menuBtn.addEventListener("click", openMenu);
postBtn.addEventListener("click", openDropdownBig);
postBtnMini.addEventListener("click", openDropdownMini);