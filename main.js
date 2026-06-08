import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// PRELOADER
// ============================================
const preloader = document.getElementById('preloader');
const preloaderCounter = document.getElementById('preloader-counter');
const preloaderBarFill = document.getElementById('preloader-bar-fill');

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 12;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          initAnimations();
        }
      });
    }, 400);
  }
  preloaderCounter.textContent = Math.floor(loadProgress);
  preloaderBarFill.style.width = loadProgress + '%';
}, 80);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .skill-card, .cert-card, .timeline-card, .contact-cta, .hero-icon-item, .project-card, .mockup-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    cursorFollower.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    cursorFollower.classList.remove('cursor-hover');
  });
});

// ============================================
// MOBILE MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Active nav link
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('active');
    }
  });
});

// ============================================
// THREE.JS — 3D ANIMATED REALISTIC CUBE BACKGROUND
// ============================================
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Enable soft shadows for realism
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.set(0, 0, 22);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Primary light source casting shadows
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
directionalLight1.position.set(8, 12, 10);
directionalLight1.castShadow = true;
directionalLight1.shadow.mapSize.width = 2048;
directionalLight1.shadow.mapSize.height = 2048;
directionalLight1.shadow.camera.near = 0.5;
directionalLight1.shadow.camera.far = 40;
directionalLight1.shadow.camera.left = -12;
directionalLight1.shadow.camera.right = 12;
directionalLight1.shadow.camera.top = 12;
directionalLight1.shadow.camera.bottom = -12;
directionalLight1.shadow.bias = -0.0005;
scene.add(directionalLight1);

// Fill light for soft background colors
const directionalLight2 = new THREE.DirectionalLight(0xeacbe9, 0.65);
directionalLight2.position.set(-8, -4, 6);
scene.add(directionalLight2);

// Soft color accent light
const pointLight = new THREE.PointLight(0xb198c6, 0.8, 50);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// Subtle rim light from the back to make boundaries pop
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(-10, 10, -10);
scene.add(rimLight);

// --- Create 3D Realistic Cube Background ---
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

// Golden-brown color palette (warmer bronze, honey, and soft golden brown tones)
const goldColors = [
  new THREE.Color(0xe6b870), // warm amber/gold
  new THREE.Color(0xc69265), // soft bronze brown
  new THREE.Color(0xab7b4c), // warm golden brown
  new THREE.Color(0xe0ab5d), // honey gold
  new THREE.Color(0xf5eccd), // warm champagne gold
];

// Helper to interpolate between gold tones for a smooth 3D spectrum
function getGoldSpectrumColor(x, y, z) {
  const nx = (x + 1) / 2;
  const ny = (y + 1) / 2;
  const nz = (z + 1) / 2;
  
  const c1 = goldColors[0].clone().lerp(goldColors[2], nx);
  const c2 = goldColors[1].clone().lerp(goldColors[3], ny);
  const finalColor = c1.lerp(c2, nz).lerp(goldColors[4], (nx + ny + nz) / 3);
  return finalColor;
}

const gridSize = 3; // 3x3x3 grid
const blockSize = 1.25;
const spacing = 1.65;
const blocks = [];

// Base geometry for block pieces
const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const targetX = x * spacing;
      const targetY = y * spacing;
      const targetZ = z * spacing;
      
      const gridPos = new THREE.Vector3(targetX, targetY, targetZ);
      
      // Calculate dispersion vector (outwards from the center of the cube)
      const disperseDir = gridPos.clone().normalize();
      if (gridPos.lengthSq() < 0.01) {
        disperseDir.set(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
      }
      
      const color = getGoldSpectrumColor(x, y, z);
      const material = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.55,   // Balanced metalness so diffuse color shines under ambient light
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0 // Animates in on load
      });
      
      const block = new THREE.Mesh(geometry, material);
      block.castShadow = true;
      block.receiveShadow = true;
      
      block.userData = {
        gridPos: gridPos,
        disperseDir: disperseDir,
        // Start scattered in space with random rotation
        scatterPos: new THREE.Vector3(
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 25
        ),
        scatterRot: new THREE.Vector3(
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 4
        ),
        tumbleSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 2.5
        )
      };
      
      block.position.copy(block.userData.scatterPos);
      block.rotation.setFromVector3(block.userData.scatterRot);
      
      cubeGroup.add(block);
      blocks.push(block);
    }
  }
}

cubeGroup.scale.set(0.9, 0.9, 0.9);

// Shift cube to the right on desktop layouts, center on mobile
function updateCubePosition() {
  if (window.innerWidth < 900) {
    cubeGroup.position.set(0, 0, 0);
  } else {
    cubeGroup.position.set(3.5, 0, 0); // Move cube to the right
  }
}
updateCubePosition();

// Floating background particles (dot grid)
const particlesCount = 180;
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particlesCount * 3);
const particleSizes = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 45;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  particleSizes[i] = Math.random() * 2 + 0.5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xc0b0a0,
  size: 0.08,
  transparent: true,
  opacity: 0.35,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Mouse interaction target rotations
let targetRotationX = 0;
let targetRotationY = 0;

document.addEventListener('mousemove', (e) => {
  targetRotationY = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
  targetRotationX = ((e.clientY / window.innerHeight) - 0.5) * 0.3;
});

// Scroll position tracking
let scrollProgress = 0;
window.addEventListener('scroll', () => {
  scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
});

// Intro animation state (tweened on load)
let introProgress = { value: 0 };

// Animation loop
const timer = new THREE.Timer();

function animate(timestamp) {
  requestAnimationFrame(animate);
  timer.update(timestamp);
  const elapsed = timer.getElapsed();
  const intro = introProgress.value;

  // Slowly rotate the entire cube group in the background + hover tilt
  cubeGroup.rotation.y = elapsed * 0.12 + targetRotationY * 0.4;
  cubeGroup.rotation.x = elapsed * 0.06 + targetRotationX * 0.3;

  // Scroll dispersion amount
  const scrollSpread = scrollProgress * 20.0;

  // Update position, rotation and opacity of each block
  blocks.forEach((block) => {
    const ud = block.userData;
    
    // Position: LERP from scattered start to cube grid, then offset by scroll dispersal
    const currentPos = new THREE.Vector3().lerpVectors(ud.scatterPos, ud.gridPos, intro);
    const scrollOffset = ud.disperseDir.clone().multiplyScalar(scrollSpread);
    block.position.copy(currentPos).add(scrollOffset);
    
    // Rotation: LERP from scattered start to 0, then tumble on scroll
    const currentRot = new THREE.Vector3().lerpVectors(
      ud.scatterRot,
      new THREE.Vector3(0, 0, 0),
      intro
    );
    const tumble = ud.tumbleSpeed.clone().multiplyScalar(scrollProgress * 2.0);
    block.rotation.set(
      currentRot.x + tumble.x,
      currentRot.y + tumble.y,
      currentRot.z + tumble.z
    );
    
    // Opacity: fade in during intro, fade out completely on scroll
    const scrollFade = Math.max(0, 1.0 - scrollProgress * 1.5);
    block.material.opacity = intro * scrollFade;
  });

  // Background particles drift
  particles.rotation.y = elapsed * 0.02;
  particles.rotation.x = Math.sin(elapsed * 0.01) * 0.05;

  // Scroll-based canvas visibility (completely hidden at deep scroll)
  const heroEnd = 0.65;
  if (scrollProgress < heroEnd) {
    canvas.style.opacity = 1;
  } else if (scrollProgress < heroEnd + 0.1) {
    canvas.style.opacity = 1 - ((scrollProgress - heroEnd) / 0.1);
  } else {
    canvas.style.opacity = 0;
  }

  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCubePosition();
});

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
function initAnimations() {
  // Animate the 3D cube assembly on load
  gsap.to(introProgress, {
    value: 1,
    duration: 2.2,
    ease: 'power3.out',
    delay: 0.1
  });

  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el, index) => {
    gsap.fromTo(el, 
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        delay: index % 3 * 0.1,
      }
    );
  });

  // Hero heading stagger
  gsap.fromTo('.hero-heading', 
    { y: 80, opacity: 0, skewY: 3 },
    { 
      y: 0, opacity: 1, skewY: 0, 
      duration: 1.2, 
      ease: 'power4.out',
      delay: 0.2
    }
  );

  gsap.fromTo('.hero-badge',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
  );

  gsap.fromTo('.hero-right',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.7 }
  );

  gsap.fromTo('.scroll-indicator',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1 }
  );

  // Section headings parallax
  gsap.utils.toArray('.section-heading').forEach(heading => {
    gsap.fromTo(heading,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // Stats counter animation
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            stat.textContent = Math.floor(this.targets()[0].innerHTML || 0);
          }
        });
        // Simple counter
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = Math.floor(current);
        }, 30);
      },
      once: true
    });
  });

  // Skill cards stagger and horizontal spread out
  gsap.fromTo('.skill-card', 
    { 
      y: 60, 
      opacity: 0, 
      rotateX: 10,
      x: (index) => {
        const col = index % 3; // 3 columns
        if (col === 0) return -35; // left column slides out from left
        if (col === 2) return 35;  // right column slides out from right
        return 0;                 // middle column slides straight up
      }
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      x: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 88%',
        end: 'top 65%',
        scrub: 1.5,
      }
    }
  );

  // Experience mockup 3D animation
  gsap.fromTo('.experience-mockup',
    { 
      rotateX: 20, 
      rotateY: -15, 
      scale: 0.8, 
      opacity: 0 
    },
    {
      rotateX: 12,
      rotateY: -8,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.experience-mockup',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Timeline items stagger
  gsap.fromTo('.timeline-item',
    { x: -60, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Project cards stagger and spread out with smooth scrub
  gsap.fromTo('.project-card',
    { 
      y: 50, 
      opacity: 0, 
      scale: 0.95,
      x: (index) => {
        const col = index % 2; // 2 columns
        return col === 0 ? -35 : 35; // spread left and right
      }
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.project-grid',
        start: 'top 88%',
        end: 'top 65%',
        scrub: 1.5,
      }
    }
  );

  // Certification, Awards, and Education cards stagger and spread out with smooth scrub
  gsap.fromTo('.cert-card',
    { 
      y: 50, 
      opacity: 0, 
      scale: 0.95,
      x: (index) => {
        const col = index % 3; // 3 columns
        if (col === 0) return -35;
        if (col === 2) return 35;
        return 0;
      }
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cert-grid',
        start: 'top 88%',
        end: 'top 65%',
        scrub: 1.5,
      }
    }
  );

  // Contact section
  gsap.fromTo('.contact-cta',
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Mockup cards stagger and spread out from center with smooth scrub
  gsap.fromTo('.mockup-card',
    { 
      y: 30, 
      opacity: 0, 
      scale: 0.9,
      x: (index) => {
        const col = index % 3; // 3 columns
        if (col === 0) return -25;
        if (col === 2) return 25;
        return 0;
      }
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.experience-mockup',
        start: 'top 88%',
        end: 'top 65%',
        scrub: 1.5,
      }
    }
  );
}

// ============================================
// 3D TILT EFFECT ON SKILL CARDS
// ============================================
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// CERTIFICATIONS & EDUCATION DETAIL MODAL LOGIC
// ============================================
const detailModal = document.getElementById('detail-modal');
const modalOverlay = document.getElementById('detail-modal-overlay');
const modalCloseBtn = document.getElementById('detail-modal-close');
const modalBodies = document.querySelectorAll('.modal-body');

function openModal(modalId, skillId = null) {
  if (!detailModal) return;
  
  // Deactivate all modal bodies
  modalBodies.forEach(body => {
    body.classList.remove('active');
    // Reset all sections visibility
    body.querySelectorAll('.modal-section[data-skill]').forEach(section => {
      section.style.display = '';
    });
    // Reset badge
    const badge = body.querySelector('.modal-badge');
    if (badge) {
      const contentId = body.getAttribute('data-content');
      if (contentId === 'languages' || contentId === 'devops' || contentId === 'cloud') {
        badge.textContent = 'SKILLS DEEP DIVE';
      }
    }
  });

  // Activate specific modal body
  const targetBody = document.querySelector(`.modal-body[data-content="${modalId}"]`);
  if (targetBody) {
    targetBody.classList.add('active');

    // Filter by skillId if provided
    if (skillId) {
      targetBody.querySelectorAll('.modal-section[data-skill]').forEach(section => {
        if (section.getAttribute('data-skill') === skillId) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
      // Change badge text to show single skill detail
      const badge = targetBody.querySelector('.modal-badge');
      if (badge) {
        badge.textContent = 'SKILL DETAIL';
      }
    }
  }

  // Open modal container
  detailModal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!detailModal) return;
  detailModal.classList.remove('active');
  document.body.classList.remove('modal-open');

  // Reset display after transition closes
  setTimeout(() => {
    modalBodies.forEach(body => {
      body.querySelectorAll('.modal-section[data-skill]').forEach(section => {
        section.style.display = '';
      });
      const badge = body.querySelector('.modal-badge');
      if (badge) {
        const contentId = body.getAttribute('data-content');
        if (contentId === 'languages' || contentId === 'devops' || contentId === 'cloud') {
          badge.textContent = 'SKILLS DEEP DIVE';
        }
      }
    });
  }, 400);
}

// Add event listeners to cert/edu/skill/project cards
document.querySelectorAll('.cert-card[data-modal], .skill-card[data-modal], .project-card[data-modal]').forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal');
    openModal(modalId);
  });
});

// Add event listeners to individual skill tags
document.querySelectorAll('.skill-tag[data-skill]').forEach(tag => {
  tag.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent opening the entire card modal
    const skillId = tag.getAttribute('data-skill');
    const skillCard = tag.closest('.skill-card');
    if (skillCard) {
      const modalId = skillCard.getAttribute('data-modal');
      openModal(modalId, skillId);
    }
  });
});

// Event listeners to close modal
if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ============================================
// EXPERIENCE DASHBOARD CARD DROPDOWNS
// ============================================
document.querySelectorAll('.mockup-card').forEach(card => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    
    // Collapse all cards first for accordion behavior
    document.querySelectorAll('.mockup-card').forEach(c => {
      c.classList.remove('active');
    });

    // If card was not active, open it
    if (!isActive) {
      card.classList.add('active');
    }
  });
});
