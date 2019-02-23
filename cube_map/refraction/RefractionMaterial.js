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
        uniform float refractiveIndex;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main(){

            float ratio = 1.00 / refractiveIndex;

            vec3 envCoords = inverseTransformDirection( refract( normalize( vPosition ), normalize( vNormal ), ratio ), viewMatrix );

            gl_FragColor = textureCube( envMap, envCoords );

        }
    `;

    window.RefractionMaterial = MaterialFactory({

        uniforms: {

            envMap: { value: null },
            refractiveIndex: { value: 1.05 }

        },
        vertexShader,
        fragmentShader

    })

} )();
