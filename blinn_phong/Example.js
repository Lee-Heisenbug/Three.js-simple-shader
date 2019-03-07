function Example() {


    this.scene = new THREE.Scene(),
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 )

    this.createScene();
    this.autoResizeCamera();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        let floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial()
        );

        this.camera.position.set( 1, 1, 1 );

        this.scene.add( floor );
        this.scene.add( this.camera );

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

} );