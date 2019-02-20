var vshader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main(){

        vNormal = normalMatrix * normal;
        vPosition = vec3( modelViewMatrix * vec4( position , 1.0 ) );
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}

    varying vec3 vPosition;
    varying vec2 vUv;
    void main(){

        gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );

    }
`;

var customMaterial, box, ambientLight, directionalLight, directionalLightHelper, gui;
var textureLoader = new THREE.TextureLoader(), colorMap;

constructScene( scene );

guiControl();

animate();

function animate() {

    directionalLightHelper.update();
    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}

function constructScene( scene ){

    camera.position.set( -3, 3, 3 );
    control.update();

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib[ "lights" ],
            {
                colorFac: new THREE.Uniform(new THREE.Color(0xffffff)),
                colorMap: { value: null },
                hasColorMap: { value: false },
                specularFac: new THREE.Uniform(new THREE.Color(0xffffff)),
                specularMap: { value: null },
                hasSpecularMap: { value: false },
                shininess: { value: 32 }
            }
        ] ),
        lights: true,
        vertexShader: vshader,
        fragmentShader: fshader
    })

    box = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 1, 1, 1 ),
        customMaterial
    );

    scene.add(box);

    // init map
    textureLoader.load( './images/diffuse.png', ( colorMap ) => {

        customMaterial.uniforms.colorMap.value = colorMap;
        customMaterial.uniforms.hasColorMap.value = true;
        
    } )

    textureLoader.load( './images/specular.png', ( specularMap ) => {

        customMaterial.uniforms.specularMap.value = specularMap;
        customMaterial.uniforms.hasSpecularMap.value = true;
        
    } )

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