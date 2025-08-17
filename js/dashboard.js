/* ===== Helpers ===== */
const $ = (q, n=document) => n.querySelector(q);
const $$ = (q, n=document) => Array.from(n.querySelectorAll(q));

/* ===== Mini “store” de estado ===== */
const state = {
  usage: 0,
  m1: 0,
  p1: 51,
  p2: 28,
};

/* ===== UI: ring de uso mensual ===== */
function setUsage(percent){
  const ring = $('#ringFg');
  const label = $('#ringLabel');
  const mini = $('#mini-usage');
  const CIRC = 2 * Math.PI * 52; // stroke-dasharray=326 (≈ 2πr con r=52)
  const p = Math.max(0, Math.min(100, percent));
  const offset = CIRC * (1 - p/100);
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = offset;
  label.textContent = `${p|0}%`;
  mini.textContent = `${p|0}%`;
}

function animateUsage(to=72, duration=1200){
  const from = state.usage;
  const start = performance.now();
  (function step(now){
    const t = Math.min(1, (now - start)/duration);
    const val = from + (to - from) * t;
    setUsage(val);
    if (t < 1) requestAnimationFrame(step); else state.usage = to;
  })(performance.now());
}

/* ===== Contadores / números ===== */
function animateNumber(el, to, duration=900){
  const from = parseFloat(el.textContent) || 0;
  const start = performance.now();
  (function step(now){
    const t = Math.min(1, (now - start)/duration);
    const val = from + (to - from) * t;
    el.textContent = (el.id.startsWith('p') ? Math.round(val) : Math.round(val));
    if (t < 1) requestAnimationFrame(step);
  })(performance.now());
}

/* ===== Mini generadores de gráficos (SVG simple) ===== */
function sparkline(container, points, options={}){
  const w = container.clientWidth || 240;
  const h = container.clientHeight || 120;
  const pad = 8;
  const max = Math.max(...points), min = Math.min(...points);
  const dx = (w - pad*2) / (points.length - 1);
  const scale = v => h - pad - ( (v - min) / (max - min || 1) ) * (h - pad*2);
  let d = "";
  points.forEach((v,i)=>{
    const x = pad + i*dx, y = scale(v);
    d += (i===0?`M${x},${y}`:` L${x},${y}`);
  });
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
      <path d="${d}" fill="none" stroke="url(#g1)" stroke-width="2"/>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stop-color="var(--accent-2)"/>
          <stop offset="100%" stop-color="#4f46e5"/>
        </linearGradient>
      </defs>
    </svg>`;
}

function areaChart(container, points){
  const w = container.clientWidth || 300;
  const h = container.clientHeight || 220;
  const pad = 10;
  const max = Math.max(...points), min = Math.min(...points);
  const dx = (w - pad*2) / (points.length - 1);
  const scale = v => h - pad - ( (v - min) / (max - min || 1) ) * (h - pad*2);
  let d = "", area="";
  points.forEach((v,i)=>{
    const x = pad + i*dx, y = scale(v);
    d += (i===0?`M${x},${y}`:` L${x},${y}`);
  });
  area = `${d} L${w-pad},${h-pad} L${pad},${h-pad} Z`;
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-2)" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="var(--accent-2)" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="la" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--accent-2)"/>
          <stop offset="100%" stop-color="#4f46e5"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#ga)"/>
      <path d="${d}" fill="none" stroke="url(#la)" stroke-width="2"/>
    </svg>`;
}

function barChart(container, series){
  const w = container.clientWidth || 300;
  const h = container.clientHeight || 220;
  const pad = 12;
  const bw = 14, gap = 10;
  const max = Math.max(...series);
  container.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",`0 0 ${w} ${h}`);
  svg.setAttribute("width","100%");
  svg.setAttribute("height","100%");
  svg.innerHTML = `
    <defs>
      <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#0ea5e9"/>
      </linearGradient>
    </defs>`;
  const baseY = h - pad;
  series.forEach((v,i)=>{
    const x = pad + i*(bw+gap);
    const hh = Math.max(4, (v/max)*(h - pad*2));
    const y = baseY - hh;
    const rect = document.createElementNS(svg.namespaceURI,"rect");
    rect.setAttribute("x", x); rect.setAttribute("y", y);
    rect.setAttribute("width", bw); rect.setAttribute("height", 0);
    rect.setAttribute("rx","6"); rect.setAttribute("fill","url(#gb)");
    svg.appendChild(rect);
    // animación simple
    setTimeout(()=>{ rect.setAttribute("height", hh); rect.setAttribute("y", baseY - hh); }, 20 + i*30);
  });
  container.appendChild(svg);
}

/* ===== Inicialización / datos de demo ===== */
function randSeries(n, base=50, spread=20){
  return Array.from({length:n}, (_,i)=> base + Math.round((Math.sin(i/2)+Math.random()-0.5)*spread));
}

function initCards(){
  animateNumber($('#m1'), 1240);
  animateNumber($('#p1'), 51);
  animateNumber($('#p2'), 28);
  sparkline($('#spark1'), randSeries(24, 60, 30));
  sparkline($('#spark2'), randSeries(24, 40, 18));
  sparkline($('#spark3'), randSeries(24, 50, 22));
}

function initPanels(){
  // Línea comparativa (2 series)
  const line = $('#lineChart');
  const a = randSeries(40, 60, 24);
  const b = randSeries(40, 40, 20);
  line.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.width = '100%'; wrap.style.height='100%';
  line.appendChild(wrap);
  // dibujar dos líneas encima
  sparkline(wrap, a);
  // clonar y recolorear segunda serie
  const s = wrap.querySelector('svg').cloneNode(true);
  s.querySelector('linearGradient stop:first-child').setAttribute('stop-color', '#4f46e5');
  s.querySelector('linearGradient stop:last-child').setAttribute('stop-color', '#22d3ee');
  wrap.appendChild(s);

  // Barras
  barChart($('#barChart'), randSeries(16, 50, 40));

  // Area + línea pequeña
  areaChart($('#areaChart'), randSeries(36, 50, 18));
  sparkline($('#lineSmall'), randSeries(36, 45, 14));
}

function bindHeader(){
  // Tabs demo
  $$('.tab').forEach(t=>{
    t.addEventListener('click', ()=>{
      $$('.tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
    });
  });
}

/* ===== Responsive sidebar en móvil (botón “≡” del header) ===== */
(function mobileSidebar(){
  const menuBtn = document.querySelector('.header .icon-btn[title="Menú"]');
  const sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar){
    menuBtn.addEventListener('click', ()=> sidebar.classList.toggle('open'));
  }
})();

/* ===== Boot ===== */
window.addEventListener('load', ()=>{
  animateUsage(72);
  initCards();
  initPanels();
  bindHeader();

  // Recalcular gráficos al redimensionar
  let t;
  window.addEventListener('resize', ()=>{
    clearTimeout(t);
    t = setTimeout(initPanels, 200);
  });
});
