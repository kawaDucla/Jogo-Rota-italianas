const pessoa = document.querySelector('.pessoa1');
const tijolo = document.querySelector('.tijolo');
const sol = document.querySelector('.sol');
const background = document.querySelector('.game-board');
const pontoEl = document.getElementById('ponto');
const morteEl = document.getElementById('morte');
const reiniciarId = document.getElementById('reiniciar');
const inicioId = document.getElementById('inicio');
const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const faseEl = document.getElementById('fase');

let pontoInterval;
let loop;
let pontos = 0;
let mortes = 0;
let jogoAtivo = false; // começa desativado
let fase = 1;
const pontosPorFase = 10;

// Função de pulo
const jump = () => {
    if (!jogoAtivo) return;
    pessoa.classList.add('jump');
    setTimeout(() => pessoa.classList.remove('jump'), 500);
};

// Loop de colisão
function startLoop() {
    loop = setInterval(() => {
        if (!jogoAtivo) return;

        const tijoloPosition = +getComputedStyle(tijolo).left.replace('px', '');
        const pessoaPosition = +getComputedStyle(pessoa).bottom.replace('px', '');
        const solPosition = +getComputedStyle(sol).left.replace('px', '');

        // Colisão detectada
        if (tijoloPosition <= 118 && tijoloPosition > 0 && pessoaPosition < 70) {
            mortes++;
            morteEl.textContent = `Mortes: ${mortes}`;
            jogoAtivo = false;

            clearInterval(pontoInterval); // Para o contador de pontos ao morrer

            // Congelar animações e manter posição
            sol.style.animation = 'none';
            sol.style.left = `${solPosition}px`;

            tijolo.style.animation = 'none';
            tijolo.style.left = `${tijoloPosition}px`;

            pessoa.style.animation = 'none';
            pessoa.style.bottom = `${pessoaPosition}px`;

            // Visual de "morte"
            sol.src = './img/Lua.png';
            sol.style.width = '190px';
            background.style.background = 'linear-gradient(#060057, #0051ffa6)';

            pessoa.src = './img/pessoa-triste.png';
            pessoa.style.width = '90px';
            pessoa.style.marginLeft = '25px';
            pessoa.style.marginBottom = '0px';

            clearInterval(loop);

            // Mostrar botões Reiniciar e Início
            reiniciarId.style.visibility = 'visible';
            inicioId.style.visibility = 'visible';
        }
    }, 5);
}

// Função para iniciar ou reiniciar o jogo
function iniciarJogo() {
    introScreen.style.display = 'none'; // Esconde tela de introdução
    jogoAtivo = true;
    reiniciarId.style.visibility = 'hidden';
    inicioId.style.visibility = 'hidden';

    pontos = 0;
    pontoEl.textContent = `Pontos: ${pontos}`;

    // Resetar posições e animações
    tijolo.style.left = '';
    tijolo.style.right = '';
    sol.style.left = '';
    sol.style.right = '';
    pessoa.style.bottom = '';

    tijolo.style.animation = 'none';
    sol.style.animation = 'none';
    void tijolo.offsetWidth; // Reflow para resetar animação
    void sol.offsetWidth;

    pessoa.style.animation = '';

    tijolo.style.animation = 'tijolo-animation 1.5s linear infinite';
    sol.style.animation = 'sol-animation 20s linear infinite';

    // Restaurar sprites e estilo padrão
    sol.src = './img/sol.png';
    sol.style.width = '240px';
    background.style.background = 'linear-gradient(#ffae00, #fbff00)';

    pessoa.src = './img/pessoa-correndo.gif';
    pessoa.style.width = '140px';
    pessoa.style.marginLeft = '0';
    pessoa.style.marginBottom = '0';

    // Iniciar loop de colisão e contador de pontos
    startLoop();

    pontoInterval = setInterval(() => {
        if (jogoAtivo) {
            pontos++;
            pontoEl.textContent = `Pontos: ${pontos}`;
            if (pontos % pontosPorFase === 0) {
                mudarDeFase();
            }
        }
    }, 1000);
}

// Evento do botão Start na tela inicial
startBtn.addEventListener('click', iniciarJogo);

// Botões Reiniciar e Início
reiniciarId.addEventListener('click', iniciarJogo);

inicioId.addEventListener('click', () => {
    window.location.href = 'index.html'; // Voltar para página inicial
});

// Tecla espaço para pular
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && jogoAtivo) jump();
});

// Aumentar dificuldade quando o sol completar uma volta
sol.addEventListener('animationiteration', () => {
    if (!jogoAtivo) return; // Só aumenta se o jogo estiver ativo
    const currentDuration = parseFloat(getComputedStyle(tijolo).animationDuration);
    const newDuration = Math.max(0.5, currentDuration - 0.2);
    tijolo.style.animationDuration = `${newDuration}s`;
});

// Mudar de fase
function mudarDeFase() {
    fase++;
    // Atualiza visual da fase
    if (faseEl) faseEl.textContent = `Fase: ${fase}`;
    // Pode direcionar para outra página ou modificar o jogo aqui
    window.location.href = 'fase2.html'; // Exemplo de mudança de página
}
