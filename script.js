const produtos = [
{
id:1,
nome:"Camiseta Dry Fit",
preco:89.90,
categoria:"loja",
imagem:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
},
{
id:2,
nome:"Short Esportivo",
preco:79.90,
categoria:"loja",
imagem:"https://images.unsplash.com/photo-1675910516800-42d3a6517de3?auto=format&fit=crop&q=80"
},
{
id:3,
nome:"Tênis Running",
preco:299.90,
categoria:"loja",
imagem:"https://images.unsplash.com/photo-1542291026-7eec264c27ff"
},
{
id:4,
nome:"Corte Degradê",
preco:35.00,
categoria:"barbearia",
imagem:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
},
{
id:5,
nome:"Barba Completa",
preco:25.00,
categoria:"barbearia",
imagem:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
},
{
id:6,
nome:"Corte + Barba",
preco:55.00,
categoria:"barbearia",
imagem:"https://images.unsplash.com/photo-1527082395-e939b847da0d?auto=format&fit=crop&q=80"
}
];

let carrinho = [];

const TEMPO_EXPIRACAO = 3 * 24 * 60 * 60 * 1000; // 3 dias

document.addEventListener("DOMContentLoaded",()=>{
renderizar();
carregarPedidoSalvo();
});

/* ============================= */
/* RENDER PRODUTOS */
/* ============================= */
function renderizar(){
const lojaGrid = document.getElementById("loja-grid");
const barbeariaGrid = document.getElementById("barbearia-grid");

produtos.forEach(p=>{
const card = `
<div class="bg-gray-900 p-4 rounded-xl">
<img src="${p.imagem}"
class="h-48 w-full object-cover rounded cursor-pointer hover:scale-105 transition"
onclick="abrirImagem('${p.imagem}')">
<h3 class="mt-4 text-xl">${p.nome}</h3>
<p class="text-brand-accent font-bold">R$ ${p.preco.toFixed(2)}</p>
<button onclick="addCarrinho(${p.id})"
class="mt-4 bg-brand-accent text-black px-4 py-2 rounded w-full">
Adicionar
</button>
</div>
`;

if(p.categoria === "loja"){
lojaGrid.innerHTML += card;
}else{
barbeariaGrid.innerHTML += card;
}
});
}

/* ============================= */
/* CARRINHO */
/* ============================= */
function addCarrinho(id){
const produto = produtos.find(p=>p.id===id);
carrinho.push(produto);
atualizarCarrinho();
}

function atualizarCarrinho(){
const cartItems = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const count = document.getElementById("cart-count");

cartItems.innerHTML="";
let total=0;

carrinho.forEach((item, index)=>{
total+=item.preco;

cartItems.innerHTML += `
<div class="flex justify-between items-center mb-3 bg-gray-900 p-2 rounded">
<div>
<p>${item.nome}</p>
<p class="text-sm text-gray-400">R$ ${item.preco.toFixed(2)}</p>
</div>

<button onclick="removerItem(${index})"
class="text-red-500 hover:text-red-400 text-lg">
<i class="fas fa-trash"></i>
</button>
</div>`;
});

totalEl.innerText="Total: R$ "+total.toFixed(2);
count.innerText=carrinho.length;
}

function toggleCart(){
const cart = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");

cart.classList.toggle("translate-x-full");
overlay.classList.toggle("hidden");
}

/* ============================= */
/* FINALIZAR PEDIDO */
/* ============================= */
function checkout(){
if(carrinho.length===0) return;

let total=0;
carrinho.forEach(item=> total+=item.preco);

const novoPedido = {
id: Date.now(),
data: Date.now(),
itens: [...carrinho],
total: total
};

let historico = JSON.parse(localStorage.getItem("historicoSportStyle")) || [];

historico.push(novoPedido);

localStorage.setItem("historicoSportStyle", JSON.stringify(historico));

let mensagem="Olá, gostaria de fazer o pedido:%0A";
carrinho.forEach(item=>{
mensagem+=`- ${item.nome} (R$ ${item.preco})%0A`;
});
mensagem+=`Total: R$ ${total.toFixed(2)}`;

window.open(`https://wa.me/5518996622714?text=${mensagem}`,"_blank");

/* LIMPA CARRINHO */
carrinho = [];
atualizarCarrinho();
toggleCart();

alert("Pedido registrado com sucesso!");
mostrarHistorico();
}

/* ============================= */
/* CARREGAR HISTÓRICO */
/* ============================= */
function carregarPedidoSalvo(){
mostrarHistorico();
}

/* ============================= */
/* MOSTRAR HISTÓRICO */
/* ============================= */
function mostrarHistorico(){

let historico = JSON.parse(localStorage.getItem("historicoSportStyle")) || [];

const TEMPO_EXPIRACAO = 3 * 24 * 60 * 60 * 1000;

historico = historico.filter(p => Date.now() - p.data <= TEMPO_EXPIRACAO);

localStorage.setItem("historicoSportStyle", JSON.stringify(historico));

let area = document.getElementById("meu-pedido");

if(!area){
area = document.createElement("div");
area.id="meu-pedido";
area.className="bg-black p-6 mt-10 rounded-xl";
document.getElementById("contato").appendChild(area);
}

if(historico.length === 0){
area.innerHTML="";
return;
}

let html="<h3 class='text-2xl mb-4 text-brand-accent'>Histórico de Pedidos (3 dias)</h3>";

historico.reverse().forEach(pedido=>{
html+=`<div class='mb-6 border-b border-gray-700 pb-4'>`;
html+=`<p class='text-sm text-gray-400'>Pedido: ${new Date(pedido.data).toLocaleString()}</p>`;

pedido.itens.forEach(item=>{
html+=`<p>- ${item.nome} (R$ ${item.preco})</p>`;
});

html+=`<p class='font-bold mt-2'>Total: R$ ${pedido.total.toFixed(2)}</p>`;
html+=`</div>`;
});

area.innerHTML = html;
}

/* ============================= */
/* AGENDAMENTO */
/* ============================= */
function agendar(event){
event.preventDefault();

const nome = document.getElementById("nomeCliente").value;
const data = document.getElementById("dataAgendamento").value;
const hora = document.getElementById("horaAgendamento").value;
const servico = document.getElementById("servicoAgendamento").value;

const novoAgendamento = {
id: Date.now(),
nome,
data,
hora,
servico
};

let agendamentos = JSON.parse(localStorage.getItem("agendamentosSportStyle")) || [];

agendamentos.push(novoAgendamento);

localStorage.setItem("agendamentosSportStyle", JSON.stringify(agendamentos));

/* ============================= */
/* ENVIO PARA WHATSAPP */
/* ============================= */
let mensagem = "Olá, gostaria de agendar um horário:%0A%0A";
mensagem += `Nome: ${nome}%0A`;
mensagem += `Serviço: ${servico}%0A`;
mensagem += `Data: ${data}%0A`;
mensagem += `Horário: ${hora}%0A`;

window.open(`https://wa.me/5518996622714?text=${mensagem}`, "_blank");

/* ============================= */

alert("Agendamento realizado com sucesso!");

event.target.reset();
mostrarAgendamentos();
}

function toggleMenu(){
document.getElementById("mobileMenu").classList.toggle("hidden");
}

function abrirImagem(src){
const modal = document.getElementById("imageModal");
const img = document.getElementById("modalImg");

img.src = src;

modal.classList.remove("hidden");
modal.classList.add("flex");

document.body.classList.add("overflow-hidden");
}

function fecharImagem(){
const modal = document.getElementById("imageModal");

modal.classList.add("hidden");
modal.classList.remove("flex");

document.body.classList.remove("overflow-hidden");
}

function removerItem(index){
carrinho.splice(index, 1);
atualizarCarrinho();
}