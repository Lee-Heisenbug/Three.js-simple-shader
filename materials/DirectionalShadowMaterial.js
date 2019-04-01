( function() {

  var vshader = `
      ${THREE.ShaderChunk.shadowmap_pars_vertex}
      void main(){

        #if NUM_DIR_LIGHTS > 0
      
          for( int i = 0; i < NUM_DIR_LIGHTS; ++i ) {

            vDirectionalShadowCoord[ i ] =  directionalShadowMatrix[ i ] * modelMatrix * vec4( position, 1.0 );

          }
        
        #endif

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        
      }
  `;

  var fshader = `
      ${THREE.ShaderChunk.packing}
      ${THREE.ShaderChunk.shadowmap_pars_fragment}

      void setDirectionalShadow();

      void main() {

        #if NUM_DIR_LIGHTS > 0

          setDirectionalShadow();

        #endif

      }

      void setDirectionalShadow() {

        for( int i = 0; i < NUM_DIR_LIGHTS; ++i ) {

          vec4 directionalShadowCoord = vDirectionalShadowCoord[ i ];

          // perform perspective divide
          vec3 projCoords = directionalShadowCoord.xyz / directionalShadowCoord.w;

          // get closest depth value from light's perspective (using [0,1] range fragPosLight as coords)
          float closestDepth = texture2D( directionalShadowMap[ i ], projCoords.xy ).a;

          // get depth of current fragment from light's perspective
          float currentDepth = projCoords.z;

          gl_FragColor = vec4( vec3( currentDepth > closestDepth ? 0.0 : 1.0 ), 1.0 );

        }

      }

  `;

  window.DirectionalShadowMaterial = MaterialFactory( {
      uniforms: THREE.UniformsUtils.merge( [
          THREE.UniformsLib[ "lights" ]
      ] ),
      lights: true,
      vertexShader: vshader,
      fragmentShader: fshader
  } );

} )();