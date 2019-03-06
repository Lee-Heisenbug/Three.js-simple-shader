let phongExample = createPhongExample();
let blinnPhongExample = createBlinnPhongExample();
renderTwoScenesOnOneCanvas();
guiControl();

function createPhongExample() {

    let example = createAlikeExample();

};
function createBlinnPhongExample() {
    
    let example = createAlikeExample();

};
function Example() {


    this.scene = new THREE.Scene(),
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 )

    this.createScene();
    this.autoResizeCamera();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        

    },
    autoResizeCamera: function() {

        let self = this;

        this.resizeCamera();
        window.addEventListener( 'resize', function() {

            self.resizeCamera();

        } );

    },
    resizeCamera: function() {

        this.camera.aspect = window.innerWidth / 2 / window.innerHeight;
        this.camera.updateProjectionMatrix();

    }

} )

function renderTwoScenesOnOneCanvas() {};
function guiControl(){

    gui = new dat.GUI();
    let ambientFolder = gui.addFolder('ambient');
    let materialFolder = gui.addFolder('material');

    ambientFolder.add(ambientLight.color,'r', 0, 1);
    ambientFolder.add(ambientLight.color,'g', 0, 1);
    ambientFolder.add(ambientLight.color,'b', 0, 1);
    ambientFolder.add(ambientLight, 'intensity', 0, 1);

    materialFolder.add(customMaterial.uniforms.colorFac.value, 'r', 0, 1);
    materialFolder.add(customMaterial.uniforms.colorFac.value, 'g', 0, 1);
    materialFolder.add(customMaterial.uniforms.colorFac.value, 'b', 0, 1);

}