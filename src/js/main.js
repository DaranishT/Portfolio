import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initContactForm } from './contact-form.js';
// Initialize Three.js scene
const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Initialize raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create starfield
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8
});

const starVertices = [];
for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lighting
const ambientLight = new THREE.AmbientLight(0xff9e40, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff7d00, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Main wireframe sphere
const geometry = new THREE.SphereGeometry(3, 32, 32);
const material = new THREE.MeshPhongMaterial({ 
    color: 0xff7d00,
    wireframe: true,
    wireframeLinewidth: 2,
    transparent: true,
    opacity: 0.7,
    emissive: 0xff7d00,
    emissiveIntensity: 0.3
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Project data
const projects = [
    {
        id: "3d-portfolio",
        title: "3D_PORTFOLIO",
        description: "Interactive portfolio with Three.js and custom shaders",
        link: "project-details.html?project=3d-portfolio",
        texture: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=500&auto=format&fit=crop",
        color: 0xff7d00
    },
    {
        id: "web-application",
        title: "WEB_APPLICATION",
        description: "Modern web app with React and WebGL",
        link: "project-details.html?project=web-application",
        texture: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop",
        color: 0xff5e00
    },
    {
        id: "vr-experience",
        title: "VR_EXPERIENCE",
        description: "Immersive virtual reality environment",
        link: "project-details.html?project=vr-experience",
        texture: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop",
        color: 0x00a2ff
    }
];

// Create orbiting project spheres
const orbs = [];
const orbCount = projects.length;
const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const textureLoader = new THREE.TextureLoader();

projects.forEach((project, i) => {
    const angle = (i / orbCount) * Math.PI * 2;
    const distance = 5;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    const texture = textureLoader.load(project.texture);
    const orbMaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
        specular: 0x111111,
        shininess: 30,
        emissive: project.color,
        emissiveIntensity: 0.3
    });
    
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(x, y, z);
    orb.userData = {
        ...project,
        originalScale: 1,
        angle: angle,
        speed: 0.003 + Math.random() * 0.003  // Reduced speed
    };
    orbs.push(orb);
    scene.add(orb);
});

// Position camera
camera.position.z = 15;

// DOM elements
const projectInfo = document.getElementById('project-info');
const projectTitle = document.getElementById('project-title');
const projectDesc = document.getElementById('project-description');
const projectLink = document.getElementById('project-link');

// Interaction variables
let hoveredOrb = null;
let selectedOrb = null;
let isMouseOverCanvas = false;
let isScrollLocked = false;
let scrollSpeed = 0;
let targetSpeed = 0.003;  // Reduced speed

// Mouse events
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(orbs);
    
    // Reset previously hovered orb
    if (hoveredOrb && hoveredOrb !== selectedOrb) {
        hoveredOrb.scale.set(
            hoveredOrb.userData.originalScale,
            hoveredOrb.userData.originalScale,
            hoveredOrb.userData.originalScale
        );
        hoveredOrb = null;
    }
    
    if (intersects.length > 0 && !selectedOrb) {
        hoveredOrb = intersects[0].object;
        hoveredOrb.scale.set(1.2, 1.2, 1.2);
        
        // Update project info
        const project = hoveredOrb.userData;
        projectTitle.textContent = project.title;
        projectDesc.textContent = project.description;
        projectLink.href = project.link;
        projectInfo.classList.add('show');
    } else if (!selectedOrb) {
        projectInfo.classList.remove('show');
    }
}

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(orbs);
    
    if (intersects.length > 0) {
        const clickedOrb = intersects[0].object;
        
        if (selectedOrb === clickedOrb) {
            // Second click - follow link immediately
            window.location.href = clickedOrb.userData.link;
            return;
        }
        
        // First click - select orb
        if (selectedOrb) {
            selectedOrb.scale.set(
                selectedOrb.userData.originalScale,
                selectedOrb.userData.originalScale,
                selectedOrb.userData.originalScale
            );
        }
        
        selectedOrb = clickedOrb;
        selectedOrb.scale.set(1.4, 1.4, 1.4);
        
        // Update project info
        const project = selectedOrb.userData;
        projectTitle.textContent = project.title;
        projectDesc.textContent = project.description;
        projectLink.href = project.link;
        projectInfo.classList.add('show');
    } else if (selectedOrb) {
        // Clicked outside - deselect
        selectedOrb.scale.set(
            selectedOrb.userData.originalScale,
            selectedOrb.userData.originalScale,
            selectedOrb.userData.originalScale
        );
        selectedOrb = null;
        projectInfo.classList.remove('show');
    }
}

function onMouseEnterCanvas() {
    isMouseOverCanvas = true;
}

function onMouseLeaveCanvas() {
    isMouseOverCanvas = false;
    if (hoveredOrb && hoveredOrb !== selectedOrb) {
        hoveredOrb.scale.set(
            hoveredOrb.userData.originalScale,
            hoveredOrb.userData.originalScale,
            hoveredOrb.userData.originalScale
        );
        hoveredOrb = null;
    }
    if (!selectedOrb) {
        projectInfo.classList.remove('show');
    }
}

canvas.addEventListener('pointermove', onMouseMove, false);
canvas.addEventListener('pointerdown', onClick, false);
canvas.addEventListener('pointerenter', onMouseEnterCanvas, false);
canvas.addEventListener('pointerleave', onMouseLeaveCanvas, false);

function handleTouch(event) {
    event.preventDefault();
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    onMouseMove(event.touches[0]);
}
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    // Optional: Add subtle parallax effect if desired
    stars.rotation.y = scrollY * 0.0001;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth speed transition
    scrollSpeed += (targetSpeed - scrollSpeed) * 0.01;
    
    // Rotate main sphere - slowed down
    sphere.rotation.y += scrollSpeed * 0.3;
    
    // Rotate orbiting spheres - slowed down
    orbs.forEach((orb, i) => {
        if (orb !== selectedOrb && orb !== hoveredOrb) {
            const userData = orb.userData;
            userData.angle += (userData.speed + scrollSpeed) * 0.3;
            
            orb.position.x = Math.cos(userData.angle) * 5;
            orb.position.z = Math.sin(userData.angle) * 5;
            orb.position.y = Math.sin(Date.now() * 0.001 + i) * 0.5;
            
            // Pulsing effect - slowed down
            const pulse = Math.sin(Date.now() * 0.002 + i) * 0.05 + 1;
            orb.scale.set(pulse, pulse, pulse);
        }
    });
    
    // Starfield animation - slowed down
    stars.rotation.y += 0.0001;
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Generate starfield for CSS
function createStars() {
    const count = 500;
    const stars = document.getElementById('stars');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.opacity = Math.random();
        star.style.animationDelay = `${Math.random() * 10}s`;
        
        if (i < count/3) {
            stars.appendChild(star);
        } else if (i < count*2/3) {
            stars2.appendChild(star);
        } else {
            stars3.appendChild(star);
        }
    }
}

createStars();

// Start animation
animate();