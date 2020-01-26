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

var notAllowed = [];
var treeTops = [];

function makeTreeAt(x, z) {
  var trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(50, 50, 200),
    new THREE.MeshBasicMaterial({ color: 'sienna' })
  );

  var top = new THREE.Mesh(
    new THREE.SphereGeometry(150),
    new THREE.MeshBasicMaterial({ color: 'forestgreen' })
  );

  var boundary = new THREE.Mesh(
    new THREE.CircleGeometry(200),
    new THREE.MeshNormalMaterial()
  )

  boundary.position.y = -100;
  boundary.rotation.x = -Math.PI / 2;
  trunk.add(boundary);
  notAllowed.push(boundary);
  treeTops.push(top);

  top.position.y = 175;
  trunk.add(top);

  trunk.position.set(x, -75, z);
  scene.add(trunk);
}

makeTreeAt(500, 0);
makeTreeAt(-500, 0);
makeTreeAt(750, -1000);
makeTreeAt(-750, -1000);

var treasureTreeNumber;
var shakingTreeTween;
function updateTreasureTreeNumber() {
  var rand = Math.random() * treeTops.length;
  treasureTreeNumber = Math.floor(rand);
}

function shakeTreasureTree() {
  updateTreasureTreeNumber();

  var tween = new TWEEN.Tween({ shake: 0 });
  tween.to({ shake: 20 * 2 * Math.PI }, 8 * 1000);
  tween.onUpdate(shakeTreeUpdate);
  tween.onComplete(shakeTreeComplete);
  shakingTreeTween = tween;
  tween.start();
}

function shakeTreeUpdate(update) {
  var top = treeTops[treasureTreeNumber];
  top.position.x = 50 * Math.sin(update.shake);
}

function shakeTreeComplete() {
  var top = treeTops[treasureTreeNumber];
  top.position.x = 0;
  setTimeout(shakeTreasureTree, 2 * 1000);
}

shakeTreasureTree();

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
var fruit;

var scoreboard = new Scoreboard();
scoreboard.countdown(45);
scoreboard.score();
scoreboard.help(
  'Arrow keys to move. ' +
  'Space bar to jump for fruit. ' +
  'Watch for shaking trees wih fruit. ' +
  'Get near the tree and jump before the fruit is gone'
);
scoreboard.onTimeExpired(timeExpired);
function timeExpired() {
  scoreboard.message("Game Over!");
}

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

function isColliding() {
  var vector = new THREE.Vector3(0, -1, 0);
  var raycaster = new THREE.Raycaster(marker.position, vector);

  var intersects = raycaster.intersectObjects(notAllowed);
  if (intersects.length > 0) { return true; }

  return false;
}

function jump() {
  if(avatar.position.y > 0) { return; }
  checkForTreasure();
  animateJump();
}

function checkForTreasure() {
  var top = treeTops[treasureTreeNumber];
  var tree = top.parent;
  var p1 = tree.position;
  var p2 = marker.position;
  var xDiff = p1.x - p2.x;
  var zDiff = p1.z - p2.z;

  var distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(zDiff,2));
  if (distance < 500) { scorePoints(); }
}

function scorePoints() {
  if (scoreboard.getTimeRemaining() === 0) { return; }
  scoreboard.addPoints(10);
  //Sounds.bubble.play();
  shakingTreeTween.stop();
  shakeTreeComplete();
  animateFruit();
}

function animateJump() {
  var tween = new TWEEN.Tween({ jump: 0 });
  tween.to({ jump: Math.PI }, 400);
  tween.onUpdate(animateJumpUpdate);
  tween.onComplete(animateJumpComplete);
  tween.start();
}

function animateJumpUpdate(update) {
  avatar.position.y = 100 * Math.sin(update.jump);
}

function animateJumpComplete() {
  avatar.position.y = 0;
}

function animateFruit() {
  if (fruit) { return; }

  fruit = new THREE.Mesh(
    new THREE.CylinderGeometry(25,25,5,25),
    new THREE.MeshBasicMaterial({ color: 'gold' })
  );
  marker.add(fruit);

  var tween = new TWEEN.Tween({ height: 200, spin: 0 });
  tween.to({ height: 350, spin: 2 * Math.PI}, 50);
  tween.onUpdate(animateFruitUpdate);
  tween.onComplete(animateFruitComplete);
  tween.start();
}

function animateFruitUpdate(update) {
  fruit.position.y = update.height;
  fruit.position.x = update.spin;
}

function animateFruitComplete() {
  marker.remove(fruit);
  fruit = undefined;
}

document.addEventListener('keydown', sendKeyDown);
function sendKeyDown(event) {
  var code = event.code;
  if (code === 'ArrowLeft') {
    marker.position.x -= 8;
    isMovingLeft = true;
  }
  if (code === 'ArrowRight') {
    marker.position.x += 8;
    isMovingRight = true;
  }
  if (code === 'ArrowUp') {
    marker.position.z -= 8;
    isMovingForward = true;
  }
  if (code === 'ArrowDown') {
    marker.position.z += 8;
    isMovingBack = true;
  }
  if (code === 'KeyC') {  isCartwheeling = true; }
  if (code === 'KeyF') {  isFlipping = true; }

  if (code === 'Space') { jump() }

  if(isColliding()) {
    if(isMovingLeft) { marker.position.x = marker.position.x + 5;}
    if(isMovingRight) { marker.position.x = marker.position.x - 5;}
    if(isMovingForward) { marker.position.z = marker.position.z + 5;}
    if(isMovingBack) { marker.position.z = marker.position.z - 5;}
  }
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
