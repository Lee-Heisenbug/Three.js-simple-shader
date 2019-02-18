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

    // const float offset = 1.0 / 300.0;

    void main() {

        // blur effect
        // vec2 offsets[9];
        // offsets[ 0 ] = vec2(-offset,  offset); // top-left
        // offsets[ 1 ] = vec2( 0.0,    offset); // top-center
        // offsets[ 2 ] = vec2( offset,  offset); // top-right
        // offsets[ 3 ] = vec2(-offset,  0.0); // center-left
        // offsets[ 4 ] = vec2( 0.0,    0.0);   // center-center
        // offsets[ 5 ] = vec2( offset,  0.0);   // center-right
        // offsets[ 6 ] = vec2(-offset, -offset); // bottom-left
        // offsets[ 7 ] = vec2( 0.0,   -offset); // bottom-center
        // offsets[ 8 ] = vec2( offset, -offset); // bottom-right 
            
        // float kernel[9];
        // kernel[ 0 ] = 1.0 / 16.0;
        // kernel[ 1 ] = 2.0 / 16.0;
        // kernel[ 2 ] = 1.0 / 16.0;
        // kernel[ 3 ] = 2.0 / 16.0;
        // kernel[ 4 ] = 4.0 / 16.0;
        // kernel[ 5 ] = 2.0 / 16.0;
        // kernel[ 6 ] = 1.0 / 16.0;
        // kernel[ 7 ] = 2.0 / 16.0;
        // kernel[ 8 ] = 1.0 / 16.0;

        // vec3 sampleTex[9];
        // for( int i = 0; i < 9; i++ ){

        //     sampleTex[i] = vec3( texture2D( map, vUv.st + offsets[ i ] ) );

        // }

        // vec3 col = vec3( 0.0 );
        // for(int i = 0; i < 9; i++) {

        //     col += sampleTex[i] * kernel[i];

        // }

        // gl_FragColor = vec4(col, 1.0);

        // normal color
        // gl_FragColor = texture2D( map, vUv );

        // test color
        // gl_FragColor = vec4( 1.0, 0.5, 0.0, 1.0 );

        // inversed color
        gl_FragColor = vec4(vec3(1.0 - texture2D(map, vUv)), 1.0);

    }
`;

let customMaterial,
    box, boxMaterial, diffuseMap,
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

    planeMat.uniforms.map.value = renderTarget.texture;

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