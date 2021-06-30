/*
	Proton's wrapper
	================

	## Description
	This contains all the boring stuff to get Proton to work, like the Proton3DInterpreter.

	## Table of Contents

	| Section Name               | Location # |
	| -------------------------- | ---------- |
	| Scripts                    | loc:1      | <- Ctrl+F "loc:#" to get to the location specified.
	| Proton3DInterpreter        | loc:2      |
	| Proton3D Tools             | loc:3      |

*/

/*
	~> loc:1
	Loading the default Proton3DInterpreter's dependencies
*/

class Scripts {

	stats = { loadedScripts: 0, maxScripts: 10 };
	
	init() {

		this.stats.maxScripts = 0;
		
		// Babylon.js
		this.import( "https://cdn.babylonjs.com/babylon.js", true, () => {
			
			// Stuff that creates the sky + more materials
			this.import( "https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js", true );
	
			// Stuff that loads files like glTF
			this.import( "https://cdn.babylonjs.com/loaders/babylonjs.loaders.js", true );
	
			// Physics!
			this.import( "https://cdn.babylonjs.com/ammo.js", false );
	
		} );
	
	}

	import( url, isModule = true, callback ) {

		this.stats.maxScripts ++;
		if ( ! isModule ) {
	
			var script = document.createElement( "script" );
			script.src = url;
			document.head.appendChild( script );
			script.onload = () => {
	
				if ( callback ) callback();
				this.stats.loadedScripts ++;
				if ( this.stats.loadedScripts >= this.stats.maxScripts ) window.finishedLoadingScripts = true;
	
			}
			;
	
			return;
	
		}
	
		import( url ).then( (value) => {
	
			// finished!
			if ( callback ) callback();
			this.stats.loadedScripts++;
			if ( this.stats.loadedScripts >= this.stats.maxScripts ) window.finishedLoadingScripts = true;
	
		} );
	
	}

}

class Game {

	constructor( init ) { // init: The function to be called as the "initial" function of your game. Think of it like GDScript's _ready().

		this.code = init;

	}

	_run() {

		if ( typeof this.code == "string" ) {

			eval( this.code );

		} else {

			this.code();

		}

	}

	start() {

		var code = this,
			scripts = new Scripts(),
			interval = setInterval( function () {

				code.loadingPercentage = ( scripts.stats.loadedScripts / scripts.stats.maxScripts ) * 100;
				if ( code.loadingPercentage == 100 ) {

					clearInterval( interval );
					code._run();

				}

			}, 1500 );
		
		scripts.init();
		this.scripts = scripts;

	}

}

/*
	~> loc:2
	Proton3DInterpreter
*/
class ObjectList {
	
	meshes = [];

	materials = [];

	getMeshByName( name ) {

		return this.meshes.find( function ( x ) {

			return x.name === name;

		} );

	}

	getMaterialByName( name ) {

		return this.materials.find( function ( x ) {

			return x.name === name;

		} );

	}

}
objectList = new ObjectList();

//\\//\\//\\//\\//\\//\\//\\//\\//\\//
//\\ Proton3DInterpreter		    //
//\\//\\//\\//\\//\\//\\//\\//\\//\\//
// 	README
// 		[!] All functions shown below that have parameters and that
// 				are not called by other functions in the Interpreter
// 				must have the same parameters when being
// 				rewritten or overwritten by a user.
//
// 				[!] -> Since some functions use "extras" for a parameter,
// 							keep in mind that these functions may be called by
// 							proton.js and not by the user. As such, they will
// 							always retain the same structure unless otherwise stated.
//
// 		[!] The same goes for returned functions: if a function returns
// 				a value (even if that function is inside of a parent function,
// 				especially if that parent function returns the child function),
// 				that value must have the same structure as when it was found by
// 				the user.
//
class Proton3DInterpreter {

	objects = new ObjectList();

	element = document.createElement( "scene" );

	canvas = document.createElement( "canvas" );

	shadowGenerators = [];

	postprocessing = {
		enabled: false,
		bloom: true,
		ssao: true,
		fxaa: true,
		usePCSS: false,
		anisotropicFilteringLevel: 4
	}

	init( params, scene ) {

		// Sets up the scene
		this.dynamicResize( scene );

		// Resizes the canvas + applies CSS to it
		this.canvas.style.cssText = "position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;outline: none;"
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		// Creates the engine + scene
		this.engine = new BABYLON.Engine( 
			this.canvas,
			true,
			{ preserveDrawingBuffer: true, stencil: true }
		);
		this.scene = new BABYLON.Scene( this.engine );
		this.scene.clearColor = new BABYLON.Color4( 0, 0, 0, 0 );

		// Creates the sky
		if ( params.sky != false && params.backgroundColor == undefined ) scene.sky = new Proton3DObject( { type: "sky" } );

		// Creates a camera
		this.camera = new Proton3DObject( { type: "perspectivecamera", position: new Proton.Vector3( 0, 0, 5 ) } );

		// Creates a camera for third-person view
		this.thirdCamera = new Proton3DObject( { type: "3rdperspectivecamera", position: new Proton.Vector3( 0, 0, 5 ) } );

		// Postprocessing
		if ( this.postprocessing.enabled ) {
		
			this.pipeline = new BABYLON.DefaultRenderingPipeline( "default", true, this.scene, [ objectList.getMeshByName( this.camera.name ) ] );
			if ( this.postprocessing.bloom ) this.pipeline.bloomEnabled = true;
			if ( this.postprocessing.fxaa ) this.pipeline.fxaaEnabled = true;
			if ( this.postprocessing.ssao ) this.ssao = new BABYLON.SSAORenderingPipeline( "ssao", this.scene, { ssaoRatio: 0.5, combineRatio: 1.0 }, [ objectList.getMeshByName( this.camera.name ) ] );

		}

		// Physics
		this.scene.enablePhysics( new BABYLON.Vector3( 0,-9.81, 0 ), new BABYLON.AmmoJSPlugin() );

		// Sets up the canvas
		this.element.appendChild( this.canvas );
		document.body.appendChild( this.element );

		// Updates the scene
		var materialLength = 0; // For anisotropic filtering (see below)
		this.engine.runRenderLoop( () => {

			this.updateScene( scene )

			// Sets texture properties
			if ( materialLength != this.scene.materials.length ) {

				materialLength = this.scene.materials.length;
				this.scene.textures.forEach( ( texture ) => {
				
					// Anisotropic filtering
					texture.anisotropicFilteringLevel = this.postprocessing.anisotropicFilteringLevel;
					texture.updateSamplingMode( BABYLON.Texture.TRILINEAR_SAMPLINGMODE );

				} );

			}

		} );
		
		// Starts the scene
		this.updateScene( scene );

	}

	// Updates a scene in Proton
	updateScene( protonScene ) {

		// Pausing
		if ( Proton && Proton.paused ) {

			return;

		}

		// Updates the scene
		protonScene.update();

	}

	// Renders everything
	render() {

		this.scene.render();

	}

	// Dynamically resizes the scene when the page is resized
	dynamicResize() {

		var interpreter = this;
		window.addEventListener( "resize", function () {

			interpreter.engine.resize();

		} );

	}

	// Removes an object from a scene
	removeFromScene( object ) {

		this.scene.removeMesh( objectList.getMeshByName( object.name ) );

	}

	// Does whatever when Proton resumes/pauses
	resume() {

		this.scene.physicsEnabled = true;

	}

	pause() {

		this.scene.physicsEnabled = false;

	}

	// Gets objects a mesh is colliding with
	getCollidingObjects( P3DObject ) {

		var collisions = [];
		this.scene.meshes.forEach( ( mesh ) => { // Runs through all the meshes and runs a collision detection function on all of them. If they are colliding with the P3DObject, add them to an array which will be returned at the end of the function.
		
			if ( !mesh.p3dParent || !mesh.physics ) return;
			var contact = new Ammo.ConcreteContactResultCallback();
			contact.hasContact = false;
			contact.addSingleResult = function( cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1 ) { // https://medium.com/@bluemagnificent/collision-detection-in-javascript-3d-physics-using-ammo-js-and-three-js-31a5569291ef

				let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

				const distance = contactPoint.getDistance();

				if( distance > 0 ) return;

				this.hasContact = true;

			}
			this.scene.getPhysicsEngine()._physicsPlugin.world.contactPairTest( mesh.physics.physicsBody, objectList.getMeshByName( P3DObject.name ).physics.physicsBody, contact );
			if ( contact.hasContact && mesh.p3dParent != P3DObject ) collisions.push( mesh.p3dParent )
		
		} );
		return collisions

	}

	// Creates a shadow generator
	createShadowGenerator( light ) {

		var shadowGenerator = new BABYLON.ShadowGenerator( 2048, light );
		light.shadowMinZ = .1;
		light.shadowMaxZ = 100;
		shadowGenerator.usePercentageCloserFiltering = true;
		this.shadowGenerators.push( shadowGenerator );

	}

	// Rotates a vector
	rotateVector3( vector, euler ) {

		// https://www.html5gamedevs.com/topic/15079-rotating-a-vector/
		var quaternion = BABYLON.Quaternion.FromEulerAngles( euler.x, euler.y, euler.z );
		var matrix = new BABYLON.Matrix();
		quaternion.toRotationMatrix( matrix );
		var rotatedVect = BABYLON.Vector3.TransformCoordinates( vector, matrix );
		return rotatedVect;

	}
	
	// Sets camera controls
	setCameraControls( params ) {
		
		var interpreter = this;
		
		// Creates a fake physics mesh
		var object = new Proton3DObject( {
			type: "capsule",
			height: params.height != undefined? params.height + 2 : 5,
			radius: 10,
			friction: 1,
			restitution: 0,
			mass: 1,
			castShadow: false,
			noPhysics: params.noPhysics,
			// setTimeout is bad.
			// I can't use it.

			// But I can.
			//  'Cause that's the way I like to live my life 🎵
			// 🎵 and I think that everything's gonna be fine.
			onReady: () => setTimeout( function() {
				object.setAngularFactor( 0, 0, 0 );
				object.material.makeTransparent();
				params.cameraParent.setPosition( 0, 0, 0 );
			}, 500 )
		} );
		params.cameraParent.physicsObject = object;
		params.cameraParent.setPosition( 0, 0, 0 );
		object.add( params.cameraParent );
		params.type == "firstperson"? object.add( params.scene.camera ) : object.add( params.scene.thirdCamera );

		// Sets the camera's position
		var cameraPosition = params.cameraParent.position.add( new BABYLON.Vector3( params.distance.x, params.distance.y, params.distance.z ) );
		params.scene.camera.setPosition( cameraPosition.x, cameraPosition.y, cameraPosition.z );
		
		// Does regular stuff
		var mouseMoveFunction, beforeRenderFunction, clickFunction, keyDownFunction; // Functions that handle various events. keyDownFunction and clickFunction are optional.
		switch( params.type ) {

			case "firstperson":
				
				mouseMoveFunction = function ( e ) {

					if ( ! Proton.paused ) {

						params.scene.camera.rotation.y += Proton.degToRad( e.movementX / params.xSensitivity );
						if ( params.scene.camera.rotation.x + Proton.degToRad( e.movementY / params.ySensitivity ) < 1.57 &&
							params.scene.camera.rotation.x + Proton.degToRad( e.movementY / params.ySensitivity ) > -1.57 ) {
							
							params.scene.camera.rotation.x += Proton.degToRad( e.movementY / params.ySensitivity );

						}

					}

				};
				beforeRenderFunction = function () {

					// Sets the crosshair's position
					params.scene.crosshair.localPosition = params.scene.camera.getWorldDirection();
					params.scene.crosshair.position = object.position.clone().add( params.scene.crosshair.localPosition ).add( params.scene.camera.position );

					// Sets the rotation of the player mesh
					params.cameraParent.rotation.y = params.scene.camera.rotation.y;			

				};
				break;

			case "birdseye": // Top-down view with a fixed beta value for the camera.

				params.distance.x = 20;
				objectList.getMeshByName( params.scene.thirdCamera.name ).lowerBetaLimit = objectList.getMeshByName( params.scene.thirdCamera.name ).upperBetaLimit = Proton.degToRad( 54.7 )
				
				

			case "thirdperson":
			
				// Enables/disables controls in Babylon on "pointerlockchange"
				document.addEventListener( "pointerlockchange", function () {
					
					if ( !document.pointerLockElement ) {

						params.scene.thirdCamera.disable();// Disables camera controls when there is no pointer lock
						
					} else {

						params.scene.thirdCamera.enable();// Does the exact opposite as above

					}

				}, false );		
				
				// Sets functions to enable + disable camera controls
				params.scene.thirdCamera.disable = () => objectList.getMeshByName( params.scene.thirdCamera.name ).detachControl( interpreter.canvas );
				params.scene.thirdCamera.enable = () =>  objectList.getMeshByName( params.scene.thirdCamera.name ).attachControl( interpreter.canvas );
						
				// Creates variables
				var animating, deg; // Wether the player is turning around and the angle (almost) in which it should be facing, in degrees (hence the name "deg")

				// Sets some camera properties
				objectList.getMeshByName( params.scene.thirdCamera.name ).inertia = 0;
				objectList.getMeshByName( params.scene.thirdCamera.name ).radius = params.distance.x;
				objectList.getMeshByName( params.scene.thirdCamera.name ).angularSensibilityX = 1000 - 60 * params.xSensitivity;
				objectList.getMeshByName( params.scene.thirdCamera.name ).angularSensibilityY = 1000 - 60 * params.ySensitivity;
				// Sets this camera as the active one.
				interpreter.scene.activeCamera = objectList.getMeshByName( params.scene.thirdCamera.name );
				params.scene.thirdCamera.active = true;

				// Now for the functions.
				mouseMoveFunction = function ( e ) {

					if ( ! Proton.paused ) {

						params.scene.crosshair.localPosition = params.scene.thirdCamera.position.clone().multiply( new BABYLON.Vector3( -.1, 0, -.1 ) );

					}

				};
				beforeRenderFunction = function () {

					// Sets the crosshair's position
					params.scene.crosshair.position = object.position.clone().add( params.scene.crosshair.localPosition );

					// Rotates the player
					deg = Proton.radToDeg( objectList.getMeshByName( Proton.scene.thirdCamera.name ).alpha )
					if ( deg > 360 ) deg = deg - 360;
					if ( deg < 360 ) deg = deg + 360;
					if ( !animating && Object.values( params.scene.keys ).indexOf( true ) > -1 ) params.cameraParent.rotation.y = Proton.degToRad( -deg + 90 );

				};
				keyDownFunction = function() {
					if ( Math.abs( params.cameraParent.rotation.y - Proton.degToRad( -deg + 90 ) )>= 1 && animating != true ) {
					
						animating = true;
						var origin = new BABYLON.Vector3( 0, params.cameraParent.rotation.y, 0 );
						Proton.animate( origin, {
							x: 0,
							y: Proton.degToRad( -deg + 90 ),
							z: 0,
						}, {
							step: function () {
			
								params.cameraParent.rotation.y = origin.y;
			
							},
							callback: () => animating = false,
							duration: 400
						} );

					}
				}
				clickFunction = function() {
					
					if ( document.pointerLockElement ) keyDownFunction();

				}

		}
		if ( keyDownFunction ) document.body.addEventListener( "keydown",  keyDownFunction )
		if ( clickFunction ) document.body.addEventListener( "click",  clickFunction )
		this.onMouseMove( mouseMoveFunction );
		this.scene.registerBeforeRender( beforeRenderFunction );


	}


	// Creating and modifing Proton3DObjects
	create3DObject( extras, object ) {

		var interpreter = this;
		switch ( extras.type ) {

			case "perspectivecamera":
				
				// Creates the camera
				var camera = new BABYLON.UniversalCamera( object.name, new BABYLON.Vector3( 0, 0, 1 ), interpreter.scene );
				camera.minZ = 0.01;
				camera.fov = extras.fov != undefined? extras.fov : 1;
				camera.setTarget( BABYLON.Vector3.Zero() );
				objectList.meshes.push( camera );

				// Adds Proton functions
				object.changeFOV = ( value ) => {

					object.fov = value;

				};

				// Done
				break;
			
			case "3rdperspectivecamera":

				// Creates the camera
				var camera = new BABYLON.ArcRotateCamera( object.name, 0, 0, 10, new BABYLON.Vector3( 0, 0, 0 ), interpreter.scene );
				camera.fov = extras.fov != undefined? extras.fov : 1;
				objectList.meshes.push( camera );

				// Adds Proton functions
				object.changeFOV = ( value ) => {

					object.fov = value;

				};

				// Done
				break;

			case "spotlight":
				
				// Creates the spotlight
				var light = new BABYLON.SpotLight( object.name, new BABYLON.Vector3( extras.position.x, extras.position.y, extras.position.z ), new BABYLON.Vector3(0, -1, 0), Proton.degToRad( 60 ), 0, this.scene );
				light.setDirectionToTarget( new BABYLON.Vector3( 0, 0, 0 ) );
				light.name = object.name;
				light.falloffType = BABYLON.SpotLight.FALLOFF_GLTF; // Smooth penumbra stuff (NOT WORKING ANY MORE)
				objectList.meshes.push( light );

				object.setIntensity = ( value ) => light.intensity = value;
				object.setAngle = ( value ) => light.angle = value;

				// Adds shadows
				this.createShadowGenerator( light );

				// Done
				break;

			case "sky":
				
				var sky = BABYLON.Mesh.CreateBox( "skybox", 10000, this.scene, false, BABYLON.Mesh.BACKSIDE );
				sky.material = new BABYLON.SkyMaterial( "sky", this.scene );
				sky.material.inclination = 0.1;
				sky.material.useSunPosition = true;

				object.setSunPosition = ( x, y, z ) => {

					sky.material.sunPosition.set(
						x,
						y,
						z
					);

				};

				if ( extras.sun != undefined ) {

					sky.sun = extras.sun;
					sky.sun.setPosition(
						sky.sunPosition.x,
						sky.sunPosition.y,
						sky.sunPosition.z
					);

					object.setSunPosition = ( x, y, z ) => {

						sky.material.sunPosition.set(
							x,
							y,
							z
						);

						object.sun.setPosition(
							x,
							y,
							z
						);

					};

				}

				sky.name = object.name;
				objectList.meshes.push( sky );
				break;

			case "capsule":

				extras.type = "capsule";

				// Makes the capsule
				var capsule = BABYLON.MeshBuilder.CreateCapsule( object.name, { radius: 1, height: extras.height, capSubdivisions: 12, tessellation: 12, topCapSubdivisions: 12 }, this.scene );
				objectList.meshes.push( capsule );
				capsule.name = object.name;

				// Shadows
				capsule.receiveShadows = true;

				// Creates some properties
				object.radius = extras.radius;
				object.height = extras.height;

				// Copies parameters to the object
				for ( var i in extras ) {

					if ( extras[ i ] && object[ i ] == undefined ) {

						object[ i ] = extras[ i ];

					}

				}

				break;

			case "cube":

				extras.type = "cube";

				// Makes the cube
				var cube = BABYLON.MeshBuilder.CreateBox( object.name, { width: extras.width, height: extras.height, depth: extras.depth }, this.scene );
				objectList.meshes.push( cube );
				cube.name = object.name;

				// Shadows
				cube.receiveShadows = true;

				// cube stuff
				object.width = extras.width;
				object.height = extras.height;
				object.depth = extras.depth;

				// Copies parameters to the object
				for ( var i in extras ) {

					if ( extras[ i ] && object[ i ] == undefined ) {

						object[ i ] = extras[ i ];

					}

				}

				break;

			case "sphere":
				
				extras.type = "sphere";
				
				// Makes the sphere
				var sphere = BABYLON.MeshBuilder.CreateSphere( object.name, { diameter: extras.radius * 2 }, this.scene );
				objectList.meshes.push( sphere );
				sphere.name = object.name;

				// Shadows
				sphere.receiveShadows = true;

				sphere.name = object.name;
				objectList.meshes.push( sphere );

				// Creates some properties
				object.radius = 1;

				// Copies parameters to the object
				for ( var i in extras ) {

					if ( extras[ i ] && object[ i ] == undefined ) {

						object[ i ] = extras[ i ];

					}

				}

				break;

			default: // For imported meshes

				var mesh = extras.mesh;
				if ( mesh.name === "" || mesh.name == undefined ) {

					mesh.name = object.name;

				} else {

					object.name = mesh.name;

				}

				function namecheck( p3dobject ) {

					if ( objectList.getMeshByName( mesh.name ) ) {

						p3dobject.name += "_copy";
						mesh.name += "_copy";

					}

					if ( objectList.getMeshByName( mesh.name ) ) {

						namecheck( p3dobject );

					}

				}
				namecheck( object );

				if ( ! mesh.material[ 0 ] ) {

					object.material = new Proton3DMaterial( object, {
						material: mesh.material
					} );

				} else {

					var y = object;
					object.material = [];
					mesh.material.forEach( ( material, i ) => {

						y.material.push( new Proton3DMaterial( mesh, {
							material: material,
							materialLocation: i
						} ) );

					} );

				}

				objectList.meshes.push( mesh );
			
		}

		// Shadows
		if ( objectList.getMeshByName( object.name ).geometry && extras.type != "sky" && extras.castShadow != false ) interpreter.shadowGenerators.forEach( ( generator ) => generator.addShadowCaster( objectList.getMeshByName( object.name ), true ) );
		

		// Sets the rotation if there is none
		if ( objectList.getMeshByName( object.name ).rotation == undefined ) objectList.getMeshByName( object.name ).rotation = BABYLON.Vector3.Zero();

		// creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if ( extras.type != "sky" && extras.type != "camera" && extras.type != undefined ) {

			object.material = extras.material || new Proton3DMaterial( objectList.getMeshByName( object.name ), {
				name: extras.materialName,
				material: objectList.getMeshByName( object.name ).material,
				materialType: extras.materialType
			} );

		}

		// Sets the mesh's "parent"
		objectList.getMeshByName( object.name ).p3dParent = object;

		// Makes the mesh (player) invisible
		if ( extras.invisible ) object.makeInvisible();

	}



	init3DObject( extras, object ) {

		// Physics
		var impostorType = "";
		if ( extras.physicsImpostor != undefined ) impostorType = BABYLON.PhysicsImpostor[ extras.physicsImpostor ];
		switch ( extras.type ) {

			case "cube":

				var cube = objectList.getMeshByName( object.name );
				// Physics
				if ( extras.noPhysics != true ) {
					
					if ( impostorType == "" ) impostorType = BABYLON.PhysicsImpostor.BoxImpostor;
					cube.physics = new BABYLON.PhysicsImpostor( cube, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined? extras.restitution : .1,
						friction: extras.friction != undefined? extras.friction : 1,
					}, this.scene );
				
				}
				break;

			case "capsule":

				var capsule = objectList.getMeshByName( object.name );
				// Physics
				if ( extras.noPhysics != true ) {
					
					if ( impostorType == "" ) impostorType = BABYLON.PhysicsImpostor.MeshImpostor;
					capsule.physics = new BABYLON.PhysicsImpostor( capsule, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined? extras.restitution : .1,
						friction: extras.friction != undefined? extras.friction : 1,
					}, this.scene );
				
				}
				break;

			case "sphere":
				
				var sphere = objectList.getMeshByName( object.name );
				// Physics
				if ( extras.noPhysics != true ) {
				
					if ( impostorType == "" ) impostorType = BABYLON.PhysicsImpostor.SphereImpostor;
					sphere.physics = new BABYLON.PhysicsImpostor( sphere, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined? extras.restitution : .1,
						friction: extras.friction != undefined? extras.friction : 1,
					}, this.scene );
					
				}
		
		}

		// Sets reflections (where possible)
		this.setReflections( objectList.getMeshByName( object.name ), this );
		
		// onReady: Where the magic happens
		if ( object.onReady ) object.onReady()

	}

	setReflections( mesh, interpreter ) {

		if ( interpreter.scene.meshes.indexOf( mesh ) == -1 ) return; // First needs to see if the object is a mesh in the first place.

		if ( !mesh.reflectionProbe && ( mesh.material != undefined && mesh.material.azimuth/*Determines if the material is a sky by a property of a SkyMaterial*/ == undefined ) ) {

			if ( mesh.p3dParent.mirror == true ) {

				if ( mesh.material.roughness == 0 ) { mesh.material.roughness = 1 }
				// Creates a reflection probe
				mesh.reflectionProbe = new BABYLON.ReflectionProbe( mesh.id + "_rp", 128, this.scene );
				mesh.reflectionProbe.attachToMesh( mesh );
				mesh.material.reflectionTexture = mesh.reflectionProbe.cubeTexture;

				// Adds all objects in the scene to the reflection probe
				this.scene.meshes.forEach( ( object ) => { mesh.reflectionProbe.renderList.push( object ) } );

			}

			// Real time filtering blurs the reflection texture depending on the object's roughness value.
			mesh.material.realTimeFiltering = true;

		}

	}

	setEnvironmentMap( url ) { // Must be HDR

		this.scene.environmentTexture =  new BABYLON.HDRCubeTexture( url, this.scene, 128, false, true, false, true ); // Preset parameters from https://doc.babylonjs.com/divingDeeper/materials/using/HDREnvironment

	}

	Proton3DObject = {
		makeInvisible( P3DObject ) {

			P3DObject.material.makeTransparent();
			if ( P3DObject.material.subMaterials ) P3DObject.material.subMaterials.forEach( ( material ) => material.makeTransparent() );
			objectList.getMeshByName( P3DObject.name ).isVisible = false

		},
		getShadowOptions( P3DObject ) {

			return {
				cast: objectList.getMeshByName( P3DObject.name ).castShadow || false,
				receive: objectList.getMeshByName( P3DObject.name ).receiveShadow
			};

		},
		setShadowOptions( cast = null, receive = null, P3DObject ) {

			// Casting will be set when an object is added to a scene
			objectList.getMeshByName( P3DObject.name ).receiveShadow = receive != undefined ? receive : objectList.getMeshByName( P3DObject.name ).receiveShadow;
			if ( cast ) {

				Proton.scene.interpreter.shadowGenerators.forEach( ( generator ) => generator.addShadowCaster( objectList.getMeshByName( P3DObject.name ) ) );

			} else {

				Proton.scene.interpreter.shadowGenerators.forEach( ( generator ) => generator.removeShadowCaster( objectList.getMeshByName( P3DObject.name ) ) );

			}

		},
		applyImpulse( force, offset = new BABYLON.Vector3( 0, 0, 0 ), P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.applyImpulse( force, offset )

		},
		delete( P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).dispose();

		},
		setMass( value, P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.mass = value;

		},
		getMass( P3DObject ) {

			return objectList.getMeshByName( P3DObject.name ).physics.mass;

		},
		setOnUse( useFunction, P3DObject ) {

			P3DObject.__onUse = useFunction;

		},
		setOnNear( nearFunction, P3DObject ) {

			P3DObject.__onNear = nearFunction;

		},
		setPickupDistance( value, P3DObject ) {

			P3DObject.__pickupDistance = value;

		},
		setPickup( pickupness, returnAfterUse, P3DObject ) {

			P3DObject.__pickupable = pickupness;
			P3DObject.__returnAfterPickup = returnAfterUse;

		},
		getOnUse( P3DObject ) {

			return P3DObject.__onUse;

		},
		getOnNear( P3DObject ) {

			return P3DObject.__onNear;

		},
		getPickupDistance( P3DObject ) {
			
			return P3DObject.__pickupDistance;

		},
		getPickup( P3DObject ) {
			
			return { pickupable: P3DObject.__pickupable, returnAfterPickup: P3DObject.__returnAfterPickup }

		},
		setLinearVelocity( x = P3DObject.getLinearVelocity().x, y = P3DObject.getLinearVelocity().y, z = P3DObject.getLinearVelocity().z, P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.physicsBody.setLinearVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setAngularVelocity( x = objectList.getMeshByName( P3DObject.name ).getAngularVelocity().x, y = objectList.getMeshByName( P3DObject.name ).getAngularVelocity().y, z = objectList.getMeshByName( P3DObject.name ).getAngularVelocity().z, P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.physicsBody.setAngularVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.physicsBody.setLinearFactor( new Ammo.btVector3( x, y, z ) );

		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {

			objectList.getMeshByName( P3DObject.name ).physics.physicsBody.setAngularFactor( new Ammo.btVector3( x, y, z ) );

		},
		setRotation( x, y, z, P3DObject ) {

			if ( x == undefined ) {

				x = P3DObject.getRotation().x;

			}

			if ( y == undefined ) {

				y = P3DObject.getRotation().y;

			}

			if ( z == undefined ) {

				z = P3DObject.getRotation().z;

			}

			objectList.getMeshByName( P3DObject.name ).rotation.set( x, y, z );

		},
		setPosition( x, y, z, P3DObject ) {

			if ( typeof x === "object" ) {

				objectList.getMeshByName( P3DObject.name ).position.set( x.x, x.y, x.z );

			}

			if ( x == undefined ) {

				x = P3DObject.getPosition().x;

			}

			if ( y == undefined ) {

				y = P3DObject.getPosition().y;

			}

			if ( z == undefined ) {

				z = P3DObject.getPosition().z;

			}

			objectList.getMeshByName( P3DObject.name ).position.set( x, y, z );

		},
		isPhysicsReady( P3DObject ) {
			
			return objectList.getMeshByName( P3DObject.name ).physics != undefined;

		},
		getRotation( P3DObject ) {

			return objectList.getMeshByName( P3DObject.name ).rotation;

		},
		getPosition( P3DObject ) {

			return objectList.getMeshByName( P3DObject.name ).position;

		},
		getLinearVelocity( P3DObject ) {

			return objectList.getMeshByName( P3DObject.name ).physics.getLinearVelocity();

		},
		getAngularVelocity( P3DObject ) {

			return objectList.getMeshByName( P3DObject.name ).physics.getAngularVelocity();

		},
		getWorldDirection( P3DObject ) {

			return Proton3DInterpreter.prototype.rotateVector3(
				new BABYLON.Vector3( 0, 0, 1 ),
				P3DObject.rotation
			);

		},
		lookAt( x = 0, y = 0, z = 0, P3DObject ) {

			if ( objectList.getMeshByName( P3DObject.name ).setDirectionToTarget ) {
			
				objectList.getMeshByName( P3DObject.name ).setDirectionToTarget( new BABYLON.Vector3( x, y, z ) );
			
			}

			if ( objectList.getMeshByName( P3DObject.name ).setTarget ) {
			
				objectList.getMeshByName( P3DObject.name ).setTarget( new BABYLON.Vector3( x, y, z ) );
			
			}

			if ( objectList.getMeshByName( P3DObject.name ).lookAt ) {

				objectList.getMeshByName( P3DObject.name ).lookAt( new BABYLON.Vector3( x, y, z ) );

			}

		},
		getWorldPosition( P3DObject ) {

			// https://forum.babylonjs.com/t/understanding-how-to-get-set-world-position-rotation-and-scale-in-a-hierarchy/5087
			var worldMatrix = objectList.getMeshByName( P3DObject.name ).getWorldMatrix();
			var quatRotation =  new BABYLON.Quaternion();
			var position = new BABYLON.Vector3();
			var scale = new BABYLON.Vector3();
			worldMatrix.decompose( scale, quatRotation, position );
			return position;

		},
		getWorldRotation( P3DObject ) {

			// If you use three.js, it should look something like this: return objectList.getMeshByName( P3DObject.name ).getWorldQuaternion( new THREE.Euler() );

		},
		add( object, P3DObject ) {

			objectList.getMeshByName( object.name ).parent = objectList.getMeshByName( P3DObject.name );
			object.parent = P3DObject;

		},
		remove( object, P3DObject ) {

			objectList.getMeshByName( object.name ).dispose();

		}
	}

	importObject( extras ) {

		// Variables
		var object = {},
			interpreter = extras.interpreter;

		// Supports whatever Babylon.js supports right now -- glTF, obj, and babylon files are supported
		load();
		async function load() {
			
			// Loads the mesh
			var mesh = await BABYLON.SceneLoader.ImportMeshAsync( "", extras.path, "", interpreter.scene );
			var meshes = mergeSameMaterials( mesh.meshes );
			
			// Loads shadows
			if ( extras.noShadows ) extras.receiveShadows = extras.castShadow = false;
			loadShadows( meshes );

			// Turns the loaded mesh to a Proton3DObject
			object.objects = meshToProton( meshes );

			// Loads physics
			if ( ! extras.noPhysics ) loadPhysics( meshes );

			// Sets the starter position (if any)
			if ( extras.position )  {
				
				object.objects.forEach( ( P3DObject ) => { 
					
					var pos = P3DObject.getPosition().add( new BABYLON.Vector3( extras.position.x, extras.position.y, extras.position.z ) );
					P3DObject.setPosition( pos.x, pos.y, pos.z );

				} )

			}

			// Now you can initialize the object
			
			object.realObjects = meshes;
			if ( extras.onReady ) {

				object.onReady = extras.onReady;
				object.onReady();

			}

		}

		// Merges materials for glTF files
		function mergeSameMaterials( objects ) {

			var similarNames = [];
			var newObjects = [];
			objects.forEach( ( object ) => {

				// Alters the material before doing anything else to it
				if ( object.material ) {
					
					object.material.usePhysicalLightFalloff = false;

				}
				
				// Merges objects if they've been split from glTF
				if ( object.name.includes( "_primitive" ) ) {

					object.realName = object.name.substr( 0, object.name.indexOf( "_primitive" ) );
					if ( similarNames.indexOf( object.realName ) == -1 ) similarNames.push( object.realName )

				} else {

					if ( object.parent && object.parent.name && object.parent.name.includes( "root" ) ) object.parent = undefined;// If the object is somehow tied to this "root" thing, get rid of the root object.
					newObjects.push( object );

				}

			} );

			similarNames.forEach( ( name ) => {
				//
				var similarMeshes = [];
				var similarMaterials = [];
				objects.forEach( ( object ) => {

					if ( object.name && object.name.includes( name ) ) {


						similarMeshes.push( object );
						similarMaterials.push( object.material );

					}

				} );

				newObjects.push( BABYLON.Mesh.MergeMeshes( similarMeshes, true, true, undefined, false, true ) )

			} );

			return newObjects;

		}

		// Creates physics meshes for imported meshes
		function loadPhysics( meshes ) {
			
			meshes.forEach( ( mesh ) => {
				
				mesh.physics = new BABYLON.PhysicsImpostor( mesh, BABYLON.PhysicsImpostor[ extras.physicsImpostor != undefined? extras.physicsImpostor : "ConvexHullImpostor" ], {
					mass: extras.mass || 0,
					restitution: extras.restitution != undefined? extras.restitution : .1,
					friction: extras.friction != undefined? extras.friction : 1,
				}, interpreter.scene );

			} );
			
		}

		// Loads shadows for imported meshes
		function loadShadows( meshes ) {
			
			meshes.forEach( ( mesh ) => {
				
				mesh.receiveShadows = extras.receiveShadows != undefined? extras.receiveShadows : true;
				if ( extras.castShadow != false ) interpreter.shadowGenerators.forEach( ( generator ) => generator.addShadowCaster( mesh ) );

			} );
			
		}

		// Converts the meshes to Proton object
		function meshToProton( meshes, parent=undefined ) {//parent==Something you don't have to worry about.

			var objects = [];
			meshes.forEach( ( mesh ) => {

				if ( mesh.children ) {

					mesh.children.forEach( meshToProton, object, root );
	
				}
	
				if ( ! mesh.material && ! mesh.geometry ) {
	
					return;
	
				}

				var object = new Proton3DObject( { mesh: mesh, noPhysics: extras.noPhysics } );

				// Adds the object to the output of objects
				if ( parent == undefined ) {

					objects.push( object );

				} else {
					// Or to another objects
					parent.children.push( object );

				}
				
			} );
			return objects;

		}

		return object;

	}

	// creating and modifing Proton3DMaterials
	create3DMaterial( extras, P3DMaterial, parentObject, interpreter ) {

		var material = extras.material;

		if ( extras.material == undefined ) {

			material = new BABYLON.PBRMaterial( P3DMaterial.name, this.scene );
			material.usePhysicalLightFalloff = false;
			material.name = P3DMaterial.name;
			material.roughness = 1;
			objectList.materials.push( material );
			parentObject.material = material;

		} else {

			material.name = P3DMaterial.name;
			objectList.materials.push( material );
			if ( material.subMaterials ) {

				P3DMaterial.subMaterials = [];
				material.subMaterials.forEach( function( material ) {

					P3DMaterial.subMaterials.push( new Proton3DMaterial( parentObject, {
						material: material
					}  ) );

				} );

			}

		}

		// Run whatever you want to alter all materials here
		
	}

	Proton3DMaterial = {
		setEmissiveColor( color, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).emissiveColor = new BABYLON.Color3.FromHexString( color );

		},
		getEmissiveColor( P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).emissiveColor.toHexString();

		},
		setWireframe( value, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).wireframe = value;

		},
		getWireframe( P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).wireframe;

		},
		setEmissive( value, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).emissiveIntensity = value;

		},
		getEmissive( P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).emissiveIntensity;

		},
		setColor( hexString, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).albedoColor = new BABYLON.Color3.FromHexString( hexString );

		},
		getColor( P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).albedoColor.toHexString();

		},
		setRoughness( value, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).roughness = value;

		},
		setMetalness( value, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).metallic = value;

		},
		getRoughness( value, P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).roughness;

		},
		getMetalness( value, P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).metallic;

		},
		setOpacity( value, P3DMaterial ) {

			objectList.getMaterialByName( P3DMaterial.name ).forceAlphaTest = true;
			objectList.getMaterialByName( P3DMaterial.name ).alpha = value;

		},
		getOpacity( P3DMaterial ) {

			return objectList.getMaterialByName( P3DMaterial.name ).alpha;

		},
		makeTransparent( value, P3DMaterial ) {

			P3DMaterial.setOpacity( 0 )
		}
	}

	// Listens for key events
	onKeyDown( callback ) {

		window.addEventListener( "keydown", function ( event ) {

			// Why the heck event.keyCode is crossed out on VSCodium I don't know.
			if ( event.keyCode == 27 ) document.exitPointerLock();
			if ( event.keyCode == 32 ) event.preventDefault();
			callback( event.keyCode );

		} );

	}

	onKeyUp( callback ) {

		window.addEventListener( "keyup", function ( e ) {

			e.preventDefault();
			callback( e.keyCode );

		} );

	}

	// Hides the pointer through requestPointerLock
	hidePointer() {

		this.canvas.requestPointerLock();

	}
	
	// Handles events for when the mouse is moved
	onMouseMove( callback ) {

		window.addEventListener( "mousemove", callback );

	}

	// Creates a crosshair in HTML
	crosshair() {

		var crosshairElement = document.createElement( "div" );
		crosshairElement.hide = function () {

			crosshairElement.style.display = "none";

		};

		crosshairElement.show = function () {

			crosshairElement.style.display = undefined;

		};

		crosshairElement.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(  -50%, -50%  );
			height: 4px;
			width: 4px;
			background: rgba( 255, 255, 255, 0.25 );
			border-radius: 100%;
			box-shadow: white 0 0px 7px;
			backdrop-filter: invert( 1 );
		`;
		document.body.appendChild( crosshairElement );
		return crosshairElement;

	}

	// Some nonessential variables
	audio = Audio
	storage = localStorage

};