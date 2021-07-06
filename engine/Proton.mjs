/*
	Proton
	======

	## Table of Contents

	| Section Name               | Location # |
	| -------------------------- | ---------- |
	| Scenes                     | loc:1      | <- Ctrl+F "loc:#" to get to the location specified.
	| Meshes                     | loc:2      |
	| Materials                  | loc:3      |
	| Loading dependencies       | loc:4      |
	| Running code               | loc:5      |

*/

/* CONSTANTS */
export const DEFAULT_KEY_CONTROLS = {
	forward: 87, // W
	sprint: 16, // Shift
	backward: 83, // S
	left: 65, // A
	right: 68, // D
	jump: 32, // Spacebar
	use: 69, // E
	flashlight: 70 // F
};
export const OBJECT_TYPES = {
	// Primitive mesh types
	Cube: 0,
	Sphere: 1,
	Capsule: 2,
	// Camera types
	PerspectiveCamera: 3,
	ThirdPerspectiveCamera: 4,
	// Lights and sky stuff
	SpotLight: 5,
	DirectionalLight: 6,
	Sky: 7
}
export const CAMERA_TYPES = {
	first: 0,
	third: 1
}

/* UTILITIES */
export const UTILS = {
	degToRad( deg ) {

		return deg * ( Math.PI / 180 );

	},
	radToDeg( rad ) {

		return rad * ( 180 / Math.PI );

	},
	// Animates an object with values to the same object, but just with different values.
	animate( object, properties = {}, options = {} /* = { step: function, callback: function, duration: 10 */ ) {

		/*

			What this does is this funciton goes through each property in an object, matching it with its value in the "properties" variable. Keep in mind this must be a FLOAT. Although, this is JavaScript, so any number goes I guess.

			Then this function creates an "easing" function, that, every time it is looped, does the following:
			1. it takes an out-of-one percentage and multiplies that with the difference between the target value for the object and its initial value.
			2. it takes that and adds the initial value again.

		*/
		if ( options.duration == undefined ) options.duration = 100;
		
		// Variables
		var animations = [], currentFrame = 0;
		const ANIM_REFRESH_RATE = 16; // In milliseconds
		// Instead of just adding .1 to the percent done or whatever, we use some math based on the current frame to ease the percentage. --> https://easings.net/#easeInOutCubic
		var ease = ( x ) => { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow( - 2 * x + 2, 3 ) / 2; }
		
		// Adds an animation to a list of animations
		function addAnimation( property, value, target ) {

			var animateValue = target - value;
			animations.push( function ( percentDone ) {

				if ( percentDone >= 1 || object.__isAnimating != 1 ) {

					object[ property ] = animateValue + value;
					if ( options.callback && object.__isAnimating != - 1 ) options.callback( percentDone, object[ property ] );
					return;

				}

				object[ property ] = ( percentDone * animateValue ) + value;

			} );

		}

		// Runs each animation function with a "% done" function.
		function animateAll() {

			object.__animationInterval = setInterval( function () {

				currentFrame ++;

				var framePercentage = currentFrame / ( options.duration / ANIM_REFRESH_RATE /* Gets frames by dividing the duration in ms with the refresh rate in ms */ ) /* Then divides the current frame by the # of total frames */

				animations.forEach( ( animation ) => animation( ease( framePercentage ) ) ); // Runs each animation function.

				if ( ease( framePercentage ) >= 1 ) clearInterval( object.__animationInterval );
				
				if ( options.step ) options.step( object );

			}, ANIM_REFRESH_RATE );

		}

		// Sifts through the "properties" parameter and tries to find each value in the "object" parameter. If it finds a match, it calls addAnimation with the two values.
		for ( var i in properties ) { if ( object[ i ] != undefined ) addAnimation( i, object[ i ], properties[ i ] ); }

		animateAll(); // Begins animating everything

	}
}

/* VECTOR3 */
// Port of THREE.Vector3
export class Vector3 {

 	constructor ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

	add( vector3 ) {

		this.x += vector3.x;
		this.y += vector3.y;
		this.z += vector3.z;
		return this;

	}

	sub( vector3 ) {

		this.x -= vector3.x;
		this.y -= vector3.y;
		this.z -= vector3.z;
		return this;

	}

	multiply( vector3 ) {

		this.x *= vector3.x;
		this.y *= vector3.y;
		this.z *= vector3.z;
		return this;

	}

	divide( vector3 ) {

		this.x /= vector3.x;
		this.y /= vector3.y;
		this.z /= vector3.z;
		return this;

	}

	set( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;
		return this;

	}

	distanceTo( vec3 ) {

		var deltaX = this.x - vec3.x;
		var deltaY = this.y - vec3.y;
		var deltaZ = this.z - vec3.z;
		return Math.sqrt( deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ );

	}

	clone() {

		return new Vector3( this.x, this.y, this.z );

	}

	applyAxisAngle( axis, angle ) {

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

	}

	applyQuaternion( q ) {

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

	}

}

/*
	~> loc:1
	Scenes
*/
export class Scene {

	mappedKeys = DEFAULT_KEY_CONTROLS;

	keys = {}; // A.K.A array of currently pressed keys: { float(key code): boolean(pressed) }

	loopFunctions = []; // Array of functions to be ran when the scene loops

	constructor( interpreter ) {

		// Creating the interpreter
		this.interpreter = interpreter;

		// Initializing the interpreter
		this.interpreter.init( this );

		// Creates the sky
		this.sky = new Mesh( "sky", { type: OBJECT_TYPES.Sky }, this );

		// Creates a camera -- This should be the default camera, especially if you are making games that don't use a traditional first- or third-person camera views.
		this.camera = new Mesh( "camera", { type: OBJECT_TYPES.PerspectiveCamera, position: new Vector3( 0, 0, 5 ) }, this );

		// Creates a camera for third-person views
		this.thirdCamera = new Mesh( "thirdCamera", { type: OBJECT_TYPES.ThirdPerspectiveCamera, position: new Vector3( 0, 0, 5 ) }, this );

	}

	Import( params ) {

		return this.interpreter.importObject( params );
	}

	pause() {

		this.paused = true;
		if ( this.crosshair && this.crosshair.hide ) {

			this.crosshair.hide();

		}

		if ( this.onPause ) {

			this.onPause();

		}

		this.interpreter.pause();

	}

	resume() {

		this.paused = false;
		if ( this.crosshair && this.crosshair.show ) {

			this.crosshair.show();

		}

		this.interpreter.resume();
		if ( this.onResume ) {

			this.onResume();

		}

	}

	makeCrosshair( crosshair ) {

		var crosshairElement = this.interpreter.crosshair();
		crosshair.hide = crosshairElement.hide;
		crosshair.show = crosshairElement.show;
		crosshair.element = crosshairElement;
		return crosshair;

	}

	update() {

		// Running functions that are to run per loop
		this.loopFunctions.forEach( ( fn ) => { fn() } ); // fn is shorthand for "function"

	}

	setEnvironmentMap( url ) {

		return this.interpreter.setEnvironmentMap( url );

	}

	remove( object ) {

		return this.interpreter.removeFromScene( object, this );

	}

	/* Controls */

	setKeyControls( obj, movementSpeed, jumpHeight, weaponAnimations = undefined ) { // Lets you move around + gives you a flashlight
		
		this.interpreter.onKeyDown( ( keyCode ) => {

			this.keys[ keyCode ] = true;
			if ( this.keys[ this.mappedKeys.flashlight ] ) { this.camera.flashlight.toggle() } // Toggles the flashlight

		} );
		this.interpreter.onKeyUp( ( keyCode ) => {

			this.keys[ keyCode ] = false;

			// weapon animations, like in source!
			if ( weaponAnimations && this.weapon && this.weapon.movePosition ) {

				clearInterval( this.__weaponWalkingAnimation );
				this.__weaponWalkingAnimation = undefined;
				UTILS.animate(
					this.weapon.movePosition,
					{
						x: this.weapon.starterPosition.x,
						y: this.weapon.starterPosition.y,
						z: this.weapon.starterPosition.z
					},
					{
						step: function () {

							this.weapon.position.set( this.weapon.movePosition.x, this.weapon.movePosition.y, this.weapon.movePosition.z );

						},
						duration: 1500
					}
				);

			}

		} );

		/*
			A flashlight!
		*/
		this.camera.flashlight = new Mesh( "flashlight", { type: OBJECT_TYPES.SpotLight }, this );
		// Adds it to the camera
		this.camera.add( this.camera.flashlight );
		// Makes it look forward
		this.camera.flashlight.lookAt( 0, 0, 1 );
		this.camera.flashlight.setAngle( 1 );
		// Creates a function to toglge it
		this.camera.flashlight.toggle = () => { this.camera.flashlight.enabled? this.camera.flashlight.setIntensity( 0 ) : this.camera.flashlight.setIntensity( 0.5 ); this.camera.flashlight.enabled = !this.camera.flashlight.enabled };
		// Tells the function the camera is on and toggles it off
		this.camera.flashlight.enabled = true;
		this.camera.flashlight.toggle();
		
		// Movement
		this.loopFunctions.push( () => {

			var practicalSpeed = movementSpeed; // This gets altered if you are sprinting.

			// Sprinting
			if ( this.keys[ this.mappedKeys.sprint ] ) {

				practicalSpeed *= 2.5;

			}

			// Walking
			if ( this.keys[ this.mappedKeys.forward ] ) {

				move( obj.getWorldDirection(), practicalSpeed, false, true );
				
				// Moving diagonally
				if ( this.keys[ this.mappedKeys.left ] || this.keys[ this.mappedKeys.right ] ) {
				
					var movementVector;

					if ( this.keys[ this.mappedKeys.left ] ) {

						movementVector = new Vector3( 0, 40, 0 )

					}

					if ( this.keys[ this.mappedKeys.right ] ) {

						movementVector = new Vector3( 0, -40, 0 )

					}

					move( this.interpreter.rotateVector3( obj.getWorldDirection(), movementVector ), practicalSpeed - 0.5, true, false );

				}

			} else if ( this.keys[ this.mappedKeys.backward ] ) {

				move( obj.getWorldDirection(), practicalSpeed, true, true );

				// Moving diagonally
				if ( this.keys[ this.mappedKeys.left ] || this.keys[ this.mappedKeys.right ] ) {
				
					var movementVector;

					if ( this.keys[ this.mappedKeys.left ] ) {

						movementVector = new Vector3( 0, -40, 0 )

					}

					if ( this.keys[ this.mappedKeys.right ] ) {

						movementVector = new Vector3( 0, 40, 0 )

					}

					move( this.interpreter.rotateVector3( obj.getWorldDirection(), movementVector ), practicalSpeed - 0.5, false, false );

				}

			} else if ( this.keys[ this.mappedKeys.left ] || this.keys[ this.mappedKeys.right ] ) {
				
				var movementVector;

				if ( this.keys[ this.mappedKeys.left ] ) {

					movementVector = new Vector3( 0, 80, 0 )

				}

				if ( this.keys[ this.mappedKeys.right ] ) {

					movementVector = new Vector3( 0, -80, 0 )

				}

				move( this.interpreter.rotateVector3( obj.getWorldDirection(), movementVector ), practicalSpeed - 0.5 );

			}

			// Jumping
			if ( this.keys[ this.mappedKeys.jump ] && obj.physicsObject.linearVelocity.y <= 0.5 && this.interpreter.getCollidingObjects( obj.physicsObject ).length > 0 ) {
		
				obj.physicsObject.setLinearVelocity(
					obj.physicsObject.linearVelocity.x,
					jumpHeight,
					obj.physicsObject.linearVelocity.z
				)

			}

		} );

		// The function that ACTUALLY that moves the player
		var move = ( movementVector, speed, negatise = false, weaponAnimation = true ) => {

			if ( this.thirdCamera.active ) {
				
				// Converts y from any other kind of Vector3
				movementVector = new Vector3( movementVector.x, movementVector.y, movementVector.z )
				
				movementVector.multiply( new Vector3( -1, -1, -1 ) )

			}
			if ( ( this.keys[ this.mappedKeys.forward ] || this.keys[ this.mappedKeys.backward ] ) && this.keys[ this.keys.jump ] && obj.physicsObject.linearVelocity.y <= 0.5 ) {

				movementVector.x *= 1.1;
				movementVector.z *= 1.1;

			}

			obj.physicsObject.setLinearVelocity( movementVector.x * speed * ( negatise ? - 1 : 1 ), obj.physicsObject.linearVelocity.y, movementVector.z * speed * ( negatise ? - 1 : 1 ) );

			if ( this.weapon && weaponAnimations && ! Proton.cancelWeaponAnimations && weaponAnimation == true ) {

				if ( this.__weaponWalkingAnimation == undefined ) {

					this.__weaponWalkingAnimation = interval( function () {

						var movement = Math.sin( gunMoveFrame += ( ( 0.03 * movementSpeed ) + ( this.keys[ this.mappedKeys.sprint ] ? 0.1 : 0 ) ) ) / 500;
						if ( this.gun.movePosition ) Proton.resetAnimation( this.gun.movePosition );
						this.gun.position.set( this.gun.position.x + ( ( 2 * movement ) ), this.gun.position.y + ( movement / 2 ), undefined );
						this.gun.movePosition = this.gun.position.clone();

					}, 32 );

				}

			}

		}

	}

	setCameraControls( options = {} ) {

		if ( options.distance == undefined ) options.distance = new Vector3();
		if ( options.sensitivity == undefined ) options.sensitivity = 10;

		this.crosshair = {};
		this.crosshair.localPosition = new Vector3( 0, 0, 0 );

		this.pause(); // Pauses the game until camera controls are initialized ([...]setCameraControls().init())
		return { init: () => {

			// Requests pointer lock and resumes Proton
			document.body.requestPointerLock();
			this.resume();

			// Initializes camera controls
			if ( ! options.alreadyInitialized ) {

				options.cameraParent.cameraRotation = new Vector3();
				options.alreadyInitialized = true;

				if ( options.invisibleParent ) {

					options.cameraParent.material.opacity = 0.001;
					if ( options.cameraParent.material && options.cameraParent.material.subMaterials ) {

						options.cameraParent.material.subMaterials.forEach( function ( material ) {

							material.makeTransparent();

						} );

					}

					options.invisibleParent = undefined;

				}

			}

			//
			switch ( options.type ) {

				default:

					this.camera.position.set( 0, 0, 0 );

					if ( options.distance != 5 ) {

						this.camera.position.set( options.distance.x, options.distance.y, options.distance.z );

					}

					if ( options.weapon ) {

						this.camera.add( options.weapon );
						this.gun = options.weapon;
						options.weapon.castShadow = false;
						options.weapon.receiveShadow = false;
						options.weapon.position.set( 0.9, - 0.8, - 1.4 );
						if ( options.weaponPosition ) {

							options.weapon.position.set( options.weaponPosition.x, options.weaponPosition.y, options.weaponPosition.z );

						}

						options.weapon.starterPosition = options.weapon.position.clone();

					}

			}

			this.interpreter.setCameraControls( options );

		} };

	}

	// Setting key and camera controls for an object
	setControls( object, options ) {

		var defaultOptions = {
			// Camera controls
			type: CAMERA_TYPES.first,
			head: new Vector3( 0, 0.3, 0 ),
			// Key controls
			movementSpeed: undefined,
			jumpHeight: 4
		};
		for ( var i in defaultOptions ) { // Sets any unset options as the default values for those options

			if ( options[ i ] == undefined ) options[ i ] = defaultOptions[ i ];

		}

		// Controls
		this.controls = {
			camera: this.setCameraControls( {
				type: options.type,
				distance: options.type == CAMERA_TYPES.first ? options.head : options.head.clone().add( new Vector3( 10, 0, 10 ) ),
				invisibleParent: options.invisible,
				cameraParent: object,
				gun: options.weapon,
				height: options.height,
				hidePointer: options.hidePointer
			} ),
			key: this.setKeyControls(
				object,
				options.movementSpeed,
				options.jumpHeight,
				{ weaponAnimations: true }
			)
		};

		// Creates a crosshair element
		if ( options.type == CAMERA_TYPES.first ) this.makeCrosshair( this.crosshair );

	}

}
/*
	loc:2
	Meshes
*/
export class Mesh {

	constructor( name, options, scene ) {

		// A variable to indicate the object's name
		this.name = name;
		
		// A variable to indicate which scene the object is "attached" to.
		this.scene = scene;

		// Gives the mesh an ID
		this.id = scene.interpreter.objectList.giveMeshID();
		
		// Allows the mesh to adopt children
		this.children = [];

		// Creates the mesh
		if ( options.position == undefined ) options.position = new Vector3();
		if ( options.rotation == undefined ) options.rotation = new Vector3();
		this.scene.interpreter.create3DObject( options, this );

		// Sets the mesh's position + rotation to any predefined values
		if ( options.position != new Vector3() ) this.position = options.position;
		if ( options.rotation != new Vector3() ) this.rotation = options.rotation;

		// Does an event if the object has one for creating an object
		if ( Object.prototype.onCreation != undefined ) this.onCreation();

		// Does any extra stuff to the object to "initialize" it
		this.scene.interpreter.init3DObject( options, this );
	
	}

	// Casting shadows
	get castShadow() { return this.scene.interpreter.Mesh.getShadowOptions( this ).cast; }
	set castShadow( value ) { return this.scene.interpreter.Mesh.setShadowOptions( value, undefined, this ) }

	// Receving shadows
	get receiveShadows() { return this.scene.interpreter.Mesh.getShadowOptions( this ).receive; }
	set receiveShadows( value ) { return this.scene.interpreter.Mesh.setShadowOptions( undefined, value, this ) }

	// Setting the position of the object
	get position() { return  this.scene.interpreter.Mesh.getPosition( this ) }
	set position( vector ) { return this.scene.interpreter.Mesh.setPosition( vector.x, vector.y, vector.z, this ); }

	// Setting the rotation of the object
	get rotation() { return  this.scene.interpreter.Mesh.getRotation( this ) }
	set rotation( vector ) { return this.scene.interpreter.Mesh.setRotation( vector.x, vector.y, vector.z, this ); }

	// Setting the linear velocity of the object
	get linearVelocity() { return  this.scene.interpreter.Mesh.getLinearVelocity( this ) }
	set linearVelocity( vector ) { return this.setLinearVelocity( vector ) } // You have to go object.linearVelocity = new Vector3() in order for the velocity to be set so I made a function below

	setLinearVelocity( x = 0, y = 0, z = 0 ) { return this.scene.interpreter.Mesh.setLinearVelocity( x, y, z, this ); }

	setLinearFactor( x = 0, y = 0, z = 0 ) { return this.scene.interpreter.Mesh.setLinearFactor( x, y, z, this ); } // Input should be a normalized vector. This function is sort of like PhysiJS' function of the same name. Is PhysiJS still maintained?

	// Setting the angular velocity of the object
	get angularVelocity() { return  this.scene.interpreter.Mesh.getLinearVelocity( this ) }
	set angularVelocity( vector ) { return this.setLinearVelocity( vector ) } // You have to go object.angularVelocity = new Vector3() in order for the velocity to be set so I made a function below

	setAngularVelocity( x = 0, y = 0, z = 0 ) { return this.scene.interpreter.Mesh.setAngularVelocity( x, y, z, this ); }

	setAngularFactor( x = 0, y = 0, z = 0 ) { return this.scene.interpreter.Mesh.setAngularFactor( x, y, z, this ); }
	
	// The object's mass (physics)
	get mass() { try { return this.scene.interpreter.Mesh.getMass( this ) } catch { /* Errors tend to arise because this accessor is used before initializing physics */ } }
	set mass( value ) { try { return this.scene.interpreter.Mesh.setMass( value, this ) } catch { /* Errors tend to arise because this accessor is used before initializing physics */ } }

	// More physics!
	applyImpulse( force, offset = new Vector3( 0, 0, 0 ) ) { return this.scene.interpreter.Mesh.applyImpulse( force, offset, this ); }

	// Dealing with object "structures"
	delete() { return this.scene.interpreter.Mesh.delete( this ); }
	add( object ) { return this.scene.interpreter.Mesh.add( object, this ); }
	remove() { return this.scene.interpreter.Mesh.remove( this ); }
	
	// Getting an object's global direction + position.
	getWorldDirection() { return this.scene.interpreter.Mesh.getWorldDirection( this ); }
	getWorldPosition() { return this.scene.interpreter.Mesh.getWorldPosition( this ); }

	// Misc.
	makeInvisible() { return this.scene.interpreter.Mesh.makeInvisible( this ); }
	lookAt( x = 0, y = 0, z = 0 ) { return this.scene.interpreter.Mesh.lookAt( x, y, z, this ); }

	// Smoothly animating an object's position.
	animatePosition( x, y, z, time = 1500, callback = undefined ) {

		UTILS.animate(
			this.position.clone(),
			{
				x: x,
				y: y,
				z: z,
			},
			{
				step: ( frame, position ) => { this.position = position; },
				duration: time,
				callback: callback
			}
		);

	}

}

/*
	loc:3
	Materials
*/

export class Material {

	constructor( parentObject, options, scene ) {

		// A variable to indicate which scene the object is "attached" to.
		this.scene = scene;
		
		// Gives the material an ID
		this.id = scene.interpreter.objectList.giveMaterialID();

		// Creates the material
		this.scene.interpreter.create3DMaterial( options, this, parentObject );

	}

	// Properties (but they're really accessors)
	get emissiveColor() { return this.scene.interpreter.Material.getEmissiveColor( this ); }
	set emissiveColor( color ){ return this.scene.interpreter.Material.setEmissiveColor( color, this ); }

	get wireframe() { return this.scene.interpreter.Material.getWireframe( this ); }
	set wireframe( value ) { return this.scene.interpreter.Material.setWireframe( value, this ); }

	get emissive() { return this.scene.interpreter.Material.getEmissive( this ); }
	set emissive( value ) { return this.scene.interpreter.Material.setEmissive( value, this ); }

	get color() { return this.scene.interpreter.Material.getColor( this ); }
	set color( hexString ) { return this.scene.interpreter.Material.setColor( hexString, this ); }

	get roughness() { return this.scene.interpreter.Material.getRoughness( this ); }
	set roughness( value ) { return this.scene.interpreter.Material.setRoughness( value, this ); }

	get metalness() { return this.scene.interpreter.Material.getMetalness( this ); }
	set metalness( value ) { return this.scene.interpreter.Material.setMetalness( value, this ); }
	
	get opacity() { return this.scene.interpreter.Material.getOpacity( this ); }
	set opacity( value ) { return this.scene.interpreter.Material.setOpacity( value, this ); }
	
	// Functions
	makeTransparent() { this.opacity = 0 }

}

/*

	loc:4

	~> Loading dependencies

*/
export class ScriptLoader {

	stats = { loadedScripts: 0, maxScripts: 0 };

	constructor( sources ) {
		
		this.sources = sources
	
	}

	init() {

		this.stats.maxScripts = 0;
		
		// Loads ye main script (ex. babylonjs, threejs)
		this.import( this.sources.primary[ 0 ], this.sources.primary[ 1 ], () => {
			
			// Loads secondary scripts (ex. threejs gltf loader)
			this.sources.secondary.forEach( ( source ) => { this.import( source[ 0 ], source[ 1 ] ) } )
	
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
	
			};
	
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

/*
	~> loc:5
	Running code (for the first time).
	This is needed because you may want to import scripts before you run your game.
	This is why the class below is called MainActivity -- it is constructed using an init function for your game. This then waits until all scripts have loaded to automatically start your init function.
*/
export class MainActivity {

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

	start( scriptSources ) {

		var code = this,
			scripts = new ScriptLoader( scriptSources ),
			interval = setInterval( function () {

				code.loadingPercentage = ( scripts.stats.loadedScripts / scripts.stats.maxScripts ) * 100;
				if ( code.loadingPercentage == 100 ) {

					clearInterval( interval );
					code._run();

				}

			}, 500 );
		
		scripts.init();
		this.scripts = scripts;

	}

}