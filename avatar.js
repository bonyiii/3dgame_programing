// The "scene" is where stuff in our game will happen:
var scene = new THREE.Scene();
var flat = {flatShading: true};
var light = new THREE.AmbientLight('white', 0.8);
scene.add(light);

// The "camera" is what sees the stuff:
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 10000);
camera.position.z = 500;
scene.add(camera);

// The "renderer" draws what the camera sees onto the screen:
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ******** START CODING ON THE NEXT LINE ********

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



scene.add(avatar);
scene.add(rightHand);
scene.add(leftHand);
scene.add(rightFoot);
scene.add(leftFoot);

// Now, show what the camera sees on the screen:
renderer.render(scene, camera);
