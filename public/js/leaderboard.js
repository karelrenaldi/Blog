/*eslint-disable*/
// TODO FINISH PAGINATION AND REFACTOR!!!

const leadButtons = document.querySelectorAll(`button[role="tab"]`);
const tabPanels = Array.from(document.querySelectorAll(`div[role="tabpanel"]`));
const endpoint = "http://localhost:3000/leaderboardData";
const prevBtn = document.querySelector(".previous-button");
const nextBtn = document.querySelector(".next-button");

const tabRecent = document.querySelector(`div[aria-labelledby="recent"]`);
const tabHighest = document.querySelector(`div[aria-labelledby="highest"]`);
const tabPopular = document.querySelector(`div[aria-labelledby="popular"`);

let page = 1;
let clickedBtn;

function renderData(data, tab) {
  if(tab === "recent" || tab === "highest"){
    console.log(data);
    const html = data.map(item => 
      `<div class="leaderboard-item">
          <i class="fas fa-user-tie"></i>
          <div class="leaderboard-item-description">
              <h2>${item.name}</h2>
              <p>Rp. ${item.nominal}</p>
          </div>
      </div>
      <hr>
    `);
    tab === "recent" ? tabRecent.innerHTML = html.join("\n") : tabHighest.innerHTML = html.join("\n");

  }else if(tab === "popular"){
    const html = data.map(item => `
    <div class="leaderboard-item">
        <i class="fas fa-user-tie"></i>
        <div class="leaderboard-item-description">
          <h2>${item.prokerName}</h2>
          <p>Total Donatur: ${item.totalDonors}</p>
          <p>Total Donasi: Rp. ${item.nominalTotal}</p>
        </div>
    </div>
    <hr>
    `);

    tabPopular.innerHTML = html.join("\n");
  }
}

async function fetchingData() {
  const res = await fetch(`${endpoint}?tab=${clickedBtn.id}&page=${page}`);
  const data = await res.json();

  return data;
}

async function handleButtonClick({ currentTarget:button }){
  const clicked = (button === clickedBtn);
  if(!clicked){
    // Restart Page
    page = 1;
    prevBtn.classList.add("hidden");
    // CSS Button
    clickedBtn.classList.remove("clicked");
    button.classList.add("clicked");
    clickedBtn = button;

    // Display only related id
    tabPanels.forEach(tabPanel => {
      tabPanel.getAttribute("aria-labelledby") === clickedBtn.id 
        ? tabPanel.classList.remove("hidden")
        : tabPanel.classList.add("hidden");
    })

    let data = await fetchingData();
    data = data.data;

    renderData(data, clickedBtn.id);
  }
}

leadButtons.forEach(async(leadButton) => {
  if(leadButton.classList.contains("clicked")){
    clickedBtn = leadButton;

    let data = await fetchingData();
    data = data.data;

    renderData(data, clickedBtn.id);
  }

  leadButton.addEventListener("click", handleButtonClick);
})

nextBtn.addEventListener("click", async() => {
  page === 1 ? prevBtn.classList.remove("hidden") : null;
  page += 1;
  
  let data = await fetchingData();
  data = data.data;
 
  renderData(data, clickedBtn.id);
})

prevBtn.addEventListener("click", async() => {
  page === 2 ? prevBtn.classList.add("hidden") : null;
  page = (page === 1) ? 1 : page - 1 ;
  let data = await fetchingData();
  data = data.data;

  renderData(data, clickedBtn.id);
})