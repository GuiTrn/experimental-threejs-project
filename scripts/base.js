import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Créer la scène
const scene = new THREE.Scene();

// Définir un fond blanc
scene.background = new THREE.Color(0xffffff);

// Créer une caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Créer un renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajouter une lumière directionnelle principale
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.5); // Intensité augmentée à 3.5
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

// Ajouter une lumière directionnelle secondaire
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5); // Intensité augmentée à 2.5
directionalLight2.position.set(-5, -10, -7.5); // Éclairage dans l'autre sens
scene.add(directionalLight2);

// Ajouter une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Éclairage global doux avec intensité augmentée
scene.add(ambientLight);

// Ajouter une lumière ponctuelle
const pointLight = new THREE.PointLight(0xffffff, 3, 150); // Intensité augmentée à 3 et portée à 150
pointLight.position.set(0, 10, 10); // Positionner au-dessus et légèrement devant
scene.add(pointLight);

// Ajouter des contrôles pour naviguer
const controls = new OrbitControls(camera, renderer.domElement);

// Charger le modèle avec GLTFLoader
const loader = new GLTFLoader();
loader.load(
    'models/model1/scene.gltf', // Chemin relatif vers le fichier gltf
    function (gltf) {
        const model = gltf.scene;

        // Ajuster l'échelle et la position
        model.scale.set(10, 10, 10); // Échelle
        model.position.set(0, 0, 0); // Position au centre

        // Calculer la boîte englobante
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        model.position.sub(center); // Centrer le modèle
        camera.position.z = size.length() * 1.5; // Ajuster la caméra

        scene.add(model); // Ajouter le modèle à la scène
        console.log('Modèle chargé avec succès !');
    },
    undefined, // Callback pour le chargement en cours (facultatif)
    function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
    }
);

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Met à jour les contrôles
    renderer.render(scene, camera);
}
animate();

// Adapter la scène à la fenêtre
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
