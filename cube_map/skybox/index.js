var vshader = `
    varying vec3 envCoords;

    void main(){

        envCoords = position;
        gl_Position = projectionMatrix * vec4( mat3( viewMatrix ) * position, 1.0 );

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}

    uniform samplerCube envMap;
    varying vec3 envCoords;

    void main(){

        gl_FragColor = textureCube( envMap, envCoords );

    }
`;

var customMaterial, skybox, skyboxGeo = new THREE.BoxBufferGeometry( 1, 1, 1 ) , gui;
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

    customMaterial = new THREE.ShaderMaterial({
        uniforms: {

            envMap: { value: null }

        },
        vertexShader: vshader,
        fragmentShader: fshader,
        side: THREE.BackSide
    });

    envMap = textureLoader.setPath( '../../images/env/sunny_lake/' ).load( [
		'right.jpg',
		'left.jpg',
		'top.jpg',
		'bottom.jpg',
		'front.jpg',
		'back.jpg'
    ] );
    
    customMaterial.uniforms.envMap.value = envMap;

    skybox = new THREE.Mesh(
        skyboxGeo,
        customMaterial
    );

    scene.add( skybox );
    skybox.frustumCulled = false;

}

function guiControl(){

    gui = new dat.GUI();

}