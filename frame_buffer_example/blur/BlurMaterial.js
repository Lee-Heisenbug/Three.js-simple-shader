( function() {

    var vertexShader = `
        varying vec2 vUv;

        attribute vec2 cPosition;

        void main(){

            gl_Position = vec4( cPosition, 0.0, 1.0 );
            vUv = uv;

        }
    `;

    var fragmentShader = `
        ${THREE.ShaderChunk.common}

        uniform sampler2D map;
        varying vec2 vUv;

        const float offset = 1.0 / 300.0;

        void main() {

            // blur effect
            vec2 offsets[9];
            offsets[ 0 ] = vec2(-offset,  offset); // top-left
            offsets[ 1 ] = vec2( 0.0,    offset); // top-center
            offsets[ 2 ] = vec2( offset,  offset); // top-right
            offsets[ 3 ] = vec2(-offset,  0.0); // center-left
            offsets[ 4 ] = vec2( 0.0,    0.0);   // center-center
            offsets[ 5 ] = vec2( offset,  0.0);   // center-right
            offsets[ 6 ] = vec2(-offset, -offset); // bottom-left
            offsets[ 7 ] = vec2( 0.0,   -offset); // bottom-center
            offsets[ 8 ] = vec2( offset, -offset); // bottom-right 
                
            float kernel[9];
            kernel[ 0 ] = 1.0 / 16.0;
            kernel[ 1 ] = 2.0 / 16.0;
            kernel[ 2 ] = 1.0 / 16.0;
            kernel[ 3 ] = 2.0 / 16.0;
            kernel[ 4 ] = 4.0 / 16.0;
            kernel[ 5 ] = 2.0 / 16.0;
            kernel[ 6 ] = 1.0 / 16.0;
            kernel[ 7 ] = 2.0 / 16.0;
            kernel[ 8 ] = 1.0 / 16.0;

            vec3 sampleTex[9];
            for( int i = 0; i < 9; i++ ){

                sampleTex[i] = vec3( texture2D( map, vUv.st + offsets[ i ] ) );

            }

            vec3 col = vec3( 0.0 );
            for(int i = 0; i < 9; i++) {

                col += sampleTex[i] * kernel[i];

            }

            gl_FragColor = vec4(col, 1.0);

        }
    `;

    window.BlurMaterial = MaterialFactory({

        uniforms: {

            map: { value: null }

        },
        vertexShader,
        fragmentShader,
        depthTest: false

    });

} )();