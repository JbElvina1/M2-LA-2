const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cubeMesh = new THREE.Mesh();
let stars, starGeo, starMaterial;
let colorTimer = 0;

lighting();
cube();
particles();

function particles() {
  const particleCount = 6000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 600 - 300; 
    positions[i * 3 + 1] = Math.random() * 600 - 300;
    positions[i * 3 + 2] = Math.random() * 600 - 300;
  }

  starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const sprite = new THREE.TextureLoader().load("Assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
    transparent: true,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 2; 
    if (positions[i + 1] < -300) {
      positions[i + 1] = 300; 
      positions[i] = Math.random() * 600 - 300;
      positions[i + 2] = Math.random() * 600 - 300; 
    }
  }

  starGeo.attributes.position.needsUpdate = true;

  colorTimer += 1 / 60;
  if (colorTimer >= 3) {
    colorTimer = 0;
    starMaterial.color.setHSL(Math.random(), 0.8, 0.6);
  }
}

function cube() {
  const texture = new THREE.TextureLoader().load("Assets/textures/wooden.jpg");
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;

  renderer.render(scene, camera);
}

animate();