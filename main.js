import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { MathUtils, Mesh } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});


/* Window size */
window.addEventListener('resize', () => {
  console.log(window.innerHeight , "+" ,window.innerWidth)
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
})

camera.position.setZ(5);

renderer.render(scene, camera);  

/* Torus geometry */
// const geometry = new THREE.TorusGeometry(50,10,50,200);
const geometry = new THREE.SphereGeometry(25,25,25);
const material = new THREE.MeshStandardMaterial( {color: 0xFFFF00} );

const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);
let fishArray = [];
/* Fish Geometry */

function addFish(x,y,z) {
  const fishShape = new THREE.Shape();
  x = THREE.MathUtils.randFloatSpread(250);
  y = THREE.MathUtils.randFloatSpread(150);
  z = THREE.MathUtils.randFloatSpread(200);
  // z = THREE.MathUtils.randFloatSpread(50);
  fishShape.moveTo(x, y);
  
  fishShape.quadraticCurveTo( x + 5, y - 8, x + 9, y - 1 );
  fishShape.quadraticCurveTo( x + 10, y - 1, x + 11, y - 4 );
  fishShape.quadraticCurveTo( x + 11, y, x + 11, y + 4 );
  fishShape.quadraticCurveTo( x + 10, y + 1, x + 9, y + 1 );
  fishShape.quadraticCurveTo( x + 5, y + 9, x, y );

  const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };

  const fishGeometry = new THREE.ExtrudeGeometry(fishShape, extrudeSettings);
  const fishMesh = new THREE.Mesh(fishGeometry, new THREE.MeshPhongMaterial);
  fishMesh.material.color.setHex(0xcd57cf);
  fishMesh.position.set(x,y,z);
  fishArray.push(fishMesh);
  scene.add(fishMesh);
}
Array(150).fill().forEach(addFish);

/* Lights */
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,40);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

/* Grid/light helper */
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

/* Background */
const underWaterTexture = new THREE.TextureLoader().load('./Assets/under.jpg');
scene.background = underWaterTexture;

/* Fish image */
// function addFish() {
//   const loader = new THREE.TextureLoader();
//   const material = new THREE.MeshLambertMaterial({
//     map: loader.load('./Assets/fish.jpg')
//   });
//   const geometry = new THREE.PlaneGeometry(6, 6);
//   const fish = new THREE.Mesh(geometry, material);
//   const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(40))
//   fish.position.set(x,y,z)
//   scene.add(fish);
// }
// Array(25).fill().forEach(addFish)

/* Bubbles mesh */
function addBubble() {
  const geometry = new THREE.SphereGeometry(0.75, 72, 72);
  const material = new THREE.MeshPhongMaterial({shininess: 30, color: 0xe7feff, specular: 0xffffff, transparent: true, depthWrite: false, opacity: 0.15});
  const bubble = new THREE.Mesh(geometry, material);

  const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

  bubble.position.set(x,y,z);
  scene.add(bubble)
}
Array(2000).fill().forEach(addBubble); 

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.1;
  fishArray.forEach((fish) => {
    fish.position.x -= 0.025 
  })
  controls.update();
  renderer.render(scene,camera);
}

animate()