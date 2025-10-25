
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);


const head = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffe0bd })
);
scene.add(head);


const eyeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.8, 0.5, 1.8);
rightEye.position.set(0.8, 0.5, 1.8);
scene.add(leftEye, rightEye);


const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.2, 0.6, 16),
  new THREE.MeshStandardMaterial({ color: 0xffa500 })
);
nose.rotation.x = Math.PI / 2;
nose.position.set(0, 0.2, 2.1);
scene.add(nose);


const mouth = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.15, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xff4444 })
);
mouth.rotation.x = Math.PI / 2;
mouth.position.set(0, -0.5, 1.9);
scene.add(mouth);


const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.4, 0.4, 1, 30),
  new THREE.MeshStandardMaterial({ color: 0x8b4513 })
);
neck.position.set(0, -2.5, 0);
scene.add(neck);


const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  head.position.y = Math.sin(t * 0.5) * 0.1;

  const blink = Math.abs(Math.sin(t * 3)) * 0.4 + 0.1;
  leftEye.scale.y = blink;
  rightEye.scale.y = blink;

  nose.rotation.z = Math.sin(t * 2) * 0.1;

  mouth.rotation.z = Math.sin(t * 1.5) * 0.2;

  const neckScale = 1 + Math.sin(t * 2) * 0.05;
  neck.scale.set(1, neckScale, 1);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
