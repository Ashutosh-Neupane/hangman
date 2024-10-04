const words = document.getElementById("words");
const hangman = document.getElementById("hangman");
const startGame = document.getElementById("restart");
const lifetag = document.getElementById("life");
const numberOfWords = 5;
const ctx = hangman.getContext("2d");

async function fetchWords() {
  try {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Array of words:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function initGame() {
  ctx.clearRect(0, 0, hangman.width, hangman.height);
  const Wordsname = await fetchWords();

  if (Wordsname.length === 0) {
    console.error("No words fetched. Exiting the game initialization.");
    return;
  }
  
  const wordname = Wordsname[Math.floor(Math.random() * Wordsname.length)];
  console.log(wordname);
  
  drawLine(10, 150, 100, 150);
  drawLine(10, 150, 10, 10);
  drawLine(10, 10, 80, 10);
  drawLine(80, 10, 80, 30);
  
  StartGame(wordname);
}

const drawCircle = (x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
};

const drawLine = (startX, startY, endX, endY) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
};

const drawHangman = (life) => {
  switch (life) {
    case 5:
      drawCircle(80, 40, 10);
      break;
    case 4:
      drawLine(80, 50, 80, 100);
      break;
    case 3:
      drawLine(80, 60, 100, 80);
      break;
    case 2:
      drawLine(80, 60, 60, 80);
      break;
    case 1:
      drawLine(80, 100, 100, 140);
      break;
    case 0:
      drawLine(80, 100, 60, 140);
      break;
    default:
      return;
  }
};

const StartGame = (wordname) => {
  let wordname1 = wordname;
  let life = 6;
  let guessedLetters = new Set();
  let gameActive = true;

  words.innerHTML = "";
  for (let i = 0; i < wordname.length; i++) {
    const word = document.createElement("div");
    word.className = "word";
    word.innerText = "_";
    words.appendChild(word);
  }

  lifetag.innerText = `Lives: ${life}`;

  document.addEventListener("keypress", (event) => {
    if (!gameActive) return;

    const keyPressed = event.key;

    if (guessedLetters.has(keyPressed)) {
      alert("You've already guessed that letter!");
      return;
    }

    guessedLetters.add(keyPressed);
    console.log(keyPressed);

    if (wordname1.includes(keyPressed)) {
      const indices = [];
      for (let i = 0; i < wordname.length; i++) {
        if (wordname[i] === keyPressed) {
          indices.push(i);
        }
      }

      indices.forEach((index) => {
        const wordDiv = words.children[index];
        if (wordDiv) {
          wordDiv.innerHTML = keyPressed;
        }
      });

      wordname1 = wordname1.replace(new RegExp(keyPressed, "g"), "");

      if (!wordname1) {
        gameActive = false;
        const winMessage = document.createElement("h1");
        winMessage.innerText = "Congratulations! You've guessed the word!";
        winMessage.style.color = "green";
        lifetag.appendChild(winMessage);
      }
    } else {
      life -= 1;
      drawHangman(life);
      lifetag.innerText = `Lives: ${life}`;

      if (life <= 0) {
        gameActive = false;
        const loseMessage = document.createElement("h1");
        loseMessage.innerText = `Game Over! The word was "${wordname}".`;
        loseMessage.style.color = "red";
        lifetag.appendChild(loseMessage);
      }
    }
  });
};

startGame.addEventListener("click", initGame);
initGame();
