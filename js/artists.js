
  // ---- formateo de números ----
  const smfFmt = {
    int: v => Number(Math.round(v)).toLocaleString(),
    money: v => '$' + Number(Math.round(v)).toLocaleString(),
    fixed4: v => Number(v).toFixed(4)
  };

  // ---- animación count-up al entrar en viewport ----
  const smfCounters = document.querySelectorAll('.smf-counter');

  function smfAnimate(el){
    const target = parseFloat(el.dataset.value);
    const format = el.dataset.format || 'int';
    const duration = 1400;
    const start = performance.now();

    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = target * eased;
      el.textContent = smfFmt[format] ? smfFmt[format](current) : current.toFixed(0);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const smfIO = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        smfAnimate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .4 });

  smfCounters.forEach(c => smfIO.observe(c));

  //Artist main 
   function showPlaybooks() {
            alert('Playbooks feature coming soon! This will show artist guidance and best practices.');
        }

        function getStarted() {
            alert('Welcome to Kool! This would normally redirect to the chat.');
        }

        function connectSMS() {
            alert('SMS marketing tool activated! Connect directly with your fans via text.');
        }

        function connectEmail() {
            alert('Email campaigns ready! Build your fan base with targeted email marketing.');
        }

        // Add some interactive hover effects
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.dashboard-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Animate stats on load
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const finalValue = stat.textContent;
                if (finalValue.includes('$')) {
                    animateNumber(stat, finalValue);
                }
            });
        });

        function animateNumber(element, finalValue) {
            const numericValue = parseInt(finalValue.replace(/[$,]/g, ''));
            const prefix = finalValue.includes('$') ? '$' : '';
            const duration = 2000;
            const steps = 60;
            const increment = numericValue / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    element.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    element.textContent = prefix + Math.floor(current).toLocaleString();
                }
            }, duration / steps);
        }

        // Add smooth scrolling animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        // Apply animation to dashboard cards
        setTimeout(() => {
            document.querySelectorAll('.dashboard-card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);

        // New Center Elements

         // Interactive functionality
        function getStarted() {
            alert('¡Bienvenido a EVEN! Aquí comenzarías el proceso de registro para artistas.');
        }

        function showPlaybooks() {
            alert('Los Playbooks te mostrarían guías y estrategias para maximizar tus ingresos como artista.');
        }

        // Add mouse following effect
        document.addEventListener('mousemove', (e) => {
            const dots = document.querySelectorAll('.interactive-dot');
            dots.forEach((dot, index) => {
                const delay = index * 50;
                setTimeout(() => {
                    const x = (e.clientX / window.innerWidth) * 100;
                    const y = (e.clientY / window.innerHeight) * 100;
                    dot.style.transform = `translate(${x/10}px, ${y/10}px)`;
                }, delay);
            });
        });

        // Add click effect to cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform += ' scale(1.02)';
                setTimeout(() => {
                    card.style.transform = card.style.transform.replace(' scale(1.02)', '');
                }, 200);
            });
        });

        // Smooth scroll animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.bg-element');
            
            parallax.forEach((element, index) => {
                const speed = (index + 1) * 0.2;
                element.style.transform += `translateY(${scrolled * speed}px)`;
            });
        });

        // Auto-animate stats
        function animateStats() {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const finalValue = stat.textContent;
                const isMonetary = finalValue.includes('$');
                const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                
                let currentValue = 0;
                const increment = numericValue / 100;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }
                    
                    if (isMonetary) {
                        stat.textContent = '$' + Math.floor(currentValue).toLocaleString();
                    } else {
                        stat.textContent = '$' + Math.floor(currentValue);
                    }
                }, 20);
            });
        }

        // Start animations when page loads
        window.addEventListener('load', () => {
            setTimeout(animateStats, 1000);
        });