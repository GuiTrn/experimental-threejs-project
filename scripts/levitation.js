import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Créer la scène
// Create the scene
const scene = new THREE.Scene();

// Définir un fond blanc
// Set a white background
scene.background = new THREE.Color(0xffffff);

// Créer une caméra
// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Créer un renderer
// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajouter une lumière directionnelle principale
// Add a main directional light
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.5);
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

// Ajouter une lumière directionnelle secondaire
// Add a secondary directional light
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight2.position.set(-5, -10, -7.5);
scene.add(directionalLight2);

// Ajouter une lumière ambiante
// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Ajouter une lumière ponctuelle
// Add a point light
const pointLight = new THREE.PointLight(0xffffff, 3, 150);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

// Ajouter des contrôles pour naviguer
// Add controls for navigation
const controls = new OrbitControls(camera, renderer.domElement);

// Charger le modèle avec GLTFLoader
// Load the model with GLTFLoader
let model;
let baseY = 0; // Pour enregistrer la position de base sur l'axe Y
// To store the base Y position

const loader = new GLTFLoader();
loader.load(
    'models/model1/scene.gltf',
    function (gltf) {
        model = gltf.scene;

        // Ajuster l'échelle et la position
        // Adjust the scale and position
        model.scale.set(10, 10, 10);
        model.position.set(0, 0, 0);

        // Calculer la boîte englobante
        // Compute the bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        model.position.sub(center); // Centrer le modèle
        camera.position.z = size.length() * 1.5; // Ajuster la caméra

        scene.add(model); // Ajouter le modèle à la scène
        console.log('Modèle chargé avec succès !');

        // Enregistrer la position Y de base du modèle après positionnement
        // Store the base Y position of the model after positioning
        baseY = model.position.y;
    },
    undefined,
    function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
    }
);

// Fonction d'animation
// Animation function
let clock = new THREE.Clock(); // Horloge pour l'animation
// Clock for animation

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Appliquer l'effet de lévitation uniquement si le modèle est chargé
    // Apply the levitation effect only if the model is loaded
    if (model) {
        const time = clock.getElapsedTime();
        // Intensifier l'amplitude de la lévitation
        // Intensify the levitation amplitude
        model.position.y = baseY + Math.sin(time * 2) * 5; // Augmenter l'amplitude à 0.6
    }

    renderer.render(scene, camera);
}
animate();

// Adapter la scène à la fenêtre
// Adjust the scene to the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
