let vertexShader = `
    varying vec3 envCoords;

    void main(){

        envCoords = position;
        gl_Position = ( projectionMatrix * vec4( mat3( viewMatrix ) * position, 1.0 ) ).xyww;

    }
`;

let fragmentShader = `
    ${THREE.ShaderChunk.common}

    uniform samplerCube envMap;
    varying vec3 envCoords;

    void main(){

        gl_FragColor = textureCube( envMap, envCoords );

    }
`;

let SkyboxMaterial = MaterialFactory({

    uniforms: {

        envMap: { value: null }

    },
    vertexShader,
    fragmentShader,
    side: THREE.BackSide

})