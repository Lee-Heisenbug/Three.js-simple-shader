( function() {

    let vertexShader = `
        varying vec2 vUv;

        attribute vec2 cPosition;

        void main(){

            gl_Position = vec4( cPosition, 0.0, 1.0 );
            vUv = uv;

        }
    `;

    let fragmentShader = `
        ${THREE.ShaderChunk.common}

        uniform sampler2D map;
        varying vec2 vUv;

        void main() {

            // inversed color
            gl_FragColor = vec4(vec3(1.0 - texture2D(map, vUv)), 1.0);

        }
    `;

    window.InversedColorMaterial = MaterialFactory({

        uniforms: {

            map: { value: null }

        },
        vertexShader,
        fragmentShader,
        depthTest: false

    })

} )();