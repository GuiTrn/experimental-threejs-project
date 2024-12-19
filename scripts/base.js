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
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.5); // Intensité augmentée à 3.5
// Intensity increased to 3.5
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

// Ajouter une lumière directionnelle secondaire
// Add a secondary directional light
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5); // Intensité augmentée à 2.5
// Intensity increased to 2.5
directionalLight2.position.set(-5, -10, -7.5); // Éclairage dans l'autre sens
// Lighting from the opposite direction
scene.add(directionalLight2);

// Ajouter une lumière ambiante
// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Éclairage global doux avec intensité augmentée
// Soft global lighting with increased intensity
scene.add(ambientLight);

// Ajouter une lumière ponctuelle
// Add a point light
const pointLight = new THREE.PointLight(0xffffff, 3, 150); // Intensité augmentée à 3 et portée à 150
// Intensity increased to 3 and range to 150
pointLight.position.set(0, 10, 10); // Positionner au-dessus et légèrement devant
// Positioned above and slightly in front
scene.add(pointLight);

// Ajouter des contrôles pour naviguer
// Add controls for navigation
const controls = new OrbitControls(camera, renderer.domElement);

// Charger le modèle avec GLTFLoader
// Load the model with GLTFLoader
const loader = new GLTFLoader();
loader.load(
    'models/model1/scene.gltf', // Chemin relatif vers le fichier gltf
    // Relative path to the glTF file
    function (gltf) {
        const model = gltf.scene;

        // Ajuster l'échelle et la position
        // Adjust the scale and position
        model.scale.set(10, 10, 10); // Échelle
        // Scale
        model.position.set(0, 0, 0); // Position au centre
        // Center position

        // Calculer la boîte englobante
        // Compute the bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        model.position.sub(center); // Centrer le modèle
        // Center the model
        camera.position.z = size.length() * 1.5; // Ajuster la caméra
        // Adjust the camera

        scene.add(model); // Ajouter le modèle à la scène
        // Add the model to the scene
        console.log('Modèle chargé avec succès !');
        // Model loaded successfully!
    },
    undefined, // Callback pour le chargement en cours (facultatif)
    // Callback for loading progress (optional)
    function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
        // Error while loading the model:
    }
);

// Fonction d'animation
// Animation function
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Met à jour les contrôles
    // Update controls
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
