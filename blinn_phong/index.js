let phongExample = createPhongExample();
let blinnPhongExample = createBlinnPhongExample();
let renderer = new THREE.WebGLRenderer( { canvas: document.querySelector( '#scene' ) } );

setupRenderer();
setupOribitControls();
renderTwoScenesOnOneCanvas();
// guiControl();

function createPhongExample() {

    let example = new Example();
    return example;

}
function createBlinnPhongExample() {
    
    let example = new Example();
    example.floor.material = new BlinnPhongMaterial();
    example.floor.material.shininess = 0.5;
    return example;

}

function setupRenderer() {

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.autoClearColor = false;
    autoResizeRenderer();

}

function autoResizeRenderer() {

    resizeRenderer();
    window.addEventListener( 'resize', resizeRenderer );

}
function resizeRenderer() {

    renderer.setSize( window.innerWidth, window.innerHeight );

}
function setupOribitControls() {

    new THREE.OrbitControls( phongExample.camera, renderer.domElement );
    new THREE.OrbitControls( blinnPhongExample.camera, renderer.domElement );

}
function renderTwoScenesOnOneCanvas() {

    renderer.clearColor();
    renderPhongExample();
    renderBlinnPhongExample();

    requestAnimationFrame( renderTwoScenesOnOneCanvas );

}
function renderPhongExample() {

    renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight );
    renderer.render( phongExample.scene, phongExample.camera );

}
function renderBlinnPhongExample() {

    renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
    renderer.render( blinnPhongExample.scene, blinnPhongExample.camera );

}
function guiControl(){

    gui = new dat.GUI();
    let ambientFolder = gui.addFolder('ambient');
    let materialFolder = gui.addFolder('material');

    ambientFolder.add(ambientLight.color,'r', 0, 1);
    ambientFolder.add(ambientLight.color,'g', 0, 1);
    ambientFolder.add(ambientLight.color,'b', 0, 1);
    ambientFolder.add(ambientLight, 'intensity', 0, 1);

    materialFolder.add(customMaterial.uniforms.colorFac.value, 'r', 0, 1);
    materialFolder.add(customMaterial.uniforms.colorFac.value, 'g', 0, 1);
    materialFolder.add(customMaterial.uniforms.colorFac.value, 'b', 0, 1);

}