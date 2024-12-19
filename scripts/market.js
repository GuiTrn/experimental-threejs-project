import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Fonction pour créer une scène dans un conteneur spécifique
// Function to create a scene in a specific container
function createScene(containerId, modelPath) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    camera.position.z = 3;

    const container = document.getElementById(containerId);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lumière directionnelle principale
    // Main directional light
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.5); // Intensité augmentée à 3.5
    // Increased intensity to 3.5
    directionalLight1.position.set(5, 10, 7.5);
    scene.add(directionalLight1);

    // Lumière directionnelle secondaire
    // Secondary directional light
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5); // Intensité augmentée à 2.5
    // Increased intensity to 2.5
    directionalLight2.position.set(-5, -10, -7.5); // Éclairage dans l'autre sens
    // Lighting from the opposite direction
    scene.add(directionalLight2);

    // Lumière ambiante
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Intensité augmentée à 2
    // Increased intensity to 2
    scene.add(ambientLight);

    // Lumière ponctuelle
    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 3, 150); // Intensité augmentée à 3 et portée à 150
    // Increased intensity to 3 and range to 150
    pointLight.position.set(0, 15, 15); // Positionner au-dessus et légèrement devant
    // Positioned above and slightly in front
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    const loader = new GLTFLoader();
    loader.load(
        modelPath,
        function (gltf) {
            const model = gltf.scene;

            model.scale.set(10, 10, 10); // Ajuster la taille du modèle
            // Adjust the size of the model
            model.position.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            const size = new THREE.Vector3();
            box.getSize(size);

            model.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            const distance = maxDim / (2 * Math.tan(fov / 2));
            camera.position.z = distance * 1.2;

            scene.add(model);
            console.log(`Modèle chargé dans ${containerId}`);
            // Model loaded in ${containerId}
        },
        undefined,
        function (error) {
            console.error(`Erreur lors du chargement du modèle pour ${containerId}:`, error);
            // Error loading the model for ${containerId}:
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });
}

// Créer une scène pour chaque card
// Create a scene for each card
createScene('three-container-1', 'models/model1/scene.gltf'); // Modèle 1
// Model 1
createScene('three-container-2', 'models/model2/fire_axe.gltf'); // Modèle 2
// Model 2
createScene('three-container-3', 'models/model3/tactical_boots_01.gltf'); // Modèle 3
// Model 3

createScene('three-container-4', 'models/model1/scene.gltf'); // Modèle 1
// Model 1
createScene('three-container-5', 'models/model2/fire_axe.gltf'); // Modèle 2
// Model 2
createScene('three-container-6', 'models/model3/tactical_boots_01.gltf'); // Modèle 3
// Model 3

createScene('three-container-7', 'models/model1/scene.gltf'); // Modèle 1
// Model 1
createScene('three-container-8', 'models/model2/fire_axe.gltf'); // Modèle 2
// Model 2
createScene('three-container-9', 'models/model3/tactical_boots_01.gltf'); // Modèle 3
// Model 3
