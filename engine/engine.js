/*
	Proton
	======

	## Table of Contents

	| Section Name               | Location # |
	| -------------------------- | ---------- |
	| Proton3DScene              | loc:1      | <- Ctrl+F "loc:#" to get to the location specified.
	| Proton3DObject             | loc:2      |
	| Proton3DMaterial           | loc:3      |
	| Proton                     | loc:4      |

*/

/*
	~> loc:1
	Proton3DScene
*/
class Proton3DScene {

	constructor() {

		this.mappedKeys = {
			forward: 87, // W
			sprint: 16, // Shift
			backward: 83, // S
			left: 65, // A
			right: 68, // D
			jump: 32, // Spacebar
			use: 69, // E
			flashlight: 70 // F
		};
		this.keys = {};
		this.extraFunctions = [];
		this.priorityExtraFunctions = [];
		this.extraKeyControls = [];

		// Creating the interpreter
		this.interpreter = new Proton3DInterpreter();

	}
	init( extras = {} ) {

		// Initializing the interpreter
		this.interpreter.init( extras, this )

		// Variables
		this.camera = this.interpreter.camera // Should be a Proton3DObject
		this.thirdCamera = this.interpreter.thirdCamera
		
		
		// Functions to be called after a render
		this.runExtraFunctions = false;
		
		// Objects in the scene
		this.children = [];

	}
	update() {

		// Rendering using Proton.scene.interpreter.render
		Proton.scene.interpreter.render( this );
		// extraFunctions
		// priorityExtraFunctions = functions that must run each rendering cycle
		// extraFunctions = functions that fun every 2nd cycle
		this.priorityExtraFunctions.forEach( function ( e ) {

			e();

		} );
		if ( this.runExtraFunctions = !this.runExtraFunctions ) {

			this.extraFunctions.forEach( function ( e ) {

				if ( Proton.paused && ! e.continuePastPausing ) {

					return;

				}

				e();

			} );

		}

	}
	getObjectList() {

		console.warn( "Please consider using [scene].children instead, since that's all this function does.." )
		return this.children;

	}
	remove( object ) {

		return Proton.scene.interpreter.removeFromScene( object, this );

	}
	setKeyControls( obj, movementSpeed = 2.5, jumpHeight, extras = {} ) {

		var x = this,
			gunMoveFrame = 0;
		Proton.scene.interpreter.onKeyDown( function ( keyCode ) {

			x.keys[ keyCode ] = true;
			// flashlight
			if ( x.keys[ x.mappedKeys.flashlight ] && x.camera.flashlight.canBeEnabled ) {

				x.camera.flashlight.enabled ? x.camera.flashlight.disable() : x.camera.flashlight.enable();

			}

		} );
		Proton.scene.interpreter.onKeyUp( function ( keyCode ) {

			x.keys[ keyCode ] = false;
			// gun animations, like in source!
			if ( extras.gunAnimations && ! Proton.cancelGunAnimations && x.gun && x.gun.movePosition ) {

				clearInterval( Proton.cache.gunWalkingAnimation );
				Proton.cache.gunWalkingAnimation = undefined;
				Proton.animate(
					x.gun.movePosition,
					{
						x: x.gun.starterPosition.x,
						y: x.gun.starterPosition.y,
						z: x.gun.starterPosition.z
					},
					{
						step: function () {

							x.gun.position.set( x.gun.movePosition.x, x.gun.movePosition.y, x.gun.movePosition.z );

						},
						duration: 1500
					}
				);

			}

		} );
		x.priorityExtraFunctions.push( checkKeys );
		/*
			A flashlight!
		*/
		x.camera.flashlight = new Proton3DObject( {
			intensity: 0,
			type: "spotlight"
		} );
		x.camera.add( x.camera.flashlight );
		x.camera.flashlight.lookAt( 0, 0, 1 );
		x.camera.flashlight.canBeEnabled = true;
		x.camera.flashlight.setAngle( 1 );
		x.camera.flashlight.enable = function () {

			x.camera.flashlight.setIntensity( 0.5 );
			x.camera.flashlight.enabled = true;

		};

		x.camera.flashlight.disable = function () {

			x.camera.flashlight.setIntensity( 0 );
			x.camera.flashlight.enabled = false;

		};

		x.camera.flashlight.disable();
		
		// Movement
		function checkKeys() {

			var speed = x.playerSpeed || movementSpeed;
			//
			if ( x.skipCheckingKeys ) {

				return;

			}

			// extra (user set) key controls
			x.extraKeyControls.forEach( function ( f ) {

				f( x.keys );

			} );
			// sprinting
			if ( x.keys[ x.mappedKeys.sprint ] ) {

				speed += 5;

			}

			// moving
			if ( x.keys[ x.mappedKeys.forward ] ) {

				var y = obj.getWorldDirection();
				//
				move( y, speed, false, true );
				// moving left and right
				if ( x.keys[ x.mappedKeys.left ] ) {

					var y = Proton.scene.interpreter.rotateVector3(
						obj.getWorldDirection(),
						new Proton.Vector3( 0, 40, 0 )
					)
					//
					move( y, speed - 0.5, true, undefined, false );
					return;

				}

				if ( x.keys[ x.mappedKeys.right ] ) {

					var y = Proton.scene.interpreter.rotateVector3(
						obj.getWorldDirection(),
						new Proton.Vector3( 0, -40, 0 )
					)
					//
					move( y, speed - 0.5, true, undefined, false );
					return;

				}

			}

			if ( x.keys[ x.mappedKeys.backward ] ) {

				var y = obj.getWorldDirection();
				//
				move( y, speed, true, true );
				// moving left and right
				if ( x.keys[ x.mappedKeys.left ] ) {

					var y = Proton.scene.interpreter.rotateVector3(
						obj.getWorldDirection(),
						new Proton.Vector3( 0, -40, 0 )
					)
					//
					move( y, speed - 0.5, false, undefined, false );
					return;

				}

				if ( x.keys[ x.mappedKeys.right ] ) {

					var y = Proton.scene.interpreter.rotateVector3(
						obj.getWorldDirection(),
						new Proton.Vector3( 0, 40, 0 )
					)
					//
					move( y, speed - 0.5, false, undefined, false );
					return;

				}

			}

			if ( x.keys[ x.mappedKeys.left ] ) {

				var y = Proton.scene.interpreter.rotateVector3(
					obj.getWorldDirection(),
					new Proton.Vector3( 0, 80, 0 )
				)
				move( y, speed - 0.5 );

			}

			if ( x.keys[ x.mappedKeys.right ] ) {

				var y = Proton.scene.interpreter.rotateVector3(
					obj.getWorldDirection(),
					new Proton.Vector3( 0, -80, 0 )
				)
				move( y, speed - 0.5 );

			}

			if ( x.keys[ x.mappedKeys.jump ] && obj.physicsObject.getLinearVelocity().y <= 0.5 && Proton.scene.interpreter.getCollidingObjects( obj.physicsObject ).length > 0 ) {
		
				obj.physicsObject.setLinearVelocity(
					undefined,
					jumpHeight,
					undefined
				)

			}

		}

		// The actual function that moves the player
		function move( y, speed, negatise = false, forward = false, gunAnimation = true ) {

			if ( x.thirdCamera.active ) {
				
				// Converts y from any other kind of Vector3
				y = new Proton.Vector3( y.x, y.y, y.z )
				
				y.multiply( new Proton.Vector3( -1, -1, -1 ) )

			}
			if ( ! obj.physicsObject.isPhysicsReady() ) {

				return;

			}
			if ( x.noclip ) {

				var pos = obj.position.clone().add( new THREE.Vector3( y.x * ( speed / 500 ) * ( negatise ? - 1 : 1 ), forward ? ( x.camera.getWorldDirection().y * ( speed / 500 ) * ( negatise ? - 1 : 1 ) ) : 0, y.z * ( speed / 500 ) * ( negatise ? - 1 : 1 ) ) );
				obj.setPosition( pos.x, pos.y, pos.z );
				obj.applyLocRotChange();

			} else {

				if ( ( x.keys[ x.mappedKeys.forward ] || x.keys[ x.mappedKeys.backward ] ) && x.keys[ x.keys.jump ] && obj.physicsObject.getLinearVelocity().y <= 0.5 ) {

					y.x *= 1.1;
					y.z *= 1.1;

				}

				obj.physicsObject.setLinearVelocity( y.x * speed * ( negatise ? - 1 : 1 ), obj.physicsObject.getLinearVelocity().y, y.z * speed * ( negatise ? - 1 : 1 ) );

			}

			if ( x.gun && extras.gunAnimations && ! Proton.cancelGunAnimations && gunAnimation == true ) {

				if ( Proton.cache.gunWalkingAnimation == undefined ) {

					Proton.cache.gunWalkingAnimation = interval( function () {

						var movement = Math.sin( gunMoveFrame += ( ( 0.03 * movementSpeed ) + ( x.keys[ x.mappedKeys.sprint ] ? 0.1 : 0 ) ) ) / 500;
						if ( x.gun.movePosition ) Proton.resetAnimation( x.gun.movePosition );
						x.gun.setPosition( x.gun.position.x + ( ( 2 * movement ) ), x.gun.position.y + ( movement / 2 ), undefined );
						x.gun.movePosition = x.gun.position.clone();

					}, 32 );

				}

			}

		}

	}
	setCameraControls( extras = {} ) {

		var x = this,
			returningObject = {};

		extras.distance = extras.distance || new Proton.Vector3();
		extras.xSensitivity = extras.xSensitivity || 10;
		extras.ySensitivity = extras.ySensitivity || 10;
		extras.scene = this;

		returningObject.init = function () {

			Proton.scene.interpreter.hidePointer();
			Proton.resume();
			init();

		};


		function init() {
			
			if ( ! extras.alreadyInitialized ) {

				extras.cameraParent.cameraRotation = new Proton.Vector3();
				extras.alreadyInitialized = true;

				if ( extras.invisibleParent ) {

					extras.cameraParent.material.opacity = 0.001;
					if ( extras.cameraParent.material && extras.cameraParent.material.subMaterials ) {

						extras.cameraParent.material.subMaterials.forEach( function ( material ) {

							material.makeTransparent();

						} );

					}

					extras.invisibleParent = undefined;

				}

			}

			//
			switch ( extras.type ) {

				case "thirdperson":

					// Add third-person support here.
					break;

				default:

					x.camera.setPosition( 0, 0, 0 );

					if ( extras.distance != 5 ) {

						x.camera.setPosition( extras.distance.x, extras.distance.y, extras.distance.z );

					}

					if ( extras.gun ) {

						x.camera.add( extras.gun );
						x.gun = extras.gun;
						extras.gun.castShadow = false;
						extras.gun.receiveShadow = false;
						extras.gun.setPosition( 0.9, - 0.8, - 1.4 );
						if ( extras.gunPosition ) {

							extras.gun.setPosition( extras.gunPosition.x, extras.gunPosition.y, extras.gunPosition.z );

						}

						extras.gun.starterPosition = extras.gun.position.clone();

					}

			}

			Proton.scene.interpreter.setCameraControls( extras );
			x.setPickingUpControls();

		}

		x.crosshair = {};
		x.crosshair.localPosition = new Proton.Vector3( 0, 0, 0 );

		Proton.pause();
		returningObject.crosshair = x.crosshair;
		return returningObject;

	}
	setPickingUpControls() {

		var x = this,
			objectCollision = false;
		this.priorityExtraFunctions.push( function () {

			if ( x.pickingUpObject && x.pickingUpObject.boundingBox ) {

				objectCollision = false;
				x.getObjectList().forEach( function ( child ) {

					if ( child.boundingBox && child != x.camera.parent && child != x.pickingUpObject && child.parent != x.camera.parent && child.parent != x.camera ) {

						var pos = x.pickingUpObject.position.z;
						child.updateBoundingBox();

						// With the object in an extended position
						x.pickingUpObject.setPosition( 0, 0, - 5 );
						x.pickingUpObject.updateBoundingBox();
						x.pickingUpObject.setPosition( 0, 0, pos );
						
						if ( child.intersectsBoundingBox( x.pickingUpObject.boundingBox ) ) {

							objectCollision = true;

						}

						// With the object in its original position
						x.pickingUpObject.updateBoundingBox();
						
						if ( child.intersectsBoundingBox( x.pickingUpObject.boundingBox ) ) {

							objectCollision = true;

						}

					}

				} );
				if ( objectCollision ) {

					x.pickingUpObject.animatePosition( 0, 0, - 1, 500 );

				} else {

					x.pickingUpObject.animatePosition( 0, 0, - 5, 500 );

				}

			}

		} );

		Proton.scene.interpreter.onKeyUp( function () {

			x.getObjectList().forEach( function ( child ) {

				checkKeypress( child );

			} );

		} );

		function checkKeypress( child ) {

			if ( child.children ) {

				child.children.forEach( function ( child ) {

					checkKeypress( child );

				} );

			}

			if ( child.__pickupable != true || Proton.cache.keyErrorCheck ) {

				return;

			}

			if ( x.keys[ x.mappedKeys.use ] && child.pickingUp === true ) {

				resetPickingUp( child );
				return;

			}

			if ( x.keys[ x.mappedKeys.use ] && x.crosshair.position.distanceTo( child.position ) <= ( child.__pickupDistance || 2 ) && child.pickingUp == null ) {

				x.pickUpObject( child );

			}

		}

		var resetPickingUp = function ( child ) {

			x.resetPickingUp( child, x );

		};

	}
	resetPickingUp( child, scene, callback = function () {} ) {

		this.pickingUpObject = undefined;
		if ( child.__movePosition ) Proton.resetAnimation( child.__movePosition );
		//
		var position = child.getWorldPosition(),
			rotation = child.getWorldRotation();
		scene.crosshair.show();
		scene.add( child );
		child.setLinearVelocity( 0, 0, 0 );
		child.setAngularVelocity( 0, 0, 0 );
		child.setPosition( position.x, position.y, position.z );
		child.setRotation( rotation.x, rotation.y, rotation.z );
		child.applyLocRotChange();
		child.pickingUp = undefined;
		//
		Proton.cache.keyErrorCheck = true;
		timeout( function () {

			callback();

		}, 50 );
		timeout( function () {

			Proton.cache.keyErrorCheck = false;

		}, 500 );

	}
	pickUpObject( child ) {

		var x = this;

		Proton.cache.keyErrorCheck = true;
		timeout( function () {

			Proton.cache.keyErrorCheck = false;

		}, 250 );
		//

		if ( child.onUse ) {

			child.onUse();
			if ( child.__returnAfterPickup ) {

				return;

			}

		}

		child.pickingUp = true;
		x.pickingUpObject = child;
		child.oldPos = child.position.clone();
		child.distance = this.crosshair.position.distanceTo( child.position );
		child.position.set( 0, 0, - 5 );
		this.camera.add( child );
		this.crosshair.hide();

	}

}
/*
	loc:2
	Proton3DObject
*/
const meshData = {
	genericMeshNameInstances: 0,
	genericMaterialNameInstances: 0
};
class Proton3DObject {

	constructor( extras = {} ) {

		// Names the mesh
		if ( extras.name === "" || extras.name == undefined ) {

			this.name = "Mesh";

			if ( meshData.genericMeshNameInstances > 0 ) {

				this.name += "." + meshData.genericMeshNameInstances;

			}

			meshData.genericMeshNameInstances += 1;

		} else {

			this.name = extras.name;

		}

		if ( getMeshByName( this.name ) ) {

			if ( meshData.genericMeshNameInstances > 0 ) {

				this.name += "." + meshData.genericMeshNameInstances;

			}

			meshData.genericMeshNameInstances += 1;

		}

		// Allows the mesh to adopt children
		this.children = extras.children || [];

		// Creates the mesh
		if ( extras.position == undefined ) extras.position = new Proton.Vector3();
		if ( extras.rotation == undefined ) extras.rotation = new Proton.Vector3();
		Proton.scene.interpreter.create3DObject( extras, this );

		// Sets the mesh's position + rotation to any predefined values
		this.setPosition( extras.position.x, extras.position.y, extras.position.z );
		this.setRotation( extras.rotation.x, extras.rotation.y, extras.rotation.z );
		this.position = null;
		this.rotation = null;

		// Does an event if the object has one for creating an object
		if ( Proton3DObject.prototype.onCreation != undefined ) this.onCreation();

		// Does any extra stuff to the object
		Proton.scene.interpreter.init3DObject( extras, this );

		// The Accessors
		Object.defineProperty( this, "castShadow", {
			get: function () {

				return this.getShadowOptions().cast;

			},
			set: function ( value ) {

				return this.setShadowOptions( value );

			}
		} );
		Object.defineProperty( this, "receiveShadow", {
			get: function () {

				return this.getShadowOptions().receive;

			},
			set: function ( value ) {

				return this.setShadowOptions( undefined, value );

			}
		} );
		Object.defineProperty( this, "position", {
			get: function () {

				return this.getPosition();

			},
			set: function ( vector ) {

				return this.setPosition( vector.x, vector.y, vector.z );

			}
		} );
		Object.defineProperty( this, "rotation", {
			get: function () {

				return this.getRotation();

			},
			set: function ( vector ) {

				return this.setRotation( vector.x, vector.y, vector.z );

			}
		} );
		Object.defineProperty( this, "pickupDistance", {
			get: function () {

				return this.getPickupDistance();

			},
			set: function ( value ) {

				return this.setPickupDistance( value );

			}
		} );
		Object.defineProperty( this, "onNear", {
			get: function () {

				return this.getOnNear();

			},
			set: function ( nearFunction ) {

				return this.setOnNear( nearFunction );

			}
		} );
		Object.defineProperty( this, "onUse", {
			get: function () {

				return this.getOnUse();

			},
			set: function ( useFunction ) {

				return this.setOnUse( useFunction );

			}
		} );
		Object.defineProperty( this, "mass", {
			get: function () {

				return this.getMass();

			},
			set: function ( value ) {

				return this.setMass( value );

			}
		} );

	}
	// Making the object... the player
	makePlayer( extras ) {

		var defaultExtras = {
				// Camera
				type: "firstperson",
				head: new Proton.Vector3( 0, 0.3, 0 ),
				invisible: false,
				// Key controls
				movementSpeed: undefined,
				jumpHeight: 4
			},
			object = this;
		for ( var i in defaultExtras ) {

			if ( extras[ i ] == undefined ) extras[ i ] = defaultExtras[ i ];

		}

		// Controls
		Proton.scene.controls = {
			camera: Proton.scene.setCameraControls( {
				type: extras.type,
				distance: extras.type == "firstperson" ? extras.head : extras.head.clone().add( new Proton.Vector3( 10, 0, 10 ) ),
				invisibleParent: extras.invisible,
				cameraParent: object,
				gun: extras.gun,
				height: extras.height
			} ),
			key: Proton.scene.setKeyControls(
				object,
				extras.movementSpeed,
				extras.jumpHeight,
				{ gunAnimations: true }
			)
		};

		// Crosshair
		Proton.crosshair( Proton.scene.crosshair );
		if ( extras.type != "firstperson" ) Proton.scene.crosshair.hide();

		// Rotates a weapon. Crowbars are included, too.
		if ( extras.gunRotation ) {

			extras.gun.setRotation( extras.gunRotation.x, extras.gunRotation.y, extras.gunRotation.z );

		}

		// Immersive stuff to increase immersion
		if ( extras.invisible ) {

			object.makeInvisible();

		}
		if ( extras.noShadows ) {

			// Must already be on a mesh loaded with noShadows = true
			object.setShadowOptions( false, false )

		}

		// Clauses and Provisions
		Proton.player = object;

		// Health (/ 100)
		object.health = 100;
		object.maxHealth = 100;

	}
	// The accessors' corresponding functions:
	makeInvisible() {

		return Proton.scene.interpreter.Proton3DObject.makeInvisible( this );

	}
	getShadowOptions() {

		return Proton.scene.interpreter.Proton3DObject.getShadowOptions( this );

	}
	setShadowOptions( cast = null, receive = null ) {

		return Proton.scene.interpreter.Proton3DObject.setShadowOptions( cast, receive, this );

	}
	applyImpulse( force, offset = new Proton.Vector3( 0, 0, 0 ) ) {

		return Proton.scene.interpreter.Proton3DObject.applyImpulse( force, offset, this );

	}
	delete() {

		return Proton.scene.interpreter.Proton3DObject.delete( this );

	}
	setMass( value ) {

		return Proton.scene.interpreter.Proton3DObject.setMass( value, this );

	}
	getMass() {

		return Proton.scene.interpreter.Proton3DObject.getMass( this );

	}
	setOnUse( useFunction ) {

		return Proton.scene.interpreter.Proton3DObject.setOnUse( useFunction, this );

	}
	setOnNear( nearFunction ) {

		return Proton.scene.interpreter.Proton3DObject.setOnNear( nearFunction, this );

	}
	setPickupDistance( value ) {

		return Proton.scene.interpreter.Proton3DObject.setPickupDistance( value, this );

	}
	setPickup( pickupness, returnAfterUse ) {

		return Proton.scene.interpreter.Proton3DObject.setPickup( pickupness, returnAfterUse, this );

	}
	getOnUse() {

		return Proton.scene.interpreter.Proton3DObject.getOnUse( this );

	}
	getOnNear() {

		return Proton.scene.interpreter.Proton3DObject.getOnNear( this );

	}
	getPickupDistance() {

		return Proton.scene.interpreter.Proton3DObject.getPickupDistance( this );

	}
	getPickup() {

		return Proton.scene.interpreter.Proton3DObject.getPickup( this );

	}
	setLinearVelocity( x = 0, y = 0, z = 0 ) {

		return Proton.scene.interpreter.Proton3DObject.setLinearVelocity( x, y, z, this );

	}
	setAngularVelocity( x = 0, y = 0, z = 0 ) {

		return Proton.scene.interpreter.Proton3DObject.setAngularVelocity( x, y, z, this );

	}
	setLinearFactor( x = 0, y = 0, z = 0 ) {

		return Proton.scene.interpreter.Proton3DObject.setLinearFactor( x, y, z, this );

	}
	addLinearVelocity( x = 0, y = 0, z = 0 ) {

		var velocity = this.getLinearVelocity();
		return Proton.scene.interpreter.Proton3DObject.setLinearVelocity( x + velocity.x, y + velocity.y, z + velocity.z, this );

	}
	addAngularVelocity( x = 0, y = 0, z = 0 ) {

		var velocity = this.getAngularVelocity();
		return Proton.scene.interpreter.Proton3DObject.setAngularVelocity( x + velocity.x, y + velocity.y, z + velocity.z, this );

	}
	setAngularFactor( x = 0, y = 0, z = 0 ) {

		return Proton.scene.interpreter.Proton3DObject.setAngularFactor( x, y, z, this );

	}
	setRotation( x, y, z ) {

		return Proton.scene.interpreter.Proton3DObject.setRotation( x, y, z, this );

	}
	setPosition( x, y, z ) {

		return Proton.scene.interpreter.Proton3DObject.setPosition( x, y, z, this );

	}
	animatePosition( x, y, z, time = 1500, step = undefined, callback = undefined ) {

		var pobject = this,
			target = new Proton.Vector3( x, y, z );
		if ( this.__movePosition === undefined ) {

			this.__movePosition = {
				x: pobject.position.x,
				y: pobject.position.y,
				z: pobject.position.z
			};
			Proton.animate( pobject.__movePosition, {
				x: target.x,
				y: target.y,
				z: target.z,
			}, {
				step: function () {

					if ( pobject.__movePosition === undefined ) {

						return;

					}

					pobject.setPosition( pobject.__movePosition.x, pobject.__movePosition.y, pobject.__movePosition.z );
					if ( step ) {

						step();

					}

				},
				callback: function () {

					pobject.__movePosition = undefined;
					if ( callback ) {

						callback();

					}

				},
				duration: time
			} );

		}

	}
	getRotation() {

		return Proton.scene.interpreter.Proton3DObject.getRotation( this );

	}
	getPosition() {

		return Proton.scene.interpreter.Proton3DObject.getPosition( this );

	}
	getLinearVelocity() {

		return Proton.scene.interpreter.Proton3DObject.getLinearVelocity( this );

	}
	getAngularVelocity() {

		return Proton.scene.interpreter.Proton3DObject.getAngularVelocity( this );

	}
	isPhysicsReady() {

		return Proton.scene.interpreter.Proton3DObject.isPhysicsReady( this );

	}
	getWorldDirection() {

		return Proton.scene.interpreter.Proton3DObject.getWorldDirection( this );

	}
	lookAt( x = 0, y = 0, z = 0 ) {

		return Proton.scene.interpreter.Proton3DObject.lookAt( x, y, z, this );

	}
	getWorldPosition() {

		return Proton.scene.interpreter.Proton3DObject.getWorldPosition( this );

	}
	getWorldRotation() {

		return Proton.scene.interpreter.Proton3DObject.getWorldRotation( this );

	}
	add( object ) {

		return Proton.scene.interpreter.Proton3DObject.add( object, this );

	}
	remove( object ) {

		return Proton.scene.interpreter.Proton3DObject.remove( object, this );

	}

}
/*
	loc:3
	Proton3DMaterial
*/
class Proton3DMaterial {

	constructor( parentObject, extras ) {

		// Names the material
		if ( extras.name === "" || extras.name == undefined ) {

			this.name = "Material";

			if ( meshData.genericMaterialNameInstances > 0 ) {

				this.name += "." + meshData.genericMaterialNameInstances;

			}

			meshData.genericMaterialNameInstances += 1;

		} else {

			this.name = extras.name;

		}

		// Creates the material
		Proton.scene.interpreter.create3DMaterial( extras, this, parentObject, Proton.scene.interpreter );
		
		// Accessors
		Object.defineProperty( this, "color", {
			get: function () {

				return this.getColor();

			},
			set: function ( hexString ) {

				return this.setColor( hexString );

			}
		} );
		Object.defineProperty( this, "roughness", {
			get: function () {

				return this.getRoughness();

			},
			set: function ( value ) {

				return this.setRoughness( value );

			}
		} );
		Object.defineProperty( this, "metalness", {
			get: function () {

				return this.getMetalness();

			},
			set: function ( value ) {

				return this.setMetalness( value );

			}
		} );
		Object.defineProperty( this, "opacity", {
			get: function () {

				return this.getOpacity();

			},
			set: function ( value ) {

				return this.setOpacity( value );

			}
		} );
		Object.defineProperty( this, "emissive", {
			get: function () {

				return this.getEmissive();

			},
			set: function ( value ) {

				return this.setEmissive( value );

			}
		} );
		Object.defineProperty( this, "emissiveColor", {
			get: function () {

				return this.getEmissiveColor();

			},
			set: function ( value ) {

				return this.setEmissiveColor( value );

			}
		} );
		Object.defineProperty( this, "wireframe", {
			get: function () {

				return this.getWireframe();

			},
			set: function ( value ) {

				return this.setWireframe( value );

			}
		} );
		// Done!

	}
	setEmissiveColor( color ) {

		return Proton.scene.interpreter.Proton3DMaterial.setEmissiveColor( color, this );

	}
	getEmissiveColor() {

		return Proton.scene.interpreter.Proton3DMaterial.getEmissiveColor( this );

	}
	setWireframe( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.setWireframe( value, this );

	}
	getWireframe() {

		return Proton.scene.interpreter.Proton3DMaterial.getWireframe( this );

	}
	setEmissive( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.setEmissive( value, this );

	}
	getEmissive() {

		return Proton.scene.interpreter.Proton3DMaterial.getEmissive( this );

	}
	setColor( hexString ) {

		return Proton.scene.interpreter.Proton3DMaterial.setColor( hexString, this );

	}
	getColor() {

		return Proton.scene.interpreter.Proton3DMaterial.getColor( this );

	}
	setRoughness( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.setRoughness( value, this );

	}
	setMetalness( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.setMetalness( value, this );

	}
	getRoughness( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.getRoughness( value, this );

	}
	getMetalness( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.getMetalness( value, this );

	}
	setOpacity( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.setOpacity( value, this );

	}
	getOpacity() {

		return Proton.scene.interpreter.Proton3DMaterial.getOpacity( this );

	}
	makeTransparent( value ) {

		return Proton.scene.interpreter.Proton3DMaterial.makeTransparent( value, this );

	}

}
// Creating audio... that repeats
class RepeatingAudio {

	constructor( beginning, middle, end = undefined ) {

		this.audio = new Proton.scene.interpreter.audio( beginning );
		Proton.playingAudio.push( this );
		// urls
		this.beginning = beginning;
		this.middle = middle;
		this.end = end;
		// repeating
		this.repeatingTimes = Infinity;
		this.loops = 0;

	}
	play() {

		var x = this;
		this.audio.play();
		if ( this.audio.onended == undefined ) {

			this.audio.onended = function () {

				x.beginningOnEnded( x );

			};

		}

	}
	pause() {

		this.audio.pause();

	}
	reset() {

		this.pause();
		this.audio.src = this.beginning;
		this.audio.onended = undefined;
		this.loops = 0;

	}
	//
	beginningOnEnded( x ) {

		this.audio.src = this.middle;
		this.audio.play();
		this.audio.onended = function () {

			x.middleOnEnded( x );

		};

	}
	middleOnEnded( x ) {

		this.loops ++;
		if ( this.loops >= this.repeatingTimes ) {

			if ( this.end ) {

				this.audio.src = this.end;
				this.audio.play();
				this.audio.onended = function () {

					x.reset();

				};

			} else {

				this.reset();

			}

		} else {

			this.audio.play();

		}

	}

}
/*
	~> loc:4
	Proton
*/
let Proton = {
	objects: [],
	paused: false,
	cache: {
		// ...
	},
	// Wrapper for localStorage
	storage: {
		name: "mygame",
		get( name ) {

			return Proton.scene.interpreter.storage.getItem( Proton.storage.name + "-" + name ) || null;

		},
		set( name, value ) {

			Proton.scene.interpreter.storage.setItem( Proton.storage.name + "-" + name, value );
			return value;

		},
		remove( name ) {

			Proton.scene.interpreter.storage.removeItem( Proton.storage.name + "-" + name );

		}
	},
	degToRad( deg ) {

		return deg * ( Math.PI / 180 );

	},
	radToDeg( rad ) {

		return rad * ( 180 / Math.PI );

	},
	// Port of THREE.Vector3
	Vector3: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.add = function ( vector3 ) {

			this.x += vector3.x;
			this.y += vector3.y;
			this.z += vector3.z;
			return this;

		};

		this.sub = function ( vector3 ) {

			this.x -= vector3.x;
			this.y -= vector3.y;
			this.z -= vector3.z;
			return this;

		};

		this.multiply = function ( vector3 ) {

			this.x *= vector3.x;
			this.y *= vector3.y;
			this.z *= vector3.z;
			return this;

		};

		this.divide = function ( vector3 ) {

			this.x /= vector3.x;
			this.y /= vector3.y;
			this.z /= vector3.z;
			return this;

		};

		this.set = function ( x, y, z ) {

			this.x = x;
			this.y = y;
			this.z = z;
			return this;

		};

		this.distanceTo = function ( vec3 ) {

			var deltaX = this.x - vec3.x;
			var deltaY = this.y - vec3.y;
			var deltaZ = this.z - vec3.z;
			return Math.sqrt( deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ );

		};

		this.clone = function () {

			return new Proton.Vector3( this.x, this.y, this.z );

		};

		this.applyAxisAngle = function ( axis, angle ) {

			var _quaternion = {
				setFromAxisAngle: function ( axis, angle ) {

					// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

					// Assumes the axis involved is normalized

					var halfAngle = angle / 2,
						s = Math.sin( halfAngle );

					this.x = axis.x * s;
					this.y = axis.y * s;
					this.z = axis.z * s;
					this.w = Math.cos( halfAngle );

					return this;

				}
			};

			return this.applyQuaternion( _quaternion.setFromAxisAngle( axis, angle ) );

		};

		this.applyQuaternion = function ( q ) {

			var x = this.x,
				y = this.y,
				z = this.z;
			var qx = q.x;
			qy = q.y,
			qz = q.z,
			qw = q.w;

			// Calculate quat * vector

			var ix = qw * x + qy * z - qz * y,
				iy = qw * y + qz * x - qx * z,
				iz = qw * z + qx * y - qy * x,
				iw = - qx * x - qy * y - qz * z;

			// Calculate result * inverse quat

			this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
			this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
			this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

			return this;

		};

	},
	import: function( params ) {

		params.interpreter = Proton.scene.interpreter;
		return Proton.scene.interpreter.importObject( params );

	},
	pause: function () {

		this.paused = true;
		if ( this.scene.crosshair && this.scene.crosshair.hide ) {

			this.scene.crosshair.hide();

		}

		if ( this.onPause ) {

			this.onPause();

		}

		Proton.scene.interpreter.pause();

	},
	resume: function () {

		this.paused = false;
		if ( this.scene.crosshair && this.scene.crosshair.show ) {

			this.scene.crosshair.show();

		}

		Proton.scene.interpreter.resume();
		if ( this.onResume ) {

			this.onResume();

		}

	},
	crosshair( crosshair ) {

		var crosshairElement = Proton.scene.interpreter.crosshair();
		crosshair.hide = crosshairElement.hide;
		crosshair.show = crosshairElement.show;
		crosshair.element = crosshairElement;
		return crosshair;

	},
	noclip() {

		if ( Proton.scene.noclip ) {

			Proton.scene.noclip = false;
			Proton.player.setLinearFactor( 1, 1, 1 );
			Proton.player.setLinearVelocity( 0, 0, 0 );
			Proton.player.setDamping( 0 );
			return;

		} else {

			Proton.scene.noclip = true;
			Proton.player.setLinearFactor( 0, 0, 0 );
			Proton.player.setLinearVelocity( 0, 0, 0 );
			Proton.player.setDamping( 100 );

		}

	},

	// Initiate Proton! (Through executing this function.)
	init( params ) {

		Proton.scene = new Proton3DScene();
		Proton.scene.init( params )

	}
	
}