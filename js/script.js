// Three.js 3D Background
let scene, camera, renderer, particles;

// Black Hole Component
class BlackHole extends HTMLElement {
  /**
   * Init
   */
  connectedCallback() {
    // Elements
    this.canvas = this.querySelector(".js-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Init
    this.setSizes();
    this.bindEvents();

    // RAF
    requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Bind events
   */
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  /**
   * Resize handler
   */
  onResize() {
    this.setSizes();
  }

  /**
   * Set sizes
   */
  setSizes() {
    this.setCanvasSize();
    this.setGraphics();
  }
  
  /**
   * Set canvas size
   */
  setCanvasSize() {
    const rect = this.getBoundingClientRect();

    this.render = {
      width: rect.width,
      hWidth: rect.width * 0.5,
      height: rect.height,
      hHeight: rect.height * 0.5,
      dpi: window.devicePixelRatio || 1
    };

    this.canvas.width = this.render.width * this.render.dpi;
    this.canvas.height = this.render.height * this.render.dpi;
  }

  /**
   * Set graphics
   */
  setGraphics() {
    this.setDiscs();
    this.setDots();
  }

  /**
   * Set discs
   */
  setDiscs() {
    this.discs = [];

    this.startDisc = {
      x: this.render.width * 0.5,
      y: this.render.height * 0,
      w: this.render.width * 1,
      h: this.render.height * 1
    };

    const totalDiscs = 150;

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = this.tweenDisc({ p });
      this.discs.push(disc);
    }
  }

  /**
   * Set dots
   */
  setDots() {
    this.dots = [];
    const totalDots = 20000;

    for (let i = 0; i < totalDots; i++) {
      const disc = this.discs[Math.floor(this.discs.length * Math.random())];
      const dot = {
        d: disc,
        a: 0,
        c: `rgb(${Math.random() * 0}, ${150 + Math.random() * 50}, ${150 + Math.random() * 105})`,
        p: Math.random(),
        o: Math.random()
      };
      this.dots.push(dot);
    }
  }

  /**
   * Tween disc
   */
  tweenDisc(disc) {
    const { startDisc } = this;

    const scaleX = this.tweenValue(1, 0, disc.p, 'outCubic');
    const scaleY = this.tweenValue(1, 0, disc.p, 'outExpo');

    disc.sx = scaleX;
    disc.sy = scaleY;
    disc.w = startDisc.w * scaleX;
    disc.h = startDisc.h * scaleY;
    disc.x = startDisc.x;
    disc.y = startDisc.y + disc.p * startDisc.h * 1;

    return disc;
  }

  /**
   * Tween value
   */
  tweenValue(start, end, p, ease = false) {
    const delta = end - start;
    let easeFn;

    if (ease === 'outCubic') {
      easeFn = (t) => 1 - Math.pow(1 - t, 3);
    } else if (ease === 'outExpo') {
      easeFn = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    } else if (ease === 'inExpo') {
      easeFn = (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    } else {
      easeFn = (t) => t;
    }

    return start + delta * easeFn(p);
  }
  
  /**
   * Draw discs
   */
  drawDiscs() {
    const { ctx } = this;

    ctx.strokeStyle = '#0329';
    ctx.lineWidth = 1;

    // Discs
    this.discs.forEach((disc) => {
      const p = disc.sx * disc.sy;

      ctx.beginPath();
      ctx.globalAlpha = disc.a;

      ctx.ellipse(
        disc.x,
        disc.y + disc.h,
        disc.w,
        disc.h,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.closePath();
    });
  }

  /**
   * Draw dots
   */
  drawDots() {
    const { ctx } = this;

    this.dots.forEach((dot) => {
      const { d, a, p, c, o } = dot;
      
      const _p = d.sx * d.sy;
      ctx.fillStyle = c;

      const newA = a + (Math.PI * 2 * p);
      const x = d.x + Math.cos(newA) * d.w;
      const y = d.y + Math.sin(newA) * d.h;

      ctx.globalAlpha = d.a * o;

      ctx.beginPath();
      ctx.arc(x, y + d.h, 1 + _p * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  }

  /**
   * Move discs
   */
  moveDiscs() {
    this.discs.forEach((disc) => {
      disc.p = (disc.p + 0.0003) % 1;
      
      this.tweenDisc(disc);
      
      const p = disc.sx * disc.sy;

      let a = 1;
      if (p < 0.01) {
        a = Math.pow(Math.min(p / 0.01, 1), 3);
      } else if (p > 0.2) {
        a = 1 - Math.min((p - 0.2) / 0.8, 1);
      }
      
      disc.a = a;
    });
  }

  /**
   * Move dots
   */
  moveDots() {
    this.dots.forEach((dot) => {
      const v = this.tweenValue(0, 0.001, 1 - dot.d.sx * dot.d.sy, 'inExpo');
      dot.p = (dot.p + v) % 1;
    });
  }
  
  /**
   * Tick
   */
  tick(time) {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.scale(this.render.dpi, this.render.dpi);

    // Move
    this.moveDiscs();
    this.moveDots();

    // Draw
    this.drawDiscs();
    this.drawDots();

    ctx.restore();

    requestAnimationFrame(this.tick.bind(this));
  }
}

// Register custom element
if (!customElements.get('black-hole')) {
  customElements.define("black-hole", BlackHole);
}

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('canvas3d'),
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x00d4ff);
    const color2 = new THREE.Color(0x0066ff);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;
        
        const color = Math.random() > 0.5 ? color1 : color2;
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 1000;
    
    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// GSAP Scroll Animations - Will be initialized after libraries load
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Fade in animations (but keep elements visible after animation)
    gsap.utils.toArray('[data-aos]').forEach((element) => {
        // Ensure element starts visible
        gsap.set(element, { opacity: 1, y: 0, visibility: 'visible' });
        
        // Entrance animation
        gsap.from(element, {
            opacity: 0.3,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(element, { opacity: 1, y: 0, visibility: 'visible' });
                }
            }
        });
    });

    // Skill bars animation (if they exist)
    gsap.utils.toArray('.skill-progress').forEach((bar) => {
        const width = bar.getAttribute('data-width');
        if (width) {
            gsap.to(bar, {
                width: width + '%',
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });
}

// Stats counter animation removed - replaced with expertise tags

// Typing effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Navigation
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would typically send the form data to a server
        alert('Mensagem enviada! Entrarei em contato em breve.');
        contactForm.reset();
    });
}

// Keypad Contact Form
function initKeypadForm() {
    const keypad = document.querySelector('.keypad');
    const contactFormKeypad = document.getElementById('contactFormKeypad');
    const keyOne = document.getElementById('key-one');
    const keyTwo = document.getElementById('key-two');
    const keyThree = document.getElementById('key-three');
    
    if (!keypad || !contactFormKeypad) return;
    
    // Keypad configuration
    const keyConfig = {
        one: {
            travel: 26,
            text: 'ok',
            key: 'o',
            hue: 114,
            saturation: 1.4,
            brightness: 1.2,
        },
        two: {
            travel: 26,
            text: 'go',
            key: 'g',
            hue: 0,
            saturation: 0,
            brightness: 1.4,
        },
        three: {
            travel: 18,
            text: 'enviar.',
            key: 'Enter',
            hue: 0,
            saturation: 0,
            brightness: 0.4,
        },
    };
    
    // Click audio (optional)
    const clickAudio = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3');
    clickAudio.muted = true; // Muted by default
    
    // Setup keys
    function setupKey(keyElement, config, id) {
        if (!keyElement) return;
        
        const textElement = keyElement.querySelector('.key__text');
        if (textElement) {
            textElement.innerText = config.text;
        }
        
        keyElement.style.setProperty('--travel', config.travel);
        keyElement.style.setProperty('--saturate', config.saturation);
        keyElement.style.setProperty('--hue', config.hue);
        keyElement.style.setProperty('--brightness', config.brightness);
        
        keyElement.addEventListener('pointerdown', () => {
            keyElement.dataset.pressed = 'true';
            if (!clickAudio.muted) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(() => {});
            }
        });
        
        keyElement.addEventListener('pointerup', () => {
            keyElement.dataset.pressed = 'false';
        });
        
        keyElement.addEventListener('pointerleave', () => {
            keyElement.dataset.pressed = 'false';
        });
    }
    
    // Setup all keys
    if (keyOne) setupKey(keyOne, keyConfig.one, 'one');
    if (keyTwo) setupKey(keyTwo, keyConfig.two, 'two');
    if (keyThree) setupKey(keyThree, keyConfig.three, 'three');
    
    // Handle keyboard shortcuts
    window.addEventListener('keydown', (event) => {
        if (event.key === 'o' && keyOne) {
            keyOne.dataset.pressed = 'true';
            if (!clickAudio.muted) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(() => {});
            }
        }
        if (event.key === 'g' && keyTwo) {
            keyTwo.dataset.pressed = 'true';
            if (!clickAudio.muted) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(() => {});
            }
        }
        if (event.key === 'Enter' && keyThree) {
            keyThree.dataset.pressed = 'true';
            if (!clickAudio.muted) {
                clickAudio.currentTime = 0;
                clickAudio.play().catch(() => {});
            }
        }
    });
    
    window.addEventListener('keyup', (event) => {
        if (event.key === 'o' && keyOne) keyOne.dataset.pressed = 'false';
        if (event.key === 'g' && keyTwo) keyTwo.dataset.pressed = 'false';
        if (event.key === 'Enter' && keyThree) keyThree.dataset.pressed = 'false';
    });
    
    // Form submission
    if (contactFormKeypad) {
        contactFormKeypad.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactFormKeypad);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Here you would typically send the form data to a server
            // For now, we'll show a success message
            alert(`Obrigado, ${name}! Sua mensagem foi enviada. Entrarei em contato em breve.`);
            contactFormKeypad.reset();
            
            // Trigger key three animation
            if (keyThree) {
                keyThree.dataset.pressed = 'true';
                setTimeout(() => {
                    keyThree.dataset.pressed = 'false';
                }, 200);
            }
        });
    }
    
    // Show keypad with animation
    setTimeout(() => {
        if (keypad) {
            keypad.style.setProperty('opacity', '1');
            keypad.setAttribute('data-visible', 'true');
        }
    }, 500);
}

// Interactive Cards Pointer Tracking
function initInteractiveCardsTracking() {
    const contactCards = document.querySelectorAll('.contact-card');
    const projectCards = document.querySelectorAll('.project-card-new');
    
    // Set default CSS variables
    document.documentElement.style.setProperty('--icon-saturate', '5');
    document.documentElement.style.setProperty('--icon-brightness', '1.3');
    document.documentElement.style.setProperty('--icon-scale', '3.4');
    document.documentElement.style.setProperty('--icon-opacity', '0.25');
    document.documentElement.style.setProperty('--border-width', '3');
    document.documentElement.style.setProperty('--border-blur', '0');
    document.documentElement.style.setProperty('--border-saturate', '4.2');
    document.documentElement.style.setProperty('--border-brightness', '2.5');
    document.documentElement.style.setProperty('--border-contrast', '2.5');
    
    // Update blur filters
    const blurFilter = document.querySelector('filter#blur feGaussianBlur');
    if (blurFilter) {
        blurFilter.setAttribute('stdDeviation', '20');
    }
    
    const blurFilterProjects = document.querySelector('filter#blur-projects feGaussianBlur');
    if (blurFilterProjects) {
        blurFilterProjects.setAttribute('stdDeviation', '20');
    }
    
    // Function to update card pointer position
    function updateCardPosition(card, event) {
        const rect = card.getBoundingClientRect();
        
        // Calculate center point of the card
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate pointer position relative to center
        const relativeX = event.clientX - centerX;
        const relativeY = event.clientY - centerY;
        
        // Normalize to -1 to 1 range (at card edges)
        const x = relativeX / (rect.width / 2);
        const y = relativeY / (rect.height / 2);
        
        // Update CSS custom properties for each card
        card.style.setProperty('--pointer-x', x.toFixed(3));
        card.style.setProperty('--pointer-y', y.toFixed(3));
    }
    
    // Function to reset card position
    function resetCardPosition(card) {
        card.style.setProperty('--pointer-x', '-10');
        card.style.setProperty('--pointer-y', '-10');
    }
    
    // Track pointer for contact cards
    document.addEventListener('pointermove', (event) => {
        contactCards.forEach((card) => {
            updateCardPosition(card, event);
        });
        
        projectCards.forEach((card) => {
            updateCardPosition(card, event);
        });
    });
    
    // Reset position when pointer leaves
    document.addEventListener('pointerleave', () => {
        contactCards.forEach((card) => {
            resetCardPosition(card);
        });
        
        projectCards.forEach((card) => {
            resetCardPosition(card);
        });
    });
}

// Hero 3D Model - Removed (replaced by Black Hole animation)

// Advanced Parallax Effects
function initParallaxEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Hero text parallax with smooth easing (only movement, no opacity change)
    gsap.to('.hero-text', {
        y: -50,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            ease: 'power2.out'
        }
    });
    
    // Hero section parallax (removed hero3d reference)
    
    // Hero labels parallax (only movement, keep visible)
    gsap.utils.toArray('.hero-label').forEach((label, index) => {
        gsap.to(label, {
            y: -30 - (index * 5),
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });
    });
    
    // Sections parallax with alternating directions (only movement, keep visible)
    gsap.utils.toArray('.section').forEach((section, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        gsap.to(section, {
            y: -30 * direction,
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.5,
                ease: 'power1.inOut'
            }
        });
    });
    
    // Project cards parallax (only entrance animation, keep visible after)
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        // Set initial state
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
        
        // Entrance animation
        gsap.from(card, {
            y: 50,
            opacity: 0.5,
            scale: 0.95,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 70%',
                scrub: 1,
                ease: 'power2.out',
                onEnter: () => {
                    gsap.set(card, { opacity: 1, y: 0, scale: 1 });
                }
            }
        });
    });
    
    // Smooth scroll enhancement
    if (window.innerWidth > 768) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Wait for all libraries to load (with shorter timeout for faster fallback)
function waitForLibraries() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 40; // 2 seconds max wait - faster fallback
        
        const checkLibraries = () => {
            attempts++;
            if (typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
                resolve();
            } else if (attempts < maxAttempts) {
                setTimeout(checkLibraries, 50);
            } else {
                console.warn('Libraries did not load in time, continuing anyway...');
                // Force visibility of all sections
                document.querySelectorAll('.section, .skills-section, .projects-section, .about-timeline, [data-aos]').forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.display = 'block';
                    el.style.transform = 'translateY(0)';
                });
                resolve(); // Continue even if libraries didn't load
            }
        };
        checkLibraries();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for libraries to load
        await waitForLibraries();
        
        // Register GSAP plugin
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Initialize 3D background
        if (typeof THREE !== 'undefined') {
            try {
                init3D();
            } catch (error) {
                console.warn('Error initializing 3D background:', error);
            }
            
            // Hero 3D removed - using Black Hole animation instead
        }
        
        // Initialize parallax and GSAP animations
        if (typeof gsap !== 'undefined') {
            try {
                initParallaxEffects();
                initGSAPAnimations();
            } catch (error) {
                console.warn('Error initializing parallax/animations:', error);
            }
        }
        
        // Hero labels removed - using Black Hole animation instead
        
        // Start typing effect
        const typingElement = document.getElementById('typingText');
        if (typingElement) {
            setTimeout(() => {
                try {
                    typeWriter(typingElement, 'Lucas Lopes', 150);
                } catch (error) {
                    console.warn('Error in typing effect:', error);
                }
            }, 500);
        }
        
        // Initialize interactive cards tracking
        try {
            initInteractiveCardsTracking();
        } catch (error) {
            console.warn('Error initializing interactive cards tracking:', error);
        }
        
        // Initialize keypad form
        try {
            initKeypadForm();
        } catch (error) {
            console.warn('Error initializing keypad form:', error);
        }
        
        // Set initial scroll position
        window.scrollTo(0, 0);
        
        // Resize handler for background canvas
        window.addEventListener('resize', () => {
            // Resize background canvas
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Hero labels removed - using Black Hole animation instead