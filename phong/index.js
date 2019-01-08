var vshader = `
    void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    }
`;

var fshader = `
    uniform vec3 color;
    uniform vec3 ambientLightColor;
    void main(){
        gl_FragColor = vec4(color * ambientLightColor, 1.0);
    }
`;

var customMaterial, box, ambientLight, gui;

constructScene( scene );

guiControl();

animate();

function animate() {
    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function constructScene( scene ){
    camera.position.z = 5

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib[ "lights" ],
            {
                color: new THREE.Uniform(new THREE.Color(0xffff00))
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

    ambientLight = new THREE.AmbientLight( new THREE.Color(0xffffff), 1.0 );
    scene.add( ambientLight );
}

function guiControl(){
    gui = new dat.GUI();
    let ambientFolder = gui.addFolder('ambient');
    let materialFolder = gui.addFolder('material');

    ambientFolder.add(ambientLight.color,'r', 0, 1);
    ambientFolder.add(ambientLight.color,'g', 0, 1);
    ambientFolder.add(ambientLight.color,'b', 0, 1);
    ambientFolder.add(ambientLight, 'intensity', 0, 1);

    materialFolder.add(customMaterial.uniforms.color.value, 'r', 0, 1);
    materialFolder.add(customMaterial.uniforms.color.value, 'g', 0, 1);
    materialFolder.add(customMaterial.uniforms.color.value, 'b', 0, 1);
}