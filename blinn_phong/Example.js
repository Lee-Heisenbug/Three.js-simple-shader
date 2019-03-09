function Example() {


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    this.light = new THREE.PointLight( new THREE.Color( 255, 255, 255 ) );

    this.createScene();
    this.autoResizeCamera();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        let floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new PhongMaterial()
        );
        floor.rotation.x = - Math.PI / 2;
        this.scene.add( floor );
        
        this.camera.position.set( 1, 1, 1 );
        this.scene.add( this.camera );

        this.light.position.set( 0, 0.3, 0 );
        this.light.intensity = 0.003;
        this.scene.add( this.light );

        let lightHelper = new THREE.PointLightHelper( this.light );
        this.scene.add( lightHelper );
        
        this.scene.add( new THREE.AxesHelper( 1 ) );

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