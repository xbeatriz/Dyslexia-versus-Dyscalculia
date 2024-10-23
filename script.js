// script.js
const scrollToSection = (target) => {
    const section = document.querySelector(target);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth'
        });
    }
};

// Seta para avançar
document.querySelector('.scroll-arrow.next').addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = this.getAttribute('href');
    
    // Adicionar a classe para ativar a animação de "slide"
    document.querySelector(target).classList.add('active');
    
    // Rolar até a secção "dislexia"
    scrollToSection(target);
});

// Seta para voltar
document.querySelector('.scroll-arrow.previous').addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = this.getAttribute('href');
    
    // Rolar até a secção "title"
    scrollToSection(target);
});
