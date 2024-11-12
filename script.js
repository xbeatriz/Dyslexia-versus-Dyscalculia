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

//Dyscalcluia canva

document.addEventListener("DOMContentLoaded", () => {
  const shapesCanvas = document.getElementById("shapesCanvas");
  const shapesCanvas2 = document.getElementById("shapesCanvas2");
  const ctx = shapesCanvas.getContext("2d");
  const ctx2 = shapesCanvas2.getContext("2d");

  let currentCanvas = 0;
  const canvases = [shapesCanvas, shapesCanvas2];

  //First canva
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function drawRandomShape(context) {
    const shapeType = Math.floor(Math.random() * 3);
    const x = Math.random() * shapesCanvas.width;
    const y = Math.random() * shapesCanvas.height;
    const size = Math.random() * 50 + 20;
    const color = getRandomColor();

    context.fillStyle = color;

    if (shapeType === 0) {
      context.beginPath();
      context.arc(x, y, size / 2, 0, Math.PI * 2);
      context.fill();
    } else if (shapeType === 1) {
      context.fillRect(x, y, size, size);
    } else if (shapeType === 2) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + size, y);
      context.lineTo(x + size / 2, y - size);
      context.closePath();
      context.fill();
    }
  }

  function drawRandomShapes(context, count) {
    context.clearRect(0, 0, shapesCanvas.width, shapesCanvas.height);
    for (let i = 0; i < count; i++) {
      drawRandomShape(context);
    }
  }

  // First canvas: Random shapes
  drawRandomShapes(ctx, 10);
  setInterval(() => drawRandomShapes(ctx, 10), 1000);

  // Second canvas: Confused calculations
  function drawConfusedCalculations() {
    ctx2.clearRect(0, 0, shapesCanvas2.width, shapesCanvas2.height);
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, shapesCanvas2.width, shapesCanvas2.height);

    const operations = ["+", "-", "x", "÷"];
    const fontSize = 30;
    ctx2.font = `${fontSize}px Arial`;

    for (let i = 0; i < 5; i++) {
      const x = 50 + (i % 2) * 400;
      const y = 100 + Math.floor(i / 2) * 150;

      const num1 = Math.floor(Math.random() * 100);
      const num2 = Math.floor(Math.random() * 100);
      const operation =
        operations[Math.floor(Math.random() * operations.length)];
      const result = Math.floor(Math.random() * 200) - 100; // Random result, possibly incorrect

      // Draw the calculation
      ctx2.fillStyle = "black";
      ctx2.fillText(`${num1} ${operation} ${num2} = ${result}`, x, y);

      // Add confused elements
      addConfusedElements(ctx2, x, y, fontSize);
    }
  }

  function addConfusedElements(ctx, x, y, fontSize) {
    // Add mirrored numbers
    ctx.save();
    ctx.translate(x + 250, y);
    ctx.scale(-1, 1);
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    // Add rotated numbers
    ctx.save();
    ctx.translate(x + 280, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    // Add blurred numbers
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.fillText(Math.floor(Math.random() * 10), x + 310, y);
    ctx.restore();

    // Add faded numbers
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillText(Math.floor(Math.random() * 10), x + 340, y);
  }

  // First canvas: Random shapes (keep your existing code)
  drawRandomShapes(ctx, 10);
  setInterval(() => drawRandomShapes(ctx, 10), 1000);

  // Second canvas: Confused calculations
  drawConfusedCalculations();
  setInterval(drawConfusedCalculations, 3000);

  // Carousel functionality
  window.moveCarousel = function (direction) {
    canvases[currentCanvas].style.display = "none";
    currentCanvas =
      (currentCanvas + direction + canvases.length) % canvases.length;
    canvases[currentCanvas].style.display = "block";
  };

  // Initialize carousel
  canvases[1].style.display = "none";
});

//Dyslexia

const canvas5 = document.getElementById("dyslexiaCanvas");
const ctx5 = canvas5.getContext("2d");
console.log(canvas5.parentElement.getBoundingClientRect());
canvas5.width = canvas5.parentElement.getBoundingClientRect().width;
canvas5.height = canvas5.parentElement.getBoundingClientRect().height;

//função para definir o tamanho da fonte
function getFontSize() {
  return Math.max(24, canvas5.height / 20); 
}

const intervalTime = 200;
let scrambleInterval;

const textLines = [
  "Dyslexia",
  "Friends who have dyslexia described to me how they experience reading ...",
  "I remembered reading about typoglycemia ...",
  "Dyslexia is characterized by difficulty with learning to read fluently",
  "and with accurate comprehension.",
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

function drawScrambledText() {
  const scrambledLines = scrambleTextLines();

  ctx5.fillStyle = "#ff7f50"; // Cor de fundo do canvas
  ctx5.fillRect(0, 0, canvas5.width, canvas5.height);

  const fontSize = getFontSize(); // Usa a função para definir o tamanho da fonte
  ctx5.font = `${fontSize}px Montserrat`;
  ctx5.fillStyle = "#FFFFFF"; // Cor do texto
  ctx5.textAlign = "left";
  ctx5.textBaseline = "top";

  // Calcula o espaçamento entre as linhas com base na altura do canvas
  const lineSpacing = Math.min((canvas5.height - 20) / scrambledLines.length, fontSize + 10);

  scrambledLines.forEach((line, index) => {
    ctx5.fillText(line, 10, index * lineSpacing + 10); // Ajusta o espaçamento entre linhas
  });
}

scrambleInterval = setInterval(drawScrambledText, intervalTime);

const words = [
  "education",
  "learning",
  "difficulty",
  "understand",
  "comprehension",
  "memory",
  "focus",
  "attention",
  "communication",
  "development"
];
const canvasgamex = document.getElementById("scrambleCanvas");
const ctxx = canvasgamex.getContext("2d");
const guessInput = document.getElementById("guessInput");
const feedbackMessage = document.getElementById("feedbackMessage");

let selectedWord;
let scrambledWord;
let scrambleIntervalG;

// Função para escolher uma palavra aleatória e embaralhá-la
function pickAndScrambleWord() {
  let newWord;
  do {
    newWord = words[Math.floor(Math.random() * words.length)];
  } while (newWord === selectedWord); // Garante que a nova palavra seja diferente

  selectedWord = newWord;
  scrambledWord = selectedWord;
  drawScrambledWord(scrambledWord); // Inicializar com a palavra selecionada

if (scrambleIntervalG) clearInterval(scrambleIntervalG); // Limpa qualquer intervalo anterior
  scrambleIntervalG = setInterval(() => {
    scrambledWord = scrambleWord(selectedWord); // Reembaralha continuamente
    drawScrambledWord(scrambledWord); // Atualiza o desenho com a nova palavra embaralhada
  }, 1200); // Intervalo de 100ms (pode ser ajustado)
}

// Função para embaralhar a palavra
function scrambleWord(word) {
  if (word.length < 4) return word;
  let middle = word.slice(1, -1).split("");
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]];
  }
  return word[0] + middle.join("") + word[word.length - 1];
}

// Função para desenhar a palavra embaralhada no canvas
function drawScrambledWord(word) {
  ctxx.clearRect(0, 0, canvasgamex.width, canvasgamex.height);
  ctxx.font = "30px Arial";
  ctxx.fillStyle = "#000";
  ctxx.textAlign = "center";
  ctxx.textBaseline = "middle";
  ctxx.fillText(word, canvasgamex.width / 2, canvasgamex.height / 2);
}

//canvas para guardar a resposta do jogador
function drawCorrectWordOnSecondCanvas(word) {
  ctxSecond.clearRect(0, 0, secondCanvas.width, secondCanvas.height); // Limpa o segundo canvas
  ctxSecond.font = "30px Arial";
  ctxSecond.fillStyle = "#008000"; // Cor para o texto correto
  ctxSecond.textAlign = "center";
  ctxSecond.textBaseline = "middle";
  ctxSecond.fillText(word, secondCanvas.width / 2, secondCanvas.height / 2); // Desenha no centro do canvas
  secondCanvas.style.display = "block"; // Torna o segundo canvas visível
}

// Verificar a resposta do jogador
document.getElementById("submitGuess").addEventListener("click", () => {
  const guess = guessInput.value.toLowerCase();
  if (guess === selectedWord.toLowerCase()) {
    feedbackMessage.textContent = "Correct! Well done!";
    feedbackMessage.style.color = "green";
    pickAndScrambleWord(); // Escolher uma nova palavra
  } else {
    feedbackMessage.textContent = "Try again!";
    feedbackMessage.style.color = "red";
  }
  guessInput.value = ""; // Limpar o campo de input
});

// Inicia o jogo com uma palavra aleatória
pickAndScrambleWord();



// Dyscalculia jogo

const canvas4 = document.getElementById('gameCanvas');
const ctx4 = canvas4.getContext('2d');
canvas4.width = 500;
canvas4.height = 300;

// Variáveis do jogo
let currentEquation = '';
let isCorrect = false;
let score = 0;
let questionCount = 0;
let particles = [];
let fallingNumbers = [];

// Configuração para números caindo
const fallingNumbersCount = 50;

// Operações possíveis
const operations = ['+', '-', '*', '/'];

// Gera números aleatórios para o fundo
function createFallingNumbers() {
    for (let i = 0; i < fallingNumbersCount; i++) {
        fallingNumbers.push({
            x: Math.random() * canvas4.width,
            y: Math.random() * canvas4.height,
            speedY: Math.random() * 2 + 1,
            size: Math.random() * 24 + 12,
            number: Math.floor(Math.random() * 10),
            alpha: Math.random() * 0.5 + 0.5,
        });
    }
}

// Atualiza a posição dos números caindo
function updateFallingNumbers() {
    fallingNumbers.forEach((num) => {
        num.y += num.speedY;
        if (num.y > canvas4.height) {
            num.y = -num.size;
            num.x = Math.random() * canvas4.width;
            num.number = Math.floor(Math.random() * 10);
        }
    });
}

// Desenha os números a cair no fundo
function drawFallingNumbers() {
    fallingNumbers.forEach((num) => {
        ctx4.font = `${num.size}px Arial`;
        ctx4.fillStyle = `rgba(255, 255, 255, ${num.alpha})`;
        ctx4.fillText(num.number, num.x, num.y);
    });
}

// Gera uma nova equação
function generateEquation() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let realAnswer;
    let fakeAnswer;

    switch (operation) {
        case '+':
            realAnswer = num1 + num2;
            break;
        case '-':
            realAnswer = num1 - num2;
            break;
        case '*':
            realAnswer = num1 * num2;
            break;
        case '/':
            realAnswer = parseFloat((num1 / num2).toFixed(2)); // Limita a precisão
            break;
    }

    fakeAnswer = realAnswer + (Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? 1 : -1));
    if (operation === '/') fakeAnswer = parseFloat((fakeAnswer).toFixed(2)); // Garante precisão para divisões

    currentEquation = `${num1} ${operation} ${num2} = ${fakeAnswer}`;
    isCorrect = (realAnswer === fakeAnswer);
}

// Renderiza a equação no canvas
function renderEquation() {
    ctx4.font = '36px Montserrat';
    ctx4.fillStyle = 'white';
    ctx4.textAlign = 'center';
    ctx4.fillText(currentEquation, canvas4.width / 2, canvas4.height / 2);
}

// Renderiza a pontuação
function renderScore() {
    ctx4.font = '24px Montserrat';
    ctx4.fillStyle = 'black';
    ctx4.textAlign = 'left';
    ctx4.fillText(`Pontuação: ${score}`, 10, 30);
    ctx4.fillText(`Perguntas: ${questionCount}/20`, 10, 50);
}

// Cria partículas para animação
function createParticles(color) {
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: canvas4.width / 2,
            y: canvas4.height / 2,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            color: color,
            alpha: 1
        });
    }
}

// Atualiza e desenha as partículas
function updateParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.alpha -= 0.02;
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    particles.forEach((particle) => {
        ctx4.beginPath();
        ctx4.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx4.fillStyle = `rgba(${particle.color},${particle.alpha})`;
        ctx4.fill();
    });
}

// Avalia a resposta do jogador
function evaluateAnswer(playerChoice) {
    if (playerChoice === isCorrect) {
        score++;
        createParticles('0, 255, 0'); // Verde
    } else {
        createParticles('255, 0, 0'); // Vermelho
    }

    questionCount++;
    if (questionCount < 20) {
        generateEquation();
    } else {
        endGame();
    }
}

// Finaliza o jogo
function endGame() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
    ctx4.font = '24px';
    ctx4.fillStyle = 'white';
    ctx4.textAlign = 'center';
    ctx4.fillText(`Fim do jogo! Sua pontuação: ${score}/20`, canvas4.width / 2, canvas4.height / 2);
}

// Animação do jogo
function animate() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

    // Fundo com números caindo
    drawFallingNumbers();
    updateFallingNumbers();

    // Renderiza a equação, partículas e pontuação
    renderEquation();
    renderScore();
    updateParticles();

    requestAnimationFrame(animate);
}

// Configura os botões
document.getElementById('correct').addEventListener('click', () => evaluateAnswer(true));
document.getElementById('incorrect').addEventListener('click', () => evaluateAnswer(false));

// Inicializa o jogo
generateEquation();
createFallingNumbers();
animate();
