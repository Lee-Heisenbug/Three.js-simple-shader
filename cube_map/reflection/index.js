var customMaterial, skybox, skyboxGeo = new THREE.BoxBufferGeometry( 1, 1, 1 ) , gui;
var reflectingBox = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), new ReflectionMaterial() );
var textureLoader = new THREE.CubeTextureLoader(), envMap;

constructScene( scene );

guiControl();

animate();

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}

function constructScene( scene ){

    camera.position.set( -3, 3, 3 );
    control.update();

    customMaterial = new SkyboxMaterial();

    envMap = textureLoader.setPath( '../../images/env/sunny_lake/' ).load( [
		'right.jpg',
		'left.jpg',
		'top.jpg',
		'bottom.jpg',
		'front.jpg',
		'back.jpg'
    ] );
    
    customMaterial.uniforms.envMap.value = envMap;
    reflectingBox.material.envMap = envMap;

    skybox = new THREE.Mesh(
        skyboxGeo,
        customMaterial
    );

    scene.add( skybox );
    scene.add( reflectingBox );
    skybox.frustumCulled = false;

}

function guiControl(){

    gui = new dat.GUI();

}