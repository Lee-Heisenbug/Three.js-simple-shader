var vshader = `

    varying vec4 vColor;
    
    attribute float instanceInitialProgress;
    attribute float instanceSpeed;
    attribute vec3 instanceColor;

    uniform float time;

    void main(){

        vColor = vec4( instanceColor, 1.0 );
        gl_Position = vec4( position, 1.0 );

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

// guiControl();

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

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}