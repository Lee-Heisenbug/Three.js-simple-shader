var vshader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main(){

        vNormal = normalMatrix * normal;
        vPosition = vec3( modelViewMatrix * vec4( position , 1.0 ) );
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    }
`;

var fshader = `
    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.lights_pars_begin}

    vec3 calculateDiffuse(
        const in vec3 objColor, const in vec3 lightColor,
        const in vec3 lightDir, const in vec3 fragNormal 
    ) {

        return objColor * lightColor * max( dot( fragNormal, lightDir ), 0.0 );

    }

    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main(){

        vec3 result;
        vec3 ambient;
        vec3 diffuse = vec3( 0 );
        vec3 specular = vec3( 0 );
        vec3 reflectDir;
        float specularStrength = 0.0;
        vec3 fragNormal = normalize( vNormal );
        vec3 fragPosition = normalize( vPosition );

        ambient = color * ambientLightColor;

        #if NUM_DIR_LIGHTS > 0

            for( int i = 0; i < NUM_DIR_LIGHTS; ++i ){

                diffuse = diffuse + calculateDiffuse(
                    color, directionalLights[i].color,
                    directionalLights[i].direction, fragNormal
                );

                reflectDir = reflect( - directionalLights[i].direction, fragNormal );

                specularStrength = max( dot( reflectDir, - fragPosition ) , 0.0 );

                specular = specular + directionalLights[i].color * specularStrength;
    
            }

        #endif

        result = ambient + diffuse + specular;

        gl_FragColor = vec4(result, 1.0);

    }
`;

var customMaterial, box, ambientLight, directionalLight, directionalLightHelper, gui;

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

    ambientLight = new THREE.AmbientLight( new THREE.Color(0xffffff), 0.3 );
    directionalLight = new THREE.DirectionalLight( new THREE.Color(0xffffff), 1.0 );
    directionalLight.position.set( 0, 1, 0 );
    directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add( ambientLight );
    scene.add( directionalLight );
    scene.add( directionalLightHelper );

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