/* Default */
const timedefault = "Times";
const tableGame = document.querySelector(".maintable__boder-game");
const option = document.querySelector("#options");
const levels = {
  easy: 4,
  medium: 6,
  difficult: 8,
  extremely: 10,
};

const arr = [];
var imageLength = 36 + 1;
var i = 1;

while (arr.length < 99) {
  if (i % imageLength != 0) {
    arr.push(i % imageLength);
    arr.push(i % imageLength);
  }
  i++;
}

function shuffleArray(array, n) {
  for (let i = n; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* Music */
const audioChon = new Audio("./assets/audio/chon.mp3");
const audioChonSai = new Audio("./assets/audio/chonsai.mp3");
const audioChonDung = new Audio("./assets/audio/chondung.mp3");
const audioWin = new Audio("./assets/audio/win.mp3");
const audioBomb = new Audio("./assets/audio/bomb.mp3");
const audioGameStart = new Audio("./assets/audio/game-start.mp3");
const audioNhac = new Audio("./assets/audio/nhac.mp3");
audioNhac.loop = true;
audioNhac.volume = 0.4;
var isMusic = false;

const musicOn = document.querySelector("#icon-music-on");
const musicOff = document.querySelector("#icon-music-off");
const musicToggle = document.querySelector(".maintable-2-music");

musicToggle.addEventListener("click", () => {
  if (musicOn.style.display === "none") {
    musicOn.style.display = "unset";
    musicOff.style.display = "none";
    audioNhac.play();
    isMusic = true;
  } else {
    musicOn.style.display = "none";
    musicOff.style.display = "unset";
    audioNhac.pause();
    audioNhac.currentTime = 0;
    isMusic = false;
  }
});

/* Table game*/

function createTable(x = "easy") {
  tableGame.className = `maintable__boder-game ${x}`;
  tableGame.innerHTML = "";

  var n = levels[x];
  var array = arr.map((value) => value);

  shuffleArray(array, n * n - 1);

  for (let i = 0; i < n * n; i++) {
    tableGame.innerHTML += `
        <div class="maintable__boder-frame-img"> 
            <img  src="assets/images/pieces${array[i]}.png" alt="">
        </div>`;
  }

  addClickEvents();
}

function checkAllHidden() {
  const imgElements = document.querySelectorAll(".maintable__boder-frame-img");
  let allHidden = true;

  imgElements.forEach((value) => {
    if (value.style.visibility !== "hidden") {
      allHidden = false;
    }
  });

  return allHidden;
}

function addClickEvents() {
  var x,
    d = 0,
    index0;
  var imgElements = document.querySelectorAll(".maintable__boder-frame-img");

  imgElements.forEach((value, index) => {
    value.addEventListener("click", () => {
      if (d === 0) {
        x = value;
        index0 = index;
        value.style.opacity = 0.5;
        d++;
        if (isMusic) audioChon.play();
        // console.log(1);
      } else {
        // console.log(2);
        d = 0;
        x.style.opacity = 1;
        let linkimg1 = x.querySelector("img").currentSrc;
        let linkimg2 = value.querySelector("img").currentSrc;
        if (linkimg1 === linkimg2 && index0 != index) {
          x.style.visibility = "hidden";
          value.style.visibility = "hidden";
          if (isMusic) audioChonDung.play();
          if (checkAllHidden()) {
            setTimeout(() => {
              if (isMusic) audioWin.play();
              setTimeout(() => {
                alert("Chúc mừng bạn đã chiến thắng!");
              }, 1000);
              createTable(option.value);
              clearInterval(timerInterval);
              timeClock.textContent = timedefault;
              timerInterval = null;
              overlay.style.display = "unset";
            }, 0);
          }
        } else {
          if (isMusic) audioChonSai.play();
        }
      }
    });
  });
}

/* Control bar */

const time = 180;
const timeClock = document.querySelector(".maintable__clock-time");
const startButton = document.querySelector(".maintable__start");
const resetButton = document.querySelector(".maintable__reset");
const overlay = document.querySelector(".maintable__boder-overlay");

var xtime = time;
function updateClock() {
  var minutes = Math.floor(xtime / 60);
  var seconds = xtime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timeClock.textContent = `${minutes}:${seconds}`;

  xtime--;

  if (xtime < 0) {
    clearInterval(timerInterval);
    setTimeout(() => {
      if (isMusic) audioBomb.play();
      setTimeout(() => {
        alert("Thời gian đã hết!");
      }, 1000);
      xtime = time;
      timeClock.textContent = timedefault;
      createTable(option.value);
      overlay.style.display = "unset";
      timerInterval = null;
    }, 1000);
  }
}
// var timerInterval = setInterval(updateClock, 1000);
var timerInterval = null;
function startTimer() {
  if (!timerInterval) {
    xtime = time;
    setTimeout(() => {
      overlay.style.display = "none";
      timerInterval = setInterval(updateClock, 1000);
      if (isMusic) audioGameStart.play();
    }, 1000);
  }
}

function resetClock() {
  clearInterval(timerInterval);
  timerInterval = null;
  xtime = time;
  timeClock.textContent = timedefault;
  createTable(option.value);
  overlay.style.display = "unset";
}

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetClock);

/* Run */

function submitForm() {
  createTable(option.value);
  clearInterval(timerInterval);
  timerInterval = null;
  timeClock.textContent = timedefault;
  overlay.style.display = "unset";
}
createTable();
