function MaterialFactory( defaultParameters ) {

    let materialSingleton = new THREE.ShaderMaterial( defaultParameters );

    function CustomMaterial( parameters ) {

        Object.assign( this, materialSingleton.clone() );

        let proxyProperties = Object.keys( this.uniforms );

        proxyProperties.forEach( propName => {

            Object.defineProperty( this, propName, {

                get() {

                    return this.uniforms[ propName ].value;

                },
                set( newValue ) {

                    this.uniforms[ propName ].value = newValue;

                }

            } )

        } );

        Object.assign( this, parameters );

    }

    CustomMaterial.prototype =  Object.assign( Object.create( THREE.ShaderMaterial.prototype ), {

        constructor: CustomMaterial

    } )

    return CustomMaterial;

}