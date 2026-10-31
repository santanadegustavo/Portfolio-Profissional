// =============================================
// Configurações rápidas (troque aqui)
// =============================================
const MEU_EMAIL = "santanagustavo902@gmail.com";
const FRASES = ["interfaces web", "React e Next.js", "automações com IA"];

// =============================================
// Pegando os elementos da página
// =============================================
const menu = document.getElementById("menu");
const botaoHamburguer = document.getElementById("hamburguer");
const barraProgresso = document.getElementById("barra-progresso");
const linhaTempo = document.getElementById("linha-tempo");
const itensLinhaTempo = document.querySelectorAll(".linha-tempo-item");
const linksMenu = document.querySelectorAll(".links-menu a");
const secoes = document.querySelectorAll("main section");
const topo = document.getElementById("inicio");
const frase = document.getElementById("frase");
const aviso = document.getElementById("aviso");
const botaoCopiarEmail = document.getElementById("botao-copiar-email");
const formulario = document.getElementById("formulario");
const avisoFormulario = document.getElementById("aviso-formulario");

// =============================================
// Menu do celular (hambúrguer)
// =============================================
function abrirMenu(abrir) {
  menu.classList.toggle("aberto", abrir);
  botaoHamburguer.setAttribute("aria-expanded", abrir);
  botaoHamburguer.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
}

botaoHamburguer.addEventListener("click", function () {
  const estaAberto = menu.classList.contains("aberto");
  abrirMenu(!estaAberto);
});

// fecha o menu quando clica em um link
linksMenu.forEach(function (link) {
  link.addEventListener("click", function () {
    abrirMenu(false);
  });
});

// fecha o menu com a tecla Esc
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    abrirMenu(false);
  }
});

// =============================================
// Efeitos ao rolar a página
// =============================================
function aoRolar() {
  const rolado = window.scrollY;
  const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

  // menu ganha fundo depois que a página desce um pouco
  menu.classList.toggle("rolou", rolado > 8);

  // barra fina embaixo do menu
  barraProgresso.style.setProperty("--rolagem", rolado / alturaTotal);

  // linha do tempo vai se preenchendo
  const meioDaTela = window.innerHeight * 0.62;
  const caixa = linhaTempo.getBoundingClientRect();
  let progresso = (meioDaTela - caixa.top) / caixa.height;
  progresso = Math.min(1, Math.max(0, progresso));
  linhaTempo.style.setProperty("--progresso", progresso);

  itensLinhaTempo.forEach(function (item) {
    const passou = item.getBoundingClientRect().top < meioDaTela;
    item.classList.toggle("concluido", passou);
  });
}

window.addEventListener("scroll", aoRolar);
window.addEventListener("resize", aoRolar);
aoRolar();

// =============================================
// Destaca no menu a seção que está na tela
// =============================================
const observador = new IntersectionObserver(
  function (lista) {
    lista.forEach(function (item) {
      if (!item.isIntersecting) return;

      linksMenu.forEach(function (link) {
        const ehDestaSecao = link.getAttribute("href") === "#" + item.target.id;
        link.setAttribute("aria-current", ehDestaSecao);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

secoes.forEach(function (secao) {
  observador.observe(secao);
});

// =============================================
// Início: luz que segue o mouse
// =============================================
topo.addEventListener("pointermove", function (evento) {
  const caixa = topo.getBoundingClientRect();
  topo.style.setProperty("--mouse-x", evento.clientX - caixa.left + "px");
  topo.style.setProperty("--mouse-y", evento.clientY - caixa.top + "px");
});

// =============================================
// Início: frase que troca sozinha
// =============================================
let posicaoFrase = 0;

setInterval(function () {
  if (document.hidden) return;

  frase.classList.add("trocando");

  setTimeout(function () {
    posicaoFrase = (posicaoFrase + 1) % FRASES.length;
    frase.textContent = FRASES[posicaoFrase];
    frase.classList.remove("trocando");
  }, 260);
}, 2800);

// =============================================
// Aviso rápido (aparece e some)
// =============================================
let tempoAviso;

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add("visivel");

  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function () {
    aviso.classList.remove("visivel");
  }, 2600);
}

// =============================================
// Botão de copiar e-mail
// =============================================
botaoCopiarEmail.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(MEU_EMAIL);
    mostrarAviso("E-mail copiado");
  } catch (erro) {
    mostrarAviso("Não deu para copiar. Selecione o e-mail e copie.");
  }
});

// =============================================
// Formulário de contato (usa o Formspree)
// =============================================
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  // se você ainda não trocou o SEU_ID, avisa em vez de tentar enviar
  if (formulario.action.includes("SEU_ID")) {
    avisoFormulario.textContent = "Formulário ainda não configurado. Veja o README.";
    return;
  }

  avisoFormulario.textContent = "Enviando...";

  try {
    const resposta = await fetch(formulario.action, {
      method: "POST",
      body: new FormData(formulario),
      headers: { Accept: "application/json" },
    });

    if (resposta.ok) {
      formulario.reset();
      avisoFormulario.textContent = "Mensagem enviada. Obrigado pelo contato!";
    } else {
      avisoFormulario.textContent = "Não foi possível enviar. Tente pelo e-mail.";
    }
  } catch (erro) {
    avisoFormulario.textContent = "Sem conexão. Tente de novo ou use o e-mail.";
  }
});

// =============================================
// Carrossel de projetos
// =============================================
const listaProjetos = document.getElementById("projetos-lista");
const controlesProjetos = document.getElementById("carrossel-controles");
const botaoAnterior = document.getElementById("projetos-anterior");
const botaoProximo = document.getElementById("projetos-proximo");

function atualizarCarrossel() {
  const cabemTodos = listaProjetos.scrollWidth <= listaProjetos.clientWidth + 1;

  // sem sobra de projetos, os botões ficam escondidos
  controlesProjetos.hidden = cabemTodos;

  const noInicio = listaProjetos.scrollLeft <= 1;
  const noFim =
    listaProjetos.scrollLeft + listaProjetos.clientWidth >= listaProjetos.scrollWidth - 1;
  botaoAnterior.disabled = noInicio;
  botaoProximo.disabled = noFim;
}

function rolarProjetos(direcao) {
  const card = listaProjetos.querySelector(".projeto");
  const espaco = parseFloat(getComputedStyle(listaProjetos).columnGap) || 0;

  // anda a largura de um card por clique
  listaProjetos.scrollBy({
    left: direcao * (card.offsetWidth + espaco),
    behavior: "smooth",
  });
}

botaoAnterior.addEventListener("click", function () {
  rolarProjetos(-1);
});
botaoProximo.addEventListener("click", function () {
  rolarProjetos(1);
});

listaProjetos.addEventListener("scroll", atualizarCarrossel);
window.addEventListener("resize", atualizarCarrossel);
atualizarCarrossel();
