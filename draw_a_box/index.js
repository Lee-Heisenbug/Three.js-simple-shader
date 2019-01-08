var vshader = `
    void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    }
`;

var fshader = `
    uniform vec3 color;
    void main(){
        gl_FragColor = vec4(color, 1.0);
    }
`;

var customMaterial, box;

constructScene( scene );

animate();

function animate() {
    requestAnimationFrame( animate );
    box.rotation.x += 0.1;
    box.rotation.y += 0.1;
	renderer.render( scene, camera );
}

function constructScene( scene ){
    camera.position.z = 5

    customMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: new THREE.Uniform(new THREE.Color(0xffff00))
        },
        vertexShader: vshader,
        fragmentShader: fshader
    })

    box = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 1, 1, 1 ),
        customMaterial
    );
    // box = new THREE.Mesh(
    //     new THREE.BoxBufferGeometry( 1, 1, 1 ),
    //     new THREE.MeshBasicMaterial({color:new THREE.Color(0xff0000)})
    // );
    scene.add(box);
}