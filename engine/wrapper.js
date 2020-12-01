"use strict";
/*
	Proton's wrapper
	================

	## Description
	This contains all the boring stuff to get Proton to work, like the Proton3DInterpreter.

	## Table of Contents

	| Section Name               | Location # |
	| -------------------------- | ---------- |
	| ???                        | loc:1      |

*/

/*

	# What does "loc" mean? And why isn't there any documentation for Proton?
	-> If you have any of these symptoms, please consult the `README` in the same directory as this script.

*/

/*
	~> wrapper/loc:1
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

		if ( isModule === "CANNON" ) window[ "CANNON" ] = value
		
		for ( var i in value ) {

			if ( isModule && isModule != "CANNON" ) window[ isModule == true ? "window" : isModule ][ i ] = value[ i ];

		}

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
	wrapper/loc:4.3
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
		this.scene = scene;

		// Auto graphics
		switch ( params.graphicsRating ) {

			case 1 / 10:
				break;
			
		}

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

		// Adds ambient lighting
		var hemisphere = new BABYLON.HemisphericLight( "ambientLight", new BABYLON.Vector3( 0, 1, 0 ), this.scene );
		hemisphere.intensity = .3;
		hemisphere.specular = new BABYLON.Color3( 0, 0, 0 )


		// Postprocessing
		/* var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [ camera ]); */

		// Physics
		var gravityVector = new BABYLON.Vector3( 0,-9.81, 0 );
		var physicsPlugin = new BABYLON.AmmoJSPlugin();
		this.scene.enablePhysics( gravityVector, physicsPlugin );

		// Sets up the canvas
		this.element.appendChild( this.canvas );
		document.body.appendChild( this.element );

		// Updates the scene
		this.engine.runRenderLoop( function() {

			//if ( wiz.objects ) { wiz.objects[ 0 ].setAngularVelocity( 0, 0, 0 ); }
			interpreter.updateScene( scene )

		} );

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

	// Adds an object to the scene
	addToScene( /* object, scene */ ) {

		console.error( "In Babylon.js, objects are already initiated to scenes when you create them." )

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

		function vecToLocal( vector, mesh ) {

			var m = mesh.getWorldMatrix();
			var v = BABYLON.Vector3.TransformCoordinates( vector, m );
			return v;

		}
		
		var origin = getMeshByName( P3DObject.name ).position;

		var forward = new BABYLON.Vector3( 0, -1, 0 );
		forward = vecToLocal( forward, getMeshByName( P3DObject.name ) );

		var direction = forward.subtract( origin );
		direction = BABYLON.Vector3.Normalize( direction );

		var length = 2;

		var ray = new BABYLON.Ray( origin, direction, length );

		var hits = this.scene.multiPickWithRay( ray );

		var returningObject = [];

		hits.forEach( ( hit ) => returningObject.push( hit.pickedMesh.p3dParent ) );

		return returningObject;
		
	}

	// Creates a shadow generator
	createShadowGenerator( light ) {

		var shadowGenerator = new BABYLON.ShadowGenerator( 1024, light );
		shadowGenerator.usePercentageCloserFiltering = true;
		shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
		shadowGenerator.bias = 0.005;
		this.shadowGenerators.push( shadowGenerator )

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
		
		// Creates a fake physics mesh
		var object = new Proton3DObject( {
			type: "cube",
			height: 3,
			friction: 1,
			restitution: 0,
			mass: 1,
			castShadow: false,
			// setTimeout is bad.
			// I can't use it.

			// But I can.
			//  'Cause that's the way I like to live my life 🎵
			// 🎵 and I think that everything's gonna be fine.
			onReady: () => setTimeout( () => object.setAngularFactor( 0, 0, 0 ), 500 )
		} );
		params.cameraParent.physicsObject = object;
		params.cameraParent.material.makeTransparent();
		params.cameraParent.setPosition( 0, 0, 0 );
		object.add( params.cameraParent );
		object.add( params.scene.camera );

		// Sets the camera's position
		var cameraPosition = params.cameraParent.position.add( new BABYLON.Vector3( params.distance.x, params.distance.y, params.distance.z ) );
		params.scene.camera.setPosition( cameraPosition.x, cameraPosition.y, cameraPosition.z );
		
		// Does regular stuff
		this.onMouseMove( function ( e ) {

			if ( ! Proton.paused ) {

				params.scene.camera.rotation.y += Proton.degToRad( e.movementX / params.xSensitivity );
				if ( params.scene.camera.rotation.x + Proton.degToRad( e.movementY / params.ySensitivity ) < 1.57 &&
					params.scene.camera.rotation.x + Proton.degToRad( e.movementY / params.ySensitivity ) > -1.57 ) {
					
					params.scene.camera.rotation.x += Proton.degToRad( e.movementY / params.ySensitivity );

				}

			}

		} );
		this.scene.registerBeforeRender( function () {

			// Sets the crosshair's position
			params.scene.crosshair.localPosition = params.scene.camera.getWorldDirection();
			params.scene.crosshair.position = object.position.clone().add( params.scene.crosshair.localPosition ).add( params.scene.camera.position );

			// Sets the rotation of the player mesh
			params.cameraParent.rotation.y = params.scene.camera.rotation.y;			

		} );


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

				// Scaling
				object.getScale = function () {

					return getMeshByName( object.name ).scale;

				};

				object.setScale = function ( x, y, z ) {

					if ( x == undefined ) {

						x = object.getScale().x;

					}

					if ( y == undefined ) {

						y = object.getScale().y;

					}

					if ( z == undefined ) {

						z = object.getScale().z;

					}

					getMeshByName( object.name ).scale = new BABYLON.Vector3( x, y, z );

				};
			
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

		// Just initializes physics for now.
		switch ( extras.type ) {

			case "cube":

				var cube = getMeshByName( object.name );
				// Physics
				if ( extras.noPhysics != true ) {
					
					cube.physics = new BABYLON.PhysicsImpostor( cube, BABYLON.PhysicsImpostor.BoxImpostor, {
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
				
					sphere.physics = new BABYLON.PhysicsImpostor( sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined? extras.restitution : .1,
						friction: extras.friction != undefined? extras.friction : 1,
					}, this.scene );
					
				}
		
		}
		if ( object.onReady ) object.onReady();

	}

	Proton3DObject = {
		makeInvisible( P3DObject ) {

			P3DObject.material.makeTransparent();
			if ( P3DObject.material.subMaterials ) P3DObject.material.subMaterials.forEach( ( material ) => material.makeTransparent() )

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
		playAudio( src, listener, P3DObject ) {
			
			return new BABYLON.Sound( "Audio", url, this.scene, null );

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
			// Should be something here
		},
		getPickup( P3DObject ) {
			// Should be something here
		},
		makeListeningObject( P3DObject ) {

			// If you use three.js, put something here.

		},
		setLinearVelocity( x = P3DObject.getLinearVelocity().x, y = P3DObject.getLinearVelocity().y, z = P3DObject.getLinearVelocity().z, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setLinearVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setAngularVelocity( x = getMeshByName( P3DObject.name ).getAngularVelocity().x, y = getMeshByName( P3DObject.name ).getAngularVelocity().y, z = getMeshByName( P3DObject.name ).getAngularVelocity().z, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setAngularVelocity( new Ammo.btVector3( x, y, z ) );

		},
		setDamping( linear, angular, P3DObject ) {

			// If you like Physijs, have a look here.

		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setLinearFactor( new Ammo.btVector3( x, y, z ) );

		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.physicsBody.setAngularFactor( new Ammo.btVector3( x, y, z ) );

		},
		addEventListener( name, callback, P3DObject ) {

			getMeshByName( P3DObject.name ).addEventListener( name, callback );

		},
		removeEventListener( name, callback, P3DObject ) {

			getMeshByName( P3DObject.name ).removeEventListener( name, callback );

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
		applyLocRotChange( P3DObject ) {

			// If you use Physijs, have a look here (__dirtyPosition & __dirtyRotation)

		},
		getLinearVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getLinearVelocity();

		},
		getAngularVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getAngularVelocity();

		},
		isMesh( object, P3DObject ) {

			// What is this good for? I don't know!
			return object.name == P3DObject.name;

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
		getCollidingObjects( P3DObject ) {

			/*
				For three.js

			var touches = [],
				object = getMeshByName( P3DObject.name ),
				interpreter = this;
			// modified from https://stackoverflow.com/questions/11473755/how-to-detect-collision-in-three-js/
			for ( var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex ++ ) {

				// reduced the vertices needed to find a collision
				if ( vertexIndex % 2 == 0 || vertexIndex % 3 == 0 ) continue;
				// reduced variable usage
				var directionVector = object.geometry.vertices[ vertexIndex ].clone().applyMatrix4( object.matrix ).sub( object.position );
				( new THREE.Raycaster( object.position, directionVector.clone().normalize() ) ).intersectObjects( interpreter.objects.children ).forEach( function ( collision ) {

					if ( touches.find( function ( x ) {

						return x.name === collision.object.name;

					} ) || collision.distance > ( directionVector.distanceTo( new THREE.Vector3() ) + .1 ) || ( collision.object.material && collision.object.material.uniforms && collision.object.material.uniforms.sunPosition ) || collision.object == object || collision.object.parent == object || collision.object.parent.parent == object || collision.object.parent.parent == object ) return;
					touches.push( collision.object.p3dParent || collision.object );

				} );

			}

			return touches;
			*/
			// I haven't worked on this yet :(
			return [];

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

			// Now you can do onReady stuff
			if ( extras.onReady ) {

				object.onReady = extras.onReady;
				object.onReady()

			}

		}

		// Merges materials for glTF files
		function mergeSameMaterials( objects ) {

			var similarNames = [];
			var newObjects = [];
			objects.forEach( ( object ) => {

				// Alters the material before doing anything else to it
				if ( object.material ) object.material.usePhysicalLightFalloff = false;
				
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
	create3DMaterial( extras, P3DMaterial, parentObject ) {

		if ( extras.material == undefined ) {

			var material = new BABYLON.PBRMaterial( P3DMaterial.name, this.scene );
			material.usePhysicalLightFalloff = false;
			material.name = P3DMaterial.name;
			material.roughness = 1;
			materials.push( material );
			parentObject.material = material;

		} else {

			extras.material.name = P3DMaterial.name;
			materials.push( extras.material );
			if ( extras.material.subMaterials ) {

				P3DMaterial.subMaterials = [];
				extras.material.subMaterials.forEach( function( material ) {

					P3DMaterial.subMaterials.push( new Proton3DMaterial( parentObject, {
						material: material
					}  ) );

				} );

			}

		}
		
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

		document.body.requestPointerLock();

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
			box-shadow: 0px 0px 10px rgba( 0, 0, 0, 0.7 )
		`;
		document.body.appendChild( crosshairElement );
		return crosshairElement;

	}

	// Some nonessential variables
	audio = Audio
	storage = localStorage

};
/*
	~> wrapper/loc:4.5
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