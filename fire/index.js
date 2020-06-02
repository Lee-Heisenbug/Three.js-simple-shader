var vshader = `
    attribute float instanceLifeTime;
    attribute float instanceSpeed;
    attribute float instanceSize;
    attribute vec2 instanceOffset;
    attribute float instanceFadeIn;
    attribute float instanceFadeOut;

    uniform float time;

    varying float currentOpacity;

    void main(){
        
        float currentTime = mod( time, instanceLifeTime );
        float currentProgress = currentTime / instanceLifeTime;

        vec3 currentPosition = position;


        currentPosition.x += instanceOffset.x;
        currentPosition.z += instanceOffset.y;
        currentPosition.y =  currentTime * instanceSpeed;

        if( currentProgress < instanceFadeIn ) { //fading in

            currentOpacity = currentProgress / instanceFadeIn;
            
        } else if( currentProgress > instanceFadeOut ) {

            currentOpacity = 1.0 - ( currentProgress - instanceFadeOut ) / ( 1.0 - instanceFadeOut );

        } else {

            currentOpacity = 1.0;

        }

        // currentOpacity = 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( currentPosition, 1.0 );
        gl_PointSize = 10.0;

    }
`;

var fshader = `
    varying float currentOpacity;
    void main(){
        gl_FragColor = vec4(0.3, 0.1, 0.05,currentOpacity);
    }
`;

var customMaterial, fireGeo, fire, gui, instanceCount = 1000, clock = new THREE.Clock(), radius = 0.2,
    minFadeIn = 0.2, maxFadeOut = 0.7, maxLifeTime = 3, maxSpeed = 2;
var textureLoader = new THREE.TextureLoader(), colorMap;

constructScene( scene );

guiControl();

animate();

function animate() {

    customMaterial.uniforms.time.value += clock.getDelta();
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
                time: new THREE.Uniform( 0 )
            }
        ] ),
        vertexShader: vshader,
        fragmentShader: fshader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: true
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
    let lifeTimes = [];
    let offsets = [];
    let fadeIns = [];
    let fadeOuts = [];

    for( let i = 0; i < instanceCount; ++i ){

        speeds.push( Math.random() * maxSpeed );
        lifeTimes.push( Math.random() * maxLifeTime )

        let v_offset = new THREE.Vector2();
        v_offset.x = ( Math.random() * 2 - 1 ) * radius;
        v_offset.y = ( Math.random() * 2 - 1 ) * radius;
        v_offset.clampLength( 0.0,  radius )
        offsets.push( v_offset.x, v_offset.y )

        let fadeIn = Math.min( Math.max( Math.random(), minFadeIn ), maxFadeOut );
        fadeIns.push( fadeIn )
        fadeOuts.push( Math.min( Math.max( Math.random(), fadeIn ), maxFadeOut ) );

    }

    fireGeo.addAttribute( 'instanceSpeed', new THREE.InstancedBufferAttribute( new Float32Array( speeds ), 1 ) );
    fireGeo.addAttribute( 'instanceLifeTime', new THREE.InstancedBufferAttribute( new Float32Array( lifeTimes ), 1 ) );
    fireGeo.addAttribute( 'instanceOffset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 2 ) );
    fireGeo.addAttribute( 'instanceFadeIn', new THREE.InstancedBufferAttribute( new Float32Array( fadeIns ), 1 ) );
    fireGeo.addAttribute( 'instanceFadeOut', new THREE.InstancedBufferAttribute( new Float32Array( fadeOuts ), 1 ) );

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