document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const arrows = document.querySelectorAll('.scroll-arrow');
    let previousSectionId = 'title'; // Store the previous section ID

    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = 'none'; // Hide sections
        });
    }

    function showSection(section, direction) {
        // Display the section
        section.style.display = 'flex';
        section.classList.add('active');

        // Apply the appropriate animation based on direction
        if (direction === 'next') {
            section.classList.add('slide-in-bottom');
        } else if (direction === 'previous') {
            section.classList.add('slide-in-top');
        }

        // Remove animation classes after animation ends
        section.addEventListener('animationend', () => {
            section.classList.remove('slide-in-bottom', 'slide-in-top');
        }, { once: true }); // Use `{ once: true }` to automatically remove the listener

    }

    // Initialize visibility
    hideAllSections();
    showSection(document.getElementById('title'), 'next');

    arrows.forEach(arrow => {
        arrow.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = arrow.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Determine direction
            const direction = (previousSectionId < targetId) ? 'next' : 'previous';
            previousSectionId = targetId; // Update the previous section ID

            hideAllSections();
            showSection(targetSection, direction);
            updateArrowVisibility(targetId);
        });
    });

    function updateArrowVisibility(activeSectionId) {
        arrows.forEach(arrow => {
            const targetId = arrow.getAttribute('href').substring(1);
            if (activeSectionId === 'title' && arrow.classList.contains('previous')) {
                arrow.style.display = 'none'; // Hide previous arrow on title
            } else if (activeSectionId === 'dyscalculia-game' && arrow.classList.contains('next')) {
                arrow.style.display = 'none'; // Hide next arrow on dyscalculia game
            } else {
                arrow.style.display = ''; // Show all other arrows
            }
        });
    }

    // Initialize visibility
    updateArrowVisibility('title');
});


// Typoglycemia effect on canvas
const canvas = document.getElementById('dyslexiaCanvas');
const ctx = canvas.getContext('2d');
const intervalTime = 150;
let scrambleInterval;

const textLines = [
    "Dyslexia",
    "Friends who have dyslexia described to me how they experience reading...",
    "I remembered reading about typoglycemia...",
    "Dyslexia is characterized by difficulty with learning to read fluently and with accurate comprehension."
];

function scrambleWord(word) {
    if (word.length < 4) return word;
    let middle = word.slice(1, -1).split('');
    for (let i = middle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    return word[0] + middle.join('') + word[word.length - 1];
}

function scrambleTextLines() {
    return textLines.map(line =>
        line.split(" ").map(word => (Math.random() < 0.3 ? scrambleWord(word) : word)).join(" ")
    );
}

function drawScrambledText() {
    const scrambledLines = scrambleTextLines();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px Montserrat";
    ctx.fillStyle = "#ff7f50";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    scrambledLines.forEach((line, index) => {
        ctx.fillText(line, 10, index * 30 + 20);
    });
}

scrambleInterval = setInterval(drawScrambledText, intervalTime);
