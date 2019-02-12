var vshader = `

    varying vec4 vColor;
    
    attribute float instanceInitialProgress;
    attribute float instanceSpeed;
    attribute vec3 instanceColor;

    uniform float time;

    vec3 currentPosition( vec3 initPosition, float currentProgress ) {

        return initPosition + vec3( currentProgress );

    }

    void main(){
        
        float currentProgress = mod( instanceInitialProgress + instanceSpeed * time, 1.0 );

        vColor = vec4( instanceColor, 1.0 );
        gl_Position = vec4( currentPosition( position, currentProgress ), 1.0 );

    }
`;

var fshader = `
    varying vec4 vColor;

    void main(){

        gl_FragColor = vColor;

    }
`;

var customMaterial,
    instanceCount = 1, instanceGeo = new THREE.InstancedBufferGeometry(),
    lines,
    gui;

constructScene( scene );

guiControl();

animate();

function constructScene( scene ){

    camera.position.set( -3, 3, 3 );
    control.update();

    // construct geo
    instanceGeo.addAttribute( 'position', new THREE.Float32BufferAttribute( [

        -0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        -0.5, 0.25, 0.0,
        0.5, 0.25, 0.0,
        -0.5, 0.50, 0.0,
        0.5, 0.50, 0.0,
        -0.5, 0.75, 0.0,
        0.5, 0.75, 0.0,
        -0.5, 1.0, 0.0,
        0.5, 1.0, 0.0,

    ], 3 ) );

    instanceGeo.index = new THREE.Uint8BufferAttribute( [

        0, 1, 2,
        1, 3, 2,

        2, 3, 4,
        3, 5, 4,

        4, 5, 6,
        5, 7, 6,

        6, 7, 8,
        7, 9, 8
        
    ], 1 );

    for( let i = 0; i < instanceCount; ++i ){

        instanceGeo.addAttribute( 'instanceInitialProgress', new THREE.InstancedBufferAttribute( new Float32Array( [ 0.0 ] ), 1 ) );
        instanceGeo.addAttribute( 'instanceSpeed', new THREE.InstancedBufferAttribute( new Float32Array( [ 1.0 ] ), 1 ) );
        instanceGeo.addAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( [ 1.0, 1.0, 1.0 ] ), 3 ) );

    }

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            {
                time: { value: 0 }
            }
        ] ),
        vertexShader: vshader,
        fragmentShader: fshader,
        vertexColors: true
    })

    lines = new THREE.Mesh(
        instanceGeo,
        customMaterial
    );

    scene.add( lines );
    scene.add( new THREE.AxesHelper() );

}

function guiControl(){

    gui = new dat.GUI();

    let timeFolder = gui.addFolder( "time" );
    
    timeFolder.add( customMaterial.uniforms.time, 'value', 0, 2, 0.001 );

}

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}