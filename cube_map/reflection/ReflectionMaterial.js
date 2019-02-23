( function() {

    let vertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main(){

            vNormal = normalMatrix * normal;
            vPosition = vec3( modelViewMatrix * vec4( position , 1.0 ) );

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
    `;

    let fragmentShader = `
        ${THREE.ShaderChunk.common}

        uniform samplerCube envMap;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main(){

            vec3 envCoords = inverseTransformDirection( reflect( vPosition, normalize( vNormal ) ), viewMatrix );

            gl_FragColor = textureCube( envMap, envCoords );

        }
    `;

    window.ReflectionMaterial = MaterialFactory({

        uniforms: {

            envMap: { value: null }

        },
        vertexShader,
        fragmentShader

    })

} )();
