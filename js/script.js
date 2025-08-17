 // Funcionalidad interactiva
        function showMessage(message) {
            // Crear un toast notification
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                color: black;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 1000;
                font-size: 14px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // Animar entrada
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            // Remover después de 3 segundos
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        // Efecto de parallax sutil
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const phone = document.querySelector('.phone-mockup');
            const nowPlaying = document.querySelector('.now-playing');
            const socialPost = document.querySelector('.social-post');
            
            if (phone) {
                phone.style.transform = `
                    perspective(1000px) 
                    rotateY(${-15 + mouseX * 5}deg) 
                    rotateX(${5 - mouseY * 3}deg)
                `;
            }
        });

        // Simular progreso de la barra de música
        setInterval(() => {
            const progress = document.querySelector('.progress');
            if (progress) {
                let width = parseInt(progress.style.width) || 60;
                width += 0.5;
                if (width > 100) width = 0;
                progress.style.width = width + '%';
            }
        }, 200);

        // Añadir efectos de hover mejorados
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Autoplay control por visibilidad de la sección
(function () {
  const section = document.getElementById('pay-section');
  if (!section) return;
  const video = section.querySelector('.pay-video');
  if (!video) return;

  // iOS requiere muted + playsinline (ya están en el HTML)
  // Forzamos intento de play al cargar
  const tryPlay = () => video.play().catch(() => {/* silenciar errores de autoplay */});
  document.addEventListener('visibilitychange', tryPlay, { once: true });
  window.addEventListener('load', tryPlay);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  io.observe(section);
})();

(function () {
  const section = document.getElementById('pay-section-left');
  if (!section) return;
  const video = section.querySelector('.pay-video');
  if (!video) return;

  const tryPlay = () => video.play().catch(() => {});
  document.addEventListener('visibilitychange', tryPlay, { once: true });
  window.addEventListener('load', tryPlay);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  io.observe(section);
})();

/* Loop perfecto: duplica automáticamente el contenido de cada track.
   Resultado: el ancho total = 200% y la animación recorre exactamente el 50%. */
(function () {
  const tracks = document.querySelectorAll('.marquee__track');
  tracks.forEach(track => {
    // Evitar duplicaciones si el script se ejecuta más de una vez
    if (track.dataset.cloned === 'true') return;

    const items = Array.from(track.children);
    items.forEach(el => track.appendChild(el.cloneNode(true)));

    // Marcar como clonado
    track.dataset.cloned = 'true';

    // Forzar reflow para que la animación arranque ya con el nuevo ancho
    // (previene un micro-salto en algunos navegadores)
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight; 
  });
})();

/* ===== FAQ: acordeón en móvil y toggle accesible ===== */
(function(){
  const heads = document.querySelectorAll('.faq-head');
  heads.forEach(head => {
    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      // En desktop mantenemos abierto; en móvil sí colapsa
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      head.setAttribute('aria-expanded', isMobile ? (!expanded).toString() : 'true');
      const body = head.nextElementSibling;
      if (isMobile){
        body.style.display = expanded ? 'none' : 'block';
      } else {
        body.style.display = 'block';
      }
    });
    // Estado inicial
    const body = head.nextElementSibling;
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    head.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
    body.style.display = isMobile ? 'none' : 'block';
  });
})();

/* ===== Footer: selector de idioma (mock) ===== */
(function(){
  const btn = document.querySelector('.lang-btn');
  const menu = document.querySelector('.lang-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', (!open).toString());
    menu.hidden = open;
    // Posicionar menucito junto al botón
    const rect = btn.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top  = `${rect.bottom + window.scrollY}px`;
  });

  document.addEventListener('click', () => {
    btn.setAttribute('aria-expanded','false');
    menu.hidden = true;
  });
})();

<script>
document.addEventListener("DOMContentLoaded", () = {
  document.querySelectorAll('.ticker__track').forEach(track => {
    if (track.dataset.cloned) return; // evitar duplicar más de una vez
    const items = Array.from(track.children);
    items.forEach(el => track.appendChild(el.cloneNode(true)));
    track.dataset.cloned = "true";
  })
});
</script>