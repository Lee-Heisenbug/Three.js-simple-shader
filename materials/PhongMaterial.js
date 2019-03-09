( function() {

    var vshader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main(){

            vNormal = normalize( normalMatrix * normal );
            vPosition = vec3( modelViewMatrix * vec4( position , 1.0 ) );
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

        }
    `;

    var fshader = `
        ${THREE.ShaderChunk.common}
        ${THREE.ShaderChunk.bsdfs}
        ${THREE.ShaderChunk.lights_pars_begin}

        uniform vec3 colorFac;
        uniform sampler2D colorMap;
        uniform bool hasColorMap;

        uniform vec3 specularFac;
        uniform sampler2D specularMap;
        uniform bool hasSpecularMap;

        uniform float shininess;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        vec3 getDiffuse( vec3 );

        #if NUM_DIR_LIGHTS > 0
            vec3 getDirectionalLightsDiffuse( vec3 );
        #endif

        #if NUM_POINT_LIGHTS > 0
            vec3 getPointLightsDiffuse( vec3 );
        #endif

        vec3 calculateDiffuse( const in vec3, const in vec3, const in vec3 );

        void main(){

            vec3 color;
            vec3 specularColor;

            vec3 ambient;
            vec3 diffuse;
            vec3 specular = vec3( 0 );
            vec3 result;

            vec3 fragPosition = normalize( vPosition );
            vec3 reflectDir;
            float specularStrength;

            // set the color
            color = colorFac;
            if( hasColorMap ) {

                color = color * vec3( texture2D( colorMap, vUv ) );

            }

            // set specular color
            specularColor = specularFac;
            if( hasSpecularMap ) {

                specularColor = specularColor * vec3( texture2D( specularMap, vUv ) );

            }

            ambient = color * ambientLightColor;

            diffuse = getDiffuse( color );

            // specular = getSpecular();

            result = ambient + diffuse + specular;

            gl_FragColor = vec4( result, 1.0 );

        }

        vec3 getDiffuse( vec3 color ) {

            vec3 diffuse = vec3( 0 );

            #if NUM_DIR_LIGHTS > 0
            
                diffuse += getDirectionalLightsDiffuse( color );

            #endif

            #if NUM_POINT_LIGHTS > 0
            
                diffuse += getPointLightsDiffuse( color );

            #endif
            
            return diffuse;

        }

        #if NUM_DIR_LIGHTS > 0
            vec3 getDirectionalLightsDiffuse( vec3 color ) {

                vec3 diffuse = vec3( 0 );

                for( int i = 0; i < NUM_DIR_LIGHTS; ++i ) {

                    diffuse += calculateDiffuse(
                        color * directionalLights[ i ].color,
                        directionalLights[i].direction, vNormal
                    );

                }

                return diffuse;

            }
        #endif

        #if NUM_POINT_LIGHTS > 0
            vec3 getPointLightsDiffuse( vec3 color ) {

                vec3 diffuse = vec3( 0 );
                vec3 pointLightDirection;

                for( int i = 0; i < NUM_POINT_LIGHTS; ++i ) {

                    pointLightDirection = pointLights[ i ].position - vPosition;

                    diffuse += calculateDiffuse(
                        color * pointLights[ i ].color,
                        pointLightDirection, vNormal
                    );

                }

                return diffuse;

            }
        #endif

        vec3 calculateDiffuse(
            const in vec3 color,
            const in vec3 lightDir,
            const in vec3 fragNormal
        ) {

            return color * max( dot( fragNormal, normalize( lightDir ) ), 0.0 );

        }

        // vec3 getSpecular() {

        //     for( int i = 0; i < NUM_DIR_LIGHTS; ++i ){

        //         diffuse = diffuse + calculateDiffuse(
        //             color, directionalLights[i].color,
        //             directionalLights[i].direction, fragNormal
        //         );

        //         reflectDir = reflect( - directionalLights[i].direction, fragNormal );

        //         specularStrength = pow( max( dot( reflectDir, - fragPosition ) , 0.0 ), shininess );

        //         specular = specular + specularColor * directionalLights[i].color * specularStrength;
    
        //     }

        // }
    `;

    window.PhongMaterial = MaterialFactory( {
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
    } );

} )();