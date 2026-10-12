"use strict";

// A conta é guardada como uma lista de pedaços: números (texto) e operadores.
// Exemplo: 12,5 × −3 + 4  →  ["12.5", "*", "-3", "+", "4"]
const OPERADORES = ["+", "-", "*", "/"];
const SIMBOLOS = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const MAX_DIGITOS = 15;

const telaExpressao = document.getElementById("expressao");
const telaResultado = document.getElementById("resultado");
const teclado = document.getElementById("teclado");

let pedacos = [];
let concluido = false; // true logo depois de apertar "="
let ultimaConta = "";
let erro = "";

const ehOperador = (p) => OPERADORES.includes(p);
const ultimo = () => pedacos[pedacos.length - 1];
const ultimoEhNumero = () => pedacos.length > 0 && !ehOperador(ultimo());
const trocarUltimo = (valor) => (pedacos[pedacos.length - 1] = valor);

// ---------- Ações ----------
function comecarDeNovoSeConcluido(manterResultado) {
  if (!concluido) return;
  concluido = false;
  ultimaConta = "";
  if (!manterResultado || erro) pedacos = [];
  erro = "";
}

function digitar(digito) {
  comecarDeNovoSeConcluido(false);
  if (!ultimoEhNumero()) return pedacos.push(digito);

  const numero = ultimo();
  if (numero.replace(/[-.]/g, "").length >= MAX_DIGITOS) return;
  if (numero === "0") return trocarUltimo(digito);
  if (numero === "-0") return trocarUltimo("-" + digito);
  trocarUltimo(numero + digito);
}

function decimal() {
  comecarDeNovoSeConcluido(false);
  if (!ultimoEhNumero()) return pedacos.push("0.");
  if (!ultimo().includes(".")) trocarUltimo(ultimo() + ".");
}

function operador(op) {
  comecarDeNovoSeConcluido(true);
  if (pedacos.length === 0) pedacos.push("0");

  if (ehOperador(ultimo())) return trocarUltimo(op);
  if (ultimo().endsWith(".")) trocarUltimo(ultimo().slice(0, -1));
  pedacos.push(op);
}

function trocarSinal() {
  comecarDeNovoSeConcluido(true);
  if (!ultimoEhNumero()) return pedacos.push("-0");
  const numero = ultimo();
  trocarUltimo(numero.startsWith("-") ? numero.slice(1) : "-" + numero);
}

function porcentagem() {
  comecarDeNovoSeConcluido(true);
  if (!ultimoEhNumero()) return;
  trocarUltimo(arredondar(parseFloat(ultimo()) / 100));
}

function apagar() {
  if (concluido) return limpar();
  if (pedacos.length === 0) return;
  if (ehOperador(ultimo())) return pedacos.pop();

  const numero = ultimo().slice(0, -1);
  if (numero === "" || numero === "-") pedacos.pop();
  else trocarUltimo(numero);
}

function limpar() {
  pedacos = [];
  concluido = false;
  ultimaConta = "";
  erro = "";
}

function igual() {
  if (concluido || pedacos.length === 0) return;
  if (ehOperador(ultimo())) pedacos.pop();

  ultimaConta = formatarConta(pedacos) + " =";
  try {
    pedacos = [calcular(pedacos)];
  } catch (e) {
    erro = e.message;
    pedacos = [];
  }
  concluido = true;
}

// ---------- Cálculo (respeita a ordem: × e ÷ antes de + e −) ----------
function calcular(lista) {
  const numeros = [parseFloat(lista[0])];
  const somas = [];

  for (let i = 1; i < lista.length; i += 2) {
    const op = lista[i];
    const valor = parseFloat(lista[i + 1]);
    if (op === "*") numeros[numeros.length - 1] *= valor;
    else if (op === "/") {
      if (valor === 0) throw new Error("Não dá para dividir por zero");
      numeros[numeros.length - 1] /= valor;
    } else {
      somas.push(op);
      numeros.push(valor);
    }
  }

  let total = numeros[0];
  somas.forEach((op, i) => (total = op === "+" ? total + numeros[i + 1] : total - numeros[i + 1]));

  if (!Number.isFinite(total)) throw new Error("Número grande demais");
  return arredondar(total);
}

// Evita resultados como 0.1 + 0.2 = 0.30000000000000004
function arredondar(n) {
  const r = Number(n.toPrecision(12));
  return String(Object.is(r, -0) ? 0 : r);
}

// ---------- Formatação no padrão brasileiro (1.234,5) ----------
function formatarNumero(texto) {
  if (/e/i.test(texto)) return texto.replace(".", ",");
  const negativo = texto.startsWith("-");
  const [inteiro, fracao] = texto.replace("-", "").split(".");
  const agrupado = (inteiro || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (negativo ? "−" : "") + agrupado + (fracao !== undefined ? "," + fracao : "");
}

function formatarConta(lista) {
  return lista.map((p) => (ehOperador(p) ? ` ${SIMBOLOS[p]} ` : formatarNumero(p))).join("").trim();
}

// ---------- Tela ----------
function atualizarTela() {
  let resultado = "0";
  let previa = false;

  if (erro) {
    telaExpressao.textContent = ultimaConta;
    resultado = erro;
  } else if (concluido) {
    telaExpressao.textContent = ultimaConta;
    resultado = formatarNumero(pedacos[0]);
  } else if (pedacos.length > 0) {
    const temConta = pedacos.some(ehOperador);
    telaExpressao.textContent = temConta ? formatarConta(pedacos) : "";
    if (temConta) {
      const completos = ehOperador(ultimo()) ? pedacos.slice(0, -1) : pedacos;
      try {
        resultado = formatarNumero(calcular(completos));
        previa = true;
      } catch (e) {
        resultado = "…";
        previa = true;
      }
    } else {
      resultado = formatarNumero(ultimo());
    }
  } else {
    telaExpressao.textContent = "";
  }

  telaResultado.textContent = resultado;
  telaResultado.classList.toggle("erro", Boolean(erro));
  telaResultado.classList.toggle("previa", previa);
  telaResultado.classList.toggle("medio", !erro && resultado.length > 9 && resultado.length <= 13);
  telaResultado.classList.toggle("pequeno", !erro && resultado.length > 13);
  telaResultado.scrollLeft = telaResultado.scrollWidth;

  const opAtivo = !concluido && pedacos.length > 0 && ehOperador(ultimo()) ? ultimo() : null;
  teclado.querySelectorAll("[data-op]").forEach((b) => b.classList.toggle("ativo", b.dataset.op === opAtivo));
}

// ---------- Cliques ----------
const ACOES = { limpar, apagar, porcentagem, sinal: trocarSinal, decimal, igual };

function executar(botao) {
  if (botao.dataset.num) digitar(botao.dataset.num);
  else if (botao.dataset.op) operador(botao.dataset.op);
  else if (botao.dataset.acao) ACOES[botao.dataset.acao]();
  atualizarTela();
}

teclado.addEventListener("click", (e) => {
  const botao = e.target.closest("button");
  if (botao) executar(botao);
});

// ---------- Teclado do computador ----------
const TECLAS = {
  Enter: '[data-acao="igual"]',
  "=": '[data-acao="igual"]',
  Backspace: '[data-acao="apagar"]',
  Escape: '[data-acao="limpar"]',
  Delete: '[data-acao="limpar"]',
  "%": '[data-acao="porcentagem"]',
  ",": '[data-acao="decimal"]',
  ".": '[data-acao="decimal"]',
  "+": '[data-op="+"]',
  "-": '[data-op="-"]',
  "*": '[data-op="*"]',
  x: '[data-op="*"]',
  X: '[data-op="*"]',
  "/": '[data-op="/"]',
};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const seletor = /^\d$/.test(e.key) ? `[data-num="${e.key}"]` : TECLAS[e.key];
  const botao = seletor && teclado.querySelector(seletor);
  if (!botao) return;

  e.preventDefault();
  executar(botao);
  botao.classList.add("pressionada");
  setTimeout(() => botao.classList.remove("pressionada"), 120);
});

atualizarTela();
