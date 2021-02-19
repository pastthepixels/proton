"use strict";
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


const scriptStats = { loadedScripts: 0, maxScripts: 10 };
function importScript( url, isModule = true, callback ) {

	scriptStats.maxScripts ++;
	if ( ! isModule ) {

		var script = document.createElement( "script" );
		script.src = url;
		document.head.appendChild( script );
		script.onload = function () {

			if ( callback ) callback();
			scriptStats.loadedScripts ++;
			if ( scriptStats.loadedScripts >= scriptStats.maxScripts ) window.finishedLoadingScripts = true;

		}
		;

		return;

	}

	import( url ).then( (value) => {

		// finished!
		if ( callback ) callback();
		scriptStats.loadedScripts++;
		if ( scriptStats.loadedScripts >= scriptStats.maxScripts ) window.finishedLoadingScripts = true;

	} );

}

// The part that requires an internet connection:
// Note that you can set which sources Proton uses to local ones.
function init( scripts ) {

	scriptStats.maxScripts = 0;
	if ( ! scripts ) {

		scripts = {
			ammojs: "https://cdn.babylonjs.com/ammo.js",
			babylonjs: "https://cdn.babylonjs.com/babylon.js",
			babylonjs_materials: "https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.js",
			babylonjs_loaders: "https://preview.babylonjs.com/loaders/babylonjs.loaders.js"
		};

	}
	scriptStats.scripts = scripts;

	// Babylon.js
	importScript( scripts.babylonjs, true, function() {
		// Stuff that creates the sky + more materials
		importScript( scripts.babylonjs_materials, true );

		// Stuff that loads files like glTF
		importScript( scripts.babylonjs_loaders, true );

		// Physics!
		importScript( scripts.ammojs, false );
	} );

}
/*
	~> loc:2
	Proton3DInterpreter
*/
const meshes = [];
const materials = [];
function getMeshByName( name ) {

	return meshes.find( function ( x ) {

		return x.name === name;

	} );

}

function getMaterialByName( name ) {

	return materials.find( function ( x ) {

		return x.name === name;

	} );

}

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

	init( params, scene ) {

		var interpreter = this;
		this.postprocessing = params.postprocessing || {
			enabled: false,
			bloom: true,
			ssao: true,
			fxaa: true,
			usePCSS: false,
			anisotropicFilteringLevel: 4
		}
		this.scene = scene;

		// Sets up the scene
		this.dynamicResize( scene );

		// Creates everything HTML
		this.element = document.createElement( "scene" );
		this.canvas = document.createElement( "canvas" );

		// Take a break to resize the canvas
		this.canvas.style.width = this.canvas.style.height = "100%";
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight

		// Creates the engine + scene
		this.engine = new BABYLON.Engine( 
			this.canvas,
			true,
			{ preserveDrawingBuffer: true, stencil: true }
		);
		this.scene = new BABYLON.Scene( this.engine );
		this.scene.clearColor = new BABYLON.Color4( 0, 0, 0, 0 );

		// Sets up shadows
		this.shadowGenerators = [];

		// Creates the sky
		if ( params.sky != false ) scene.sky = new Proton3DObject( { type: "sky" } );

		// Creates a camera
		this.camera = new Proton3DObject( { type: "perspectivecamera", x: 0, y: 0, z: 5 } );
		this.camera.setPosition( 0, 0, 5 );

		// Creates a camera for third-person view
		this.thirdCamera = new Proton3DObject( { type: "3rdperspectivecamera", x: 0, y: 0, z: 5 } );
		this.thirdCamera.setPosition( 0, 0, 5 );

		// Adds ambient lighting
		this.hemisphereLight = new BABYLON.HemisphericLight( "hemisphere", new BABYLON.Vector3( -1, 1, 0 ), this.scene );


		// Postprocessing
		if ( this.postprocessing.enabled ) {
		
			this.pipeline = new BABYLON.DefaultRenderingPipeline( "default", true, this.scene, [ getMeshByName( this.camera.name ) ] );
			if ( this.postprocessing.bloom ) this.pipeline.bloomEnabled = true;
			if ( this.postprocessing.fxaa ) this.pipeline.fxaaEnabled = true;
			if ( this.postprocessing.ssao ) this.ssao = new BABYLON.SSAORenderingPipeline( "ssao", this.scene, { ssaoRatio: 0.5, combineRatio: 1.0 }, [ getMeshByName( this.camera.name ) ] );

		}

		// Physics
		var gravityVector = new BABYLON.Vector3( 0,-9.81, 0 );
		var physicsPlugin = new BABYLON.AmmoJSPlugin();
		this.scene.enablePhysics( gravityVector, physicsPlugin );

		// Sets up the canvas
		this.element.appendChild( this.canvas );
		document.body.appendChild( this.element );

		// Updates the scene
		var materialLength = 0;
		this.engine.runRenderLoop( function() {

			//if ( wiz.objects ) { wiz.objects[ 0 ].setAngularVelocity( 0, 0, 0 ); }
			interpreter.updateScene( scene )

			// Sets anisotropic filtering
			if ( materialLength != interpreter.scene.materials.length ) {

				materialLength = interpreter.scene.materials.length;
				interpreter.scene.textures.forEach( ( texture ) => {
				
					texture.anisotropicFilteringLevel = interpreter.postprocessing.anisotropicFilteringLevel;
					texture.updateSamplingMode( BABYLON.Texture.TRILINEAR_SAMPLINGMODE )
				
				} )

			}

		} );

		// GI
			
		//var probe = new BABYLON.ReflectionProbe("main", 512, this.scene );
		var interpreter = this;
		this.scene.reflectionProbes = [];
		this.scene.reflectionProbeObjects = [];
		this.rp = new BABYLON.ReflectionProbe( "rp", 512, this.scene );
		this.scene.registerBeforeRender( function() {
			
			interpreter.scene.meshes.forEach( function( mesh ) {

				if ( !mesh.reflectionProbe && mesh.material ) {

					mesh.reflectionProbe = new BABYLON.ReflectionProbe( mesh.id + "_rp", 512, interpreter.scene );
					mesh.reflectionProbe.parent = mesh;
					//mesh.reflectionProbe.refreshRate = 6;
					//mesh.reflectionProbe.samples = 32;
					mesh.material.reflectionTexture = mesh.reflectionProbe.cubeTexture;
					//mesh.material.realTimeFiltering = true;
					interpreter.scene.reflectionProbes.push( mesh.reflectionProbe );
					interpreter.scene.reflectionProbeObjects.forEach( function( object ) {

						if ( object.name != mesh.name ) mesh.reflectionProbe.renderList.push( object )

					} );
					if ( mesh.reflectionProbe.renderList.indexOf( mesh ) > -1 ) mesh.reflectionProbe.renderList.splice( mesh.reflectionProbe.renderList.indexOf( mesh ), 1 )

				}
				if ( interpreter.scene.reflectionProbeObjects.indexOf( mesh ) === -1 ) {
					
					interpreter.scene.reflectionProbeObjects.push( mesh )
					interpreter.scene.reflectionProbes.forEach( function( reflectionProbe ) {

						if ( !reflectionProbe.name.includes( mesh.name ) ) reflectionProbe.renderList.push( mesh )

					} )

				}

			} )

		} );
		/*
		var ssr = new BABYLON.ScreenSpaceReflectionPostProcess( "ssr", interpreter.scene, 1.0, getMeshByName( interpreter.thirdCamera.name ) );
		ssr.reflectionSamples = 100; // High quality.
		ssr.strength = 1; // Set default strength of reflections.
		ssr.reflectionSpecularFalloffExponent = 3; // Attenuate the reflections a little bit. (typically in interval [1, 3])
		this.scene.registerBeforeRender( function() {

			if ( mesh.material && mesh.reflectivityTextureDone == undefined ) {

				mesh.reflectivityTextureDone = true;
				mesh.material.reflectivityTexture = new BABYLON.Texture("data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII= ", interpreter.scene );
			} 

		} )
		*/
		// Starts the scene
		this.updateScene( scene );

		// Done!
		return this.canvas;

	}

	// Updates a scene in Proton
	updateScene( scene ) {

		// Pausing
		if ( Proton && Proton.paused ) {

			return;

		}

		// Updates the scene
		scene.update();

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

		this.scene.removeMesh( getMeshByName( object.name ) );

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

		var collisions = [], interpreter = this;
		this.scene.meshes.forEach( function( mesh ) { // Runs through all the meshes and runs a collision detection function on all of them. If they are colliding with the P3DObject, add them to an array which will be returned at the end of the function.
		
			if ( !mesh.p3dParent || !mesh.physics ) return;
			var contact = new Ammo.ConcreteContactResultCallback();
			contact.hasContact = false;
			contact.addSingleResult = function( cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1 ) { // https://medium.com/@bluemagnificent/collision-detection-in-javascript-3d-physics-using-ammo-js-and-three-js-31a5569291ef

				let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

				const distance = contactPoint.getDistance();

				if( distance > 0 ) return;

				this.hasContact = true;

			}
			interpreter.scene.getPhysicsEngine()._physicsPlugin.world.contactPairTest( mesh.physics.physicsBody, getMeshByName( P3DObject.name ).physics.physicsBody, contact );
			if ( contact.hasContact && mesh.p3dParent != P3DObject ) collisions.push( mesh.p3dParent )
		
		} );
		return collisions

	}

	// Creates a shadow generator
	createShadowGenerator( light ) {

		var shadowGenerator = new BABYLON.ShadowGenerator( 1024, light );
		light.minZ = .01;
		light.maxZ = 100;

		shadowGenerator.bias = 0.00001
		shadowGenerator.normalBias= 0.0005
		
		if ( this.postprocessing.usePCSS ) {

			shadowGenerator.useContactHardeningShadow = true;
			shadowGenerator.contactHardeningLightSizeUVRatio = 0.5;

		} else {

			shadowGenerator.bias = 0.0005
			shadowGenerator.usePercentageCloserFiltering = true;
			shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;

		}
		
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
			height: params.height != undefined? params.height : 3,
			radius: 2,
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
				getMeshByName( params.scene.thirdCamera.name ).lowerBetaLimit = getMeshByName( params.scene.thirdCamera.name ).upperBetaLimit = Proton.degToRad( 54.7 )
				
				

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
				params.scene.thirdCamera.disable = () => getMeshByName( params.scene.thirdCamera.name ).detachControl( interpreter.canvas );
				params.scene.thirdCamera.enable = () =>  getMeshByName( params.scene.thirdCamera.name ).attachControl( interpreter.canvas );
						
				// Creates variables
				var animating, deg; // Wether the player is turning around and the angle (almost) in which it should be facing, in degrees (hence the name "deg")

				// Sets some camera properties
				getMeshByName( params.scene.thirdCamera.name ).inertia = 0;
				getMeshByName( params.scene.thirdCamera.name ).radius = params.distance.x;
				getMeshByName( params.scene.thirdCamera.name ).angularSensibilityX = 1000 - 60 * params.xSensitivity;
				getMeshByName( params.scene.thirdCamera.name ).angularSensibilityY = 1000 - 60 * params.ySensitivity;
				// Sets this camera as the active one.
				interpreter.scene.activeCamera = getMeshByName( params.scene.thirdCamera.name );
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
					deg = Proton.radToDeg( getMeshByName( Proton.scene.thirdCamera.name ).alpha )
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
				camera.fov = extras.fov != undefined? extras.fov : 1;
				camera.setTarget( BABYLON.Vector3.Zero() );
				meshes.push( camera );

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
				meshes.push( camera );

				// Adds Proton functions
				object.changeFOV = ( value ) => {

					object.fov = value;

				};

				// Done
				break;

			case "spotlight":
				
				// Creates the spotlight
				var light = new BABYLON.SpotLight( object.name, new BABYLON.Vector3( extras.position.x, extras.position.y, extras.position.z ), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, this.scene );
				light.setDirectionToTarget( new BABYLON.Vector3( 0, 0, 0 ) );
				light.name = object.name;
				meshes.push( light );

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
				meshes.push( sky );
				break;

			case "capsule":

				extras.type = "capsule";

				// Makes the capsule
				var capsule = BABYLON.MeshBuilder.CreateCapsule( object.name, { radius: 1, height: extras.height, capSubdivisions: 12, tessellation: 12, topCapSubdivisions: 12 }, this.scene );
				meshes.push( capsule );
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
				meshes.push( cube );
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
				meshes.push( sphere );
				sphere.name = object.name;

				// Shadows
				sphere.receiveShadows = true;

				sphere.name = object.name;
				meshes.push( sphere );

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

					if ( getMeshByName( mesh.name ) ) {

						p3dobject.name += "_copy";
						mesh.name += "_copy";

					}

					if ( getMeshByName( mesh.name ) ) {

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

				meshes.push( mesh );
			
		}

		// Shadows
		if ( getMeshByName( object.name ).geometry && extras.type != "sky" && extras.castShadow != false ) interpreter.shadowGenerators.forEach( ( generator ) => generator.addShadowCaster( getMeshByName( object.name ) ) );
		

		// Sets the rotation if there is none
		getMeshByName( object.name ).rotation = getMeshByName( object.name ).rotation || BABYLON.Vector3.Zero();

		// creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if ( extras.type != "sky" && extras.type != "camera" && extras.type != undefined ) {

			object.material = extras.material || new Proton3DMaterial( getMeshByName( object.name ), {
				name: extras.materialName,
				material: getMeshByName( object.name ).material,
				materialType: extras.materialType
			} );

		}

		// Sets the mesh's parent
		getMeshByName( object.name ).p3dParent = object;

		// Makes the mesh (player) invisible
		if ( extras.invisible ) object.makeInvisible();

	}

	init3DObject( extras, object ) {

		// Physics
		var impostorType = "";
		if ( extras.physicsImpostor != undefined ) impostorType = BABYLON.PhysicsImpostor[ extras.physicsImpostor ];
		switch ( extras.type ) {

			case "cube":

				var cube = getMeshByName( object.name );
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

				var capsule = getMeshByName( object.name );
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
				
				var sphere = getMeshByName( object.name );
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
		
		// onReady: Where the magic happens
		if ( object.onReady ) object.onReady()

	}

	Proton3DObject = {
		makeInvisible( P3DObject ) {

			P3DObject.material.makeTransparent();
			if ( P3DObject.material.subMaterials ) P3DObject.material.subMaterials.forEach( ( material ) => material.makeTransparent() );
			getMeshByName( P3DObject.name ).isVisible = false

		},
		getShadowOptions( P3DObject ) {

			return {
				cast: getMeshByName( P3DObject.name ).castShadow || false,
				receive: getMeshByName( P3DObject.name ).receiveShadow
			};

		},
		setShadowOptions( cast = null, receive = null, P3DObject ) {

			// Casting will be set when an object is added to a scene
			getMeshByName( P3DObject.name ).receiveShadow = receive != undefined ? receive : getMeshByName( P3DObject.name ).receiveShadow;
			if ( cast ) {

				Proton.scene.interpreter.shadowGenerators.forEach( ( generator ) => generator.addShadowCaster( getMeshByName( P3DObject.name ) ) );

			} else {

				Proton.scene.interpreter.shadowGenerators.forEach( ( generator ) => generator.removeShadowCaster( getMeshByName( P3DObject.name ) ) );

			}

		},
		applyImpulse( force, offset = new BABYLON.Vector3( 0, 0, 0 ), P3DObject ) {

			getMeshByName( P3DObject.name ).physics.applyImpulse( force, offset )

		},
		delete( P3DObject ) {

			getMeshByName( P3DObject.name ).dispose();

		},
		setMass( value, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.mass = value;

		},
		getMass( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.mass;

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

			getMeshByName( P3DObject.name ).physics.physicsBody.setLinearVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setAngularVelocity( x = getMeshByName( P3DObject.name ).getAngularVelocity().x, y = getMeshByName( P3DObject.name ).getAngularVelocity().y, z = getMeshByName( P3DObject.name ).getAngularVelocity().z, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setAngularVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setLinearFactor( new Ammo.btVector3( x, y, z ) );

		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setAngularFactor( new Ammo.btVector3( x, y, z ) );

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

			getMeshByName( P3DObject.name ).rotation.set( x, y, z );

		},
		setPosition( x, y, z, P3DObject ) {

			if ( typeof x === "object" ) {

				getMeshByName( P3DObject.name ).position.set( x.x, x.y, x.z );

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

			getMeshByName( P3DObject.name ).position.set( x, y, z );

		},
		isPhysicsReady( P3DObject ) {
			
			return getMeshByName( P3DObject.name ).physics != undefined;

		},
		getRotation( P3DObject ) {

			return getMeshByName( P3DObject.name ).rotation;

		},
		getPosition( P3DObject ) {

			return getMeshByName( P3DObject.name ).position;

		},
		getLinearVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getLinearVelocity();

		},
		getAngularVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getAngularVelocity();

		},
		getWorldDirection( P3DObject ) {

			return Proton3DInterpreter.prototype.rotateVector3(
				new BABYLON.Vector3( 0, 0, 1 ),
				P3DObject.rotation
			);

		},
		lookAt( x = 0, y = 0, z = 0, P3DObject ) {

			if ( getMeshByName( P3DObject.name ).setDirectionToTarget ) {
			
				getMeshByName( P3DObject.name ).setDirectionToTarget( new BABYLON.Vector3( x, y, z ) );
			
			}

			if ( getMeshByName( P3DObject.name ).setTarget ) {
			
				getMeshByName( P3DObject.name ).setTarget( new BABYLON.Vector3( x, y, z ) );
			
			}

			if ( getMeshByName( P3DObject.name ).lookAt ) {

				getMeshByName( P3DObject.name ).lookAt( new BABYLON.Vector3( x, y, z ) );

			}

		},
		getWorldPosition( P3DObject ) {

			// https://forum.babylonjs.com/t/understanding-how-to-get-set-world-position-rotation-and-scale-in-a-hierarchy/5087
			var worldMatrix = getMeshByName( P3DObject.name ).getWorldMatrix();
			var quatRotation =  new BABYLON.Quaternion();
			var position = new BABYLON.Vector3();
			var scale = new BABYLON.Vector3();
			worldMatrix.decompose( scale, quatRotation, position );
			return position;

		},
		getWorldRotation( P3DObject ) {

			// If you use three.js, it should look something like this: return getMeshByName( P3DObject.name ).getWorldQuaternion( new THREE.Euler() );

		},
		add( object, P3DObject ) {

			getMeshByName( object.name ).parent = getMeshByName( P3DObject.name );
			object.parent = P3DObject;

		},
		remove( object, P3DObject ) {

			getMeshByName( object.name ).dispose();

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
		function meshToProton( meshes, parent ) {

			var objects = [];
			meshes.forEach( ( mesh ) => {

				if ( mesh.children ) {

					mesh.children.forEach( meshToProton, object );
	
				}
	
				if ( ! mesh.material && ! mesh.geometry ) {
	
					return;
	
				}

				// Builds the 3DObject
				var position = mesh.position.clone();
				var object = new Proton3DObject( { mesh: mesh, noPhysics: extras.noPhysics } );
				object.setPosition( position.x, position.y, position.z );
	
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
			materials.push( material );
			parentObject.material = material;

		} else {

			material.name = P3DMaterial.name;
			materials.push( material );
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

			getMaterialByName( P3DMaterial.name ).emissiveColor = new BABYLON.Color3.FromHexString( color );

		},
		getEmissiveColor( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).emissiveColor.toHexString();

		},
		setWireframe( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).wireframe = value;

		},
		getWireframe( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).wireframe;

		},
		setEmissive( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).emissiveIntensity = value;

		},
		getEmissive( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).emissiveIntensity;

		},
		setColor( hexString, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).albedoColor = new BABYLON.Color3.FromHexString( hexString );

		},
		getColor( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).albedoColor.toHexString();

		},
		setRoughness( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).roughness = value;

		},
		setMetalness( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).metalness = value;

		},
		getRoughness( value, P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).roughness;

		},
		getMetalness( value, P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).metalness;

		},
		setOpacity( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).forceAlphaTest = true;
			getMaterialByName( P3DMaterial.name ).alpha = value;

		},
		getOpacity( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).alpha;

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
			background: rgba( 255, 255, 255, 0.75 );
			border-radius: 100%;
			border: 1px #222 solid;
		`;
		document.body.appendChild( crosshairElement );
		return crosshairElement;

	}

	// Some nonessential variables
	audio = Audio
	storage = localStorage

};
/*
	~> loc:3
	Proton3D Tools
*/
class GameCode {

	constructor( code ) {

		this.code = code;

	}
	load( url ) {

		import( url );

	}
	run() {

		if ( typeof this.code == "string" ) {

			eval( this.code );

		} else {

			this.code();

		}

	}
	autoStart() {

		var code = this,
			interval = setInterval( function () {

				code.loadingPercentage = ( scriptStats.loadedScripts / scriptStats.maxScripts ) * 100;
				if ( code.loadingPercentage == 100 ) {

					clearInterval( interval );
					code.run();

				}

			}, 1500 );

	}

}