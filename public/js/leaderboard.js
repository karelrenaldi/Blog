/*eslint-disable*/
const leadButtons = document.querySelectorAll(`button[role="tab"]`);
const tabPanels = Array.from(document.querySelectorAll(`div[role="tabpanel"]`));
const endpoint = "/leaderboardData";
const prevBtn = document.querySelector(".previous-button");
const nextBtn = document.querySelector(".next-button");

const tabRecent = document.querySelector(`div[aria-labelledby="recent"]`);
const tabHighest = document.querySelector(`div[aria-labelledby="highest"]`);
const tabPopular = document.querySelector(`div[aria-labelledby="popular"`);

const limit = 6;

let page = 1;
let clickedBtn;
let nextData, nowData;

function renderData(data, tab) {
  if(tab === "recent" || tab === "highest"){
    const html = data.map(item => 
      `<div class="leaderboard-item">
          <img src="https://img.icons8.com/ios-filled/50/000000/user-group-man-man.png"/>
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
        <img src="https://img.icons8.com/ios-filled/50/000000/user-group-man-man.png"/>
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
    nextBtn.classList.remove("hidden");
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

    nowData = await fetchingData();

    const res = await fetch(`${endpoint}?tab=${clickedBtn.id}&page=${page + 1}`);
    nextData = await res.json();

    nowData = nowData.data;
    nextData = nextData.data; 

    // check display next button or not
    nowData.length < limit ? nextBtn.classList.add("hidden") : null; 
    // render data
    renderData(nowData, clickedBtn.id);
  }
}

leadButtons.forEach(async(leadButton) => {
  if(leadButton.classList.contains("clicked")){
    clickedBtn = leadButton;

    nowData = await fetchingData();

    const res = await fetch(`${endpoint}?tab=${clickedBtn.id}&page=${page + 1}`);
    nextData = await res.json();

    nowData = nowData.data;
    nextData = nextData.data; 

    // check display next button or not
    nowData.length < limit ? nextBtn.classList.add("hidden") : null; 
    // render data
    renderData(nowData, clickedBtn.id);
  }

  leadButton.addEventListener("click", handleButtonClick);
})

nextBtn.addEventListener("click", async() => {
  page === 1 ? prevBtn.classList.remove("hidden") : null;
  page += 1;

  nowData = nextData;

  const res = await fetch(`${endpoint}?tab=${clickedBtn.id}&page=${page + 1}`);
  nextData = await res.json();

  nextData = nextData.data;

  const lastPage = nextData.length === 0 ? true : false;

  // If last page remove next button
  renderData(nowData, clickedBtn.id);
  lastPage ? nextBtn.classList.add("hidden") : null;
})

prevBtn.addEventListener("click", async() => {
  page === 2 ? prevBtn.classList.add("hidden") : null;
  page = (page === 1) ? 1 : page - 1 ;

  const lastPage = nextData.length === 0 ? true : false;

  nextData = nowData;

  const res = await fetch(`${endpoint}?tab=${clickedBtn.id}&page=${page}`);
  nowData = await res.json();

  nowData = nowData.data;


  // If last page add next button
  renderData(nowData, clickedBtn.id);
  lastPage ? nextBtn.classList.remove("hidden") : null;
})