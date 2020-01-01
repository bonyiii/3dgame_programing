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

var marker = new THREE.Object3D();
scene.add(marker);

var body = new THREE.SphereGeometry(100);
var cover = new THREE.MeshNormalMaterial();
var avatar = new THREE.Mesh(body, cover);

var hand = new THREE.SphereGeometry(50);
var rightHand = new THREE.Mesh(hand, cover);
rightHand.position.set(-150, 0, 0);
var leftHand = new THREE.Mesh(hand, cover);
leftHand.position.set(150, 0, 0);
var rightFoot = new THREE.Mesh(hand, cover);
rightFoot.position.set(-75, -125, 0);
var leftFoot = new THREE.Mesh(hand, cover);
leftFoot.position.set(75, -125, 0);

marker.add(avatar);
avatar.add(rightHand);
avatar.add(leftHand);
avatar.add(rightFoot);
avatar.add(leftFoot);
marker.add(camera);

function makeTreeAt(x, z) {
  var trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(50, 50, 200),
    new THREE.MeshBasicMaterial({ color: 'sienna' })
  );

  var top = new THREE.Mesh(
    new THREE.SphereGeometry(150),
    new THREE.MeshBasicMaterial({ color: 'forestgreen' })
  );

  top.position.y = 175;
  trunk.add(top);

  trunk.position.set(x, -75, z);
  scene.add(trunk);
}

makeTreeAt(0, 0);
makeTreeAt(500, 0);
makeTreeAt(-500, 0);
makeTreeAt(750, -1000);
makeTreeAt(-750, -1000);

// Now, show what the camera sees on the screen:

var clock = new THREE.Clock();
var isCartwheeling = false;
var isFlipping = false;
var isMovingRight = false;
var isMovingLeft = false;
var isMovingForward = false;
var isMovingBack = false;
var direction;
var lastDirection;

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  turn();
  walk();
  acrobatics();
  renderer.render(scene, camera);
}
animate();

function acrobatics() {
  if (isCartwheeling) {
    avatar.rotation.z = avatar.rotation.z + 0.05;
  }

  if (isFlipping) {
    avatar.rotation.x = avatar.rotation.x + 0.05;
  }
}

function isWalking() {
  if (isMovingRight) { return true; }
  if (isMovingLeft) { return true; }
  if (isMovingForward) { return true; }
  if (isMovingBack) { return true; }
  return false;
}

function walk() {
  if (!isWalking()) { return; }

  var speed = 10;
  var size = 100;
  var time = clock.getElapsedTime();
  var position = Math.sin(speed * time) * size;
  rightHand.position.z = position;
  leftHand.position.z = -position;
  rightFoot.position.z = -position;
  leftFoot.position.z = position;
}

function turn() {
  if(isMovingRight) { direction = Math.PI / 2; }
  if(isMovingLeft) { direction = - Math.PI / 2; }
  if(isMovingForward) { direction = Math.PI; }
  if(isMovingBack) { direction = 0; }
  if(!isWalking()) { direction = 0; }

  if(direction == lastDirection) { return; }
  lastDirection = direction;

  var tween = new TWEEN.Tween(avatar.rotation);
  tween.to({y: direction}, 500);
  tween.start();
}

document.addEventListener('keydown', sendKeyDown);
function sendKeyDown(event) {
  var code = event.code;
  if (code === 'ArrowLeft') {
    marker.position.x -= 5;
    isMovingLeft = true;
  }
  if (code === 'ArrowRight') {
    marker.position.x += 5;
    isMovingRight = true;
  }
  if (code === 'ArrowUp') {
    marker.position.z -= 5;
    isMovingForward = true;
  }
  if (code === 'ArrowDown') {
    marker.position.z += 5;
    isMovingBack = true;
  }
  if (code === 'KeyC') {  isCartwheeling = true; }
  if (code === 'KeyF') {  isFlipping = true; }
}

document.addEventListener('keyup', sendKeyUp);
function sendKeyUp(event) {
  var code = event.code;
  if (code === 'ArrowLeft') { isMovingLeft = false; }
  if (code === 'ArrowRight') { isMovingRight = false; }
  if (code === 'ArrowUp') { isMovingForward = false; }
  if (code === 'ArrowDown') { isMovingBack = false; }
  if (code === 'KeyC') {  isCartwheeling = false }
  if (code === 'KeyF') {  isFlipping = false }
}
