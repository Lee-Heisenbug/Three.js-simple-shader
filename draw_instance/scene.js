var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1 );
var canvas = document.getElementById( 'scene-3d' );
var renderer = new THREE.WebGLRenderer( { canvas } );
var control = new THREE.OrbitControls( camera, canvas );

scene.add( camera );

renderer.setSize( window.innerWidth, window.innerHeight );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}