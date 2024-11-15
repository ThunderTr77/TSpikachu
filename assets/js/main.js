/* Music */
const audioChon = new Audio('./assets/audio/chon.mp3');
const audioChonSai = new Audio('./assets/audio/chonsai.mp3');
const audioChonDung = new Audio('./assets/audio/chondung.mp3');
const audioWin = new Audio('./assets/audio/win.mp3');
const audioBomb = new Audio('./assets/audio/bomb.mp3');
const audioGameStart = new Audio('./assets/audio/game-start.mp3')
const audioNhac = new Audio('./assets/audio/nhac.mp3')
audioNhac.loop = true;
audioNhac.volume = 0.4;
var isMusic = false;

const musicOn = document.querySelector('#icon-music-on');
const musicOff = document.querySelector('#icon-music-off');
const musicToggle = document.querySelector('.mainboard-2-music');

musicToggle.addEventListener('click', () => {
    if (musicOn.style.display === 'none' || musicOn.style.display === '') {
      musicOn.style.display = 'unset';
      musicOff.style.display = 'none';
      audioNhac.play();
      isMusic = true;
  } else {
      musicOn.style.display = 'none';
      musicOff.style.display = 'unset';
      audioNhac.pause();
      audioNhac.currentTime = 0;
      isMusic = false;
  }
});


/* Default */
const timedefault = 'Time'
const tableGame =  document.querySelector('.mainboard__border-game');
const option = document.querySelector('#options');
const levels = {
    easy : 4,
    medium : 6,
    difficult : 8,
    extremely : 10,
}

const arr = [];
var imageLength = 36 + 1;
var i=1;

while(arr.length < 100 ) {
    if (i%imageLength != 0) {
        arr.push(i%imageLength)
        arr.push(i%imageLength)
    }
    i++;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

// Hàm xáo trộn mảng 2 chiều
function shuffle2DArray(arr2D) {
    // Lưu trữ các phần tử không phải 0
    const nonZeroElements = [];

    for (let i = 0; i < arr2D.length; i++) {
        for (let j = 0; j < arr2D[i].length; j++) {
            if (arr2D[i][j] !== 0) {
                nonZeroElements.push(arr2D[i][j]);
            }
        }
    }

    // Xáo trộn các phần tử không phải 0
    shuffleArray(nonZeroElements);

    // Đưa các phần tử đã xáo trộn vào mảng 2 chiều
    let index = 0;
    for (let i = 0; i < arr2D.length; i++) {
        for (let j = 0; j < arr2D[i].length; j++) {
            if (arr2D[i][j] !== 0) {
                arr2D[i][j] = nonZeroElements[index];
                index++;
            }
        }
    }
}

function indexInmatrix(k, m, n) {
    const row = Math.floor(k / n);
    const col = k % m;
    return { row: row, col: col }
}

function convertToIndex(x, y, width) {
    return x * width + y;
}



const directions = [
    [0, 1],   // Phải
    [1, 0],   // Dưới
    [0, -1],  // Trái
    [-1, 0]   // Trên
];

function dfs(startX, startY, endX, endY, a) {
    const rows = a.length;
    const cols = a[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = {};

    function dfsRecursive(currentRow, currentCol, lastDirection, turns) {
        // Kiểm tra nếu đã đến đích
        if (currentRow === endX && currentCol === endY) {
            let path = [];
            let curr = `${endX},${endY}`;
            while (curr) {
                const [x, y] = curr.split(',').map(Number);
                path.push([x, y]);
                curr = parent[curr];
            }
            return path.reverse(); // Đảo ngược để có đường đi từ start đến end
        }

        // Duyệt qua các điểm kề
        for (let i = 0; i < directions.length; i++) {
            const [dx, dy] = directions[i];
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;

            // Kiểm tra điều kiện hợp lệ
            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited[newRow][newCol] && // Chưa thăm
                (a[newRow][newCol] === 0 || (newRow === endX && newCol === endY)) // Chỉ đi qua ô có giá trị 0 hoặc ô đích
            ) {
                const newTurns = (lastDirection !== -1 && lastDirection !== i) ? turns + 1 : turns;

                if (newTurns <= 2) { // Chỉ cho phép tối đa 2 lần rẽ
                    visited[newRow][newCol] = true; // Đánh dấu là đã thăm
                    parent[`${newRow},${newCol}`] = `${currentRow},${currentCol}`; // Ghi lại điểm cha
                    
                    const result = dfsRecursive(newRow, newCol, i, newTurns);
                    if (result) return result; // Nếu tìm thấy đường đi
                    visited[newRow][newCol] = false; // Quay lại, đánh dấu lại là chưa thăm
                }
            }
        }

        return null; // Nếu không tìm thấy đường đi
    }

    visited[startX][startY] = true; // Đánh dấu ô bắt đầu là đã thăm
    return dfsRecursive(startX, startY, -1, 0); // Gọi hàm đệ quy
}

/* Hàm checkPairsWithSameValue kiểm tra mảng có dường đi không, nếu có thì trả về true, ngược lại false */

// Nhóm các ô có giá trị giống nhau
function groupByValue(a) {
    const groups = {};
    const rows = a.length;
    const cols = a[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const value = a[i][j];
            if (value !== 0) { // Chỉ nhóm các ô có giá trị khác 0
                if (!groups[value]) {
                    groups[value] = [];
                }
                groups[value].push([i, j]);
            }
        }
    }
    return groups;
}

// Tương tự như dfs mà trả về true/false
function canReachWithTwoTurns(startX, startY, endX, endY, a) {
    const rows = a.length;
    const cols = a[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[startX][startY] = true; // Đánh dấu ô bắt đầu là đã thăm

    function dfs(currentRow, currentCol, lastDirection, turns) {
        // Kiểm tra nếu đã đến đích
        if (currentRow === endX && currentCol === endY) {
            return true;
        }

        // Duyệt qua các điểm kề
        for (let i = 0; i < directions.length; i++) {
            const [dx, dy] = directions[i];
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;

            // Kiểm tra điều kiện hợp lệ
            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited[newRow][newCol] && // Chưa thăm
                (a[newRow][newCol] === 0 || (newRow === endX && newCol === endY)) // Chỉ đi qua ô có giá trị 0 hoặc ô đích
            ) {
                const newTurns = (lastDirection !== -1 && lastDirection !== i) ? turns + 1 : turns;

                if (newTurns <= 2) { // Chỉ cho phép tối đa 2 lần rẽ
                    visited[newRow][newCol] = true; // Đánh dấu là đã thăm

                    // Gọi đệ quy
                    if (dfs(newRow, newCol, i, newTurns)) {
                        return true; // Nếu tìm thấy đường đi
                    }

                    visited[newRow][newCol] = false; // Quay lại, đánh dấu lại là chưa thăm
                }
            }
        }

        return false; // Nếu không tìm thấy đường đi
    }

    return dfs(startX, startY, -1, 0); // Gọi hàm đệ quy
}

// Kiểm tra cả mảng có đường đi không trả về true/false
function checkPairsWithSameValue(a) {
    const allZeros = a.every(row => row.every(value => value === 0));
    if (allZeros) {
        console.log('win')
        return true; // Trả về true nếu tất cả giá trị đều là 0
    }
    const groups = groupByValue(a);
    // console.log(groups);
    for (const value in groups) {
        const positions = groups[value];
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const [startX, startY] = positions[i];
                const [endX, endY] = positions[j];

                if (canReachWithTwoTurns(startX, startY, endX, endY, a)) {
                    console.log(`Path found between (${startX}, ${startY}) and (${endX}, ${endY})`);
                    // console.log(a)
                    return true; // Nếu tìm thấy ít nhất một đường đi
                }
            }
        }
    }

    // console.log("No valid path found between any pairs.");
    return false; // Không tìm thấy đường đi cho bất kỳ cặp nào
}
/*------------------------------------------------------------------------*/

function shuffleBoard(a) {
    // Kiểm tra xem có cặp nào có thể di chuyển không
    bool = true;
    if ( checkPairsWithSameValue(a) == false ) {
        console.log("shuffleBoard");
        bool = false;
        while (!checkPairsWithSameValue(a)) {
            shuffle2DArray(a); // Nếu không có cặp hợp lệ, xáo trộn lại
        }
    }
    return bool;
}


/* Table game*/

function createTable(x = 'easy') {
    tableGame.className = `mainboard__border-game ${x}`;
    tableGame.innerHTML = '';
    
    const n = levels[x];
    const array = arr.slice(0,n*n);


    shuffleArray(array);
    const arr2D = [];
    let index = 0;

    // console.log(array)

    for( let i = 0; i <= n+1; i++ ) {
        arr2D[i] = [];
        for( let j = 0; j <= n+1; j++) {
            if ( i != 0 && j != 0 && i <= n && j <= n ) {
                arr2D[i][j] = array[index];
                index++;
            } else {
                arr2D[i][j] = 0;
            }
        }
    }

    // console.log(arr2D)
    shuffleBoard(arr2D);

    for( let i = 0; i <= n+1; i++ ) {
        for( let j = 0; j <= n+1;j++ ) {
            if (arr2D[i][j] != 0) {
                tableGame.innerHTML += `
                <div class="mainboard__border-frame-img"> 
                    <img  src="assets/images/pieces${arr2D[i][j]}.png" alt="">
                    <div></div>
                </div>`;
            } else {
                tableGame.innerHTML += `
                <div class="mainboard__border-frame-img view-off"> 
                    <img  src="" alt="">
                    <div></div>
                </div>`;
            }
        }
    }
    addClickEvents(arr2D, n, n, tableGame);
}

function checkAllHidden() {
    const imgElements = document.querySelectorAll('.mainboard__border-frame-img');
    let allHidden = true; 

    imgElements.forEach(value => {
        if (!value.classList.contains('view-off')) {
            allHidden = false; 
        }
    });
    return allHidden; 
}

function addClickEvents(arr2D, m, n, tableGame) {
    var x, d = 0, index0;
    var imgElements = document.querySelectorAll('.mainboard__border-frame-img');
    var divElementChilds = [];

    imgElements.forEach( (value) => {
        divElementChilds.push(value.querySelector('div'))
    })

    imgElements.forEach( (value, index) => {
        value.addEventListener('click', () => {
            if (d === 0) {
                x = value;
                index0 = index;
                value.style.opacity = 0.5; 
                d++; 
                if(isMusic) audioChon.play();
            } else {
                d = 0;  
                x.style.opacity = "";  
                let linkimg1 = x.querySelector('img').currentSrc;
                let linkimg2 = value.querySelector('img').currentSrc;

                position = indexInmatrix(index, m + 2, n + 2);
                position0 = indexInmatrix(index0, m + 2, n + 2);

                const path =  dfs( position.row, position.col, position0.row, position0.col, arr2D);

                if ( linkimg1 === linkimg2 && index0 != index && path ) {

                    x.classList.add('view-off');
                    value.classList.add('view-off');

                    
                    path.forEach((value) => {
                        const index = convertToIndex(value[0], value[1], levels[option.value] + 2);
                        if (index >= 0 && index < divElementChilds.length) {
                            divElementChilds[index].classList.toggle('background-connect');
                        }
                    });
                    setTimeout( () => {
                        path.forEach((value) => {
                            const index = convertToIndex(value[0], value[1], levels[option.value] + 2);
                            if (index >= 0 && index < divElementChilds.length) {
                                divElementChilds[index].classList.toggle('background-connect');
                            }
                        })
                    },200);

                    if (isMusic) audioChonDung.play();
                    
                    arr2D[position.row][position.col] = 0;
                    arr2D[position0.row][position0.col] = 0;

                    if ( shuffleBoard(arr2D) == false ) {
                        let imgs = tableGame.querySelectorAll('div img');
                        let index = 0;

                        for( let i = 0; i <= m+1; i++ ) {
                            for( let j = 0; j <= n+1;j++ ) {
                                if (arr2D[i][j] != 0) {
                                    imgs[index].src = `assets/images/pieces${arr2D[i][j]}.png`;
                                } 
                                index++;
                            }
                        }
                    }


                    if (checkAllHidden()) {
                        setTimeout( ()=> {
                            if(isMusic) audioWin.play(); 
                            setTimeout(() => 
                              {
                                alert('Chúc mừng bạn đã chiến thắng!');
                              },1000)
                            createTable(option.value)
                            clearInterval(timerInterval); 
                            timeClock.textContent = timedefault;
                            timerInterval = null;
                            overlay.style.display = 'unset';
                        },0)
                    }
                } else {
                  if(isMusic) audioChonSai.play();
                }
            }
        });
    });
}


/* Control bar */

const time = 300;
const timeClock = document.querySelector('.mainboard__clock-time');
const startButton = document.querySelector('.mainboard__start');
const resetButton = document.querySelector('.mainboard__reset');
const overlay = document.querySelector('.mainboard__border-overlay');

var xtime = time;
function updateClock() {
    var minutes = Math.floor(xtime / 60);
    var seconds = xtime % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timeClock.textContent = `${minutes}:${seconds}`;
    
    xtime--;

    if (xtime < 0) {
        clearInterval(timerInterval); 
        setTimeout(() => {
            if(isMusic) audioBomb.play()
            setTimeout(() => 
              {
                alert('Thời gian đã hết!');
              },1000)
            xtime = time;
            timeClock.textContent = timedefault;
            createTable(option.value)
            overlay.style.display = 'unset';
            timerInterval = null; 
        }, 1000);
    }
}
// var timerInterval = setInterval(updateClock, 1000);

var timerInterval = null;
function startTimer() {
    if (!timerInterval) { 
        xtime = time
        setTimeout(() => {
          overlay.style.display = 'none'
          timerInterval = setInterval(updateClock, 1000);
          if(isMusic) audioGameStart.play();
        },1000);
    }
}

function resetClock() {
    clearInterval(timerInterval); 
    timerInterval = null; 
    xtime = time; 
    timeClock.textContent = timedefault;; 
    createTable(option.value)
    overlay.style.display = 'unset';
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetClock);

/* Run */
  
function submitForm() {
    createTable(option.value)
    clearInterval(timerInterval);
    timerInterval = null;
    timeClock.textContent = timedefault;
    overlay.style.display = 'unset';
}

createTable()

