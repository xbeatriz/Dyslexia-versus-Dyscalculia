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

const canvas = document.getElementById("dyslexiaCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 2500;
canvas.height = 600;
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
  //!NOT WORKING - borda ao redor do canva
  // Adiciona uma borda ao redor do canvas
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#FFFFFF"; // Cor da borda (stroke)
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000"; // Cor de fundo do canvas
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "75px Montserrat"; // Tamanho da fonte
  ctx.fillStyle = "#FFFFFF"; // Cor do texto
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  scrambledLines.forEach((line, index) => {
    ctx.fillText(line, 10, index * 80 + 60);
  });
}

scrambleInterval = setInterval(drawScrambledText, intervalTime);
