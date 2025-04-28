document.addEventListener('DOMContentLoaded', function() {
    // Botão para alternar tema
    const themeButton = document.getElementById('theme-button');
    
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Atualiza o texto do botão
        if (document.body.classList.contains('dark-theme')) {
            themeButton.textContent = 'Tema Claro';
        } else {
            themeButton.textContent = 'Tema Escuro';
        }
    });
    
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio de formulário
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Animação suave de rolagem para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
