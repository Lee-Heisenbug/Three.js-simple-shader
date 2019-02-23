var customMaterial, skybox, skyboxGeo = new THREE.BoxBufferGeometry( 1, 1, 1 ) , gui;
var refractingObj = new THREE.Mesh( new THREE.TorusBufferGeometry( 2, 0.5, 16, 100 ), new RefractionMaterial() );
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
    refractingObj.material.envMap = envMap;

    skybox = new THREE.Mesh(
        skyboxGeo,
        customMaterial
    );

    scene.add( skybox );
    scene.add( refractingObj );
    skybox.frustumCulled = false;

}

function guiControl(){

    gui = new dat.GUI();
    gui.add( refractingObj.material, 'refractiveIndex', 1, 3, 0.001 );

}