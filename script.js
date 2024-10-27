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

  // Inicializa visibilidade
  hideAllSections();
  showSection(document.getElementById("title"), "next");

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = arrow.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Determina direção com base na ordem das secções
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

document.addEventListener("DOMContentLoaded", () => {
  const shapesCanvas = document.getElementById("shapesCanvas");
  const ctx = shapesCanvas.getContext("2d");

  // Função para gerar uma cor aleatória
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Função para desenhar uma forma aleatória
  function drawRandomShape() {
    const shapeType = Math.floor(Math.random() * 3); // 0: Círculo, 1: Quadrado, 2: Triângulo
    const x = Math.random() * shapesCanvas.width;
    const y = Math.random() * shapesCanvas.height;
    const size = Math.random() * 50 + 20;
    const color = getRandomColor();

    ctx.fillStyle = color;

    if (shapeType === 0) {
      // Círculo
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeType === 1) {
      // Quadrado
      ctx.fillRect(x, y, size, size);
    } else if (shapeType === 2) {
      // Triângulo
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size / 2, y - size);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Função para desenhar várias formas aleatórias
  function drawRandomShapes(count) {
    ctx.clearRect(0, 0, shapesCanvas.width, shapesCanvas.height); // Limpa o canvas
    for (let i = 0; i < count; i++) {
      drawRandomShape();
    }
  }

  // Desenhar 10 formas aleatórias inicialmente e repetir a cada segundo
  drawRandomShapes(10);
  setInterval(() => drawRandomShapes(10), 1000);
});

// Typoglycemia effect on canvas
const canvas = document.getElementById("dyslexiaCanvas");
const ctx = canvas.getContext("2d");
const intervalTime = 200;
let scrambleInterval;

const textLines = [
  "Dyslexia",
  "Friends who have dyslexia described to me how they experience reading...",
  "I remembered reading about typoglycemia...",
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "34px Montserrat";
  ctx.fillStyle = "#ff7f50";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  scrambledLines.forEach((line, index) => {
    ctx.fillText(line, 10, index * 30 + 20);
  });
}

scrambleInterval = setInterval(drawScrambledText, intervalTime);
