function Example( canvas ) {


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000 );
    this.light = new THREE.PointLight( 0xffffff,1 );
    this.boxes = [];
    this.room = new THREE.Mesh( new THREE.BoxGeometry(), new PointShadowMaterial() );
    this.renderer = new THREE.WebGLRenderer( { canvas: canvas } );
    this.renderer.shadowMap.enabled = true;

    this.createScene();
    this.setupRenderer();
    this.autoResizeCamera();
    this.setupOribitControls();
    
}

Object.assign( Example.prototype, {

    createScene: function() {

        // add camera
        this.camera.position.set( 10, 10, 10 );
        this.scene.add( this.camera );

        // add room
        this.room.material.side = THREE.BackSide;
        this.room.position.set( 0, 0, 0 );
        this.room.scale.set( 10, 10, 10 );
        this.scene.add( this.room );

        // add boxes
        var boxesCount = 5;
        this.addBoxes( boxesCount );

        // add light
        this.light.position.set( 0, 0, 0 );
        this.light.intensity = 0.5;
        this.light.castShadow = true;
        this.scene.add( this.light );

        // add light helper
        this.lightHelper = new THREE.PointLightHelper( this.light );
        this.scene.add( this.lightHelper );
        
        // add axes helper
        this.scene.add( new THREE.AxesHelper( 1 ) );


    },
    addBoxes: function( count ) {

        var box;

        for( var i = 0; i < count; ++i ) {

            box = new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshBasicMaterial() );
            box.material.castShadow = true;

            this.scene.add( box );

            box.position.set(
                Math.random() * 8 - 4,
                Math.random() * 8 - 4,
                Math.random() * 8 - 4
            )

        }

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

        this.lightHelper.update();

        requestAnimationFrame( () => {

            self.animate();

        } );

    },
    renderScene: function() {

        this.renderer.render( this.scene, this.camera );

    }

} );