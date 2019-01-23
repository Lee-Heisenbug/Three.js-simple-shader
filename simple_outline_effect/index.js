var vshader = `
    varying vec2 vUv;
    void main(){

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vUv = uv;

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}

    uniform sampler2D diffuseMap;
    varying vec2 vUv;
    void main() {

        vec3 result;

        gl_FragColor = texture2D( diffuseMap, vUv );

    }
`;

var customMaterial, box, box2, gui, textureLoader = new THREE.TextureLoader(), diffuseMap,
    outlineMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)});
    gl = renderer.context;

constructScene( scene );

// guiControl();

renderer.autoClear = false;
outlineMaterial.depthTest = false;
gl.clearStencil(0);
gl.enable(gl.STENCIL_TEST);

animate();

function animate() {

    // update stencil
    gl.stencilOp( gl.KEEP, gl.KEEP, gl.REPLACE );
    renderer.clear( true, true, true );

    gl.stencilFunc( gl.ALWAYS, 1, 0xff );
    gl.stencilMask( 0xff );
    renderer.render( scene, camera );

    //scale box and draw outline
    box.scale.set(1.2,1.2,1.2);
    box.material = outlineMaterial;

    gl.stencilFunc( gl.NOTEQUAL, 1, 0xff );
    gl.stencilMask( 0x00 );

    renderer.render( scene, camera );

    //reset box
    box.scale.set(1,1,1);
    box.material = customMaterial;

    requestAnimationFrame( animate );

}

function constructScene( scene ){

    camera.position.set( -3, 3, 3 );
    control.update();
    diffuseMap = textureLoader.load( "./images/diffuse.png" );
    diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            {
                diffuseMap: { value: null }
            }
        ] ),
        lights: false,
        vertexShader: vshader,
        fragmentShader: fshader
    })

    customMaterial.uniforms.diffuseMap.value = diffuseMap;

    box = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 1, 1, 1 ),
        customMaterial
    );

    scene.add( box );
}

function guiControl(){

    gui = new dat.GUI();

}