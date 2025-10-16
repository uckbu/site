// Simple interactions: reveal on scroll, nav toggle, set year
document.addEventListener('DOMContentLoaded',()=>{
  // set year
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = String(y);

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  reveals.forEach(r=>io.observe(r));

  // nav toggle for small screens
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
  const closeNav = () => {
    nav?.classList.remove('is-open');
    if(toggle){
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded','false');
    }
    dropdowns.forEach(drop => setDropdownOpen(drop,false));
  };
  if(toggle && nav){
    toggle.addEventListener('click',()=>{
      const open = nav.classList.toggle('is-open');
      toggle.textContent = open ? '✕' : '☰';
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown',(e)=>{
      if(e.key === 'Escape'){
        closeNav();
      }
    });
  }

  nav?.querySelectorAll('a[href]').forEach(link =>{
    link.addEventListener('click',()=>{
      closeNav();
    });
  });

  const mediaFinePointer = window.matchMedia('(pointer:fine)');
  const setDropdownOpen = (drop, open) => {
    drop.dataset.open = open ? 'true' : 'false';
    const trigger = drop.querySelector('.dropdown-toggle');
    if(trigger){
      trigger.setAttribute('aria-expanded', String(open));
    }
  };

  dropdowns.forEach(drop => {
    const trigger = drop.querySelector('.dropdown-toggle');
    const panel = drop.querySelector('.dropdown-panel');
    if(!trigger || !panel){
      return;
    }
    setDropdownOpen(drop,false);

    trigger.addEventListener('click',(event)=>{
      event.stopPropagation();
      const open = drop.dataset.open === 'true';
      setDropdownOpen(drop,!open);
    });

    trigger.addEventListener('keydown',(event)=>{
      if(event.key === 'Escape'){
        setDropdownOpen(drop,false);
        trigger.blur();
      }
    });

    drop.addEventListener('mouseenter',()=>{
      if(mediaFinePointer.matches){
        setDropdownOpen(drop,true);
      }
    });
    drop.addEventListener('mouseleave',()=>{
      if(mediaFinePointer.matches){
        setDropdownOpen(drop,false);
      }
    });
  });

  document.addEventListener('click',(event)=>{
    dropdowns.forEach(drop =>{
      if(!drop.contains(event.target)){
        setDropdownOpen(drop,false);
      }
    });
  });

  // Slideshow functionality
  const initSlideshow = () => {
    const slideshow = document.querySelector('.slideshow-container');
    if (!slideshow) {
      console.log('Slideshow container not found');
      return;
    }

    console.log('Initializing slideshow');
    const slides = slideshow.querySelectorAll('.slide');
    const indicators = slideshow.querySelectorAll('.indicator');
    const prevBtn = slideshow.querySelector('.prev');
    const nextBtn = slideshow.querySelector('.next');

    console.log('Found slides:', slides.length);
    console.log('Found indicators:', indicators.length);

    let currentSlide = 0;

    const showSlide = (index) => {
      // Remove active class from all slides and indicators
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      // Add active class to current slide and indicator
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentSlide = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => showSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Initialize first slide
    showSlide(0);
  };

  initSlideshow();
});