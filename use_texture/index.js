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

var customMaterial, box, gui, textureLoader = new THREE.TextureLoader(), diffuseMap;

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

    scene.add(box);

}

function guiControl(){

    gui = new dat.GUI();

}