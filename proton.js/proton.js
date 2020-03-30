"use strict";
/*
	[proton.js beta 1.0]
	[third party software]
		>> three js ( and extra related software, found under its branches ) @ mrdoob/threejs
		>> jquery @ jquery.com
	[locations of sections]
	To get to locations, press Control+F
	and type
	"loc:[location number]"
	Locations of sections:
		adding extra scripts | 1
		constants | 2
		pausing stuff | 3
		misc (which includes some content from some other places on the web) | 4
		proton3d | 9
*/
//\\//\\//\\//\\//\\//\\//\\ //
//\\ adding extra scripts \\ // //loc:1
//\\//\\//\\//\\//\\//\\//\\ //
//25 lines in total will be added to the HTML of a document using Proton3D.
var three_revision = { veryMin: "0.99.0", min: "0.105.0", max: "0.106.0" }
//do not forget to use the tag below
document.writeln( '<meta name="viewport" content="width = device-width, initial-scale = 1.0">' );
//jquery: required
document.writeln( '<script src="https://code.jquery.com/jquery-3.4.1.js"></script>' );
document.writeln( '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>' );
//roboto. all of it (for some reason).
document.writeln( '<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed|Roboto+Mono|Roboto+Slab" rel="stylesheet">' );
//proton3d: threejs
document.writeln( '<script src="https://threejs.org/build/three.js"></script>' );
//proton3d models: threejs
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.min + '/examples/js/loaders/MTLLoader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.veryMin + '/examples/js/loaders/LoaderSupport.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.min + '/examples/js/loaders/OBJLoader2.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.min + '/examples/js/loaders/GLTFLoader.js"></script>' );
//threejs effects
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.max + '/examples/js/postprocessing/EffectComposer.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.max + '/examples/js/postprocessing/ShaderPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.max + '/examples/js/postprocessing/RenderPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.max + '/examples/js/shaders/CopyShader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.min + '/examples/js/postprocessing/UnrealBloomPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@' + three_revision.min + '/examples/js/shaders/LuminosityHighPassShader.js"></script>' );
//proton3d physics: physijs | ammo.js
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physi.js"></script>' );
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/kripken/ammo.js@master/builds/ammo.js"></script>' );
//three.js' sky shader, by https://github.com/zz85
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/objects/Sky.js"></script>' );

//\\//\\//\\//\\// //
//\\ constants \// //loc:3
//\\//\\//\\//\\// //
const CSS = {
	"html, body": [
		"width:  100%",
		"height: 100%",
		"margin: 0px",
		"display: block",
		"border: 0"
	],
	"body": [
		"font-family: 'Roboto Mono', monospace",
		"margin: 0",
		"padding: 0",
		"overflow: hidden"
	],
	"canvas": [
		"margin: 0",
		"padding: 0"
	],
	"watermark": [
		"position: fixed",
		"bottom: 5px",
		"right: 10px",
		"font-family: 'Roboto Mono', monospace",
		"user-select: none",
		"z-index: 2",
		"display: inline-block"
	],
	"scene": [
		"display: block",
		"overflow: auto"
	],
	"scene::-webkit-scrollbar": [
		"display: none"
	],
	"scene::-moz-scrollbar": [
		"display: none"
	],
	"button.aperturebutton": [
	  "box-shadow: 15px 0px 1px -7px #ce4b5a",
	  "border-color: #f1f1f1",
	  "background: #f1f1f1",
	  "color: #f2a519",
	  "border-top-right-radius: 5px",
	  "border-bottom-right-radius: 5px"
	],
	"button.aperturebutton:hover": [
	  "background: #f1f1f1"
	],
	"button": [
	  "padding: 10px",
	  "border: 5px solid black",
	  "outline: none",
	  "margin: 10px",
	  "cursor: pointer",
	  "font-weight: bold",
	  "font-family: 'Roboto Mono', monospace",
	  "background: white",
	  "background-size: 100% 100%",
	  "transition: all 0.3s ease"
	],
	"button:not(.aperturebutton):hover": [
	  "box-shadow: 5px 0px 1px royalblue"
	],
	"button.aperturebutton:focus": [
	  "color: #5291d8"
	],
	"button.aperturebutton:active": [
	  "box-shadow: 10px 0px 1px -7px #ce4b5a"
	],
	"button:not(.aperturebutton):active": [
	  "background: black",
	  "color: white"
	]
}
const ProtonJS = {
	version: "beta 1.0",
	//
	cache: {
		vector3: function ( x, y, z ) {
			ProtonJS.threevector = ProtonJS.threevector || new THREE.Vector3( 0, 0, 0 );
			return ProtonJS.threevector.set( x, y, z )
		}
	},
	paused: false,
	scene: function () {
		console.warn( "ProtonJS.scene is deprecated. Use new Proton3DScene() instead.");
		return new Proton3DScene();
	},
	compileCSS: function ( exclude = [] ) {
		this.style = document.createElement( "style" );
		for ( var i in CSS ) {
			if ( exclude.indexOf( i ) > -1 ) {

				continue;

			}
			this.style.innerHTML += i + "  {\n\t" + CSS[i].join( ";\n\t" ) + "\n}";
		}
		document.head.appendChild( this.style );
	},
	watermark: function ( parent = document.body ) {
		parent.appendChild( Element( "watermark", "proton.js " + this.display_version ) );
	},
	loadingManager: function ( extras = {} ) {
		this.value = 0;
		this.min = 0;
		this.max = 0;
		this.onLoad = null;
		this.onStart = null;
		this.onProgress = null;
		this._onProgress = function ( url, itemsLoaded, itemsTotal ) {
			this.value += itemsLoaded;
			if ( this.onProgress ) {

				this.onProgress( url, itemsLoaded, itemsTotal );

			}
			if ( this.value >= this.max && this.onLoad ) {

				this.loaded = true;
				this.onLoad();

			}
		}
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	pause: function () {
		this.paused = true;
		if ( window.onpause ) {

			window.onpause();

		}
	},
	resume: function () {
		this.paused = false;
		Proton3DInterpreter.resume();
		if ( window.onresume ) {

			window.onresume();

		}
	}
}
//For code that has "ProtonJS" and not "protonjs"
Object.defineProperty( window, "protonjs", {
	get: function() { return ProtonJS }
} );	
//\\//\\//\\//\\//\\  //
//\\ pausing stuff \  // loc:3
//\\//\\//\\//\\//\\  //
window.timeoutList = [];
window.intervalList = [];
window.intervalInfo = [];
window.oldSetTimeout = window.setTimeout;
window.oldSetInterval = window.setInterval;
window.oldClearTimeout = window.clearTimeout;
window.oldClearInterval = window.clearInterval;
window.setTimeout = function ( code, delay ) {
	var val = window.oldSetTimeout( code, delay );
	window.timeoutList.push( val );
	return {
		val: val,
		then: setTimeout.then,
		delay: delay,
		code: code
	};
}
window.clearTimeout = function ( id ) {
	var ind = window.timeoutList.indexOf( id );
	if ( ind >= 0 ) {

		window.timeoutList.splice( ind, 1 );

	}
	var val = window.oldClearTimeout( id );
	return val;
}
window.setInterval = function ( code, delay ) {
	var val = window.oldSetInterval( code, delay );
	window.intervalList.push( val );
	window.intervalInfo.push( [code, delay] );
	return {
		val: val,
		code: code,
		delay: delay
	}
}
window.clearInterval = function ( id ) {
	if ( typeof id === "object" ) {

		id = id.val

	}
	var ind = window.intervalList.indexOf( id );
	if ( ind >= 0 ) {

		window.intervalList.splice( ind, 1 );
		window.intervalInfo.splice( ind, 1 );

	}
	var val = window.oldClearInterval( id );
	return val;
}
window.clearAllTimeouts = function () {
	for ( var i in window.timeoutList ) {
		window.oldClearTimeout( window.timeoutList[i] );
	}
	window.timeoutList = [];
}
window.clearAllIntervals = function () {
	for ( var i in window.intervalList ) {
		window.oldClearInterval( window.intervalList[i] );
	}
	window.intervalList = [];
}
window.setTimeout.then = function ( a, timeout ) {
	var delay = this.delay + ( timeout * 2 );
	setTimeout( a, ( this.delay + ( timeout * 2 ) ) );
	return {
		val: this.val,
		then: setTimeout.then,
		delay: delay,
		code: a
	};
}
//do it again, but for pausing
window.intervals = [];
window.oldOldSetInterval = window.setInterval;
window.setInterval = function ( code, delay ) {
	function newCode() {
		if ( ProtonJS.paused ) {

			return;

		}
		code();
	}
	return window.oldOldSetInterval( newCode, delay );
}
////////////// //
//   misc   // //loc:4
////////////// //
//get a radian from an angle in degrees
const radian = function ( angle ) {
	return THREE.Math.degToRad( angle );
}
//get an angle from a radian (or the other way around)
const angle = function ( converto, degOrRad ) {
	//This assumes that the variable converto is in the opposite measurement that you want to convert it to.
	return degOrRad == "rad"? THREE.Math.degToRad( converto ) : THREE.Math.radToDeg( converto )
}
//creating elements
const Element = function ( elementType = "div", innerHTML = "", properties = null) {
	var elem = document.createElement( elementType );
	elem.innerHTML = innerHTML;
	if ( properties ) {

		for ( var i in properties ) {
			if ( i === "class" ) {

				var array = properties[i].split(" ");
				array.forEach( function ( classString ) {
					elem.classList.add( classString )
				} )

			}

			if ( i === "id" ) {
				elem.id = properties[i]

			}
			elem[i] = properties[i];
		}

	}
	return elem;
}
//toggling
const toggle = function ( boolean ) {
	return !boolean;
}
//bringing back object.watch from user Eli Grey on:
//https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript
Object.defineProperty( Object.prototype, "watch", {
	enumerable: false,
	configurable: true,
	writable: false,
	value: function ( prop, handler ) {
		var oldval = this[ prop ],
			newval = oldval,
			getVal = function () {
				return this[ "_" + prop ];
			},
			setVal = function ( val ) {
				var h = handler.call( this, prop, this[ "_" + prop ], val );
				this[ "_" + prop ] = val;
				return newval = h;
			};
		this[ "_" + prop ] = this[ prop ];
		if ( oldval == undefined || newval == undefined ) {

			return;

		}
		if ( delete this[prop] ) {

			Object.defineProperty( this, prop, {
				get: getVal,
				set: setVal
			} );

		}
	}
} );
/*
	~> loc:9
		~> there are locations 9.1 - 10.0 in this section.
	proton3d
*/
class Proton3DScene {
	constructor() {
		Physijs.scripts.worker = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physijs_worker.js";
		Physijs.scripts.ammo = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/examples/js/ammo.js";
		this.mappedKeys = {
			forward: 38,
			sprint: 16,
			backward: 40,
			left: 37,
			right: 39,
			jump: 32,
			use: 13
		}
		this.keys = {};
		this.extraFunctions = [];
		this.priorityExtraFunctions = [];
		this.extraKeyControls = [];
	}
	//this is the same as the 2d init function,
	//except with an object rather than
	//parameters.
	init( extras = {} ) {
		//some [extras] stuff
		extras.width = extras.width || window.innerWidth;
		extras.height = extras.height || window.innerHeight;
		//variables
		this.element = ( extras.sceneElement || document.createElement( "scene" ) );
		this.camera = new Proton3DObject( {
			type: "perspectivecamera",
			viewportWidth: extras.width,
			viewportHeight: extras.height
		} );
		this.audio = new Audio();
		//ifs
		if ( extras.parent == undefined ) {

			document.body.appendChild( this.element );

		} else if ( extras.parent ) {

			extras.parent.appendChild( this.element );

		}
		//creating a scene
		extras.element = this.element;
		extras.scene = this;
		Proton3DInterpreter.create3DScene( extras );
		//watching for variables
		this.background = ""
		this.backgroundImage = "";
		this.watch( "background", function ( id, oldval, newval ) {
			this.element.style.background = newval;
		} );
		this.watch( "backgroundImage", function ( id, oldval, newval ) {
			this.canvas.style.background = newval;
		} );
		//updating
		this.update( this );
		this.updateExtraFunctions( this );
		//objectList
		this.objectList = []
	}
	update( scene ) {
		requestAnimationFrame( function() {
			scene.update( scene )
		} );
		//pausing
		if ( ProtonJS.paused ) {

			return

		}
		//rendering using Proton3DInterpreter.render
		Proton3DInterpreter.render( this )
		//extraFunctions
		this.priorityExtraFunctions.forEach( function ( e ) {
			e();
		} );
	}
	updateExtraFunctions( scene ) {
		requestIdleCallback( function () {
			scene.updateExtraFunctions( scene )
		} );
		//functions
		scene.extraFunctions.forEach( function ( e ) {
			if ( ProtonJS.paused && !e.continuePastPausing ) {

				return

			}
			e();
		} );
	}
	getObjectList() {
		return this.objectList
	}
	add( object ) {
		return Proton3DInterpreter.addToScene( object, this )
	}
	remove( object ) {
		return Proton3DInterpreter.removeFromScene( object, this )
	}
	dynamicResize() {
		Proton3DInterpreter.dynamicResize( this )
	}
	setKeyControls( obj, speed = 2.5, jumpHeight = 4, extras = {} ) {
		var x = this, gunMoveFrame = 0;
		window.addEventListener( "keydown", function ( e ) {
			e = e || event;
			x.keys[ e.keyCode ] = e.type;
			x.keys[ e.keyCode ] = true;
		} );
		window.addEventListener( "keyup", function ( e ) {
			e = e || event;
			x.keys[ e.keyCode ] = false;
			if ( extras.gunAnimations && x.gun && x.gun.movePosition ) {

				clearInterval( window.gunWalkingAnimation );
				window.gunWalkingAnimation = undefined;
				$( x.gun.movePosition ).animate( {
					x: x.gun.starterPosition.x,
					y: x.gun.starterPosition.y,
					z: x.gun.starterPosition.z
				}, {
					step: function() {
						x.gun.position.set( x.gun.movePosition.x, x.gun.movePosition.y, x.gun.movePosition.z );
					},
					duration: 1500
				} )

			}
		} );
		x.priorityExtraFunctions.push( checkKeys );

		function checkKeys() {
			speed = x.playerSpeed || speed;
			//
			if ( x.skipCheckingKeys ) {

				return;

			}
			//
			x.extraKeyControls.forEach( function ( f ) {
				f( x.keys )
			} )
			//
			if ( x.keys[ x.mappedKeys.forward ] ) {

				var y = obj.getWorldDirection(),
					z = obj.getLinearVelocity();
				//
				move( y, z, speed, false, true )
				//sprinting
				if ( x.keys[ x.mappedKeys.sprint ] ) {

					move( y, z, speed + 3.5 )

				}
				//moving left and right
				if ( x.keys[ x.mappedKeys.left ] ) {

					var y = ProtonJS.rotateVector3(
						new THREE.Vector3( 0, 1, 0 ),
						45,
						obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
						true
					).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
					//
					move( y, z, speed - 0.5, undefined, undefined, false )
					return

				}
				if ( x.keys[ x.mappedKeys.right ] ) {

					var y = ProtonJS.rotateVector3(
						new THREE.Vector3( 0, 1, 0 ),
						-45,
						obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
						true
					).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
					//
					move( y, z, speed - 0.5, undefined, undefined, false )
					return

				}

			}
			if ( x.keys[ x.mappedKeys.backward ] ) {

				var y = obj.getWorldDirection(),
					z = obj.getLinearVelocity();
				//
				move( y, z, speed, true, true )
				//moving left and right
				if ( x.keys[ x.mappedKeys.left ] ) {

					var y = ProtonJS.rotateVector3(
						new THREE.Vector3( 0, 1, 0 ),
						-45,
						obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
						true
					).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
					//
					move( y, z, speed - 0.5, true, undefined, false )
					return

				}
				if ( x.keys[ x.mappedKeys.right ] ) {

					var y = ProtonJS.rotateVector3(
						new THREE.Vector3( 0, 1, 0 ),
						45,
						obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
						true
					).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
					//
					move( y, z, speed - 0.5, true, undefined, false )
					return

				}

			}
			if ( x.keys[ x.mappedKeys.left ] ) {

				var z = obj.getLinearVelocity();
				var y = ProtonJS.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					90,
					obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
					true
				).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
				//
				move( y, z, speed - 0.5 )

			}
			if ( x.keys[ x.mappedKeys.right ] ) {

				var z = obj.getLinearVelocity();
				var y = ProtonJS.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-90,
					obj.getWorldDirection(),
					true
				).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
				//
				move( y, z, speed - 0.5 )

			}
			if ( x.keys[ x.mappedKeys.jump ] && obj.getCollidingObjects().length > 0 ) {

				var rotation = x.camera.getRotation(),
					z = obj.getLinearVelocity();
				obj.setLinearVelocity( z.x, jumpHeight, z.z );

			}
		}
		function move ( y, z, speed, negatise = false, forward = false, gunAnimation = true) {
			if ( x.noclip ) {

				var pos = obj.position.clone().add( new THREE.Vector3( y.x * ( speed / 500 ) * ( negatise? -1 : 1 ) , forward? ( x.camera.getWorldDirection().y * (speed / 500) * ( negatise? -1 : 1 ) ) : 0, y.z * (speed / 500) * ( negatise? -1 : 1 )  ) )
				obj.setPosition( pos.x, pos.y, pos.z );
				obj.applyLocRotChange();

			} else {

				obj.setLinearVelocity( y.x * speed * ( negatise? -1 : 1 ), z.y, y.z * speed * ( negatise? -1 : 1 ) );

			}
			if ( x.gun && extras.gunAnimations && gunAnimation == true ) {

				if ( window.gunWalkingAnimation == undefined ) {

					window.gunWalkingAnimation = setInterval( function() {
						var movement = ( ( Math.sin( gunMoveFrame += 0.2 ) * speed ) / 4000 )
						x.gun.movePosition? $( x.gun.movePosition ).stop() : undefined;
						x.gun.setPosition( x.gun.position.x + ( ( 2 * movement ) ), x.gun.position.y + ( movement / 2 ), undefined );
						x.gun.movePosition = x.gun.position.clone();
					}, 32 )

				}
			}
		}
	}
	makeDoor( door, width = door.width || 2.5, faceInwards = true ) {
		Proton3DInterpreter.makeDoor( door, width, faceInwards, this )
	}
	addPortal2ZoomControls() {
		var x = this.camera,
			oldZoom = 1;
		window.addEventListener( "wheel", function ( e ) {
			if ( e.deltaY < 0 ) {

				if ( x.getZoom() != 3 ) {

					oldZoom = x.getZoom();

				}
				x.setZoom( 3 )

			}
			if ( e.deltaY > 0 ) {

				x.setZoom( oldZoom );

			}
		} );
	}
	setCameraControls( extras = {} ) {
		var x = this,
			returningObject = {},
			posY = 0;
		extras.distance = extras.distance || new THREE.Vector3();
		extras.xSensivity = extras.xSensivity || 10;
		extras.ySensivity = extras.ySensivity || 10;
		//

		returningObject.init = function () {
			document.body.requestPointerLock();
			ProtonJS.resume();
			init();
		}

		//

		function init(){
			var localPosClone = x.crosshair.localPosition.clone();
			
			//physics
			extras.cameraParent.setAngularFactor( 0, 0, 0 );
			extras.cameraParent.setLinearFactor( 1.2, 1.2, 1.2 );
			
			//everything else
			extras.cameraParent.add( x.camera );
			extras.cameraParent.cameraRotation = new THREE.Vector3();

			if ( extras.invisibleParent ) {

				extras.cameraParent.material.opacity = 0.001;
				if ( extras.cameraParent.material && extras.cameraParent.material[ 0 ] ) {

					extras.cameraParent.material.forEach( function ( material ) {
						material.makeTransparent();
					} );

				}

			}

			//
			var oldMovement = 0;
			switch( extras.type ){

				case "thirdperson":

					x.camera.setPosition( 0, 0, -( extras.distance.z || 5 ) );
					x.camera.lookAt( x.camera.parent.getPosition().x, x.camera.parent.getPosition().y, x.camera.parent.getPosition().z );
					break;

				default:

					x.camera.setPosition( 0, 0, 0 )

					if ( extras.distance != 5 ) {

						x.camera.setPosition( extras.distance.x, extras.distance.y, extras.distance.z );

					}
					if ( extras.gun ) {

						x.camera.add( extras.gun )
						x.gun = extras.gun;
						extras.gun.setPosition( 0.9, -0.8, -1.4 )
						if ( extras.gunPosition ) {

							extras.gun.setPosition( extras.gunPosition.x, extras.gunPosition.y, extras.gunPosition.z )

						}
						extras.gun.starterPosition = extras.gun.position.clone();

					}

			}
			window.addEventListener( "mousemove", function ( e ) {
				if ( !ProtonJS.paused ) {

					x.crosshair.__localPosition = ProtonJS.rotateVector3(
						new THREE.Vector3( 0, 1, 0 ),
						-radian( e.movementX / extras.xSensivity ),
						localPosClone,
						false,
						true
					);

					//
					var crosshairPos = ( e.movementY / ( extras.ySensivity * 40 ) ) * ( x.crosshair.__localPosition.distanceTo( x.camera.getPosition() ) );
					if ( 
						//If it's third person and [???]
						(
							(x.cameraType === "thirdperson" || extras.type === "thirdperson" ) &&
							(
								( x.camera.getPosition().y - e.movementY / extras.ySensivity ) > -9 ||
								( x.camera.getPosition().y - e.movementY / extras.ySensivity ) < 9
							) 
						) ||
						
						// If it's first person and the camera's within a certain range
						(
							x.cameraType != "thirdperson" &&
							(
								( x.crosshair.__localPosition.y - crosshairPos ) > -4.5 &&
								( x.crosshair.__localPosition.y - crosshairPos ) < 4.5
							) 
						)
						) {

						x.crosshair.__localPosition.y -= ( e.movementY / ( extras.ySensivity * 40 ) ) * ( x.crosshair.__localPosition.distanceTo( x.camera.getPosition() ) )

						if ( x.cameraType === "thirdperson" || extras.type === "thirdperson" ) {

							x.camera.setPosition( undefined, ( posY += e.movementY / extras.ySensivity ), undefined )

						}

					}

				}
			} );
			x.priorityExtraFunctions.push( function () {
				extras.cameraParent.setRotation( undefined, radian( 90 ), undefined );
				extras.cameraParent.__dirtyRotation = true;
				x.crosshair.position = x.crosshair.__localPosition.clone().add( extras.cameraParent.getPosition() );
				var pos = x.crosshair.position.clone();
				pos.y = extras.cameraParent.getPosition().y;
				extras.cameraParent.lookAt( pos.x, pos.y, pos.z );
				x.camera.lookAt( x.crosshair.position.x, x.crosshair.position.y, x.crosshair.position.z );
			} );
			x.setPickingUpControls();
		}

		//
		x.crosshair = {}
		x.crosshair.localPosition = new THREE.Vector3( 0, 0, 1 );
		x.crosshair.__localPosition = new THREE.Vector3( 0, 0, 0 );
		//

		if ( !extras.cameraParent.parent ) {

			x.add( extras.cameraParent )

		}

		ProtonJS.pause();
		returningObject.crosshair = x.crosshair;
		return returningObject;
	}
	setPickingUpControls() {
		var x = this;
		this.priorityExtraFunctions.push( function () {
			x.getObjectList().forEach( function ( child ) {
				checkObjects( child )
			} );
		} );

		function checkObjects( child ) {
			if ( child.children ) {

				child.children.forEach( function ( child ) {
					checkObjects( child )
				} );

			}
			if ( child.__pickupable != true ) {

				return;

			}
			if( child.__alreadyNeared && x.crosshair.position.distanceTo( child.position ) > ( child.nearDistance || 2 ) ) {

				child.__alreadyNeared = false
				return

			}
			if ( x.crosshair.position.distanceTo( child.position ) <= ( child.nearDistance || 2 ) && child.__onNear && !child.__alreadyNeared ) {

				child.onNear();
				child.__alreadyNeared = true;

			}
			if ( child.pickingUp ) {

				var pos = x.crosshair.__localPosition.clone()
				pos.y = pos.y > 2? 2 : pos.y;
				pos.y = pos.y < -2? -2 : pos.y;
				pos.multiply( new THREE.Vector3( 2.5, 1.5, 2.5 ) ).add( x.camera.parent.getPosition() );
				child.setPosition(
					pos.x,
					pos.y,
					pos.z,
					100
				);

			}
			if ( child.pickingUp === "wrapping" ) {

				child.mass = child.oldMass;
				child.setLinearVelocity( 0, 0, 0 );
				child.setLinearFactor( 1, 1, 1 );
				child.setAngularVelocity( 0, 0, 0 );
				child.setAngularFactor( 1, 1, 1 );
				x.pickingUpObject = null;
				child.pickingUp = null;

			}
		}
		window.addEventListener( "keypress", function () {
			x.getObjectList().forEach( function ( child ) {
				checkKeypress( child );
			} );
		} )

		function checkKeypress( child ) {
			if ( child.children ) {

				child.children.forEach( function ( child ) {
					checkKeypress( child )
				} );

			}
			if ( child.__pickupable != true || window.keyErrorCheck ) {

				return

			}
			if ( x.keys[ x.mappedKeys.use ] && child.pickingUp === true ) {

				resetPickingUp( child )
				return

			}
			if ( x.keys[ x.mappedKeys.use ] && x.crosshair.position.distanceTo( child.position ) <= ( child.__pickupDistance || 2 ) && child.pickingUp == null && window.pickingUpChild == undefined ) {

				x.pickUpObject( child )

			}
		}
		
		var resetPickingUp = function ( child ) { x.resetPickingUp( child, x ) }
	}
	resetPickingUp( child, scene, callback = function(){} ) {
		this.pickingUpObject = null;
		child.pickingUp = false;
		child.pickingUp = "wrapping";
		scene.crosshair.show()
		//
		window.keyErrorCheck = true;
		setTimeout( function () {
		callback();
		}, 50 );
		setTimeout( function () {
			window.keyErrorCheck = false;
		}, 500 )
	}
	pickUpObject( child ) {
		var x = this, resetPickingUp = function ( child ) { x.resetPickingUp( child, x ) };
		window.keyErrorCheck = true
		setTimeout( function () { window.keyErrorCheck = false }, 250 )
		//

		if ( child.onUse ) {

			child.onUse();
			if ( child.__returnAfterPickup ) {

				return

			}

		}
		
		child.pickingUp = true;
		x.pickingUpObject = child;
		if ( child.oldMass != 0 ) {

			child.oldMass = child.mass;

		}
		child.addEventListener( "collision", function( otherobj ) {
			if ( child.pickingUp && otherobj != this && otherobj.p3dParent != x.camera.parent && otherobj.p3dParent != x.gun ) {

				resetPickingUp( child )

			}
		} )
		child.oldPos = child.position.clone();
		child.distance = this.crosshair.position.distanceTo( child.position );
		child.setLinearVelocity( 0, 0, 0 );
		child.setLinearFactor( 0, 0, 0 );
		child.setAngularVelocity( 0, 0, 0 );
		child.setAngularFactor( 0, 0, 0 );
		this.crosshair.hide();
	}
}
/*
	loc:9.1
	tools
*/
ProtonJS.crosshair = function ( crosshair ) {
	var crosshairElement = document.createElement( "div" );
	crosshairElement.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(  -50%, -50%  );
		height: 21px;
		width: 21px;
		image-rendering: auto !important;
		background: url(  "data:image / png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAKXnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjarZhpliMrDoX / s4peArNgOYzn9A56 + f0JIp1DDa + yuu2qjDAmQOheSVc26z//3uZfvILzxcQkJdecLa9YY / WNm2Lv616djefv / ZCe79zncfP6wjMUuIb7Ma9nfmM8vT8g8Rnvn8eNjGed8izkXgufV9Cd9X4 + Rj4LBX / H3fPZ1OeBlj8c5 / nvx7Pss / jXz1FwxkysF7zxK7hg79 + 7U8CKUEPjms9f8Xe0hXT + hpB + 9J95ue4nDnzdffGffbMsvLvjLvR2rPzFT / mF1Ofx8NrGf7LI + dfO / hPU23b78fXBf3vPsve6p2sxG9yVn0O9HeXcMZFFYjiPZd7C / 8S9nHflXWyzA9QmR + 2GPYerzuPr7aKbrrnt1rkONzAx + uVxt / d ++HDGCu6vfhxQor7d9mLAZ4YCKgPkAsP + ZYs7 + 1bdj80KO0 / HTO9YzPHEp7f5OvC3708L7a00d86Wl6 + wyytlMUOR07 / MigeI69N0 / OvMvdivLwU2gGA6bi4csNl + l + jJvXMrHJyDTYap0d54cTKfBXAReyeMcQEEbHYhueyseC / O4ccCPg3LfYi + g4BLJvmJlT6GkAGneN2bZ8SduT75O0x6AYhE0AjQEECAFWOKmXgrUKiZFFJMKeUkqaSaWg455pRzlqx5qkmQKEmyiBSp0koosaSSi5RSamnV10AaS6bmKrXUWltj0xYbazXmNwa676HHnnru0kuvvQ3oM + JIIw8ZZdTRpp9hkgLMzFNmmXW25RZUWnGllZessupqG67tsONOO2 / ZZdfdXqg9qH5G7Styv0fNPaj5A5TOk3fUGBZ5W8JpOkmKGYj56EBcFAEI7RUzW1yMXpFTzGz1wZClPFYmBWc6RQwE43I + bffC7h25X + Jm8O53cfM / Q84odP8P5IxC9wG5H3H7CWqznXQbDkAahfiUDBkIPyas0nxpWpe + ee2rj12Mr5uFfCw9Br3rQgYlanzCbkmrz2XrLivxZcFLkQORybZWOJE1Zee0Q9hG9s4T + yWv6rBr7ZoBa87CGq3YwNQVkuwBxlPCXrMwUli7rxjbTnO7tocRf1fHcT4Ip4d1PvSd4 + 4JkHY / duZda5c8Ci4SGd3VsebA4p0WHKCKkJ59ybu3XHuHXdlXCb3jaL4d4OZ2L7J6HJg9GQ1Sc3BlbMFBNfW13G4pmdxqHDzIl1OKPjDr2iyCcZKcVho74bw + 5StHhioiXVlfA9NqZFJSNfLc / C / X5P02c1KZnFNblpJ4TpKhKg + BZ03mctBqdzDlK8ySGbN6TfpGeOjDFg6XhhqBzappxsbqHpMvu4 / Ausds6Oo6vgEB5vRfm2W + eY4Fo + 0gdJWL4rKNoKPrGzbe76YnbtuDYrE + tMNfa3G / 8me2qggkz6KEvcJgly24ZBvic6p67EP6BNYVp0968nTM + OOr + fUEUrElHFpO5J + rDWdxS0UHZGhx4ra5wlxFwTJLtcMcdaeWSF8SojKRIkUlurGp34WodYkzXnL10tT4 / Fp7ZgM80PEHfn1wM2u6f84C5qdfVNInt1HvNuS + wwJHyPDiDu / ZqGrmqnd70ohaplhabsiLScUNsfvYR7YKk1R6n / Z1qp2KfrpO6LUl21I3DORK + dJgCqOHNSOhuvDmN3Jbjc5gt + Ih1MKYJ2acWNHStigcVJ96uJf1uz7VopkP7V1QXpLuDwbB9HmcGrqA6Hg4pPaeaScN6BnafNAsGZoCIVxc2g34RTaHjIbPM + Cd + h0OvsjBmg60YYYZCm0Q1 / jPyljRjiV3VEd8nEQryctTfiU1XXAqCrkwLdsFBLuagwbiDvs1ZpyrLR + mASd7wrpaS6AeMeeMS / ZbofVs1yljuQU1xqDC9tC8N3uUU3URt7VRC9zxqRImkZg1Bw1osKm2eh + pF5sSSOLe241m9i0t1EPbtt2CiN7d6n / M0LTvqId9TbcoPrvFGuRUnbznzqEMzKeO9oisWRycCrCWZrPv + VxLRE2bAjdos3ZJ9BRLxccIdfqe0kzohk2 + WmNjSa0UkJZznLOjLRKCvVPxivaTTcv0WNXkvkrfhapj0QaOHD1xQ2pttd4SwHC8TKoqgSzgNX3HMXYXidQ42mG6i21jWQbLQmUvcAMlJxX1KzR6SvdciybySwNClqJ1JgZSIFWsaZPkWLdiFqpWp / JNEe7KODFWSb / wvJ402 + Qjx1EDGBn2cAFct6N + ZyDNZjNn5747bqgUeMCI1a0558rM6GXAhknFgTzSlhZ0UkuhGm0YoAe / HDB6Cw3w22XKmi + m0HjBlJoOUzpKyW6VTCFvoCnjRZNkd89GZpWHJSvHgp3rYUk6QkFZwnkQW78vV7 + oa3Ajc4ilcCo1 + HepQRpQrbk7SX + 4Qw1aGMIKizo1DO07Gl2K0IzgZ5jRyEMK5DjUAEqlBjUeTKAGmjVlSJ9Lv571ZnlWB6De80Baolmipl0L7ZUY2vMwsDRmmytlKvkLQQm2iSaEzeqRAGjIre2p8FHrjEr3gBrv8OnJl8Qb4c + 5oMCTHcGNiM9J5zvd0UYTBtyGEFYuIeDxzhzmKraHEXDO5zX7w4im2nAoI + ZhhKJNXbukOHDLJ7grPu + qF2gutjZBQXNqxJfaEZzcQJ + NxiS9RdMG7QSmU3bn96q9TbE0qk1pyi4W0qquIeQ7Ny3e8TEs4QIKNxXTnUTX67g1zuaqQPXij9djBwsjDaWpWrG5RLsvaEoZU6U + gs3XVOhRIyFzpOkVOZ5exo5eKVWnlkXOWQz7 + u1FS5YktF7VZxzZbiJO26kWS0OXaH4rBl5LGWDtkCWMGbpmce1pbUljadLWVM6G / k1efedq3m7Sk4OQLeQNdDRF8MiWQ79zj + hxjyDolN / ocZaWm1O4zQXhKbBRG7SqBVS5iaRiIh7 / E4Fpfq88pTwSeHlu4xUKiA + HD45mmFWrFvQ05BcNFtimSJJlZVIwkx5Ig0BDykXXbub9Ex996yraUmsCRuOrBIhefXTsKZrFtd / Q39OSxrAmb3K5b9rJC5inWpg59EHyHyoSBXPDWw9nItFij1PnUh2tima2ez6VUtR79J4qGaWT / uYCIED5jtcVXOavus + XUjtuA / hG0FI3K6RZ800lxkJ8Hf3ZyKlr0Q + jYtCd4vXnTe2BfNfmh6gvJKmVEW9iVGQrXFWtR8nQ2MDxGxBhPMJTlANFW4aL4k + Sgfl2r / C6to6CJWuSzPGaNjWTHkYlYjtB + jCyHV5p66haBRD0UZ1wFNpdarcciKjDUmP / JkJ / cmUhlWOWbG7nh347k5Fp0X1Mb / 02Qo9yhsq43TaZTTpp73TbNGFG2 + 2g2k6GpuHKo6T + jb9Pd6 + pBxIKJQLp0PdyWi4Laq3rvlodEfmjL4PIQqqNRFeBcvCnjd3BruA61TSoLY7SkSkZS39JODWD5Hh / S5hHRkQB / rS99sJhUG / UThS5BoBmOhikQXVaYQVef1dCEECYhoJVpiUfSA / ZtxgQ7PX0N9PfTBTakfNTmxOCA0HV5vwaD3rFllkRWP8FPvsaKYhf9VwAAAGFaUNDUElDQyBQUk9GSUxFAAB4nH2RPUjDQBzFX1O1RSoOdlBxyFCdLIqKOEoVi2ChtBVadTC59ENo0pCkuDgKrgUHPxarDi7Oujq4CoLgB4iLq5Oii5T4v6TQIsaD4368u / e4ewcI9TJTzY5xQNUsIxWPidncihh4RReCEDCGAYmZeiK9kIHn + LqHj693UZ7lfe7P0aPkTQb4ROJZphsW8Trx9Kalc94nDrOSpBCfE48adEHiR67LLr9xLjos8MywkUnNEYeJxWIby23MSoZKPEUcUVSN8oWsywrnLc5qucqa9 + QvDOW15TTXaQ4hjkUkkIQIGVVsoAwLUVo1UkykaD / m4R90 / ElyyeTaACPHPCpQITl + 8D / 43a1ZmJxwk0IxoPPFtj + GgcAu0KjZ9vexbTdOAP8zcKW1 / JU6MPNJeq2lRY6A3m3g4rqlyXvA5Q7Q / 6RLhuRIfppCoQC8n9E35YC + W6B71e2tuY / TByBDXS3dAAeHwEiRstc83h1s7 + 3fM83 + fgBjZ3KhWgKGVwAAAAZiS0dEADcASwDADel / eAAAAAlwSFlzAAAuIwAALiMBeKU / dgAAAAd0SU1FB + MGCAIyI1pj764AAAAqSURBVDjL7dUxEQAADMJA / EuGgUpoh455D7lIR0kqAIu2 / SzKNuUBr48az6wTuvSPBCoAAAAASUVORK5CYII="  )
	`;
	crosshair.hide = function () {
		crosshairElement.style.display = "none"
	}
	crosshair.show = function () {
		crosshairElement.style.display = null
	}
	crosshair.remove = function(){
		crosshairElement.remove()
	}
	document.body.appendChild( crosshairElement );
	return crosshair;
}
ProtonJS.rotateVector3 = function ( axis, angle, vector, normalize, cancelAutoAngle ) {
	if ( !cancelAutoAngle ) {

		angle = radian( angle );

	}
	var rotationMatrix = new THREE.Matrix4();
	if ( normalize ) {

		vector.normalize();

	}
	vector.applyAxisAngle( axis, angle )
	return vector;
}
/*
	loc:9.2
	Proton3DObject
*/
var genericMeshNameInstances = 0
var genericMaterialNameInstances = 0
class Proton3DObject {
	constructor( extras = {} ) {
		//names the mesh
		if ( extras.name === "" || extras.name == undefined ) {

			this.name = "Mesh"

			if ( genericMeshNameInstances > 0 ) {

				this.name += "." + genericMeshNameInstances;

			}

			genericMeshNameInstances += 1;

		} else {

			this.name = extras.name

		}
		if ( getMeshByName( this.name ) ) {

			if ( genericMeshNameInstances > 0 ) {

				this.name += "." + genericMeshNameInstances;

			}

			genericMeshNameInstances += 1;

		}
		//gives children to the mesh
		this.children = extras.children || []
		//gives the decision to skip a material replacement when initilizing pbr
		this.skipPBRReplacement = false
		//creates a mesh
		Proton3DInterpreter.create3DObject( extras, this )
		if ( extras.type && ( extras.type == "sky" || extras.type.includes( "light" ) || extras.type.includes( "camera" ) ) ) {
			this.setLinearVelocity = null;
			this.setLinearVelocity = null;
			this.getAngularVelocity = null
			this.getAngularVelocity = null;
		}
		//sets the mesh's position + rotation
		this.setPosition( extras.x, extras.y, extras.z )
		this.setRotation( extras.rotationX, extras.rotationY, extras.rotationZ )
		//if you're not going to use physics, you can get scaling!
		Object.defineProperty( this, "scale", {
				get: function() {
					return this.getScale()
				},
				set: function( vector ) {
					return this.setScale( vector.x, vector.y, vector.z )
				}
		} )
		//
		this.position = null
		this.rotation = null
		//the accessors
		Object.defineProperty( this, "castShadow", {
			get: function() {
				return this.getShadowOptions().cast
			},
			set: function( value ) {
				return this.setShadowOptions( value )
			}
		} )
		Object.defineProperty( this, "receiveShadow", {
			get: function() {
				return this.getShadowOptions().receive
			},
			set: function( value ) {
				return this.setShadowOptions( undefined, value )
			}
		} )
		Object.defineProperty( this, "position", {
			get: function() {
				return this.getPosition()
			},
			set: function( vector ) {
				return this.setPosition( vector.x, vector.y, vector.z )
			}
		} )
		Object.defineProperty( this, "rotation", {
			get: function() {
				return this.getRotation()
			},
			set: function( vector ) {
				return this.setRotation( vector.x, vector.y, vector.z )
			}
		} )
		Object.defineProperty( this, "pickupDistance", {
			get: function() {
				return this.getPickupDistance()
			},
			set: function( value ) {
				return this.setPickupDistance( value )
			}
		} )
		Object.defineProperty( this, "onNear", {
			get: function() {
				return this.getOnNear()
			},
			set: function( nearFunction ) {
				return this.setOnNear( nearFunction )
			}
		} )
		Object.defineProperty( this, "onUse", {
			get: function() {
				return this.getOnUse()
			},
			set: function( useFunction ) {
				return this.setOnUse( useFunction )
			}
		} )
		Object.defineProperty( this, "mass", {
			get: function() {
				return this.getMass()
			},
			set: function( value ) {
				return this.setMass( value )
			}
		} )
	}
	//the accessors' corresponding functions
	getShadowOptions() {
		return Proton3DInterpreter.Proton3DObject.getShadowOptions( this )
	}
	setShadowOptions( cast = null, receive = null ) {
		return Proton3DInterpreter.Proton3DObject.setShadowOptions( cast, receive, this )
	}
	playAudio ( src, listener ) {
		return Proton3DInterpreter.Proton3DObject.playAudio( src, listener, this )
	}
	applyImpulse( force, offset = new THREE.Vector3( 0, 0, 0 ) ) {
		return Proton3DInterpreter.Proton3DObject.applyImpulse( force, offset, this )
	}
	delete() {
		return Proton3DInterpreter.Proton3DObject.delete( this )
	}
	setMass( value ) {
		return Proton3DInterpreter.Proton3DObject.setMass( value, this )
	}
	getMass() {
		return Proton3DInterpreter.Proton3DObject.getMass( this )
	}
	setOnUse( useFunction ){
		return Proton3DInterpreter.Proton3DObject.setOnUse( useFunction, this )
	}
	setOnNear( nearFunction ){
		return Proton3DInterpreter.Proton3DObject.setOnNear( nearFunction, this )
	}
	setPickupDistance( value ){
		return Proton3DInterpreter.Proton3DObject.setPickupDistance( value, this )
	}
	setPickup( pickupness, returnAfterUse ) {
		return Proton3DInterpreter.Proton3DObject.setPickup( pickupness, returnAfterUse, this )
	}
	getOnUse(){
		return Proton3DInterpreter.Proton3DObject.getOnUse( this )
	}
	getOnNear(){
		return Proton3DInterpreter.Proton3DObject.getOnNear( this )
	}
	getPickupDistance(){
		return Proton3DInterpreter.Proton3DObject.getPickupDistance( this )
	}
	getPickup() {
		return Proton3DInterpreter.Proton3DObject.getPickup( this )
	}
	makeListeningObject( THREEListener = new THREE.AudioListener() ) {
		return Proton3DInterpreter.Proton3DObject.makeListeningObject( THREEListener, this )
	}
	setLinearVelocity( x = 0, y = 0, z = 0 ) {
		return Proton3DInterpreter.Proton3DObject.setLinearVelocity( x, y, z, this )
	}
	setAngularVelocity( x = 0, y = 0, z = 0 ) {
		return Proton3DInterpreter.Proton3DObject.setAngularVelocity( x, y, z, this )
	}
	setLinearFactor( x = 0, y = 0, z = 0 ) {
		return Proton3DInterpreter.Proton3DObject.setLinearFactor( x, y, z, this )
	}
	setAngularFactor( x = 0, y = 0, z = 0 ) {
		return Proton3DInterpreter.Proton3DObject.setAngularFactor( x, y, z, this )
	}
	addEventListener( name, callback ) {
		return Proton3DInterpreter.Proton3DObject.addEventListener( name, callback, this )
	}
	removeEventListener( name, callback ) {
		return Proton3DInterpreter.Proton3DObject.removeEventListener( name, callback, this )
	}
	setRotation( x, y, z ) {
		return Proton3DInterpreter.Proton3DObject.setRotation( x, y, z, this )
	}
	setPosition( x, y, z ) {
		return Proton3DInterpreter.Proton3DObject.setPosition( x, y, z, this )
	}
	animatePosition( x, y, z, time = 1500, step = undefined ) {
		var pobject = this, target = new THREE.Vector3( x, y, z );
		//this.__movePosition? $( this.__movePosition ).stop( true, true ) : undefined;
		if ( this.__movePosition === undefined ) {
			
			this.__movePosition = this.position.clone();
			$( pobject.__movePosition ).animate( {
				x: target.x,
				y: target.y,
				z: target.z
			}, {
				step: function() {
					if ( pobject.__movePosition === undefined ) {

						return

					}
					if ( pobject.__movePosition.distanceTo( target ) < 1 ) {

						$( pobject.__movePosition ).stop( true, true );
						return

					}
					pobject.setPosition( pobject.__movePosition.x, pobject.__movePosition.y, pobject.__movePosition.z );
					pobject.applyLocRotChange();
					step? step() : step;
				},
				done: function() {
					console.log( "done!" );
					pobject.__movePosition = undefined;
				},
				duration: time
			} )

		}
	}
	getRotation() {
		return Proton3DInterpreter.Proton3DObject.getRotation( this )
	}
	getPosition() {
		return Proton3DInterpreter.Proton3DObject.getPosition( this )
	}
	applyLocRotChange(){
		return Proton3DInterpreter.Proton3DObject.applyLocRotChange( this )
	}
	getLinearVelocity() {
		return Proton3DInterpreter.Proton3DObject.getLinearVelocity( this )
	}
	getAngularVelocity() {
		return Proton3DInterpreter.Proton3DObject.getAngularVelocity( this )
	}
	isMesh( object ) {
		return Proton3DInterpreter.Proton3DObject.isMesh( object, this )
	}
	getWorldDirection() {
		return Proton3DInterpreter.Proton3DObject.getWorldDirection( this )
	}
	lookAt( x = 0, y = 0, z = 0 ) {
		return Proton3DInterpreter.Proton3DObject.lookAt( x, y, z, this )
	}
	getWorldPosition() {
		return Proton3DInterpreter.Proton3DObject.getWorldPosition( this )
	}
	getCollidingObjects() {
		return Proton3DInterpreter.Proton3DObject.getCollidingObjects( this )
	}
	add( object ) {
		return Proton3DInterpreter.Proton3DObject.add( object, this )
	}
	remove( object ) {
		return Proton3DInterpreter.Proton3DObject.remove( object, this )
	}
}
/*
	loc:9.3
	Proton3DMaterial
*/
class Proton3DMaterial {
	constructor( parentObject, extras ) {
		//names the material
		if ( extras.name === "" || extras.name == undefined ) {

			this.name = "Material"

			if ( genericMaterialNameInstances > 0 ) {

				this.name += "." + genericMaterialNameInstances;

			}

			genericMaterialNameInstances += 1;

		} else {

			this.name = extras.name

		}
		//creates the material
		Proton3DInterpreter.create3DMaterial( extras, this, parentObject )
		//accessors
		Object.defineProperty( this, "color", {
			get: function() {
				return this.getColor()
			},
			set: function( hexString ) {
				return this.setColor( hexString )
			}
		} )
		Object.defineProperty( this, "roughness", {
			get: function() {
				return this.getRoughness()
			},
			set: function( value ) {
				return this.setRoughness( value )
			}
		} )
		Object.defineProperty( this, "metalness", {
			get: function() {
				return this.getMetalness()
			},
			set: function( value ) {
				return this.setMetalness( value )
			}
		} )
		Object.defineProperty( this, "opacity", {
			get: function() {
				return this.getOpacity()
			},
			set: function( value ) {
				return this.setOpacity( value )
			}
		} )
		Object.defineProperty( this, "emmisive", {
			get: function() {
				return this.getEmmisive()
			},
			set: function( value ) {
				return this.setEmmisive( value )
			}
		} )
		Object.defineProperty( this, "emmisiveColor", {
			get: function() {
				return this.getEmmisiveColor()
			},
			set: function( value ) {
				return this.setEmmisiveColor( value )
			}
		} )
		Object.defineProperty( this, "wireframe", {
			get: function() {
				return this.getWireframe()
			},
			set: function( value ) {
				return this.setWireframe( value )
			}
		} )
		//done!
	}
	setEmmisiveColor( color ) {
		return Proton3DInterpreter.Proton3DMaterial.setEmmisiveColor( color, this )
	}
	getEmmisiveColor() {
		return Proton3DInterpreter.Proton3DMaterial.getEmmisiveColor( this )
	}
	setWireframe( value ) {
		return Proton3DInterpreter.Proton3DMaterial.setWireframe( value, this )
	}
	getWireframe() {
		return Proton3DInterpreter.Proton3DMaterial.getWireframe( this )
	}
	setEmmisive( value ) {
		return Proton3DInterpreter.Proton3DMaterial.setEmmisive( value, this )
	}
	getEmmisive() {
		return Proton3DInterpreter.Proton3DMaterial.getEmmisive( this )
	}
	setColor( hexString ) {
		return Proton3DInterpreter.Proton3DMaterial.setColor( hexString, this )
	}
	getColor() {
		return Proton3DInterpreter.Proton3DMaterial.getColor( this )
	}
	setRoughness( value ) {
		return Proton3DInterpreter.Proton3DMaterial.setRoughness( value, this )
	}
	setMetalness( value ) {
		return Proton3DInterpreter.Proton3DMaterial.setMetalness( value, this )
	}
	getRoughness( value ) {
		return Proton3DInterpreter.Proton3DMaterial.getRoughness( value, this )
	}
	getMetalness( value ) {
		return Proton3DInterpreter.Proton3DMaterial.getMetalness( value, this )
	}
	setOpacity( value ) {
		return Proton3DInterpreter.Proton3DMaterial.setOpacity( value, this )
	}
	getOpacity() {
		return Proton3DInterpreter.Proton3DMaterial.getOpacity( this )
	}
	makeTransparent( value ) {
		return Proton3DInterpreter.Proton3DMaterial.makeTransparent( value, this )
	}
}
/*
	loc:9.4
	Proton3DInterpreter
*/
var meshes = []
var materials = []
function getMeshByName ( name ) {
	return meshes.find( function( x ) {
		return x.name === name
	} )
}
function getMaterialByName ( name ) {
	return materials.find( function( x ) {
		return x.name === name
	} )
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//  //
//\\ Proton3DInterpreter		    	//  //
//\\ (the star of the Proton3D show)    //  // loc:10 - 10.11
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//  //
//	README
//		[!] All functions shown below that have parameters and that
//				are not called by other functions in the Interpreter
//				must have the same parameters when being
//				rewritten or overwritten by a user.
//
//				[!] -> Since some functions use "extras" for a parameter,
//							keep in mind that these functions may be called by
//							proton.js and not by the user. As such, they will
//							always retain the same structure unless otherwise stated.
//
//		[!] The same goes for returned functions: if a function returns
//				a value (even if that function is inside of a parent function,
//				especially if that parent function returns the child function),
//				that value must have the same structure as when it was found by
//				the user.
//
const Proton3DInterpreter = {

	//creating and modifing Proton3DScenes -- loc:10.1
	create3DScene( extras ) {
		extras.refreshRate = extras.refreshRate || this.refreshRate || 10
		extras.antialias = extras.antialias || false;
		extras.shaderQuality = extras.shaderQuality || "low";
		//variables
		extras.scene.usePBR = extras.pbr;
		this.canvas = document.createElement( "canvas" );
		this.context = this.canvas.getContext( "webgl2", { alpha: false } );
		this.renderer = new THREE.WebGLRenderer( {
			antialias: extras.antialias,
			canvas: this.canvas,
			context: this.context,
			precision: extras.shaderQuality.toLowerCase() + "p"
		} );
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.frame = 0;
		this.fpsMeasurements = [];
		this.renderer.setSize( extras.width, extras.height );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.VSMShadowMap;
		//physics
		this.objects = new Physijs.Scene();
		this.objects.setGravity( new THREE.Vector3( 0, ( extras.gravity || -9.81 ), 0 ) );
		//some element - y stuff
		extras.element.appendChild( this.canvas );
		extras.scene.element.style.imageRendering = extras.pixelatedScene? "pixelated": "";
		//updating a scene
		Proton3DInterpreter.render( extras.scene )
		//PBR
		this.pbrTexture = extras.pbrTexture;
		this.livePBRArray = [];
		this.livePBR = true;
		this.pbrInterval = function () {
			Proton3DInterpreter.livePBRArray.forEach( function ( object ) {
				if ( object.position.distanceTo( extras.scene.camera.parent.position ) > 5 ) {

					return

				}
				getMeshByName( object.name ).pbr? getMeshByName( object.name ).pbr() : undefined;
			} );
		}
		this.pbrArrayInterval = function () {
			if ( extras.scene.getObjectList != undefined && extras.scene.getObjectList() != undefined ) {
				
				Proton3DInterpreter.livePBRArray = [];
				extras.scene.getObjectList().forEach( function ( object ) {
					if ( object == undefined ) {

						return

					}
					if ( getMeshByName( object.name ) == undefined || object.position.distanceTo( extras.scene.camera.parent.position ) > 100 || ( object.material != undefined && object.material.roughness > 0.3 ) ) {

						return

					}
					Proton3DInterpreter.livePBRArray.push( object )
				} )

			}
		}
		if ( extras.livePBR ) {
		
			setInterval( this.pbrInterval, 64 );
			setInterval( this.pbrArrayInterval, 4000 );

		} else {

			ProtonJS.oldResume = ProtonJS.resume;
			ProtonJS.resume = function() {
				ProtonJS.oldResume();
				extras.scene.getObjectList().forEach( function ( object ) {
					if ( object == undefined ) {

						return

					}
					if ( getMeshByName( object.name ) != undefined && getMeshByName( object.name ).pbr ) {

						getMeshByName( object.name ).pbr()

					}
				} )
			}

		}
		//dynamic resolution
		if ( extras.dynamicResolution ) {

			setInterval( function() {
				Proton3DInterpreter.renderer.setPixelRatio( ( Proton3DInterpreter.fps / 60 ) / ( extras.dynamicResolutionFactor || 4 ) ) 
			}, 500 );
			extras.scene.priorityExtraFunctions.push( function() {
				//getting the fps, slightly modified from https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
				const now = performance.now();
				while ( Proton3DInterpreter.fpsMeasurements.length > 0 && Proton3DInterpreter.fpsMeasurements[0] <= now - 1000 ) {
					
					Proton3DInterpreter.fpsMeasurements.shift();

				}
				Proton3DInterpreter.fpsMeasurements.push( now );
				Proton3DInterpreter.fps = Proton3DInterpreter.fpsMeasurements.length;	

			} )

		}
		//
		return this.canvas
	},
	dynamicResize( scene ) {
		window.addEventListener( "resize", function () {
			scene.camera.changeAspectRatio( window.innerWidth / window.innerHeight );
			Proton3DInterpreter.renderer.setSize( window.innerWidth, window.innerHeight );
			if ( Proton3DInterpreter.composer ) {

				Proton3DInterpreter.composer.setSize( window.innerWidth, window.innerHeight );

			}
		} );
	},
	addToScene( object, scene ) {
		this.objects.add( object.name? getMeshByName( object.name ) : object );
		scene.objectList.push( object )
		//physically based rendering
		var skipPBRReplacement = object.skipPBRReplacement,
			skipPBRReplacement_light = object.skipPBRReplacement_light,
			object = object.name? getMeshByName( object.name ) : object,
			oldMaterial = object.material;
		if ( scene.usePBR != false && !skipPBRReplacement && !skipPBRReplacement_light && object.material ) {

			object.pbr = function ( scene = Proton3DInterpreter, PBRCamera = object.pbrCam ) {
				object.visible = false
				PBRCamera.update( scene.renderer, scene.objects );
				object.visible = true;
				if ( object.material[0] != null ) {

					object.material.forEach( function ( material ) {
						( material.proto? material.proto : material ).envMap = object.pbrTexture || PBRCamera.renderTarget.texture
					} )

				} else {

					( object.material.proto? object.material.proto : object.material ).envMap = object.pbrTexture || PBRCamera.renderTarget.texture

				}
			}
			//
			this.initPBR( object.material, object, undefined, scene, skipPBRReplacement, object.material? object.material.name : null );
			object.pbr( this );

		} else if ( !skipPBRReplacement ) {

			this.initPBR( object.material, object, undefined, scene, skipPBRReplacement, object.material? object.material.name : null, false );

		}
	},
	initPBR( material, object, materialLocation, scene = this, skipPBRReplacement = false, materialName, usePBRInTheFirstPlace = true ) {
		if ( material == undefined ) {

			return

		}
		if ( material[0] != null ) {

			material.forEach( function (m, i) {
				Proton3DInterpreter.initPBR( m, object, i, scene, skipPBRReplacement, m.name, usePBRInTheFirstPlace );
			} )

		} else {
			var oldMaterial, newMaterial, hasProto, supportedPropertyList = [
				"color",
				"alphaMap",
				"aoMap",
				"aoMapIntensity",
				"bumpMap",
				"bumpScale",
				"displacementBias",
				"displacementMap",
				"displacementScale",
				"emmisive",
				"emmisiveIntensity",
				"emmisiveMap",
				"envMap",
				"envMapIntensity",
				"flatShading",
				"lightMap",
				"lightMapIntensity",
				"map",
				"metalness",
				"metalnessMap",
				"morphTargets",
				"morphNormals",
				"normalMap",
				"normalMapType",
				"normalScale",
				"opacity",
				"reflectivity",
				"refractionRatio",
				"shadowSide",
				"roughness",
				"roughnessMap",
				"side",
				"skinning",
				"specular",
				"specularMap",
				"transparent",
				"wireframe",
				"wireframeLinecap",
				"wireframeLinejoin",
				"wireframeLinewidth"
			];
			if ( usePBRInTheFirstPlace ) {

				object.pbrCam = new THREE.CubeCamera( 1, 100, 128 );
				object.pbrTexture = Proton3DInterpreter.pbrTexture? new THREE.TextureLoader().load( Proton3DInterpreter.pbrTexture ) : undefined;
				object.add( object.pbrCam );
				//
				hasProto = material.__proto__.type != null;
				oldMaterial = hasProto? material.__proto__ : material;
				newMaterial = new THREE.MeshStandardMaterial( {
					shadowSide: THREE.BackSide,
					roughness: ( oldMaterial.roughness || (oldMaterial.shininess / 100) * 3  || 0.3 ),
					dithering: true
				} );
				for ( var i in oldMaterial ) {

					if ( supportedPropertyList.indexOf( i ) < 0 ) {

						continue

					}
					if ( newMaterial[i] != null ) {

						newMaterial[i] = oldMaterial[i]

					}

				}
				if ( oldMaterial.bumpMap != null ) {

					newMaterial.bumpMap = oldMaterial.bumpMap

				}
				if ( oldMaterial.map != null ) {

					newMaterial.map = oldMaterial.map

				}
				if ( oldMaterial.normalMap != null ) {

					newMaterial.normalMap = oldMaterial.normalMap

				}
				newMaterial.envMap = object.pbrCam.renderTarget.texture;
				newMaterial.shadowSide = THREE.BackSide;
				newMaterial.color = oldMaterial.color;

			} else {

				newMaterial = hasProto? material.__proto__ : material

			}
			if ( materialLocation != null ) {

				var m = hasProto? new Physijs.createMaterial(
					newMaterial
				) : newMaterial;
				m.transparent = false;
				object.material[materialLocation] = m;
				if ( materialName ) {

					getMaterialByName( materialName ).name += "__OBSOLETE"
					m.name = materialName;
					materials.push( m )

				}

			} else {

				var m = hasProto? new Physijs.createMaterial(
					newMaterial
				) : newMaterial;
				m.transparent = false;
				object.material = m;
				if ( materialName ) {

					getMaterialByName( materialName ).name += "__OBSOLETE"
					m.name = materialName;
					materials.push( m )

				}

			}


		}
	},
	removeFromScene( object, scene ) {
		this.objects.remove( getMeshByName( object.name ) || object )
	},
	render( scene ) {
		//rendering using three.js
		this.composer? this.composer.render() : this.renderer.render( this.objects, getMeshByName( scene.camera.name ) );
		//physics
		this.objects.simulate()
	},
	resume() {
		this.objects.onSimulationResume();
	},


	//creating and modifing Proton3DObjects -- loc:10.2
	create3DObject( extras, object ) {
		//the different object types that you see here must be used when swapping this function.
		//any extras are welcome, though!
		switch( extras.type ) {

			case "orthographiccamera":
				var camera = new THREE.OrthographicCamera(
					( extras.viewportLeft || -10 ),
					( extras.viewportRight || -10 ),
					( extras.viewportTop || -10 ),
					( extras.viewportBottom || -10 ),
					( extras.near || 0.26 ),
					( extras.far || 100 )
				);
				camera.name = object.name;
				meshes.push( camera )
				//
				object.changeViewingWidth = function( value ) {
					camera.left = value / -1;
					camera.right = value / 1;
					camera.updateProjectionMatrix()
				}
				object.changeViewingHeight = function ( value ) {
					camera.top = value / 1;
					camera.bottom = value / -1;
					camera.updateProjectionMatrix()
				}
				object.changeNear = function ( value ) {
					camera.near = value
					camera.updateProjectionMatrix()
				}
				object.changeFar = function ( value ) {
					camera.far = value
					camera.updateProjectionMatrix()
				}
				object.changeAspectRatio = function ( value ) {
					camera.aspect = value;
					camera.updateProjectionMatrix()
				}
				//
				break;

			case "perspectivecamera":
				var camera = new THREE.PerspectiveCamera(
					( extras.fov || 75 ),
					( extras.viewportWidth / extras.viewportHeight ),
					( extras.near || 0.26 ),
					( extras.far || 100 )
				);
				camera.name = object.name;
				meshes.push( camera )
				//
				object.changeFOV = function ( value ) {
					camera.fov = value;
					camera.updateProjectionMatrix()
				}
				object.changeAspectRatio = function ( value ) {
					camera.aspect = value;
					camera.updateProjectionMatrix()
				}
				object.getZoom = function () {
					return camera.zoom
				}
				object.setZoom = function ( value ) {
					camera.zoom = value
					camera.updateProjectionMatrix()
				}
				object.changeNear = function ( value ) {
					camera.near = value
					camera.updateProjectionMatrix()
				}
				object.changeFar = function ( value ) {
					camera.far = value
					camera.updateProjectionMatrix()
				}
				//
				break;

			case "spotlight":
				var spotlight = new THREE.SpotLight( new THREE.Color( extras.color || "#fff" ), extras.intensity || 15 )
				spotlight.castShadow = true;
				spotlight.angle = Math.PI / 5;
				spotlight.penumbra = 0.3;
				spotlight.castShadow = true;
				spotlight.shadow.mapSize.width = 1024;
				spotlight.shadow.mapSize.height = 1024;
				spotlight.name = object.name;
				spotlight.shadow.camera.near = 8;
				spotlight.shadow.camera.far = 200;
				spotlight.shadow.bias = -0.002;
				spotlight.shadow.radius = 5;
				//
				meshes.push( spotlight );
				//
				object.changeColor = function ( hexString ) {
					spotlight.color = new THREE.Color( hexString )
				}
				object.changeIntensity = function ( value ) {
					spotlight.intensity = value
				}
				object.getIntensity = function ( value ) {
					return spotlight.intensity
				}
				//
				break;

			case "directionallight":
				var directionallight = new THREE.DirectionalLight( new THREE.Color( extras.color || "#fff" ), extras.intensity == null? 15 : extras.intensity )
				directionallight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.25, 1000 );
				directionallight.shadow.radius = 1.5;
				directionallight.shadow.bias = -0.0008;
				directionallight.name = object.name;
				meshes.push( directionallight );
				//
				object.changeColor = function ( hexString ) {
					directionallight.color = new THREE.Color( hexString )
				}
				object.changeIntensity = function ( value ) {
					directionallight.intensity = value
				}
				object.getIntensity = function ( value ) {
					return directionallight.intensity
				}
				object.setTargetPosition = function ( x, y, z ) {
					directionallight.target.position.set( x, y, z )
					directionallight.target.updateMatrixWorld();
				}
				//
				break;

			case "sky":
				var sky = new THREE.Sky();

				object.skipPBRReplacement = true;
				sky.scale.setScalar( 450000 );
				sky.material.uniforms = {
					"luminance": {
						value: 1
					},
					"turbidity": {
						value: 10
					},
					"rayleigh": {
						value: 2
					},
					"mieCoefficient": {
						value: 0.005
					},
					"mieDirectionalG": {
						value: 0.8
					},
					"sunPosition": {
						value: new THREE.Vector3( 10, 10, 10 )
					}
				}
				for ( var i in sky.material.uniforms ) {
					object[ i ] = sky.material.uniforms[ i ].value
					//set the listeners
					if ( i != "sunPosition" ) {

						object.watch( i, function ( id, oldval, newval ) {
							sky.material.uniforms[ id ].value = newval;
						} );

					}
				}
				for ( var i in extras ) {
					//set the value
					if ( sky.material.uniforms[ i ] ) {

						object[ i ] = extras[ i ];
						sky.material.uniforms[ i ].value = extras[ i ];
					}
				}
				if ( extras.sun ) {

					//
					object.sun = extras.sun;
					object.sun.setPosition(
						object.sunPosition.x,
						object.sunPosition.y,
						object.sunPosition.z
					)
					//
					object.watch( "sunPosition", function ( id, oldval, newval ) {
						sky.material.uniforms[ id ].value = newval;
						//
						object.sun.setPosition(
							newval.x,
							newval.y,
							newval.z
						)
					} );

				}
				sky.name = object.name;
				meshes.push( sky )
				break

			case "cube":

				extras.type = "cube";
				//create the cube
				var cube;
				if ( extras.noPhysics ) {

					cube = new THREE.Mesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material
					)

				} else {

					cube = new Physijs.BoxMesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material,
						( extras.mass || 0 )
					)

				}
				cube.name = object.name;
				meshes.push( cube );
				//cube stuff
				object.width = extras.width || 1;
				object.height = extras.height || 1;
				object.depth = extras.depth || 1;
				//c u b e s t u f f
				var obj = object;
				//geometry
				object.watch( "width", function ( id, oldval, newval ) {
					obj._width = newval;
					Proton3DInterpreter.createMeshGeometry( obj, obj, object.name );
				} );
				object.watch( "height", function ( id, oldval, newval ) {
					obj._height = newval;
					Proton3DInterpreter.createMeshGeometry( obj, obj, object.name );
				} );
				object.watch( "depth", function ( id, oldval, newval ) {
					obj._depth = newval;
					Proton3DInterpreter.createMeshGeometry( obj, obj, object.name );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && object[i] == undefined ) {

						object[i] = extras[i];

					}
				}
				break

			case "sphere":
				extras.type = "sphere";
				//creates the base variables
				var sphere;
				//create the sphere!
				if ( extras.noPhysics ) {

					sphere = new THREE.Mesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material
					)

				} else {

					sphere = new Physijs.SphereMesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material,
						( extras.mass || 0 )
					)

				}
				sphere.name = object.name;
				meshes.push( sphere );
				//creates some properties
				object.radius = 1;
				//adds listeners for each property
				var obj = object;
				//geometry
				object.watch( "radius", function ( id, oldval, newval ) {
					obj._radius = newval;
					changeGeometryParameters( obj );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && object[i] == undefined ) {

						object[i] = extras[i];

					}
				}
				break

			case "cylinder":
				extras.type = "cylinder"
				//create the base variables
				var cylinder;
				//create the cylinder
				if ( extras.noPhysics ) {

					cylinder = new THREE.Mesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material
					)

				} else {

					new Physijs.CylinderMesh(
						Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
						Proton3DInterpreter.createMeshMaterial( extras ).material,
						( extras.mass || 0 )
					);

				}
				cylinder.name = object.name;
				meshes.push( cylinder );
				//creates extra values
				object.radiusTop = 1;
				object.radiusBottom = 1;
				object.height = 1;
				//creates listeners for each value
				var obj = object;
				//
				object.watch( "radiusTop", function ( id, oldval, newval ) {
					obj._radiusTop = newval;
					Proton3DInterpreter.createMeshGeometry( obj );
				} );
				object.watch( "radiusBottom", function ( id, oldval, newval ) {
					obj._radiusTop = newval;
					Proton3DInterpreter.createMeshGeometry( obj );
				} );
				object.watch( "height", function ( id, oldval, newval ) {
					obj._height = newval;
					Proton3DInterpreter.createMeshGeometry( obj );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && object[i] == undefined ) {

						object[i] = extras[i];

					}
				}
				break
			
			default:

				var mesh = extras.mesh;
				if ( mesh.name === "" || mesh.name == undefined ) {

					mesh.name = object.name

				} else {

					object.name = mesh.name

				}
				function namecheck ( p3dobject ) {
					if ( getMeshByName( mesh.name ) ) {

						p3dobject.name += "_copy"
						mesh.name += "_copy"

					}
					if ( getMeshByName( mesh.name ) ) {

						namecheck( p3dobject )

					}
				}
				namecheck( object )
				if ( !mesh.material[ 0 ] ) {

					object.material =  new Proton3DMaterial( object, {
						material: mesh.material
					} )

				} else {

					var y = object;
					object.material = [];
					mesh.material.forEach( function ( material, i ) {

						y.material.push( new Proton3DMaterial( mesh, {
							material: material,
							materialLocation: i
						} ) )

					} );

				}
				meshes.push( mesh );
				if ( extras.noPhysics ) {

					object.getScale = function () {
						return getMeshByName( object.name ).scale
					}
					object.setScale = function ( x, y, z ) {
						if ( x == undefined ) {

							x = object.getScale().x

						}
						if ( y == undefined ) {

							y = object.getScale().y

						}
						if ( z == undefined ) {

							z = object.getScale().z

						}
						getMeshByName( object.name ).scale.set( x, y, z )
					}
				}
		}
		//creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if ( getMeshByName( object.name ).material && extras.type != "sky" && !extras.mesh ) {

			object.material = extras.material || new Proton3DMaterial( getMeshByName( object.name ), {
				name: extras.materialName,
				material: getMeshByName( object.name ).material,
				materialType: extras.materialType
			} )

		}
		//sets the mesh's parent
		getMeshByName( object.name ).p3dParent = object
	},
	Proton3DObject: {
		getShadowOptions( P3DObject ) {
			return {
				cast: getMeshByName( P3DObject.name ).castShadow,
				receive: getMeshByName( P3DObject.name ).receiveShadow
			}
		},
		setShadowOptions( cast = null, receive = null, P3DObject ) {
			getMeshByName( P3DObject.name ).castShadow = cast || getMeshByName( P3DObject.name ).castShadow
			getMeshByName( P3DObject.name ).receiveShadow = receive || getMeshByName( P3DObject.name ).receiveShadow
		},
		playAudio ( src, listener, P3DObject ) {
			var sound = new THREE.PositionalAudio( listener );
			getMeshByName( P3DObject.name ).add( sound );
			var audio = new Audio( src );
			sound.setMediaElementSource( audio );
			return audio;
		},
		applyImpulse( force, offset = ProtonJS.cache.vector3( 0, 0, 0 ), P3DObject ) {
			getMeshByName( P3DObject.name ).applyImpulse( force, offset )
		},
		delete( P3DObject ) {
			if ( P3DObject.children ) {

				P3DObject.children.forEach( function ( child ) {
					if ( child.parent ) {

						child.parent.remove( child )

					}
				} )

			}
			if ( P3DObject.parent ) {

				P3DObject.parent.remove( P3DObject )

			}
		},
		setMass( value, P3DObject ) {
			getMeshByName( P3DObject.name ).mass = value
		},
		getMass( P3DObject ) {
			return getMeshByName( P3DObject.name ).mass
		},
		setOnUse( useFunction, P3DObject ){
			P3DObject.__onUse = useFunction
		},
		setOnNear( nearFunction, P3DObject ){
			P3DObject.__onNear = nearFunction
		},
		setPickupDistance( value, P3DObject ){
			P3DObject.__pickupDistance = value
		},
		setPickup( pickupness, returnAfterUse, P3DObject ) {
			P3DObject.__pickupable = pickupness
			P3DObject.__returnAfterPickup = returnAfterUse
		},
		getOnUse( P3DObject ){
			return P3DObject.__onUse
		},
		getOnNear( P3DObject ){
			return P3DObject.__onNear
		},
		getPickupDistance( P3DObject ){

		},
		getPickup( P3DObject ) {

		},
		makeListeningObject( THREEListener = new THREE.AudioListener(), P3DObject ) {
			getMeshByName( P3DObject.name ).add( THREEListener )
		},
		setLinearVelocity( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = ProtonJS.cache.vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).setLinearVelocity( x )
		},
		setAngularVelocity( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = ProtonJS.cache.vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).setAngularVelocity( x )
		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = ProtonJS.cache.vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).setLinearFactor( x )
		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = ProtonJS.cache.vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).setAngularFactor( x )
		},
		addEventListener( name, callback, P3DObject ) {
			getMeshByName( P3DObject.name ).addEventListener( name, callback )
		},
		removeEventListener( name, callback, P3DObject ) {
			getMeshByName( P3DObject.name ).removeEventListener( name, callback )
		},
		setRotation( x, y, z, P3DObject ) {
			if ( x == undefined ) {

				x = P3DObject.getRotation().x

			}
			if ( y == undefined ) {

				y = P3DObject.getRotation().y

			}
			if ( z == undefined ) {

				z = P3DObject.getRotation().z

			}
			getMeshByName( P3DObject.name ).rotation.set( x, y, z );
			getMeshByName( P3DObject.name ).__dirtyRotation = true
		},
		setPosition( x, y, z, P3DObject ) {
			if ( typeof x === "object" ) {

				getMeshByName( P3DObject.name ).position.set( x.x, x.y, x.z );

			}
			if ( x == undefined ) {

				x = P3DObject.getPosition().x

			}
			if ( y == undefined ) {

				y = P3DObject.getPosition().y

			}
			if ( z == undefined ) {

				z = P3DObject.getPosition().z

			}
			getMeshByName( P3DObject.name ).position.set( x, y, z );
			getMeshByName( P3DObject.name ).__dirtyPosition = true
		},
		getRotation( P3DObject ) {
			return getMeshByName( P3DObject.name ).rotation//.clone()
		},
		getPosition( P3DObject ) {
			return getMeshByName( P3DObject.name ).position//.clone()
		},
		applyLocRotChange( P3DObject ){
			getMeshByName( P3DObject.name ).__dirtyPosition = true
			getMeshByName( P3DObject.name ).__dirtyRotation = true
		},
		getLinearVelocity( P3DObject ) {
			return getMeshByName( P3DObject.name ).getLinearVelocity()
		},
		getAngularVelocity( P3DObject ) {
			return getMeshByName( P3DObject.name ).getAngularVelocity()
		},
		isMesh( object, P3DObject ) {
			//the object has to be a proton3dobject, as with all of these functions.
			return object.name == P3DObject.name
		},
		getWorldDirection( P3DObject ) {
			if ( getMeshByName( P3DObject.name ).getWorldDirection ) {

				return getMeshByName( P3DObject.name ).getWorldDirection( new THREE.Vector3() )

			} else {

				var point = new THREE.Mesh(
						new THREE.BoxBufferGeometry( 0.001, 0.001, 0.001 ),
						new THREE.MeshBasicMaterial()
					),
					mesh = getMeshByName( P3DObject.name );
				point.position.set( 0, 0.5, 2 )
				mesh.add( point )
				var position = ( new THREE.Vector3() ).setFromMatrixPosition( point.matrixWorld );
				mesh.remove( point )
				return position.sub( getMeshByName( P3DObject.name ).position)

			}
		},
		lookAt( x = 0, y = 0, z = 0, P3DObject ) {
			if ( getMeshByName( P3DObject.name ).lookAt ) {
				getMeshByName( P3DObject.name ).lookAt( ProtonJS.cache.vector3( x, y, z ) )
				getMeshByName( P3DObject.name ).__dirtyRotation = true;
			}
		},
		getWorldPosition( P3DObject ) {
			return ( new THREE.Vector3() ).setFromMatrixPosition( getMeshByName( P3DObject.name ).matrixWorld )
		},
		getCollidingObjects( P3DObject ) {
			return getMeshByName( P3DObject.name )._physijs.touches
		},
		add( object, P3DObject ) {
			getMeshByName( P3DObject.name ).add( getMeshByName( object.name ) );
			object.parent = P3DObject;
			P3DObject.children.push( object );
		},
		remove( object, P3DObject ) {
			getMeshByName( P3DObject.name ).remove( getMeshByName( object.name ) );
			object.parent = null;
			removeFromArray( P3DObject.children, object );
		}
	},
	importObject: function( extras ){
		var loader,
			x = this,
			objects = [],
			mesh;
		//gets the loader and loads the file
		switch ( extras.fileType.toLowerCase() ) {

			case "obj":
				loader = new THREE.OBJLoader2( extras.loadManager );
				loader.setLogging( false, false );
				if ( typeof extras.mtlPath === "string" ) {

					loader.loadMtl( extras.mtlPath, null, function ( materials ) {
						loader.setMaterials( materials );
						loader.load( extras.objPath, function ( object ) {
							finishLoad( object.detail.loaderRootNode, object )
						} );
					} );

				} else {

					loader.load( extras.objPath, function ( object ) {
						finishLoad( object.detail.loaderRootNode, object )
					} );

				}
				break;

			case "gltf":

				loader = new THREE.GLTFLoader( extras.loadManager );
				loader.load( extras.gltfPath, function ( object ) {
					finishLoad( object.scene, object )
				} );
				break;

		}
		//finishes the loading stuff
		function getAllMaterials( scene ) {
			var materials = [];
			scene.traverse( getMaterial );
			function getMaterial( object ) {
				object.children.forEach( getMaterial )
				object.material? materials.push( object.material ) : undefined;
			}
			return materials;
		}
		function finishLoad( scene, load ) {
			//takes out the children from a group and puts them into the scene.
			scene.children.forEach( function ( child ) {
				if ( child.isGroup ) {

					child.children.forEach( function ( child_child ) {
						scene.add( child_child )
					} )
					scene.remove( child )

				}
			} )
			//registers each object as a physics object.
			if ( extras.noPhysics != true ) {

				scene.children.forEach( function( child, i ) {
					var m, c = scene.children[ i ];
					//armature
					if ( child.name.toLowerCase().includes( "armature" ) || extras.armature ) {

						extras.armature = child;
						c = child.children[ child.children.length - 1 ]

					}
					//kicks out already recorded stuff
					if ( c._physijs ) {

						return;

					}
					//geometry stuff
					if ( c.isMesh && c.geometry != undefined ) {
						
						//'bakes' the scale into the geometry
						c.geometry = c.geometry.type == "BufferGeometry" ? new THREE.Geometry().fromBufferGeometry( c.geometry ) : c.geometry;
						if ( extras.accountForExtraProperties ) {

							c.geometry.vertices.forEach( function ( vertex ) {
								vertex.multiply( c.scale );
							} );

						}
						//adds the starter position to the object's position.
						if ( extras.starterPos && extras.fileType.toLowerCase() === "gltf" ) {

							c.position.add( extras.starterPos )

						}

					} else {

						//if the object is not a mesh, forget about it.
						if ( c.position && extras.starterPos ) {

							c.position.add( extras.starterPos );

						}
						objects.push( c );
						return;

					}
					//if the object has a --noPhysics flag in its name, forget about it.
					if ( c.name && c.name.includes( " --noPhysics" ) ) {

						objects.push( c );
						return;

					}
					//if extras.objectType is an array corrisponding to the objects in the scene, well, make note of that or something.
					if ( extras.objectType ) {

						switch ( typeof extras.objectType ) {

							case "object":

								extras.objectType[ i ].charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );
								break;

							default:

								m = extras.objectType.charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );

						}

					}
					//if the object has a --geometry flag in its name, extras.objectType will be overridden with this.
					if ( c.name && c.name.includes( "--geometry-" ) ) {

						m = c.name.slice( c.name.indexOf( "--geometry-" ) + 11, c.name.length )
						m = m.charAt( 0 ).toUpperCase() + m.slice( 1 );
						if ( m.includes( "_" ) ) {

							m = m.slice( 0, m.indexOf( "_" ) );

						}

					}
					//if the object must have a transparent collision material, so be it.
					if ( extras.collisionMaterialTransparent ) {

						extras.collisionMaterial = new THREE.MeshBasicMaterial();
						extras.collisionMaterial.transparent = true;
						extras.collisionMaterial.opacity = 0.001;
						extras.collisionMaterial.depthWrite = false;

					}
					//same as above, but for mass.
					var mass = 0;
					if ( extras.mass ) {

						switch ( typeof extras.mass ) {

							case "object":

								mass = extras.mass[ i ]
								break;

							default:

								mass = extras.mass

						}

					}
					//same as above, but for mass.
					if ( c.name && c.name.includes( "--mass" ) ) {

						mass = c.name.slice( c.name.indexOf( "--mass-" ) + 7, c.name.length )
						if ( mass.includes( "_" ) ) {

							mass = mass.slice( 0, mass.indexOf( "_" ) );

						}
						mass = parseFloat( mass );

					}
					//creates a physijs object
					var physicalObject = eval( `new Physijs.` + ( m || "Box" ) + `Mesh(
						(  extras.collisionGeometry || c.geometry  ),
						(  extras.collisionMaterial || c.material  ),
						mass
					)` );
					if( c.name && c.name.replace( /_/ig, " " ).indexOf( " --" ) > -1 ) {

						c.name = c.name.replace( /_/ig, " " ).slice( 0, c.name.indexOf( " --" ) );

					} else if( c.name ) {

						c.name = c.name.replace( /_/ig, " " )

					}
					physicalObject.material = extras._material? extras._material : physicalObject.material;
					physicalObject.name = c.name;
					physicalObject.userData = c.userData;
					physicalObject.material.transparent = true;
					if ( extras.armature ) {

						physicalObject.add( extras.armature );

					}
					if ( extras.starterPos && extras.fileType.toLowerCase() != "gltf" ) {

						physicalObject.position.set(
							extras.starterPos.x + c.position.x,
							extras.starterPos.y + c.position.y,
							extras.starterPos.z + c.position.z,
						);
						physicalObject.__dirtyPosition = true;
						c.position.set( 0, 0, 0 )

					}
					if ( extras.accountForExtraProperties ) {

						physicalObject.rotation.set(
							c.rotation.x,
							c.rotation.y,
							c.rotation.z
						)
						physicalObject.position.set(
							c.position.x,
							c.position.y,
							c.position.z
						)

					}
					//collision box weirdness
					if ( extras.useCollisionBox ) {

						extras.collisionBoxPosition = ( extras.collisionBoxPosition || new THREE.Vector3( 0, 0, 0 ) );
						c.position.set( extras.collisionBoxPosition.x, extras.collisionBoxPosition.y, extras.collisionBoxPosition.z );
						physicalObject.add( c );
						scene.children.push( physicalObject );
						objects.push( physicalObject );
						return;

					}
					//resizing the mesh to account for properties such as scaling
					if ( extras.accountForExtraProperties ) {

						scene.children.push( physicalObject );
						objects.push( physicalObject );
						return;

					}
					//done
					if ( extras.fileType != "gltf" ) {

						physicalObject.add( c );
						scene.children.push( physicalObject );
						objects.push( physicalObject );

					} else {

						physicalObject.children = c.children
						for ( var i in physicalObject ) {
							if ( i != "position" && i != "rotation" && i != "quaternion" && i != "scale" ) {

								c[ i ] = physicalObject[ i ];

							}
						}
						objects.push( c );

					}
					physicalObject.geometry = new THREE.BufferGeometry().fromGeometry( physicalObject.geometry );
					c.geometry = c.type === "BufferGeometry"? c.geometry : new THREE.BufferGeometry().fromGeometry( c.geometry );
					if ( scene.children.length === 1 ) {

						scene = scene.children[ 0 ];

					}
				} )

			} else {

				if ( extras.starterPos ) {

					scene.position.add( extras.starterPos )

				}
				scene.children.forEach( function ( child ) {
					if ( extras.starterPos ) {

						child.position.add( extras.starterPos )

					}
					objects.push( child )
				} )


			}
			//shadows
			scene.children.forEach( castShadow );
			function castShadow( c ) {
				if ( extras.castShadow ) {

					c.castShadow = true

				}
				if ( extras.receiveShadow ) {

					c.receiveShadow = true

				}
				c.children? c.children.forEach( castShadow ) : undefined;
			}
			//animations
			if ( extras.fileType.toLowerCase() === "gltf" && load.animations && load.animations.length ) {

				x.animations = [];
				if ( extras.starterPos ) {

					scene.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z );
					load.scene.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z );

				}
				for ( var i in load.animations ) {
					var mixer = new THREE.AnimationMixer( scene );
					var animation = {
						action: mixer.clipAction( load.animations[ i ] ),
						play: function ( animatingObjects = [] ) {
							if ( !this.action.paused ) {

								return

							}
							this.action.clampWhenFinished = true;
							this.action.enable = true;
							this.action.stop();
							this.action.reset();
							this.action.play();
							var frame = 0,
								action = this.action,
								animation = setInterval( function () {
									if ( action.paused ) {

										action.stop();
										action.reset();
										clearInterval( animation );
										action.paused = true;
										return;

									}
									mixer.update( frame += 0.005 );
									scene.children.forEach( function ( object ) {
										if ( animatingObjects.indexOf( object ) > -1 ) {

											object.position.add( extras.starterPos );

										}
										object.__dirtyPosition = true;
										object.__dirtyRotation = true;
									} );
								}, 16 )
						}
					}
					animation.action.paused = true;
					x.animations[ i ] = animation;
				}
			}
			//creating Proton3D objects
			x.children = [];
			objects.forEach( function ( mesh, i ) {
				var object = new Proton3DObject( { mesh: mesh, noPhysics: extras.noPhysics } )
				x.children.push( object )
				if ( extras.armature ) {

					object.armature = extras.armature;
					object.armatureObject = extras.armature.children[ extras.armature.children.length - 1 ];
					object.armatureObject.material =  object.armatureObject.material.clone();
					object.material = new Proton3DMaterial( object.armatureObject, {
						material: object.armatureObject.material
					} )
					//
					getMeshByName( object.name ).material.visible = false;
					getMeshByName( object.name ).castShadow = false;

				}
				if ( extras.objects ) {

					extras.objects.add( object )

				}
			} )
			//
			if ( extras.onload ) {

				extras.onload( scene );

			}
			if ( x.onload ) {

				x.onload( scene );

			}
		}
	},

	//creating and modifing Proton3DMaterials -- loc:10.3
	create3DMaterial( extras, P3DMaterial, parentObject ){
		if ( !extras.material ) {

			var material = eval( "new THREE.Mesh" + ( extras.materialType? ( extras.materialType.charAt( 0 ).toUpperCase() + extras.materialType.slice( 1 ) ) : "Standard") + "Material()" )
			material.name = P3DMaterial.name;
			material.transparent = true;
			materials.push( material )
		//	parentObject.material = material;

		} else {

			extras.material.name = P3DMaterial.name;
			extras.material.transparent = true;
			materials.push( extras.material )
			if ( extras.materialLocation != undefined || extras.materialLocation != null ) {

				parentObject.material[ extras.materialLocation ] = extras.material

			} else {

				parentObject.material = extras.material;

			}

		}
	},
	Proton3DMaterial: {
		setEmmisiveColor( color, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).emmisive = new THREE.Color( color )
		},
		getEmmisiveColor( P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).emmisive.getStyle()
		},
		setWireframe( value, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).wireframeIntensity = value
		},
		getWireframe( P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).wireframeIntensity
		},
		setEmmisive( value, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).emmisiveIntensity = value
		},
		getEmmisive( P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).emmisiveIntensity
		},
		setColor( hexString, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).color = new THREE.Color( hexString )
		},
		getColor( P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).color.getStyle()
		},
		setRoughness( value, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).roughness = value
		},
		setMetalness( value, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).metalness = value
		},
		getRoughness( value, P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).roughness
		},
		getMetalness( value, P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).metalness
		},
		setOpacity( value, P3DMaterial ) {
			getMaterialByName( P3DMaterial.name ).transparent = true;
			getMaterialByName( P3DMaterial.name ).opacity = value
		},
		getOpacity( P3DMaterial ) {
			return getMaterialByName( P3DMaterial.name ).opacity
		},
		makeTransparent( value, P3DMaterial ) {
			/*
			materials.splice( materials.indexOf( getMaterialByName( this.name ) ), 1 )
			var material = new THREE.MeshStandardMaterial()
			material.name = this.name;
			material.transparent = true;
			materials.push( material );
			*/
			//
			getMaterialByName( P3DMaterial.name ).opacity = 0.001;
			getMaterialByName( P3DMaterial.name ).depthWrite = false
		}
	},

	//some proton.js functions -- loc:10.4
	toggleDoor( door, P3DScene ){
		if ( !door.checkForEnding ) {

			door.isOpen = toggle( door.isOpen );
			var checkForRotations = P3DScene.priorityExtraFunctions.push(function(){
				if ( Math.abs( parseInt( angle( door.rotation.y - door.initialRotation ) ) -  parseInt( angle( door.oldRotation - door.initialRotation ) ) ) > 5 ) {

					P3DScene.priorityExtraFunctions.splice( checkForRotations - 1, 1 );
					door.checkForEnding = function () {
						var rotation = door.rotation.clone().y;
						if ( parseInt( angle( door.rotation.y - door.initialRotation ) ) <= 2 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= -2 ||
							door.position.distanceTo( door.initialPosition ) < 0.1 ) {
							//
							if( parseInt( angle( door.rotation.y ) ) < 2 && parseInt( angle( door.rotation.y ) ) > -2 ) {

								rotation = radian(0.1);

							}
							if ( parseInt( angle( door.rotation.y - door.initialRotation ) ) <= 91 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= 89 ||

								parseInt( angle( door.rotation.y - door.initialRotation)) <= -89 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= -91 ) {

							}
							//
							door.oldRotation = door.rotation.y;
							P3DScene.priorityExtraFunctions.splice( x.priorityExtraFunctions.indexOf( door.checkForEnding ), 1 );
							door.checkForEnding = null;
							door.opening = false;
							//
							door.setLinearVelocity( 0, 0, 0 );
							door.setLinearFactor( 0, 0, 0 );
							door.setAngularVelocity( 0, 0, 0 );
							door.setAngularFactor( 0, 0, 0 );
							door.setRotation( undefined, rotation, undefined );
							return;

						}
					}
					P3DScene.priorityExtraFunctions.push( door.checkForEnding );

				}
			});

		}
		door.setAngularFactor( 1, 1, 1 );
		door.setLinearFactor( 1, 1, 1 );
		//
		door.setLinearVelocity( 0.5, 0.5, 0.5 );
		door.applyImpulse(
			door.openingVelocity.clone().multiply( door.open ? new THREE.Vector3( 1, 1, 1 ) :  new THREE.Vector3( -1, -1, -1 ) ),
			door.position.clone().sub( door.initialPosition )
		);
	},
	makeDoor( door, width = door.width || 2.5, faceInwards = true, P3DScene ) {
		//
		door.open = true;
		//
		door.initialRotation = door.getRotation().y;
		door.initialPosition = door.getPosition().clone();
		door.oldRotation = door.getRotation().y;
		door.setAngularFactor( 0, 0, 0 );
		door.isOpen = false;
		door.openable = true;
		door.pickupDistance = 4;
		door.setOnUse( function () {

			if( door.openable ) {
				Proton3DInterpreter.toggleDoor( door, P3DScene )
			}

		} );
		door.setPickup( true, true );
		//gets (and rotates) the door's contraint's position
		var vector = new THREE.Vector3( ( width / 2 ), -1, 0 );
		vector = ProtonJS.rotateVector3(
			new THREE.Vector3( 0, 1, 0 ),
			door.getRotation().y,
			vector,
			false,
			true
		);
		vector = ProtonJS.rotateVector3(
			new THREE.Vector3( 1, 0, 0 ),
			door.getRotation().x,
			vector,
			false,
			true
		);
		vector = ProtonJS.rotateVector3(
			new THREE.Vector3( 0, 0, 1 ),
			door.getRotation().z,
			vector,
			false,
			true
		).add( door.getPosition() );
		//gets the "opening velocity" (see line 2722 in toggleDoor for more info)
		door.getOpeningVelocity = function ( velocity = new THREE.Vector3( 1, 1, 1 ), addExtraStuff = true ) {
			velocity = ProtonJS.rotateVector3(
				new THREE.Vector3( 1, 0, 0 ),
				door.getRotation().x,
				velocity,
				false,
				true
			);
			velocity = ProtonJS.rotateVector3(
				new THREE.Vector3( 0, 0, 1 ),
				door.getRotation().z,
				velocity,
				false,
				true
			);
			return addExtraStuff ? velocity.multiply( door.isOpen ? new THREE.Vector3( 1, 1, 1 ) :  new THREE.Vector3( -1, -1, -1 ) ) : velocity
		}
		door.openingVelocity = door.getOpeningVelocity( faceInwards? new THREE.Vector3( 1, 1, 1 ) : new THREE.Vector3( -1, -1, -1 ), false )
		//
		door.constraint = new Physijs.HingeConstraint(
			getMeshByName( door.name ),
			vector,
			new THREE.Vector3( 0, 1, 0 )
		);
		Proton3DInterpreter.objects.addConstraint( door.constraint );
		door.constraint.setLimits(
			faceInwards? ( radian( 0 ) + door.getRotation().y ) : ( radian( -90 ) + door.getRotation().y ),
			faceInwards? ( radian( 90 ) + door.getRotation().y ) : ( radian( 0 ) + door.getRotation().y ),
			10,
			0.1
		);
		door.constraint.enableAngularMotor( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0.5, 0 ) );
		door.constraint.disableMotor();
	},


	//changing mesh geometry n' materials loc:10.5
	createMeshGeometry( obj, extras = {} ) {
		switch( extras.type.toLowerCase() ) {
			case "sphere":
				var geoParameters = ( obj || {
					radius: ( extras.radius || 1 ),
					widthSegments: ( extras.sphereSegments || 16 ),
					heightSegments: ( extras.sphereSegments || 16 ),
					depthSegments: ( extras.sphereSegments || 16 )
				} );
				if ( extras.sphereSegments ) {

					geoParameters.widthSegments = extras.sphereSegments;
					geoParameters.heightSegments = extras.sphereSegments;
					geoParameters.depthSegments = extras.sphereSegments;

				}
				if ( obj && obj.sphereSegments ) {

					geoParameters.widthSegments = obj.sphereSegments;
					geoParameters.heightSegments = obj.sphereSegments;
					geoParameters.depthSegments = obj.sphereSegments;

				}
				//finish the function (  important  )
				var geometry = new THREE.SphereGeometry( geoParameters.radius, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );
				if ( extras.useBufferGeometry ) {

					geometry = new THREE.SphereBufferGeometry( geoParameters.radius, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );

				}
				//
				return {
					geometry: geometry,
					parameters: geoParameters
				}

			case "cylinder":
				var geoParameters = ( obj || {
					radiusTop: ( extras.radiusTop || 1 ),
					radiusBottom: ( extras.radiusBottom || 1 ),
					radialSegments: ( extras.cylinderSegments || 100 ),
					heightSegments: ( extras.cylinderSegments || 100 ),
					height: ( extras.height || 1 )
				} );
				for ( var i in extras ) {
					if ( geoParameters[i] ) {

						geoParameters[i] = extras[i]

					}
				}
				if ( extras.cylinderSegments ) {

					geoParameters.radialSegments = extras.cylinderSegments;
					geoParameters.heightSegments = extras.cylinderSegments;

				}
				if ( obj && obj.cylinderSegments ) {

					geoParameters.radialSegments = obj.cylinderSegments;
					geoParameters.heightSegments = obj.cylinderSegments;

				}
				//finish the function (  important  )
				var geometry = new THREE.CylinderGeometry( geoParameters.radiusTop, geoParameters.radiusBottom, geoParameters.height, geoParameters.radialSegments, geoParameters.heightSegments );
				if ( !extras.useBufferGeometry ) {

					geometry = new THREE.CylinderBufferGeometry( geoParameters.radiusTop, geoParameters.radiusBottom, geoParameters.height, geoParameters.radialSegments, geoParameters.heightSegments );

				}
				//
				return {
					geometry: geometry,
					parameters: geoParameters
				}

			case "cube":
				var geoParameters = ( obj || {
					width: ( extras.width || 1 ),
					height: ( extras.height || 1 ),
					depth: ( extras.depth || 1 ),
					widthSegments: extras.wireframeSegments,
					heightSegments: extras.wireframeSegments,
					depthSegments: extras.wireframeSegments
				} );
				if ( extras.wireframeSegments ) {

					geoParameters.widthSegments = extras.wireframeSegments;
					geoParameters.heightSegments = extras.wireframeSegments;
					geoParameters.depthSegments = extras.wireframeSegments;

				}
				if ( obj && obj.wireframeSegments ) {

					geoParameters.widthSegments = obj.wireframeSegments;
					geoParameters.heightSegments = obj.wireframeSegments;
					geoParameters.depthSegments = obj.wireframeSegments;

				}
				//finish the function (  important  )
				var geometry = new THREE.BoxGeometry( geoParameters.width, geoParameters.height, geoParameters.depth, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );
				if ( extras.useBufferGeometry ) {

					geometry = new THREE.BoxBufferGeometry( geoParameters.width, geoParameters.height, geoParameters.depth, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );

				}
				//
				return {
					geometry: geometry,
					parameters: geoParameters
				}
		}
	},
	createMeshMaterial( extras = {} ) {
		extras = extras || {};
		var materialParameters = {
			color: new THREE.Color( extras.color || "#fff" ),
			map: null,
			wireframe: ( extras.wireframe || false )
		}
		if ( extras.bumpMap ) {

			var bump = new THREE.TextureLoader( extras.loadManager ).load( extras.bumpMap );
			bump.wrapS = THREE.RepeatWrapping;
			bump.wrapT = THREE.RepeatWrapping;
			bump.repeat.set( ( extras.bumpMapRepeat || 1 ), ( extras.bumpMapRepeat || 1 ) );
			if ( extras.pixelatedBumpMap ) {

				bump.magFilter = THREE.NearestFilter;
				bump.minFilter = THREE.LinearMipMapLinearFilter;

			}
			materialParameters.bumpMap = bump

		}
		if ( extras.normalMap ) {

			var normal = new THREE.TextureLoader( extras.loadManager ).load( extras.normalMap );
			normal.wrapS = THREE.RepeatWrapping;
			normal.wrapT = THREE.RepeatWrapping;
			normal.repeat.set( ( extras.normalMapRepeat || 1 ), ( extras.normalMapRepeat || 1 ) );
			if ( extras.pixelatedNormalMap ) {

				normal.magFilter = THREE.NearestFilter;
				normal.minFilter = THREE.LinearMipMapLinearFilter;

			}
			materialParameters.normalMap = normal

		}
		if ( extras.roughnessMap ) {

			var rough = new THREE.TextureLoader( extras.loadManager ).load( extras.roughnessMap );
			rough.wrapS = THREE.RepeatWrapping;
			rough.wrapT = THREE.RepeatWrapping;
			rough.repeat.set( ( extras.roughMapRepeat || 1 ), ( extras.roughMapRepeat || 1 ) );
			if ( extras.pixelatedRoughMap ) {
				rough.magFilter = THREE.NearestFilter;
				rough.minFilter = THREE.LinearMipMapLinearFilter;
			}
			materialParameters.roughnessMap = rough;

		}
		if ( extras.displacementMap ) {

			var displacement = new THREE.TextureLoader( extras.loadManager ).load( extras.displacementMap );
			displacement.wrapS = THREE.RepeatWrapping;
			displacement.wrapT = THREE.RepeatWrapping;
			displacement.repeat.set( ( extras.displacementMapRepeat || 1 ), ( extras.displacementMapRepeat || 1 ) );
			if ( extras.pixelatedDisplacementMap ) {

				displacement.magFilter = THREE.NearestFilter;
				displacement.minFilter = THREE.LinearMipMapLinearFilter;

			}
			materialParameters.displacementMap = displacement;

		}
		if ( extras.texture ) {

			var texture = new THREE.TextureLoader( extras.loadManager ).load( extras.texture );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( ( extras.textureRepeat || 1 ), ( extras.textureRepeat || 1 ) );
			if ( extras.pixelatedTexture ) {

				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.LinearMipMapLinearFilter;

			}
			materialParameters.map = texture;

		}
		//finish the function (  important  )
		var material;
		switch ( extras.materialType ) {

			case "standard":

				material = Physijs.createMaterial(
					new THREE.MeshStandardMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "toon":

				material = Physijs.createMaterial(
					new THREE.MeshToonMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "physical":

				material = Physijs.createMaterial(
					new THREE.MeshPhysicalMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "phong":

				material = Physijs.createMaterial(
					new THREE.MeshPhongMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "normal":

				material = Physijs.createMaterial(
					new THREE.MeshNormalMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "matcap":

				material = Physijs.createMaterial(
					new THREE.MeshMatcapMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "lambert":

				material = Physijs.createMaterial(
					new THREE.MeshLambertMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "distance":

				material = Physijs.createMaterial(
					new THREE.MeshDistanceMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "depth":

				material = Physijs.createMaterial(
					new THREE.MeshDepthMaterial( materialParameters )
				);
				return finish( extras );
				break;

			case "basic":

				material = Physijs.createMaterial(
					new THREE.MeshBasicMaterial( materialParameters )
				);
				return finish( extras );
				break;

			default:
				Physijs.createMaterial(
					new THREE.MeshLambertMaterial( materialParameters )
				)
				return finish( extras );

		}

		function finish( extras = {} ) {
			if ( extras.mesh ) {

				extras.mesh.material = material;
				if ( extras.onmaterialupdate ) {

					extras.onmaterialupdate();

				}

			}
			return {
				material: material,
				parameters: materialParameters
			}
		}
	}
}
ProtonJS.importObject = Proton3DInterpreter.importObject