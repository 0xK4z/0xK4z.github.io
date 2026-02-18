// Função para o efeito Matrix no Background
function startMatrixEffect() {
  const canvas = document.getElementById("matrixCanvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Define o tamanho do canvas para cobrir a janela
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Caracteres que serão usados (alfanumérico e alguns símbolos de terminal)
  const katakana =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
  const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const symbols = '!@#$%^&*()_+-=[]{}|;:",./<>?`~';

  const chars = katakana + latin + nums + symbols;

  // Tamanho da fonte e colunas
  const fontSize = 16;
  const columns = canvas.width / fontSize;

  // Array para controlar a posição Y de cada coluna
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1; // Começa na primeira linha
  }

  // Cor dos caracteres (usando sua variável global)
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
    "--accent-color",
  );
  ctx.font = `${fontSize}px monospace`;

  function draw() {
    // Fundo semitransparente para o efeito de "rastro"
    ctx.fillStyle = "rgba(11, 12, 16, 0.05)"; // var(--bg-color) com transparência
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cor e fonte dos caracteres
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
      "--accent-color",
    );
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // Reseta a coluna quando atinge o final da tela ou aleatoriamente
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      // Incrementa a posição Y para o próximo frame
      drops[i]++;
    }
  }

  // Atualiza o canvas a cada 33 milissegundos (aproximadamente 30 FPS)
  setInterval(draw, 33);

  // Ajusta o tamanho do canvas se a janela for redimensionada
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalcula as colunas e drops para se ajustar à nova largura
    const newColumns = canvas.width / fontSize;
    const newDrops = [];
    for (let i = 0; i < newColumns; i++) {
      newDrops[i] = drops[i] || 1; // Mantém a posição se já existia, senão começa do 1
    }
    drops.length = 0; // Limpa o array antigo
    drops.push(...newDrops); // Adiciona os novos
  });
}

// Inicia o efeito Matrix quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", startMatrixEffect);
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos com a classe "glitch"
  const glitchElements = document.querySelectorAll(".glitch");

  glitchElements.forEach((el) => {
    // Pega o texto de dentro da tag e coloca no atributo data-text
    const text = el.innerText;
    el.setAttribute("data-text", text);
  });
});
