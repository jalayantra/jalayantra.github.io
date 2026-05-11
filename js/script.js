// --- WEBGL SETUP ---
const scene = new THREE.Scene();
// Warna background disetel ke biru navy pekat sesuai foto
scene.background = new THREE.Color(0x000c18);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas-webgl'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- WATER PLANE (BACKGROUND) ---
// Membuat mesh besar dengan banyak segmen untuk efek gelombang
const waterGeo = new THREE.PlaneGeometry(100, 100, 64, 64);
const waterMat = new THREE.MeshStandardMaterial({
    color: 0x002b4e, // Biru laut Jalayantra
    wireframe: true, // Efek digital khas Active Theory
    transparent: true,
    opacity: 0.4
});
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2.5;
water.position.y = -5;
scene.add(water);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x00f3ff, 0.5));

camera.position.z = 25;

// --- INTERACTION ---
let mouseX = 0,
    mouseY = 0;
const cursor = document.querySelector('#cursor-follower');

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4
    });
});

// --- ANIMATION & SCROLL ---
gsap.registerPlugin(ScrollTrigger);

// Intro
gsap.from(".hero-title", {
    y: 300,
    duration: 2,
    stagger: 0.2,
    ease: "power4.out"
});

// Scroll Reveal
document.querySelectorAll('.section').forEach(sec => {
    gsap.from(sec, {
        scrollTrigger: {
            trigger: sec,
            start: "top 80%"
        },
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out"
    });
});

const clock = new THREE.Clock();

function animate() {
    const t = clock.getElapsedTime();

    // Efek riak air pada geometry
    const positions = waterGeo.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Rumus matematika gelombang air
        positions[i + 2] = Math.sin(x * 0.3 + t) * 1.5 + Math.cos(y * 0.3 + t) * 1.5;
    }
    waterGeo.attributes.position.needsUpdate = true;

    // Camera Parallax
    camera.position.x += (mouseX * 20 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});