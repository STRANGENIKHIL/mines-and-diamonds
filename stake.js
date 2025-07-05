const stakeinput = document.querySelector(".enter-stake1");
const inputbox = document.querySelector(".enter-mines");
const startbutton = document.querySelector(".start-game");
const reward = document.getElementById("reward-amount");
const eachbox = document.querySelectorAll(".box");
const resultmsg = document.getElementById("game-result");
const cashoutBtn = document.querySelector(".cash");
const restartbtn = document.querySelector(".restart");
const wallet = document.getElementById("wallet1");
const rigCheckbox = document.getElementById("rig-checkbox");

let walletAmount = localStorage.getItem("walletAmount")
  ? parseFloat(localStorage.getItem("walletAmount"))
  : 1000;
wallet.innerText = walletAmount.toFixed(2);

function saveWallet() {
  localStorage.setItem("walletAmount", walletAmount.toFixed(2));
}

let minePos = [];
let stakevalue;
let mines;
let multi = 1;
let currentreward = 0;
let gameActive = false;
let startflag = 0
function startgame() {
  startbutton.disabled = true;

  stakevalue = Number(stakeinput.value);
  mines = Number(inputbox.value);

  if (!stakevalue || !mines || mines >= 25 || mines < 1) {
    alert("Enter valid stake and number of mines (1-24)");
    return;
  }

  if (stakevalue > walletAmount) {
    alert(`You don't have enough money`);
    return;
  }
  rigCheckbox.disabled = true;

  walletAmount -= stakevalue;
  wallet.innerText = walletAmount.toFixed(2);
  saveWallet();


  multi = 1;
  currentreward = 0;
  minePos = [];
  gameActive = true;
  reward.innerText = "0";
  resultmsg.innerText = "Game in Progress";

  if (rigCheckbox.checked) {
    for (let i = 1; i <= 25; i++) {
      minePos.push(i);
    }
  } else {
    while (minePos.length !== mines) {
      let randombox = Math.floor(Math.random() * 25 + 1);
      if (!minePos.includes(randombox)) {
        minePos.push(randombox);
      }
    }
  }

  let i = 1;
  eachbox.forEach((box) => {
    box.textContent = i++;
    box.style.backgroundColor = "#18396e";
    box.style.pointerEvents = "auto";
    box.style.boxShadow = "none";
  });
}

if(startflag === 1){
  startgame.disabled = true
}
function multiplier() {
  if(mines <4){
  multi *= Number((1 + mines * 0.05).toFixed(2));
  currentreward = stakevalue * multi;}
  else if(mines>=4 || mines<=8){
    multi*= Number((1+mines*0.01).toFixed(2))
    currentreward = stakevalue * multi;
  }
  else if(mines>=9 || mines<=15){
    multi*= Number((1+mines*0.008).toFixed(2))
    currentreward = stakevalue * multi;
  }
  else if(mines>=16){
    multi*= Number((1+mines*0.007).toFixed(2))
    currentreward = stakevalue * multi;
  }
  reward.innerText = currentreward.toFixed(2);
}

function gameover(clickedBox = null) {
  resultmsg.innerText = "💥 You clicked on a mine! Game Over!";
  gameActive = false;

  eachbox.forEach((box) => {
    box.style.pointerEvents = "none";
    if (clickedBox && box === clickedBox) {
      box.style.backgroundColor = "red";
      box.textContent = "💣";
    }
  });

  wallet.innerText = walletAmount.toFixed(2);
  saveWallet();

}

function restartGame() {
  gameActive = false;
  multi = 1;
  currentreward = 0;
  reward.innerText = "0";
  resultmsg.innerText = "Game in progress...";
  stakeinput.value = "";
  inputbox.value = "";
  rigCheckbox.checked = false;
  rigCheckbox.disabled = false;


  let i = 1;
  eachbox.forEach((box) => {
    box.textContent = i++;
    box.style.backgroundColor = "#18396e";
    box.style.pointerEvents = "auto";
    box.style.boxShadow = "none";
  });
  startbutton.disabled = false;

}

function handleCashout() {
  if (!gameActive || currentreward === 0) return;

  resultmsg.innerText = `🎉 You cashed out with ₹${currentreward.toFixed(2)}!`;
  walletAmount += currentreward;
  wallet.innerText = walletAmount.toFixed(2);
  gameActive = false;
  saveWallet();


  eachbox.forEach((box) => {
    box.style.pointerEvents = "none";
  });

  currentreward = 0;
}

eachbox.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive) return;

    let boxNumber = Number(box.textContent);

    if (minePos.includes(boxNumber)) {
      gameover(box); 
    } else {
      multiplier();
      box.style.backgroundColor = "green";
      box.style.boxShadow = "0 0 10px 2px lime";
      box.style.pointerEvents = "none";
      box.textContent = "💎";
    }
  });
});

function resetWallet() {
  localStorage.removeItem("walletAmount");
  walletAmount = 1000;
  wallet.innerText = walletAmount.toFixed(2);
  saveWallet();
  alert("Wallet reset to ₹1000.");
}


startbutton.addEventListener("click", startgame);
restartbtn.addEventListener("click", restartGame);
cashoutBtn.addEventListener("click", handleCashout);
