let box, boxMaterial, diffuseMap,
    textureLoader = new THREE.TextureLoader(),
    canvas = document.getElementById( 'scene-3d' ),
    renderer = new THREE.WebGLRenderer( { canvas } ),
    gui;

let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
    renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { depthBuffer: true } );
    control = new THREE.OrbitControls( camera, canvas );

let finalScene = new THREE.Scene(),
    finalSceneCamera = new THREE.OrthographicCamera(),
    plane, planeGeo, planeMat;


constructScene( scene );

constructFinalScene( finalScene );

guiControl();

animateFinalScene();

function constructScene( scene ) {
    
    scene.add( camera );
    
    boxMaterial = new THREE.MeshBasicMaterial();
    camera.position.set( -3, 3, 3 );
    control.update();
    diffuseMap = textureLoader.load( "../../images/textures/box/box_diffuse.png" );
    diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
    boxMaterial.map = diffuseMap;

    box = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 1, 1, 1 ),
        boxMaterial
    );

    scene.add(box);

}

function constructFinalScene( scene ) {

    planeGeo = new THREE.BufferGeometry();

    planeGeo.addAttribute( 'cPosition', new THREE.Float32BufferAttribute( [

        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0

    ], 2 ) );

    planeGeo.addAttribute( 'uv', new THREE.Float32BufferAttribute( [0, 1, 1, 1, 0, 0, 1, 0], 2 ) );

    planeGeo.index = new THREE.Uint8BufferAttribute( [

        0, 2, 3,
        3, 1, 0
        
    ], 1 );

    planeMat = new InversedColorMaterial();

    planeMat.map = renderTarget.texture;

    plane = new THREE.Mesh( planeGeo, planeMat );
    plane.frustumCulled = false;

    scene.add( plane );
    scene.add( finalSceneCamera );

}

window.addEventListener( 'resize', onWindowResize );
    
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderTarget.setSize( window.innerWidth, window.innerHeight );
}

onWindowResize();

function guiControl() {

    gui = new dat.GUI();

}

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}

function animateFinalScene() {

    renderer.render( scene, camera, renderTarget );
    renderer.render( finalScene, finalSceneCamera );
    requestAnimationFrame( animateFinalScene );

}