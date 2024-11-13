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
      const x1 = 50; // Posição X do primeiro cálculo em cada linha
      const x2 = 550; // Aumenta o espaçamento entre os dois cálculos na linha
      const y = 80 + i * 100; // Espaçamento vertical entre as linhas

      // Cálculo 1
      const num1a = Math.floor(Math.random() * 100);
      const num2a = Math.floor(Math.random() * 100);
      const operation1 = operations[Math.floor(Math.random() * operations.length)];
      const result1 = Math.floor(Math.random() * 200) - 100;
      ctx.fillStyle = "#FFFFFF"; // Cor do texto branco
      ctx.fillText(`${num1a} ${operation1} ${num2a} = ${result1}`, x1, y);

      // Cálculo 2
      const num1b = Math.floor(Math.random() * 100);
      const num2b = Math.floor(Math.random() * 100);
      const operation2 = operations[Math.floor(Math.random() * operations.length)];
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


// Inicializa cada canvas com suas respectivas funções
drawConfusedForms(canvases2[0]); // Primeiro canvas
drawNumbersAndChange(canvases2[1]); // Segundo canvas
drawNumbersAndForms(canvases2[2]); // Terceiro canvas






//
//
//
// DYSCALCULIA GAME
const canvas7 = document.getElementById('gameCanvas');
const ctx7 = canvas7.getContext('2d');
canvas7.width = 500;
canvas7.height = 300;

// Variáveis do jogo
let currentEquation7 = '';
let isCorrect7 = false;
let score7 = 0;
let questionCount7 = 0;
let particles7 = [];
let fallingNumbers7 = [];

// Configuração para números caindo
const fallingNumbersCount7 = 50;

// Operações possíveis
const operations7 = ['+', '-', '*', '/'];

// Gera números aleatórios para o fundo
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

// Atualiza a posição dos números caindo
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

// Desenha os números a cair no fundo
function drawFallingNumbers7() {
    fallingNumbers7.forEach((num) => {
        ctx7.font = `${num.size}px Montserrat`;
        ctx7.fillStyle = `rgba(255, 255, 255, ${num.alpha})`;
        ctx7.fillText(num.number, num.x, num.y);
    });
}

// Gera uma nova equação
function generateEquation7() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = operations7[Math.floor(Math.random() * operations7.length)];

    let realAnswer7;
    let fakeAnswer7;

    switch (operation) {
        case '+':
            realAnswer7 = num1 + num2;
            break;
        case '-':
            realAnswer7 = num1 - num2;
            break;
        case '*':
            realAnswer7 = num1 * num2;
            break;
        case '/':
            realAnswer7 = parseFloat((num1 / num2).toFixed(2)); // Limita a precisão
            break;
    }

    fakeAnswer7 = realAnswer7 + (Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? 1 : -1));
    if (operation === '/') fakeAnswer7 = parseFloat((fakeAnswer7).toFixed(2)); // Garante precisão para divisões

    currentEquation7 = `${num1} ${operation} ${num2} = ${fakeAnswer7}`;
    isCorrect7 = (realAnswer7 === fakeAnswer7);
}

// Renderiza a equação no canvas
function renderEquation7() {
    ctx7.font = '36px Montserrat';
    ctx7.fillStyle = 'white';
    ctx7.textAlign = 'center';
    ctx7.fillText(currentEquation7, canvas7.width / 2, canvas7.height / 2);
}

// Renderiza a pontuação
function renderScore7() {
    ctx7.font = '24px Montserrat';
    ctx7.fillStyle = 'black';
    ctx7.textAlign = 'left';
    ctx7.fillText(`Pontuação: ${score7}`, 10, 30);
    ctx7.fillText(`Perguntas: ${questionCount7}/20`, 10, 50);
}

// Cria partículas para animação
function createParticles7(color) {
    for (let i = 0; i < 50; i++) {
        particles7.push({
            x: canvas7.width / 2,
            y: canvas7.height / 2,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            color: color,
            alpha: 1
        });
    }
}

// Atualiza e desenha as partículas
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

// Avalia a resposta do jogador
function evaluateAnswer7(playerChoice) {
    if (playerChoice === isCorrect7) {
        score7++;
        createParticles7('0, 255, 0'); // Verde
    } else {
        createParticles7('255, 0, 0'); // Vermelho
    }

    questionCount7++;
    if (questionCount7 < 20) {
        generateEquation7();
    } else {
        endGame7();
    }
}

// Finaliza o jogo
function endGame7() {
    ctx7.clearRect(0, 0, canvas7.width, canvas7.height);
    ctx7.font = '24px';
    ctx7.fillStyle = 'white';
    ctx7.textAlign = 'center';
    ctx7.fillText(`Fim do jogo! Sua pontuação: ${score7}/20`, canvas7.width / 2, canvas7.height / 2);
}

// Animação do jogo
function animate7() {
    ctx7.clearRect(0, 0, canvas7.width, canvas7.height);

    // Fundo com números caindo
    drawFallingNumbers7();
    updateFallingNumbers7();

    // Renderiza a equação, partículas e pontuação
    renderEquation7();
    renderScore7();
    updateParticles7();

    requestAnimationFrame(animate7);
}

// Configura os botões
document.getElementById('correct').addEventListener('click', () => evaluateAnswer7(true));
document.getElementById('incorrect').addEventListener('click', () => evaluateAnswer7(false));

// Inicializa o jogo
document.addEventListener('DOMContentLoaded', () => {
  // Seu código aqui
  generateEquation7();
  createFallingNumbers7();
  animate7();
});
