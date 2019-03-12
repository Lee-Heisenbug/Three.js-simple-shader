function Example() {


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    this.light = new THREE.PointLight( 0xffffff,1 );
    this.floor = null;

    this.createScene();
    this.autoResizeCamera();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 10, 10, 1, 1 ),
            new PhongMaterial()
        );
        this.floor.rotation.x = - Math.PI / 2;
        this.floor.material.shininess = 0.5;
        this.scene.add( this.floor );
        
        this.camera.position.set( 3, 3, 3 );
        this.scene.add( this.camera );

        this.light.position.set( 0, 1, 0 );
        this.light.intensity = 0.5;
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