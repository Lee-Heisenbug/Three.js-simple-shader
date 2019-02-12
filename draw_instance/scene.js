var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1 );
var canvas = document.getElementById( 'scene-3d' );
var renderer = new THREE.WebGLRenderer( { canvas } );
var control = new THREE.OrbitControls( camera, canvas );

scene.add( camera );

renderer.setSize( window.innerWidth, window.innerHeight );

window.addEventListener( 'resize', onWindowResize );

onWindowResize();

function onWindowResize(){
    
    let aspect = window.innerHeight / window.innerWidth;
    let width = Math.sqrt( 4 / ( aspect * aspect + 1 ) );
    let height = width * aspect;

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;

    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}