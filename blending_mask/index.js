var vshader = `
    varying vec2 vUv;
    void main(){

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vUv = uv;

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}

    uniform sampler2D map;
    varying vec2 vUv;
    void main() {

        vec4 color = texture2D( map, vUv );
        if( color.a < 0.1 ){
            discard;
        }
        gl_FragColor = color;

    }
`;

var customMaterial, grass, grassMap,
    boxes, boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 ),
    boxMaterial = new THREE.MeshBasicMaterial(),
    boxMap, boxPositions = [
        [ 0, 0, 0 ],
        [ 1, 0, -2 ],
        [ 2, 0, 2 ]
    ],
    textureLoader = new THREE.TextureLoader(),
    gui;

createCustomMaterial();

constructScene( scene );

guiControl();

animate();

function createCustomMaterial() {
    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            {
                map: { value: null }
            }
        ] ),
        lights: false,
        vertexShader: vshader,
        fragmentShader: fshader
    })
}

function constructScene( scene ) {

    camera.position.set( -2, 0, 2 );
    control.update();

    boxMap = textureLoader.load( "./images/box.png" );
    grassMap = textureLoader.load( "./images/grass.png" );
    boxMap.wrapS = boxMap.wrapT = THREE.RepeatWrapping;
    boxMaterial.map = boxMap;

    boxes = boxPositions.map( position => {

        let pos = new THREE.Vector3( position[0], position[1], position[2] );
        let box = new THREE.Mesh( boxGeometry, boxMaterial );

        box.position.copy( pos );

        scene.add( box );

        return box;

    } );

    customMaterial.uniforms.map.value = grassMap;

    grass = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ),
        customMaterial
    );

    grass.position.set( 0, 0, 0.6 );

    scene.add( grass );

    scene.add(new THREE.AxesHelper( 2 ));

}

function guiControl(){

    gui = new dat.GUI();

}

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}