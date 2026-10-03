
const items = window.DISCURSOS;
const cards = document.querySelector('#cards');
const template = document.querySelector('#cardTemplate');
const search = document.querySelector('#search');
const count = document.querySelector('#resultCount');
const empty = document.querySelector('#empty');
const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
const overlay = document.querySelector('#overlay');
let range = {min:0,max:999};

function normalize(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function render(){
  const q = normalize(search.value.trim());
  const results = items.filter(item => item.number >= range.min && item.number <= range.max && (!q || item.label.includes(q) || normalize(item.title).includes(q)));
  cards.replaceChildren(...results.map(item => {
    const node = template.content.cloneNode(true);
    node.querySelector('.number').textContent = item.label;
    node.querySelector('h2').textContent = item.title;
    const readLink = node.querySelector('.read-link');
    readLink.href = item.reader;
    readLink.setAttribute('aria-label', `Ler discurso ${item.label}: ${item.title}`);
    const downloadLink = node.querySelector('.download-link');
    downloadLink.href = item.file;
    downloadLink.setAttribute('aria-label', `Baixar discurso ${item.label} em Word`);
    return node;
  }));
  count.textContent = results.length;
  empty.hidden = results.length !== 0;
}
function closeMenu(){sidebar.classList.remove('open');overlay.hidden=true;menuButton.setAttribute('aria-expanded','false')}
document.querySelectorAll('.range').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.range').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  range = {min:Number(button.dataset.min),max:Number(button.dataset.max)};
  render();closeMenu();
}));
search.addEventListener('input', render);
document.addEventListener('keydown', event => {if(event.key === 'Escape'){search.value='';render();closeMenu();search.focus()}});
menuButton.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');overlay.hidden=!open;menuButton.setAttribute('aria-expanded',String(open))});
overlay.addEventListener('click',closeMenu);
render();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'))}
