var vshader = `

    varying vec4 vColor;
    varying vec4 vPosition;
    
    attribute float instanceInitialProgress;
    attribute float instanceSpeed;
    attribute vec3 instanceColor;
    attribute float instanceOffsetRadian;
    attribute float instanceLineLength;

    uniform float time;
    uniform float curvature;
    uniform float lineWidth;

    float spinEquation( float radius ) {

        return radians( curvature * radius * 360.0 );

    }

    vec2 polarPosToCartesianPos( float radius, float radian ) {

        return vec2( radius * cos( radian ), radius * sin( radian ) );

    }

    vec3 getCurrentPosition( vec3 initPosition, float currentProgress ) {

        float radius, radian;
        float lineLength = instanceLineLength;

        radius = clamp( currentProgress * ( 1.0 + lineLength ) + ( initPosition.y - 1.0 ) * lineLength , 0.0, 1.0 );

        radian = spinEquation( radius );

        if( initPosition.x < 0.0 ) {

            radian += lineWidth;

        }

        radian += instanceOffsetRadian;

        return vec3( polarPosToCartesianPos( radius, radian ), 0.0 );

    }

    void main(){
        
        float currentProgress = mod( instanceInitialProgress + instanceSpeed * time, 1.0 );
        vec4 currentPosition = vec4( getCurrentPosition( position, currentProgress ), 1.0 );

        vColor = vec4( instanceColor, 1.0 );
        vPosition = currentPosition;

        gl_Position = projectionMatrix * modelViewMatrix * currentPosition;

    }
`;

var fshader = `
    varying vec4 vColor;
    varying vec4 vPosition;

    uniform float fogInnerRadius;
    uniform float fogOutterRadius;

    vec4 applyFog( vec4 inputColor ) {

        float fragmentRadius = length( vPosition.xy );

        return vec4( inputColor.rgb, ( fragmentRadius - fogInnerRadius ) / ( fogOutterRadius - fogInnerRadius ) );

    }

    void main(){

        vec4 outputColor = applyFog( vColor );

        gl_FragColor = outputColor;

    }
`;

var customMaterial,
    instanceCount = 100, instanceGeo = new THREE.InstancedBufferGeometry(),
    lines,
    gui;

constructScene( scene );

guiControl();

animate();

function constructScene( scene ){

    camera.position.set( 0, 0, 1 );
    control.update();

    // construct geo
    instanceGeo.addAttribute( 'position', new THREE.Float32BufferAttribute( [

        -0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        -0.5, 0.25, 0.0,
        0.5, 0.25, 0.0,
        -0.5, 0.50, 0.0,
        0.5, 0.50, 0.0,
        -0.5, 0.75, 0.0,
        0.5, 0.75, 0.0,
        -0.5, 1.0, 0.0,
        0.5, 1.0, 0.0,

    ], 3 ) );

    instanceGeo.index = new THREE.Uint8BufferAttribute( [

        0, 1, 2,
        1, 3, 2,

        2, 3, 4,
        3, 5, 4,

        4, 5, 6,
        5, 7, 6,

        6, 7, 8,
        7, 9, 8
        
    ], 1 );

    let speeds = [],
        progresses = [],
        colors = [],
        offsetRadians = [],
        lineLengths = [];

    for( let i = 0; i < instanceCount; ++i ){

        progresses.push( Math.random() );
        speeds.push( Math.random() );
        colors.push( Math.random(), Math.random(), Math.random() );
        offsetRadians.push( Math.random() * 2 * Math.PI );
        lineLengths.push( 0.3 + Math.random() * 0.1 - 0.15 );

    }

    instanceGeo.addAttribute( 'instanceInitialProgress', new THREE.InstancedBufferAttribute( new Float32Array( progresses ), 1 ) );
    instanceGeo.addAttribute( 'instanceSpeed', new THREE.InstancedBufferAttribute( new Float32Array( speeds ), 1 ) );
    instanceGeo.addAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 3 ) );
    instanceGeo.addAttribute( 'instanceOffsetRadian', new THREE.InstancedBufferAttribute( new Float32Array( offsetRadians ), 1 ) );
    instanceGeo.addAttribute( 'instanceLineLength', new THREE.InstancedBufferAttribute( new Float32Array( lineLengths ), 1 ) );

    customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge( [
            {
                time: { value: 0 },
                curvature: { value: 0.2 },
                lineWidth: { value: 0.05 },
                fogInnerRadius: { value: 0.03 },
                fogOutterRadius: { value: 0.1 },
            }
        ] ),
        vertexShader: vshader,
        fragmentShader: fshader,
        vertexColors: true,
        transparent: true,
        depthTest: false
    })

    lines = new THREE.Mesh(
        instanceGeo,
        customMaterial
    );

    scene.add( lines );
    scene.add( new THREE.AxesHelper() );

}

function guiControl(){

    gui = new dat.GUI();

    let timeFolder = gui.addFolder( "time" );
    let curvatureFolder = gui.addFolder( "curvature" );
    let lineWidthFolder = gui.addFolder( "lineWidth" );
    let fogInnerRadiusFolder = gui.addFolder( "fogInnerRadius" );
    let fogOutterRadiusFolder = gui.addFolder( "fogOutterRadius" );
    
    timeFolder.add( customMaterial.uniforms.time, 'value', 0, 2, 0.001 );
    curvatureFolder.add( customMaterial.uniforms.curvature, 'value', 0, 2, 0.001 );
    lineWidthFolder.add( customMaterial.uniforms.lineWidth, 'value', 0, 2, 0.001 );
    fogInnerRadiusFolder.add( customMaterial.uniforms.fogInnerRadius, 'value', 0, 2, 0.001 );
    fogOutterRadiusFolder.add( customMaterial.uniforms.fogOutterRadius, 'value', 0, 2, 0.001 );

}

function animate() {

    renderer.render( scene, camera );
    requestAnimationFrame( animate );

}