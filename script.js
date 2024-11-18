document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const arrows = document.querySelectorAll(".scroll-arrow");
  const sectionOrder = [
    "title",
    "dislexia",
    "dyslexia-game",
    "dyscalculia",
    "dyscalculia-game",
  ];
  let previousSectionId = "title";

  function hideAllSections() {
    sections.forEach((section) => {
      section.style.display = "none";
    });
  }

  function showSection(section, direction) {
    section.style.display = "flex";
    section.classList.add("active");

    if (direction === "next") {
      section.classList.add("slide-in-bottom");
    } else if (direction === "previous") {
      section.classList.add("slide-in-top");
    }

    section.addEventListener(
      "animationend",
      () => {
        section.classList.remove("slide-in-bottom", "slide-in-top");
      },
      { once: true }
    );
  }

  hideAllSections();
  showSection(document.getElementById("title"), "next");

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = arrow.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      const currentIdx = sectionOrder.indexOf(previousSectionId);
      const targetIdx = sectionOrder.indexOf(targetId);
      const direction = targetIdx > currentIdx ? "next" : "previous";

      previousSectionId = targetId;

      hideAllSections();
      showSection(targetSection, direction);
      updateArrowVisibility(targetId);
    });
  });

  function updateArrowVisibility(activeSectionId) {
    arrows.forEach((arrow) => {
      const targetId = arrow.getAttribute("href").substring(1);
      if (activeSectionId === "title" && arrow.classList.contains("previous")) {
        arrow.style.display = "none";
      } else if (
        activeSectionId === "dyscalculia-game" &&
        arrow.classList.contains("next")
      ) {
        arrow.style.display = "none";
      } else {
        arrow.style.display = "";
      }
    });
  }

  updateArrowVisibility("title");
});

//
//
//
//Dyslexia canvas
//cor comum para todos os canvas
const commonFillColor = "#A6A09DFF"; // Exemplo de cor

// Seleciona todos os canvas do painel direito
const canvasIds1 = ["dyslexiaCanvas", "focusCanvas", "tasksCanvas"];
const canvases1 = canvasIds1.map((id) => document.getElementById(id));

// Ajusta as dimensões de cada canvas com base no container pai
function resizeCanvases() {
  const parent1 = canvases1[0].parentElement.getBoundingClientRect();

  canvases1.forEach((canvas) => {
    canvas.width = parent1.width; // Largura igual à do pai
    canvas.height =
      (parent1.height - (canvases1.length - 1) * 24) / canvases1.length; // Divide a altura igualmente
  });
}

// Inicializa as dimensões e vincula ao redimensionamento da janela
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

//
// 1º CANVAS: TEXTO EMBARALHADO
//
function drawScrambledTextCanvas(canvas1) {
  const ctx1 = canvas1.getContext("2d");

  const textLines = [
    "Dyslexia",
    "Friends who have dyslexia described to me how they experience reading...",
    "I remembered reading about typoglycemia...",
  ];

  function scrambleWord(word) {
    if (word.length < 4) return word;
    let middle = word.slice(1, -1).split("");
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    return word[0] + middle.join("") + word[word.length - 1];
  }

  function scrambleTextLines() {
    return textLines.map((line) =>
      line
        .split(" ")
        .map((word) => (Math.random() < 0.3 ? scrambleWord(word) : word))
        .join(" ")
    );
  }

  function draw() {
    const scrambledLines = scrambleTextLines();
    ctx1.fillStyle = commonFillColor;
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height); // Preenche o fundo com a cor

    const fontSize = Math.max(20, canvas1.height / 10);
    ctx1.font = `${fontSize}px Montserrat`;
    ctx1.fillStyle = "#FFFFFF";
    ctx1.textAlign = "left";
    ctx1.textBaseline = "top";

    const lineSpacing = Math.min(
      (canvas1.height - 20) / scrambledLines.length,
      fontSize + 10
    );

    scrambledLines.forEach((line, index) => {
      ctx1.fillText(line, 10, index * lineSpacing + 10);
    });
  }

  setInterval(draw, 200);
}

//
// 2º CANVAS: TEXTO COM DESFOQUE
//
function drawFocusTextCanvas(canvas2) {
  const ctx2 = canvas2.getContext("2d");
  const text1 =
    "Sometimes people with dyslexia are not capable of reading things";
  const text2 = "because dyslexia it's not just about writing,";
  const text3 = "that also modifies your physical.";

  let blurRadius = 20;
  let increasing = false; // Controla o estado do loop

  function draw() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); // Limpa o canvas a cada iteração

    ctx2.fillStyle = commonFillColor;
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

    const fontSize = Math.max(20, canvas2.height / 5);
    ctx2.font = `${fontSize}px Montserrat`;
    ctx2.fillStyle = "#FFFFFF";
    ctx2.textAlign = "left";
    ctx2.textBaseline = "middle";

    ctx2.filter = `blur(${blurRadius}px)`;

    const lineHeight = fontSize * 1.2;
    const leftMargin = 20;
    ctx2.fillText(text1, leftMargin, canvas2.height / 2 - lineHeight); // Primeira linha
    ctx2.fillText(text2, leftMargin, canvas2.height / 2); // Segunda linha
    ctx2.fillText(text3, leftMargin, canvas2.height / 2 + lineHeight); // Terceira linha
    ctx2.filter = "none";

    if (increasing) {
      blurRadius += 0.5;
      if (blurRadius >= 20) increasing = false;
    } else {
      blurRadius -= 0.5;
      if (blurRadius <= 0) increasing = true;
    }
  }

  setInterval(draw, 100);
}

//
// 3º CANVAS: LISTA DE TAREFAS DESORDENANDO
//
function drawTasksCanvas(canvas3) {
  const ctx3 = canvas3.getContext("2d");
  const tasks = [
    "Task 1: Read book",
    "Task 2: Practice coding",
    "Task 3: Take a walk",
  ];
  const positions = tasks.map((_, i) => i * 50 + 50); // Posições iniciais para cada linha

  function shufflePositions() {
    positions.forEach((_, i) => {
      positions[i] += Math.random() < 0.5 ? -5 : 5;
      if (positions[i] < 30) positions[i] = 30;
      if (positions[i] > canvas3.height - 30)
        positions[i] = canvas3.height - 30;
    });
  }

  function draw() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height); // Limpa o canvas a cada iteração

    ctx3.fillStyle = commonFillColor;
    ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

    const fontSize = Math.max(20, canvas3.height / 15);
    ctx3.font = `${fontSize}px Montserrat`;
    ctx3.fillStyle = "#FFFFFF";
    ctx3.textAlign = "left";
    ctx3.textBaseline = "middle";

    tasks.forEach((task, i) => {
      ctx3.fillText(task, 10, positions[i]);
    });

    shufflePositions();
  }

  setInterval(draw, 200);
}

// Inicializa cada canvas
drawScrambledTextCanvas(canvases1[0]); // Primeiro canvas
drawFocusTextCanvas(canvases1[1]); // Segundo canvas
drawTasksCanvas(canvases1[2]); // Terceiro canvas

//
//
// DYSLEXIA GAME
//

const canvas8 = document.getElementById("dyslexiaGameCanvas");
const ctx8 = canvas8.getContext("2d");
const resetButton8 = document.getElementById("resetButton");

// Game Settings
const tileSize8 = 20; // Size of each grid tile
const rows8 = canvas8.height / tileSize8;
const cols8 = canvas8.width / tileSize8;
let predefinedWords8 = [
  "PICTURE",
  "HOUSE",
  "THUNDER",
  "DIAMOND",
  "CUPCAKE",
  "GAME",
  "DYSLEXIA",
  "LIGHT",
  "DYSCALCULIA",
  "ADVENTURE",
]; // Expanded word list
let discoveredWords8 = []; // Discovered words by the player
let snake8 = [{ x: 0, y: 0 }]; // Snake starting position
let direction8 = { x: 0, y: 0 }; // Initial direction (stationary)
let currentLetters8 = []; // Letters collected by the snake
let lettersGrid8 = []; // Grid of letters
let discoveredTiles8 = []; // Tracks tiles that belong to discovered words
let gameRunning8 = false; // Track if the game is running

// Generate Letter Grid with Predefined Words
function generateGrid8() {
  const alphabet8 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  lettersGrid8 = Array.from({ length: rows8 }, () =>
    Array.from(
      { length: cols8 },
      () => alphabet8[Math.floor(Math.random() * alphabet8.length)]
    )
  );

  predefinedWords8.forEach((word) => {
    const startRow8 = Math.floor(Math.random() * rows8);
    const startCol8 = Math.floor(Math.random() * (cols8 - word.length));

    for (let i8 = 0; i8 < word.length; i8++) {
      lettersGrid8[startRow8][startCol8 + i8] = word[i8];
    }
  });

  console.log("Generated Grid:", lettersGrid8);
}

function drawGrid8() {
  for (let row8 = 0; row8 < rows8; row8++) {
    for (let col8 = 0; col8 < cols8; col8++) {
      const tileDiscovered8 = discoveredTiles8.some(
        (tile) => tile.row === row8 && tile.col === col8
      );

      // Apply a gradient effect for the background
      const tileX = col8 * tileSize8;
      const tileY = row8 * tileSize8;
      const tileGradient = ctx8.createLinearGradient(
        tileX,
        tileY,
        tileX + tileSize8,
        tileY + tileSize8
      );
      tileGradient.addColorStop(0, tileDiscovered8 ? "#6c3" : "#f2f2f2");
      tileGradient.addColorStop(1, tileDiscovered8 ? "#7c4" : "#e6e6e6");

      ctx8.fillStyle = tileGradient;
      ctx8.fillRect(tileX, tileY, tileSize8, tileSize8);

      // Stylish border with rounded corners
      ctx8.strokeStyle = "#ccc";
      ctx8.lineWidth = 1;
      ctx8.lineJoin = "round"; // Rounded corners for strokes
      ctx8.strokeRect(tileX, tileY, tileSize8, tileSize8);

      // Improved font and text styling
      ctx8.fillStyle = tileDiscovered8 ? "#fff" : "#333"; // White text for discovered tiles
      ctx8.font = "bold 18px 'Montserrat', sans-serif"; // Increased font size for readability
      ctx8.textAlign = "center";
      ctx8.textBaseline = "middle";

      // Render the letter centered in the tile
      ctx8.fillText(
        lettersGrid8[row8][col8],
        tileX + tileSize8 / 2,
        tileY + tileSize8 / 2
      );
    }
  }
}

// Draw the snake
function drawSnake8() {
  snake8.forEach((segment8, index8) => {
    ctx8.fillStyle = index8 === 0 ? "#0c3" : "#3c3"; // Head and body colors
    ctx8.fillRect(
      segment8.x * tileSize8,
      segment8.y * tileSize8,
      tileSize8,
      tileSize8
    );
  });
}

// Move the snake
function moveSnake8() {
  const head8 = {
    x: snake8[0].x + direction8.x,
    y: snake8[0].y + direction8.y,
  };

  head8.x = (head8.x + cols8) % cols8;
  head8.y = (head8.y + rows8) % rows8;

  snake8.unshift(head8);

  const letter8 = lettersGrid8[head8.y][head8.x];
  currentLetters8.push({ letter: letter8, row: head8.y, col: head8.x });

  console.log("Snake Position:", snake8);
  console.log(
    "Collected Letters:",
    currentLetters8.map((item) => item.letter).join("")
  );

  checkForWords8();

  if (currentLetters8.length > rows8 * cols8) {
    currentLetters8.shift(); // Prevent unbounded growth if necessary
  }

  snake8.pop();
}

// Check for words in the collected letters
function checkForWords8() {
  const lettersString8 = currentLetters8.map((item) => item.letter).join("");
  predefinedWords8.forEach((word8) => {
    if (!discoveredWords8.includes(word8)) {
      const wordLength8 = word8.length;
      // Check for the word in `lettersString8`
      const forwardIndex8 = lettersString8.indexOf(word8);
      if (forwardIndex8 !== -1) {
        console.log(`Discovered Word: "${word8}"`);
        markWordAsDiscovered8(forwardIndex8, wordLength8, word8, false);
      }
      // Check for reversed word
      const reversedWord8 = word8.split("").reverse().join("");
      const reversedIndex8 = lettersString8.indexOf(reversedWord8);
      if (reversedIndex8 !== -1) {
        console.log(`Discovered Word: "${word8}" in Reverse`);
        markWordAsDiscovered8(reversedIndex8, wordLength8, word8, true);
      }
    }
  });
}

// Helper function to mark a word as discovered
function markWordAsDiscovered8(startIndex8, wordLength8, word8, isReversed8) {
  console.log(
    `Marking Word "${word8}" as Discovered. Start Index: ${startIndex8}, Reversed: ${isReversed8}`
  );
  discoveredWords8.push(word8);
  updateWordList8();

  for (let i8 = 0; i8 < wordLength8; i8++) {
    const index8 = isReversed8
      ? startIndex8 + (wordLength8 - 1 - i8)
      : startIndex8 + i8;
    const { row: row8, col: col8 } = currentLetters8[index8];
    discoveredTiles8.push({ row: row8, col: col8 });
  }

  // Remove only the discovered word's letters from `currentLetters8`
  currentLetters8 = currentLetters8.filter(
    (_, i8) => i8 < startIndex8 || i8 >= startIndex8 + wordLength8
  );
}

// Update the list of discovered words
function updateWordList8() {
  const wordList8 = document.getElementById("wordList");
  wordList8.innerHTML = ""; // Clear existing list
  predefinedWords8.forEach((word8) => {
    const li8 = document.createElement("li");
    li8.textContent = word8;
    li8.className = discoveredWords8.includes(word8) ? "discovered" : "";
    wordList8.appendChild(li8);
  });
}

// Reset the game
function resetGame8() {
  snake8 = [{ x: 0, y: 0 }];
  direction8 = { x: 0, y: 0 };
  discoveredWords8 = [];
  discoveredTiles8 = [];
  currentLetters8 = [];
  generateGrid8();
  updateWordList8();
  gameRunning8 = true;
}

// Handle keyboard input for controlling the snake
document.addEventListener("keydown", (event8) => {
  if (!gameRunning8) return;
  switch (event8.key) {
    case "ArrowUp":
      direction8 = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      direction8 = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      direction8 = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      direction8 = { x: 1, y: 0 };
      break;
  }
});

// Game loop
function gameLoop8() {
  if (gameRunning8) {
    ctx8.clearRect(0, 0, canvas8.width, canvas8.height); // Clear canvas
    drawGrid8();
    drawSnake8();
    moveSnake8();
  }
  setTimeout(gameLoop8, 200); // Run the loop every 200ms
}

// Add event listener for reset button
resetButton8.addEventListener("click", resetGame8);

// Initialize the game
generateGrid8();
updateWordList8();
gameLoop8();

//
//
//DYSCALCULIA CANVAS

// Seleciona todos os canvas do painel direito
const canvasIds2 = ["confusedForms", "numbersAndChange", "numbersAndForms"];
const canvases2 = canvasIds2.map((id) => document.getElementById(id));

// Ajusta as dimensões de cada canvas com base no container pai
function resizeCanvases2() {
  const parent2 = canvases2[0].parentElement.getBoundingClientRect();

  canvases2.forEach((canvas) => {
    canvas.width = parent2.width; // Largura igual à do pai
    canvas.height =
      (parent2.height - (canvases2.length - 1) * 24) / canvases2.length; // Divide a altura igualmente

    // Define a cor de fundo de cada canvas
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
}

// Inicializa as dimensões e vincula ao redimensionamento da janela
resizeCanvases2();
window.addEventListener("resize", resizeCanvases2);

//
// 1º CANVAS: CONFUSED FORMS
//

function drawConfusedForms(canvas) {
  const ctx = canvas.getContext("2d");
  const shapes = [];

  // Gerar uma cor aleatória em formato hexadecimal
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Função para criar uma nova forma com propriedades aleatórias
  function createShape() {
    const shapeTypes = ["circle", "square", "triangle"];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 40 + 40, // Tamanhos variando entre 40 e 80
      dx: (Math.random() - 0.5) * 12,
      dy: (Math.random() - 0.5) * 12,
      type: type,
      color: getRandomColor(), // Cor aleatória para cada forma
    };
  }

  // Criar várias formas iniciais
  for (let i = 0; i < 10; i++) {
    shapes.push(createShape());
  }

  // Função para desenhar uma forma no contexto
  function drawShape(shape) {
    ctx.beginPath();
    if (shape.type === "circle") {
      ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
    } else if (shape.type === "square") {
      ctx.rect(
        shape.x - shape.size / 2,
        shape.y - shape.size / 2,
        shape.size,
        shape.size
      );
    } else if (shape.type === "triangle") {
      ctx.moveTo(shape.x, shape.y - shape.size / 2);
      ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
      ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
      ctx.closePath();
    }
    ctx.fillStyle = shape.color; // Cor única para cada forma
    ctx.fill();
  }

  // Função de animação para mover as formas
  function animate() {
    // Limpa o canvas e redefine o fundo
    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualiza e desenha cada forma
    shapes.forEach((shape) => {
      shape.x += shape.dx;
      shape.y += shape.dy;

      // Inverte a direção se a forma atingir as bordas do canvas
      if (shape.x < 0 || shape.x > canvas.width) shape.dx *= -1;
      if (shape.y < 0 || shape.y > canvas.height) shape.dy *= -1;

      drawShape(shape);
    });

    // Requisita o próximo quadro de animação
    requestAnimationFrame(animate);
  }

  animate(); // Inicia a animação
}

//
// 2º CANVAS: NUMBERS AND BILLS
//

function drawNumbersAndChange(canvas) {
  const ctx = canvas.getContext("2d");

  function addConfusedElements(ctx, x, y, fontSize) {
    ctx.save();
    ctx.translate(x + 250, y);
    ctx.scale(-1, 1);
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(x + 280, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.fillText(Math.floor(Math.random() * 10), x + 310, y);
    ctx.restore();

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText(Math.floor(Math.random() * 10), x + 340, y);
  }

  function drawCalculations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const operations = ["+", "-", "x", "÷"];
    const fontSize = 30;
    ctx.font = `${fontSize}px Arial`;

    for (let i = 0; i < 5; i++) {
      const x1 = 50;
      const x2 = 550; // Aumenta o espaçamento entre os dois cálculos na linha
      const y = 80 + i * 100; // Espaçamento vertical entre as linhas

      // Cálculo 1
      const num1a = Math.floor(Math.random() * 100);
      const num2a = Math.floor(Math.random() * 100);
      const operation1 =
        operations[Math.floor(Math.random() * operations.length)];
      const result1 = Math.floor(Math.random() * 200) - 100;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${num1a} ${operation1} ${num2a} = ${result1}`, x1, y);

      // Cálculo 2
      const num1b = Math.floor(Math.random() * 100);
      const num2b = Math.floor(Math.random() * 100);
      const operation2 =
        operations[Math.floor(Math.random() * operations.length)];
      const result2 = Math.floor(Math.random() * 200) - 100;
      ctx.fillText(`${num1b} ${operation2} ${num2b} = ${result2}`, x2, y);

      // Adiciona elementos confusos para ambos os cálculos
      addConfusedElements(ctx, x1, y, fontSize);
      addConfusedElements(ctx, x2, y, fontSize);
    }
  }

  drawCalculations();
  setInterval(drawCalculations, 3000);
}

//
// 3º CANVAS: NUMBERS AND FORMS
//

function drawNumbersAndForms(canvas6) {
  const ctx6 = canvas6.getContext("2d");

  const clockRadius = 50; // Raio dos relógios grandes
  const smallClockRadius = 30; // Raio dos relógios pequenos

  const clocks = [
    {
      x: 100,
      y: 100,
      dx: 2,
      dy: 1,
      radius: clockRadius,
      time: new Date(2024, 0, 1, 2, 0, 0),
    },
    {
      x: 300,
      y: 150,
      dx: -1.5,
      dy: 2,
      radius: clockRadius,
      time: new Date(2024, 0, 1, 4, 15, 0),
    },
    {
      x: 500,
      y: 200,
      dx: 1,
      dy: -1.5,
      radius: clockRadius,
      time: new Date(2024, 0, 1, 8, 30, 0),
    },
    {
      x: 700,
      y: 250,
      dx: -2,
      dy: 1,
      radius: clockRadius,
      time: new Date(2024, 0, 1, 11, 45, 0),
    },
  ];

  // Adiciona relógios pequenos
  for (let i = 0; i < 3; i++) {
    const smallClock = {
      x:
        Math.random() * (canvas6.width - smallClockRadius * 2) +
        smallClockRadius,
      y:
        Math.random() * (canvas6.height - smallClockRadius * 2) +
        smallClockRadius,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      radius: smallClockRadius,
      time: new Date(
        2024,
        0,
        1,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 60),
        0
      ),
    };
    clocks.push(smallClock);
  }

  function drawClock(ctx6, x, y, radius, time) {
    ctx6.beginPath();
    ctx6.arc(x, y, radius, 0, Math.PI * 2);
    ctx6.fillStyle = "#fff";
    ctx6.fill();
    ctx6.lineWidth = 2;
    ctx6.strokeStyle = "#000";
    ctx6.stroke();
    ctx6.closePath();

    for (let i = 1; i <= 12; i++) {
      const angle = (Math.PI / 6) * i - Math.PI / 2;
      const numX = x + Math.cos(angle) * (radius - 15);
      const numY = y + Math.sin(angle) * (radius - 15);
      ctx6.font = `${radius * 0.2}px Montserrat`;
      ctx6.fillStyle = "#000";
      ctx6.textAlign = "center";
      ctx6.textBaseline = "middle";
      ctx6.fillText(i, numX, numY);
    }

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (Math.PI / 6) * hours + (Math.PI / 360) * minutes;
    drawHand(ctx6, x, y, hourAngle, radius * 0.5, 6);

    const minuteAngle = (Math.PI / 30) * minutes + (Math.PI / 1800) * seconds;
    drawHand(ctx6, x, y, minuteAngle, radius * 0.7, 4);

    const secondAngle = (Math.PI / 30) * seconds;
    drawHand(ctx6, x, y, secondAngle, radius * 0.9, 2, "red");
  }

  function drawHand(ctx6, x, y, angle, length, width, color = "#000") {
    ctx6.beginPath();
    ctx6.moveTo(x, y);
    ctx6.lineTo(
      x + Math.cos(angle - Math.PI / 2) * length,
      y + Math.sin(angle - Math.PI / 2) * length
    );
    ctx6.lineWidth = width;
    ctx6.strokeStyle = color;
    ctx6.stroke();
    ctx6.closePath();
  }

  function isColliding(clock1, clock2) {
    const dx = clock1.x - clock2.x;
    const dy = clock1.y - clock2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < clock1.radius + clock2.radius;
  }

  function resolveCollision(clock1, clock2) {
    const dx = clock1.x - clock2.x;
    const dy = clock1.y - clock2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return; // Evitar divisão por zero

    // Reposicionar os relógios para evitar sobreposição
    const overlap = (clock1.radius + clock2.radius - distance) / 2;
    const correctionX = (dx / distance) * overlap;
    const correctionY = (dy / distance) * overlap;

    clock1.x += correctionX;
    clock1.y += correctionY;
    clock2.x -= correctionX;
    clock2.y -= correctionY;

    // Inverter as velocidades
    [clock1.dx, clock2.dx] = [clock2.dx, clock1.dx];
    [clock1.dy, clock2.dy] = [clock2.dy, clock1.dy];
  }

  function updateClocks() {
    ctx6.fillStyle = commonFillColor;
    ctx6.fillRect(0, 0, canvas6.width, canvas6.height);

    clocks.forEach((clock, index) => {
      clock.x += clock.dx;
      clock.y += clock.dy;

      if (
        clock.x + clock.radius > canvas6.width ||
        clock.x - clock.radius < 0
      ) {
        clock.dx *= -1;
      }
      if (
        clock.y + clock.radius > canvas6.height ||
        clock.y - clock.radius < 0
      ) {
        clock.dy *= -1;
      }

      clocks.forEach((otherClock, otherIndex) => {
        if (index !== otherIndex && isColliding(clock, otherClock)) {
          resolveCollision(clock, otherClock);
        }
      });

      clock.time.setSeconds(clock.time.getSeconds() + 1);
      drawClock(ctx6, clock.x, clock.y, clock.radius, clock.time);
    });

    requestAnimationFrame(updateClocks);
  }

  updateClocks();
}

// Inicializa cada canvas
drawConfusedForms(canvases2[0]); // Primeiro canvas
drawNumbersAndChange(canvases2[1]); // Segundo canvas
drawNumbersAndForms(canvases2[2]); // Terceiro canvas

//
//
//
// DYSCALCULIA GAME
const canvas7 = document.getElementById("gameCanvas");
const ctx7 = canvas7.getContext("2d");
canvas7.width = 500;
canvas7.height = 300;

// Variáveis do jogo
let currentEquation7 = "";
let isCorrect7 = false;
let score7 = 0;
let questionCount7 = 0;
let particles7 = [];
let fallingNumbers7 = [];

// Configuração para números a chover
const fallingNumbersCount7 = 50;

// Operações possíveis
const operations7 = ["+", "-", "*", "/"];

// Gerar números aleatórios para o fundo
function createFallingNumbers7() {
  for (let i = 0; i < fallingNumbersCount7; i++) {
    fallingNumbers7.push({
      x: Math.random() * canvas7.width,
      y: Math.random() * canvas7.height,
      speedY: Math.random() * 2 + 1,
      size: Math.random() * 24 + 12,
      number: Math.floor(Math.random() * 10),
      alpha: Math.random() * 0.5 + 0.5,
    });
  }
}

// Atualizar a posição dos números
function updateFallingNumbers7() {
  fallingNumbers7.forEach((num) => {
    num.y += num.speedY;
    if (num.y > canvas7.height) {
      num.y = -num.size;
      num.x = Math.random() * canvas7.width;
      num.number = Math.floor(Math.random() * 10);
    }
  });
}

// Desenhar os números a cair no fundo
function drawFallingNumbers7() {
  fallingNumbers7.forEach((num) => {
    ctx7.font = `${num.size}px Montserrat`;
    ctx7.fillStyle = `rgba(255, 255, 255, ${num.alpha})`;
    ctx7.fillText(num.number, num.x, num.y);
  });
}

// Gerar uma nova equação
function generateEquation7() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = operations7[Math.floor(Math.random() * operations7.length)];

  let realAnswer7;
  let fakeAnswer7;

  switch (operation) {
    case "+":
      realAnswer7 = num1 + num2;
      break;
    case "-":
      realAnswer7 = num1 - num2;
      break;
    case "*":
      realAnswer7 = num1 * num2;
      break;
    case "/":
      realAnswer7 = parseFloat((num1 / num2).toFixed(2)); // Limita a precisão
      break;
  }

  fakeAnswer7 =
    realAnswer7 + (Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : -1);
  if (operation === "/") fakeAnswer7 = parseFloat(fakeAnswer7.toFixed(2)); // Garante precisão para divisões

  currentEquation7 = `${num1} ${operation} ${num2} = ${fakeAnswer7}`;
  isCorrect7 = realAnswer7 === fakeAnswer7;
}

// Renderizar a equação no canvas
function renderEquation7() {
  ctx7.font = "20px Montserrat";
  ctx7.fillStyle = "white";
  ctx7.textAlign = "center";
  ctx7.fillText(currentEquation7, canvas7.width / 2, canvas7.height / 2);
}

// Renderizar a pontuação
function renderScore7() {
  ctx7.font = "16px Montserrat";
  ctx7.fillStyle = "black";
  ctx7.textAlign = "left";
  ctx7.fillText(`Pontuação: ${score7}`, 10, 30);
  ctx7.fillText(`Perguntas: ${questionCount7}/20`, 10, 50);
}

// Criar partículas para animação
function createParticles7(color) {
  for (let i = 0; i < 50; i++) {
    particles7.push({
      x: canvas7.width / 2,
      y: canvas7.height / 2,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
      color: color,
      alpha: 1,
    });
  }
}

// Atualizar e desenhar as partículas
function updateParticles7() {
  particles7.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.alpha -= 0.02;
    if (particle.alpha <= 0) {
      particles7.splice(index, 1);
    }
  });

  particles7.forEach((particle) => {
    ctx7.beginPath();
    ctx7.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx7.fillStyle = `rgba(${particle.color},${particle.alpha})`;
    ctx7.fill();
  });
}

// Avaliar a resposta do jogador
function evaluateAnswer7(playerChoice) {
  if (playerChoice === isCorrect7) {
    score7++;
    createParticles7("0, 255, 0"); // Verde
  } else {
    createParticles7("255, 0, 0"); // Vermelho
  }

  questionCount7++;
  if (questionCount7 < 20) {
    generateEquation7();
  } else {
    endGame7();
  }
}

// Finalizar o jogo
function endGame7() {
  ctx7.clearRect(0, 0, canvas7.width, canvas7.height);
  ctx7.font = "20px Montserrat";
  ctx7.fillStyle = "white";
  ctx7.textAlign = "center";
  ctx7.fillText(
    `Fim do jogo! Sua pontuação: ${score7}/20`,
    canvas7.width / 2,
    canvas7.height / 2
  );

  // Desativar os botões
  document.getElementById("correct").disabled = true;
  document.getElementById("incorrect").disabled = true;
}

// Animação do jogo
function animate7() {
  ctx7.clearRect(0, 0, canvas7.width, canvas7.height);

  // Fundo com números
  drawFallingNumbers7();
  updateFallingNumbers7();

  // Renderizar a equação, partículas e pontuação
  renderEquation7();
  renderScore7();
  updateParticles7();

  requestAnimationFrame(animate7);
}

// Configura os botões
document
  .getElementById("correct")
  .addEventListener("click", () => evaluateAnswer7(true));
document
  .getElementById("incorrect")
  .addEventListener("click", () => evaluateAnswer7(false));

// Inicializa o jogo
document.addEventListener("DOMContentLoaded", () => {
  generateEquation7();
  createFallingNumbers7();
  animate7();
});
