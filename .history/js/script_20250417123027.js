document.addEventListener('DOMContentLoaded', function() {
    // Botão para alternar tema
    const themeButton = document.getElementById('theme-button');
    
    // Verificar se há tema salvo no localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    // Atualizar texto do botão
    updateButtonText(currentTheme);
    
    // Adicionar evento de clique ao botão
    themeButton.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Atualizar tema
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Atualizar texto do botão
        updateButtonText(newTheme);
    });
    
    function updateButtonText(theme) {
        const themeButton = document.getElementById('theme-button');
        themeButton.textContent = theme === 'light' ? 'Modo Escuro' : 'Modo Claro';
    }
    
    // Animação de scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
