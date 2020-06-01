var vshader = `
    // varying vec3 vNormal;
    // varying vec3 vPosition;
    // varying vec2 vUv;

    attribute float instanceSpeed;

    void main(){

        // vNormal = normalMatrix * normal;
        // vPosition = vec3( modelViewMatrix * vec4( position , 1.0 ) );
        // vUv = uv;
        // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        gl_Position = vec4( position, 1.0 );
        gl_PointSize = instanceSpeed * 10.0;

    }
`;

var fshader = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

var customMaterial, fireGeo, fire, gui, instanceCount = 1;
var textureLoader = new THREE.TextureLoader(), colorMap;

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

    scene.add( createFire() );

    scene.add( new THREE.AxesHelper() )

    // // init map
    // textureLoader.load( './images/diffuse.png', ( colorMap ) => {

    //     customMaterial.uniforms.colorMap.value = colorMap;
    //     customMaterial.uniforms.hasColorMap.value = true;
        
    // } )

}
function createFire() {

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            {

            }
        ] ),
        vertexShader: vshader,
        fragmentShader: fshader
    })

    createFireGeo()

    fire = new THREE.Points(
        fireGeo,
        customMaterial
    );

    return fire;

}

function createFireGeo() {

    fireGeo = new THREE.InstancedBufferGeometry();

    // construct geo
    fireGeo.addAttribute( 'position', new THREE.Float32BufferAttribute( [
        0.0, 0.0, 0.0
    ], 3 ) );

    let speeds = [];

    for( let i = 0; i < instanceCount; ++i ){

        speeds.push( Math.random() );

    }

    fireGeo.addAttribute( 'instanceSpeed', new THREE.InstancedBufferAttribute( new Float32Array( speeds ), 1 ) );

}

function guiControl(){

    gui = new dat.GUI();
    // let ambientFolder = gui.addFolder('ambient');
    // let materialFolder = gui.addFolder('material');

    // ambientFolder.add(ambientLight.color,'r', 0, 1);
    // ambientFolder.add(ambientLight.color,'g', 0, 1);
    // ambientFolder.add(ambientLight.color,'b', 0, 1);
    // ambientFolder.add(ambientLight, 'intensity', 0, 1);

    // materialFolder.add(customMaterial.uniforms.colorFac.value, 'r', 0, 1);
    // materialFolder.add(customMaterial.uniforms.colorFac.value, 'g', 0, 1);
    // materialFolder.add(customMaterial.uniforms.colorFac.value, 'b', 0, 1);

}