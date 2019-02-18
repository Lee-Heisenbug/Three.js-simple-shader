var vshader = `
    varying vec2 vUv;

    attribute vec2 cPosition;

    void main(){

        gl_Position = vec4( cPosition, 0.0, 1.0 );
        vUv = uv;

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}

    uniform sampler2D map;
    varying vec2 vUv;
    void main() {

        gl_FragColor = texture2D( map, vUv );
        // gl_FragColor = vec4( 1.0, 0.5, 0.0, 1.0 );

    }
`;

let customMaterial,
    box, boxMaterial, diffuseMap,
    textureLoader = new THREE.TextureLoader(),
    gui;

let finalScene = new THREE.Scene(),
    finalSceneCamera = new THREE.OrthographicCamera(),
    plane, planeGeo, planeMat;


constructScene( scene );

constructFinalScene( finalScene );

guiControl();

animate();

function constructScene( scene ) {

    boxMaterial = new THREE.MeshBasicMaterial();
    camera.position.set( -3, 3, 3 );
    control.update();
    diffuseMap = textureLoader.load( "./images/diffuse.png" );
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

    planeMat = new THREE.ShaderMaterial( {
        uniforms: THREE.UniformsUtils.merge( [

            {

                map: { value: null }

            }

        ] ),
        vertexShader: vshader,
        fragmentShader: fshader,
        depthTest: false

    } );

    planeMat.uniforms.map.value = diffuseMap;

    plane = new THREE.Mesh( planeGeo, planeMat );
    plane.frustumCulled = false;

    scene.add( plane );
    scene.add( finalSceneCamera );

}

function guiControl() {

    gui = new dat.GUI();

}

function animate() {

    // renderer.render( scene, camera );
    renderer.render( finalScene, finalSceneCamera );
    requestAnimationFrame( animate );

}