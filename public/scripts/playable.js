if ( WEBGL.isWebGLAvailable() === false )
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
let container, controls, camera, scene, renderer;

function startScene() {
	init();
	getMeshes();
	animate();
}

function init() {
	/* Selecting the container */
	container = document.querySelector("#container");
	document.body.appendChild(container);
	/* Creating the scene */
	scene = new THREE.Scene();
	window.addEventListener('resize', onWindowResize, false);
	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	buildRenderer();
	buildCamera();
	generateLights();
}


/* We change the render size when the window is resized */
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Starting the animations */
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function getMeshes() {

}


function buildGUI() {
	// DAT.GUI Related Stuff
	let gui = new dat.GUI({width: 400});
	let guiLight = gui.addFolder('Lights');
	let guiPlanet = gui.addFolder('Planet');
	guiLight.add(spotLight.position, 'x', -20, 20).name('Spot light - Location X').listen();
	guiLight.add(spotLight.position, 'y', -20, 20).name('Spot light - Location Y').listen();
	guiLight.add(spotLight.position, 'z', -20, 20).name('Spot light - Location Z').listen();
	guiLight.add(spotLight, 'intensity', 0, 20).name('Spot light - Intensity').listen();
	guiLight.add(spotLight, 'angle', 0, 0.1).name('Spot light - Angle').listen();
	guiLight.add(spotLight, 'distance', 0, 100).name('Spot light - Distance').listen();
	guiLight.add(spotLight, 'penumbra', 0, 1).name('Spot light - Penumbra').listen();
	guiLight.add(spotLight, 'decay', 0, 100).name('Spot light - Decay').listen();
	guiPlanet.add(planet.position, 'x', -20, 20).name('Location X').listen();
	guiPlanet.add(planet.position, 'y', -20, 20).name('Location Y').listen();
	guiPlanet.add(planet.position, 'z', -20, 20).name('Location Z').listen();
	guiPlanet.add(planet.rotation, 'x', -10, 10).name('Rotation X').listen();
	guiPlanet.add(planet.rotation, 'y', -10, 10).name('Rotation Y').listen();
	guiPlanet.add(planet.rotation, 'z', -10, 10).name('Rotation Z').listen();
	guiPlanet.add(planet.scale, 'x', 0, 6).name('Scale X').listen();
	guiPlanet.add(planet.scale, 'y', 0, 6).name('Scale Y').listen();
	guiPlanet.add(planet.scale, 'z', 0, 6).name('Scale Z').listen();
}

function generateLights() {
	/* Creating the lights and defining their position */
	ambLight = new THREE.AmbientLight(0xffffffff, 1);
	ambLight.position.set(5, 4, 8);
	scene.add(ambLight);
}



function buildCamera() {
	/* Creating the camera and setting up controls */
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 0);
	camera.position.set(0, 0, 4);
	// controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function buildRenderer() {
	/* Setting up the render */
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x000000, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	container.appendChild(renderer.domElement);
}


/* That's all folks */
startScene();
