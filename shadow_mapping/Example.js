function Example( canvas ) {


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    this.light = new THREE.DirectionalLight( 0xffffff,1 );
    this.box = new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshBasicMaterial() );
    this.floor = null;
    this.renderer = new THREE.WebGLRenderer( { canvas: canvas } );
    this.renderer.shadowMap.enabled = true;

    this.createScene();
    this.setupRenderer();
    this.autoResizeCamera();
    this.setupOribitControls();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        // add floor
        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 10, 10, 1, 1 ),
            new DirectionalShadowMaterial()
        );
        this.floor.rotation.x = - Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add( this.floor );

        // add camera
        this.camera.position.set( 3, 3, 3 );
        this.scene.add( this.camera );

        // add box for shadow
        this.box.material.color.set( 0x00ffff );
        this.box.position.set( 0, 2, 0 );
        this.box.castShadow = true;
        this.scene.add( this.box );

        // add light
        this.light.position.set( 0, 10, 0 );
        this.light.intensity = 0.5;
        this.light.castShadow = true;
        this.scene.add( this.light );

        // add light helper
        let lightHelper = new THREE.DirectionalLightHelper( this.light );
        this.scene.add( lightHelper );
        
        // add axes helper
        this.scene.add( new THREE.AxesHelper( 1 ) );

    },
    setupRenderer: function() {

        let self = this;
        
        this.resizeRenderer();
        window.addEventListener( 'resize', function() {

            self.resizeRenderer();

        } );        

    },
    resizeRenderer: function() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    },
    autoResizeCamera: function() {

        let self = this;

        this.resizeCamera();
        window.addEventListener( 'resize', function() {

            self.resizeCamera();

        } );

    },
    resizeCamera: function() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

    },
    setupOribitControls: function() {

        new THREE.OrbitControls( this.camera, this.renderer.domElement );
    
    },
    animate: function() {

        let self = this;

        this.renderScene();

        requestAnimationFrame( () => {

            self.animate();

        } );

    },
    renderScene: function() {

        this.renderer.render( this.scene, this.camera );

    }

} );