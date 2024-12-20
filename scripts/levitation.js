import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.5);
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight2.position.set(-5, -10, -7.5);
scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Trois objets avec paramètres différents et espacés
const objects = [
    { x: -60, amplitude: 5,  rotationSpeed: 1.0, model: null, modelGroup: null, levitationNode: null, baseY: 0 },
    { x:   0, amplitude: 10, rotationSpeed: 0.5, model: null, modelGroup: null, levitationNode: null, baseY: 0 },
    { x:  60, amplitude: 15, rotationSpeed: 0.2, model: null, modelGroup: null, levitationNode: null, baseY: 0 }
];

objects.forEach(obj => {
    obj.levitationNode = new THREE.Group();
    scene.add(obj.levitationNode);

    obj.modelGroup = new THREE.Group();
    obj.levitationNode.add(obj.modelGroup);

    obj.levitationNode.position.x = obj.x;
});

const loader = new GLTFLoader();
loader.load(
    'models/model1/scene.gltf',
    (gltf) => {
        const originalModel = gltf.scene;
        originalModel.scale.set(10, 10, 10);

        const box = new THREE.Box3().setFromObject(originalModel);
        const center = new THREE.Vector3();
        box.getCenter(center);
        originalModel.position.sub(center);

        const size = new THREE.Vector3();
        box.getSize(size);
        camera.position.z = size.length() * 1.5;

        console.log('Modèle chargé avec succès !');

        objects.forEach(obj => {
            const modelClone = originalModel.clone(true);

            // Cloner les matériaux pour chaque objet
            modelClone.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(m => m.clone());
                    } else {
                        child.material = child.material.clone();
                    }
                }
            });

            obj.model = modelClone;
            obj.modelGroup.add(modelClone);
            obj.baseY = obj.levitationNode.position.y;
        });
    },
    undefined,
    (error) => {
        console.error('Erreur lors du chargement du modèle :', error);
    }
);

let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    objects.forEach(obj => {
        if (obj.model) {
            obj.levitationNode.position.y = obj.baseY + Math.sin(time * 2) * obj.amplitude;
            obj.modelGroup.rotation.y = time * obj.rotationSpeed;
        }
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});
