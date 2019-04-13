/*******************************************************************************
****************************** Environment variables ***************************
*******************************************************************************/

if ( WEBGL.isWebGLAvailable() === false ) document.body.appendChild( WEBGL.getWebGLErrorMessage() );
let container, controls, camera, scene, renderer, circle, plane, rotate = true, gravity = 0.005;
const RECTANGLE_W = 20, RECTANGLE_H = 1, CIRCLE_RADIUS = 1;

/*******************************************************************************
**************************** Initalization and animation ***********************
*******************************************************************************/

function start_scene() {
	init();
	get_meshes();
	animate();
}

/* Initialization */
function init() {
	// Selecting the container
	container = document.querySelector("#container");
	document.body.appendChild(container);

	// Creating the scene
	scene = new THREE.Scene();
	window.addEventListener('resize', on_window_resize, false);
	window.addEventListener('click', () => {rotate = !rotate; if (rotate) reset_game();}, false);
	build_renderer();
	build_camera();
}

/* We change the render size when the window is resized */
function on_window_resize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Builds the camera */
function build_camera() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 0);
	camera.position.set(0, 0, 50);
}

function build_renderer() {
	/* Setting up the render */
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x000000, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	container.appendChild(renderer.domElement);
}

/* Builds and inserts the required meshes (circle and rectangle) */
function get_meshes() {
	// Circle setup
	let material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}),
	geometry = new THREE.CircleGeometry(CIRCLE_RADIUS, 64);
	circle = new THREE.Mesh(geometry, material);
	circle.position.y += 10;
	circle.speed = {x: 0, y: 0};
	circle.rotatedCenter = {};

	// Rectangle setup
	geometry = new THREE.PlaneGeometry(RECTANGLE_W, RECTANGLE_H);
	material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
	rectangle = new THREE.Mesh( geometry, material );
	rectangle.position.y -= 5;
	rectangle.center = {};
	rectangle.rotation.z += Math.random() * 2;

	// Adding the meshes to the scene
	scene.add(circle);
	scene.add(rectangle);
}

/* Resets the meshes rotations and positions */
function reset_game() {
	rotate = true;
	rectangle.rotation.z += Math.random() * 2;
	circle.position.y = 10;
	circle.position.x = 0;
	circle.speed.x = 0;
	circle.speed.y = 0;
}

/* Starting the animation */
function animate() {
	if (rotate && rectangle) rectangle.rotation.z -= 0.02;
	if (!rotate && circle && rectangle && update_position())
		circle_and_rectangle_collide();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

/* Updates the circle position */
function update_position() {
	circle.speed.y += gravity; // Gravity pull
	circle.position.y -= circle.speed.y;
	circle.position.x -= circle.speed.x;

	// Getting the circle coordinates relative to the screen
	let pos = new THREE.Vector3();
	pos = pos.setFromMatrixPosition(circle.matrixWorld);
	pos.project(camera);
	let widthHalf = window.innerWidth/2;
	let heightHalf = window.innerHeight / 2;
	pos.x = (pos.x * widthHalf) + widthHalf;
	pos.y = - (pos.y * heightHalf) + heightHalf;

	// Checking if the circle is outside the screen
	if (pos.x <= 0  || pos.x >= window.innerWidth || pos.y >= window.innerHeight || pos.y <= 0)
		reset_game();
	return true;
}

/******************************************************************************
******************** Collision detection and math functions *******************
*******************************************************************************/

/* Detects if the circle and the rectangle are colliding */
function circle_and_rectangle_collide() {
	let theta = -rectangle.rotation.z, closestX, closestY;
	rectangle.center.x = rectangle.position.x - RECTANGLE_W / 2;
	rectangle.center.y = rectangle.position.y - RECTANGLE_H / 2;

	// We unrotate the circle relatively to the rectangle
	circle.rotatedCenter.x = Math.cos(theta) * (circle.position.x - rectangle.position.x) - Math.sin(theta) * (circle.position.y - rectangle.position.y) + rectangle.position.x;
	circle.rotatedCenter.y = Math.sin(theta) * (circle.position.x - rectangle.position.x) + Math.cos(theta) * (circle.position.y - rectangle.position.y) + rectangle.position.y;

	// We find the closest unrotated x point from the rectangle
	if (circle.rotatedCenter.x < rectangle.center.x) closestX = rectangle.center.x;
	else if (circle.rotatedCenter.x > rectangle.center.x + RECTANGLE_W ) closestX = rectangle.center.x + RECTANGLE_W;
	else closestX = circle.rotatedCenter.x;

	// We find the closest unrotated y point from the rectangle
	if ( circle.rotatedCenter.y < rectangle.center.y ) closestY = rectangle.center.y;
	else if ( circle.rotatedCenter.y > rectangle.center.y + RECTANGLE_H ) closestY = rectangle.center.y + RECTANGLE_H;
	else closestY = circle.rotatedCenter.y;

	// Checking if the rectangle is within the circle's radius
	let distance = getDistance( circle.rotatedCenter.x, circle.rotatedCenter.y, closestX, closestY );
	if (distance && distance < CIRCLE_RADIUS) bounce_circle(); // It is, we bounce the circle.
}

/* Performs a simple pythagoras theorem application */
function getDistance(fromX, fromY, toX, toY ) {
	let dX = Math.abs(fromX - toX), dY = Math.abs(fromY - toY);
	return Math.sqrt((dX * dX) + (dY*dY));
}

/* Bounces the circle in the opposite direction according to the perpendicular vector to the rectangle */
function bounce_circle() {
	let normalVector = get_normal_vector(rectangle.rotation.z);
	let d = 2 * (circle.speed.x * normalVector.x + circle.speed.y * normalVector.y);
	circle.speed.x -= d * normalVector.x;
	circle.speed.y -= d * normalVector.y;
}

/* Find the the perpendicular vector to the rectangle */
function get_normal_vector(a) { return ({x: Math.sin(a), y: -Math.cos(a)}); }

/******************************************************************************
************************************ GO GO GO *********************************
*******************************************************************************/

/* That's all folks */
start_scene();
