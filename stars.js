// The "scene" is where stuff in our game will happen:
var scene = new THREE.Scene();
var flat = {flatShading: true};
var light = new THREE.AmbientLight('white', 0.8);
scene.add(light);

// The "camera" is what sees the stuff:
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 10000);
camera.position.z = 500;

// The "renderer" draws what the camera sees onto the screen:
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ******** START CODING ON THE NEXT LINE ********
var shape = new THREE.SphereGeometry(50);
var cover = new THREE.MeshBasicMaterial({ color: 'blue' });
var planet = new THREE.Mesh(shape, cover);
planet.position.set(-300, 0, 0);
scene.add(planet);


var shape = new THREE.SphereGeometry(50);
var cover = new THREE.MeshBasicMaterial({ color: 'yellow' });
var planet = new THREE.Mesh(shape, cover);
planet.position.set(200, 0, 250);
scene.add(planet);


function makePlanet() {
  var size = randomNumber(50);
  var x = randomNumber(1000) - 500;
  var y = randomNumber(1000) - 500;
  var z = randomNumber(1000) - 1000;
  var surface = randomColor();

  var shape = new THREE.SphereGeometry(50);
  var cover = new THREE.MeshBasicMaterial({ color: surface });
  var planet = new THREE.Mesh(shape, cover);
  planet.position.set(x, y, z);
  scene.add(planet);
}

function randomNumber(max) {
  if(max) {
    return max * Math.random();
  }
  return Math.random();
}

function randomColor() {
  return new THREE.Color(randomNumber(), randomNumber(), randomNumber());
}

for(let i = 0; i <100; i++) {
  makePlanet();
}

var controls = new THREE.FlyControls(camera);
controls.movementSpeed = 100;
controls.rollSpeed = .5;
controls.dragToLook = true;
controls.autoForward = false;

var clock = new THREE.Clock();
function animate() {
  var delta = clock.getDelta();
  controls.update(delta);

  // Now, show what the camera sees on the screen:
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
