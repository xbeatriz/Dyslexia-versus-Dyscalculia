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
// Defina a cor comum para todos os canvas
const commonFillColor = "#FF5733"; // Exemplo de cor

// Seleciona todos os canvas do painel direito
const canvasIds1 = ["dyslexiaCanvas", "focusCanvas", "tasksCanvas"];
const canvases1 = canvasIds1.map((id) => document.getElementById(id));

// Ajusta as dimensões de cada canvas com base no container pai
function resizeCanvases() {
  const parent1 = canvases1[0].parentElement.getBoundingClientRect();

  canvases1.forEach((canvas) => {
    canvas.width = parent1.width; // Largura igual à do pai
    canvas.height = (parent1.height - (canvases1.length - 1) * 24) / canvases1.length; // Divide a altura igualmente, considerando o espaçamento
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
    ctx1.fillStyle = commonFillColor; // Usando a cor definida para o fundo
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height); // Preenche o fundo com a cor

    const fontSize = Math.max(24, canvas1.height / 10);
    ctx1.font = `${fontSize}px Montserrat`;
    ctx1.fillStyle = "#FFFFFF"; // Cor do texto
    ctx1.textAlign = "left";
    ctx1.textBaseline = "top";

    const lineSpacing = Math.min((canvas1.height - 20) / scrambledLines.length, fontSize + 10);

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
  const text1 = "Sometimes people with dyslexia are not capable of reading things";
  const text2 = "because dyslexia it's not just about writing,";
  const text3 = "that also modifies your physical.";
  
  let blurRadius = 20;
  let increasing = false; // Controla o estado do loop

  function draw() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); // Limpa o canvas a cada iteração

    ctx2.fillStyle = commonFillColor; // Usando a cor definida para o fundo
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height); // Preenche o fundo com a cor

    const fontSize = Math.max(24, canvas2.height / 5);
    ctx2.font = `${fontSize}px Montserrat`;
    ctx2.fillStyle = "#FFFFFF"; // Cor do texto
    ctx2.textAlign = "left"; // Alinha o texto à esquerda
    ctx2.textBaseline = "middle";

    ctx2.filter = `blur(${blurRadius}px)`;
    // Desenha o texto em três linhas, com alinhamento à esquerda
    const lineHeight = fontSize * 1.2; // Espaçamento entre as linhas
    const leftMargin = 20; // Margem esquerda para o texto não ficar colado na borda
    ctx2.fillText(text1, leftMargin, canvas2.height / 2 - lineHeight); // Primeira linha
    ctx2.fillText(text2, leftMargin, canvas2.height / 2); // Segunda linha
    ctx2.fillText(text3, leftMargin, canvas2.height / 2 + lineHeight); // Terceira linha
    ctx2.filter = "none";

    if (increasing) {
      blurRadius += 0.5;
      if (blurRadius >= 20) increasing = false; // Inverta para diminuir
    } else {
      blurRadius -= 0.5;
      if (blurRadius <= 0) increasing = true; // Inverta para aumentar
    }
  }

  setInterval(draw, 100);
}



//
// 3º CANVAS: LISTA DE TAREFAS DESORDENANDO
//
function drawTasksCanvas(canvas3) {
  const ctx3 = canvas3.getContext("2d");
  const tasks = ["Task 1: Read book", "Task 2: Practice coding", "Task 3: Take a walk"];
  const positions = tasks.map((_, i) => i * 50 + 50); // Posições iniciais para cada linha

  function shufflePositions() {
    positions.forEach((_, i) => {
      positions[i] += Math.random() < 0.5 ? -5 : 5; // Move para cima ou para baixo
      if (positions[i] < 30) positions[i] = 30; // Limita a posição mínima
      if (positions[i] > canvas3.height - 30) positions[i] = canvas3.height - 30; // Limita a posição máxima
    });
  }

  function draw() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height); // Limpa o canvas a cada iteração

    ctx3.fillStyle = commonFillColor; // Usando a cor definida para o fundo
    ctx3.fillRect(0, 0, canvas3.width, canvas3.height); // Preenche o fundo com a cor

    const fontSize = Math.max(24, canvas3.height / 15);
    ctx3.font = `${fontSize}px Montserrat`;
    ctx3.fillStyle = "#FFFFFF"; // Cor do texto
    ctx3.textAlign = "left";
    ctx3.textBaseline = "middle";

    tasks.forEach((task, i) => {
      ctx3.fillText(task, 10, positions[i]);
    });

    shufflePositions();
  }

  setInterval(draw, 200);
}

// Inicializa cada canvas com suas respectivas funções
drawScrambledTextCanvas(canvases1[0]); // Primeiro canvas
drawFocusTextCanvas(canvases1[1]); // Segundo canvas
drawTasksCanvas(canvases1[2]); // Terceiro canvas



//
//
// DYSLEXIA GAME
//
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
    canvas.height = (parent2.height - (canvases2.length - 1) * 24) / canvases2.length; // Divide a altura igualmente, considerando o espaçamento
  
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
  const shapes = []; // Array para armazenar as formas

  // Gera uma cor aleatória em formato hexadecimal
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
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
      dx: (Math.random() - 0.5) * 12, // Aumentando a velocidade para variar entre -6 e 6
      dy: (Math.random() - 0.5) * 12, // Aumentando a velocidade para variar entre -6 e 6
      type: type,
      color: getRandomColor() // Cor aleatória para cada forma
    };
  }

  // Cria várias formas iniciais
  for (let i = 0; i < 10; i++) {
    shapes.push(createShape());
  }

  // Função para desenhar uma forma no contexto
  function drawShape(shape) {
    ctx.beginPath();
    if (shape.type === "circle") {
      ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
    } else if (shape.type === "square") {
      ctx.rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
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

  // Define a fonte Montserrat para os cálculos
  ctx.font = "20px 'Montserrat', sans-serif";
  ctx.fillStyle = "#ffffff"; // Cor branca para os textos

  // Lista de cálculos incorretos
  const calculosErrados = [
    { num1: 5, operator: "+", num2: 3, result: 11 },
    { num1: 12, operator: "-", num2: 4, result: 5 },
    { num1: 7, operator: "x", num2: 3, result: 25 },
    { num1: 9, operator: "÷", num2: 3, result: 4 },
    { num1: 6, operator: "+", num2: 7, result: 10 },
    { num1: 15, operator: "-", num2: 9, result: 3 },
    { num1: 8, operator: "x", num2: 5, result: 30 },
    { num1: 20, operator: "÷", num2: 4, result: 7 },
    { num1: 3, operator: "+", num2: 9, result: 15 },
    { num1: 10, operator: "-", num2: 2, result: 6 },
    { num1: 4, operator: "x", num2: 4, result: 20 },
    { num1: 18, operator: "÷", num2: 6, result: 5 },
  ];

  // Função para desenhar os cálculos
  function drawCalculations() {
    const numCalculationsPerLine = 4; // 4 cálculos por linha
    const padding = 20; // Espaçamento entre os cálculos
    const startX = 50; // Posição inicial X para o primeiro cálculo
    const startY = 50; // Posição inicial Y para a primeira linha

    // Desenha os cálculos no canvas
    calculosErrados.forEach((calc, index) => {
      const row = Math.floor(index / numCalculationsPerLine); // Define em qual linha o cálculo estará
      const col = index % numCalculationsPerLine; // Define em qual coluna o cálculo estará

      const x = startX + col * (200 + padding); // Largura de cada cálculo (200px + padding entre eles)
      const y = startY + row * (30 + padding); // Altura entre as linhas (30px + padding)

      const text = `${calc.num1} ${calc.operator} ${calc.num2} = ${calc.result}`;
      ctx.fillText(text, x, y);

      // Adiciona os efeitos confusos ao cálculo
      addConfusedElements(ctx, x, y, 20); // Adiciona elementos confusos com tamanho de fonte 20
    });
  }

  // Função para adicionar elementos confusos
  function addConfusedElements(ctx, x, y, fontSize) {
    // Números espelhados
    ctx.save();
    ctx.translate(x + 250, y);
    ctx.scale(-1, 1); // Espelha na direção X
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    // Números rotacionados
    ctx.save();
    ctx.translate(x + 280, y);
    ctx.rotate(Math.PI / 4); // Rotaciona em 45 graus
    ctx.fillText(Math.floor(Math.random() * 10), 0, 0);
    ctx.restore();

    // Números borrados
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.fillText(Math.floor(Math.random() * 10), x + 310, y);
    ctx.restore();

    // Números esmaecidos
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillText(Math.floor(Math.random() * 10), x + 340, y);
  }

  // Função de animação para desenhar os cálculos
  function animate() {
    // Limpa o canvas e redefine o fundo
    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redesenha os cálculos
    drawCalculations();

    // Requisita o próximo quadro de animação
    requestAnimationFrame(animate);
  }

  animate(); // Inicia a animação

  // Controle de troca dos números
  setInterval(() => {
    swapNumbers(); // Troca os números a cada 2 segundos (ajuste de frequência)
  }, 2000); // Troca os números a cada 2 segundos
}

// Função para trocar os números de posição nos cálculos
function swapNumbers() {
  const calculosErrados = [
    { num1: 5, operator: "+", num2: 3, result: 11 },
    { num1: 12, operator: "-", num2: 4, result: 5 },
    { num1: 7, operator: "x", num2: 3, result: 25 },
    { num1: 9, operator: "÷", num2: 3, result: 4 },
    { num1: 6, operator: "+", num2: 7, result: 10 },
    { num1: 15, operator: "-", num2: 9, result: 3 },
    { num1: 8, operator: "x", num2: 5, result: 30 },
    { num1: 20, operator: "÷", num2: 4, result: 7 },
    { num1: 3, operator: "+", num2: 9, result: 15 },
    { num1: 10, operator: "-", num2: 2, result: 6 },
    { num1: 4, operator: "x", num2: 4, result: 20 },
    { num1: 18, operator: "÷", num2: 6, result: 5 },
  ];

  calculosErrados.forEach(calc => {
    const correctResult = calc.operator === "+" ? calc.num1 + calc.num2 :
      calc.operator === "-" ? calc.num1 - calc.num2 :
      calc.operator === "x" ? calc.num1 * calc.num2 :
      calc.operator === "÷" ? calc.num1 / calc.num2 : calc.result;

    // Embaralha os números
    const numbers = [calc.num1, calc.num2, calc.result];
    const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5); // Embaralha os números

    // Atribui os números embaralhados de volta
    calc.num1 = shuffledNumbers[0];
    calc.num2 = shuffledNumbers[1];
    calc.result = shuffledNumbers[2] === calc.result ? correctResult : shuffledNumbers[2];
  });
}


//
// 3º CANVAS: NUMBERS AND FORMS
//


// Inicializa cada canvas com suas respectivas funções
drawConfusedForms(canvases2[0]); // Primeiro canvas
drawNumbersAndChange(canvases2[1]); // Segundo canvas
drawNumbersAndForms(canvases2[2]); // Terceiro canvas






//
//
//
// DYSCALCULIA GAME
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
