// Three.js 3D Background
let scene, camera, renderer, particles;
let heroScene, heroCamera, heroRenderer, heroGeometry, heroMesh, heroParticles;

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
    if (typeof gsap === 'undefined') return;
    
    // Fade in animations
    gsap.utils.toArray('[data-aos]').forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
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

// Hero 3D Model - Mathematical/Physical Geometry
function initHero3D() {
    const canvas = document.getElementById('hero3d');
    if (!canvas) return;
    
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    
    heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create Torus Knot - Mathematical Geometry (Topology)
    const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x0066ff,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85
    });
    
    heroMesh = new THREE.Mesh(geometry, material);
    heroScene.add(heroMesh);
    
    // Add wireframe for mathematical visualization (shows topology)
    const wireframe = new THREE.WireframeGeometry(geometry);
    const wireframeLine = new THREE.LineSegments(
        wireframe,
        new THREE.LineBasicMaterial({ 
            color: 0x00d4ff, 
            transparent: true, 
            opacity: 0.4,
            linewidth: 2
        })
    );
    heroScene.add(wireframeLine);
    
    // Add mathematical sphere (representing physics - atomic model)
    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0066,
        emissive: 0xff3366,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    heroScene.add(sphere);
    
    // Add orbiting particles (representing physics)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 4 + Math.random() * 2;
        const theta = (i / 3) * (Math.PI * 2 / particleCount);
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff0066,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    heroParticles = new THREE.Points(particleGeometry, particleMaterial);
    heroScene.add(heroParticles);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight1.position.set(5, 5, 5);
    heroScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff0066, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    heroScene.add(pointLight2);
    
    heroCamera.position.z = 8;
    heroCamera.position.y = 2;
    
    animateHero3D();
}

function animateHero3D() {
    requestAnimationFrame(animateHero3D);
    
    const time = Date.now() * 0.001;
    
    if (heroMesh) {
        heroMesh.rotation.x += 0.005;
        heroMesh.rotation.y += 0.01;
        heroMesh.rotation.z += 0.002;
        // Pulsing effect
        heroMesh.scale.setScalar(1 + Math.sin(time) * 0.05);
    }
    
    if (heroParticles) {
        heroParticles.rotation.x += 0.002;
        heroParticles.rotation.y += 0.003;
        // Orbital motion
        heroParticles.rotation.z += 0.001;
    }
    
    // Animate sphere (physics model)
    const sphere = heroScene.children.find(child => child.type === 'Mesh' && child.material.wireframe);
    if (sphere) {
        sphere.rotation.x += 0.003;
        sphere.rotation.y += 0.005;
        sphere.scale.setScalar(1 + Math.cos(time * 1.5) * 0.1);
    }
    
    // Camera subtle movement for depth
    if (heroCamera) {
        heroCamera.position.x = Math.sin(time * 0.5) * 0.5;
        heroCamera.position.y = 2 + Math.cos(time * 0.3) * 0.3;
    }
    
    if (heroRenderer && heroScene && heroCamera) {
        heroRenderer.render(heroScene, heroCamera);
    }
}

// Advanced Parallax Effects
function initParallaxEffects() {
    // Hero text parallax with smooth easing
    gsap.to('.hero-text', {
        y: -100,
        opacity: 0.3,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            ease: 'power2.out'
        }
    });
    
    // 3D Model parallax with rotation
    gsap.to('#hero3d', {
        y: -200,
        scale: 0.8,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            ease: 'power1.inOut'
        }
    });
    
    // Hero labels parallax
    gsap.utils.toArray('.hero-label').forEach((label, index) => {
        gsap.to(label, {
            y: -50 - (index * 10),
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });
    });
    
    // Sections parallax with alternating directions
    gsap.utils.toArray('.section').forEach((section, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        gsap.to(section, {
            y: -80 * direction,
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.5,
                ease: 'power1.inOut'
            }
        });
    });
    
    // Project cards parallax
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            scale: 0.9,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
                ease: 'power2.out'
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
            
            try {
                initHero3D();
            } catch (error) {
                console.warn('Error initializing hero 3D:', error);
            }
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
        
        // Animate hero labels
        setTimeout(() => {
            try {
                animateHeroLabels();
            } catch (error) {
                console.warn('Error animating hero labels:', error);
            }
        }, 1000);
        
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
        
        // Set initial scroll position
        window.scrollTo(0, 0);
        
        // Resize handler for hero 3D
        window.addEventListener('resize', () => {
            if (heroCamera && heroRenderer) {
                const canvas = document.getElementById('hero3d');
                if (canvas) {
                    heroCamera.aspect = canvas.clientWidth / canvas.clientHeight;
                    heroCamera.updateProjectionMatrix();
                    heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
                }
            }
            
            // Also resize background canvas
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

// Animate hero labels on load
function animateHeroLabels() {
    const labels = document.querySelectorAll('.hero-label');
    labels.forEach((label, index) => {
        setTimeout(() => {
            label.classList.add('visible');
        }, index * 200);
    });
}

// Update label positions based on 3D model
function updateLabelPositions() {
    // Labels will be positioned relative to 3D model
    // This creates a connection between the 3D geometry and the labels
    if (heroMesh && heroParticles) {
        // Labels can follow the rotation or position of 3D elements
        // This creates a dynamic, interactive feel
    }
}