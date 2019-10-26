importScripts( "./protonjs-dom-bridge.js" );
importScripts( "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/build/three.js" );
importScripts( "https://unpkg.com/three@0.99.0/examples/js/loaders/MTLLoader.js" );
importScripts( "https://unpkg.com/three@0.99.0/examples/js/loaders/LoaderSupport.js" );
importScripts( "https://unpkg.com/three@0.105.0/examples/js/loaders/OBJLoader2.js" );
importScripts( "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/js/loaders/GLTFLoader.js" );
importScripts( "https://unpkg.com/three@0.105.0/examples/js/utils/BufferGeometryUtils.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/postprocessing/EffectComposer.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/postprocessing/ShaderPass.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/postprocessing/RenderPass.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/postprocessing/MaskPass.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/math/SimplexNoise.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/shaders/CopyShader.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/postprocessing/SSAOPass.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/shaders/SSAOShader.js" );
importScripts( "https://unpkg.com/three@0.99.0/examples/js/shaders/FXAAShader.js" );
importScripts( "https://unpkg.com/three@0.99.0/examples/js/modifiers/SubdivisionModifier.js" );
importScripts( "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physi.js" );
importScripts( "https://cdn.jsdelivr.net/gh/kripken/ammo.js@master/builds/ammo.js" );
importScripts( "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/PointerLockControls.js" );
importScripts( "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/OrbitControls.js" );
importScripts( "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/TrackballControls.js" );
importScripts( "https://unpkg.com/three@0.106.0/examples/js/objects/Sky.js" );
//bridges
//Physijs.scripts.worker = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physijs_worker.js";
//Physijs.scripts.ammo = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/examples/js/ammo.js";
const protonjs = {
	paused: false,
	rotateVector3: function ( axis, angle, vector, normalize, cancelAutoAngle ) {
		if ( !cancelAutoAngle ) {

			angle = radian( angle );

		}
		var rotationMatrix = new THREE.Matrix4();
		if ( normalize ) {

			vector.normalize();

		}
		vector.applyAxisAngle( axis, angle )
		return vector;
	},
	pause: function () {
		activeScene.paused = true;
	},
	resume: function () {
		activeScene.paused = false;
	}
}
var activeScene,
	meshes = [],
	scenes = [],
	crosshair = {
		position: new THREE.Vector3(),
		localPosition: new THREE.Vector3()
	}
//functions
function update ( scene ) {
	requestAnimationFrame( function () {
		scene.update( scene )
	} );
	//pausing
	if ( protonjs.paused ) {
		
		return
		
	}
	//performance
	
	//performing extra functions
	scene.extraFunctions.forEach( function ( e ) {
		e();
	} );
	//simulating using physijs
	scene.objects.simulate();
	//rendering using renderer.render
	if ( scene.composer ) {

		scene.composer.render();

	} else {
		
		scene.renderer.render( scene.objects, scene.camera );
	
	}
}
function add ( object ) {
	this.objects.add( object.mesh || object );
	//physically based rendering
	var object = object.mesh || object;
	if ( this.usePBR != false && !object.skipMaterialReplacement ) {

		var objCamera = new THREE.CubeCamera( 1, 10,  32, {
			type: THREE.FloatType
		} );
		objCamera.renderTarget.texture.format = THREE.RGBAFormat;
		objCamera.renderTarget.texture.generateMipmaps = true;
		//
		var objCamera2 = objCamera.clone();
		
		object.usePBRCamera = false;
		object.pbrCamera1 = objCamera;
		object.pbrCamera2 = objCamera2;
		this.objects.add( objCamera );
		this.objects.add( objCamera2 );
		//
		object.pbrPingPong = function (scene, pbrCamera1 = object.pbrCamera1, pbrCamera2 = object.pbrCamera2) {
			object.usePBRCamera = toggle(object.usePBRCamera);
			if ( object.material != null ) {
				
				if ( object.material[0] != null ) {
					
					object.material.forEach( function ( material ) {
						object.__pbrPingPong( scene, material, pbrCamera1, pbrCamera2 )
					} )
					
				} else {
					
					object.__pbrPingPong( scene, object.material, pbrCamera1, pbrCamera2 )
					
				}
				
			}
		}
		object.__pbrPingPong = function ( scene, material, pbrCamera1, pbrCamera2 ) {
			if ( object.usePBRCamera ) {
				
				material.envMap = pbrCamera1.renderTarget.texture;
				pbrCamera2.position.copy( object.position );
				pbrCamera2.update( scene.renderer, scene.objects );
				
			} else {
				
				material.envMap = pbrCamera2.renderTarget.texture;
				pbrCamera1.position.copy( object.position );
				pbrCamera1.update( scene.renderer, scene.objects );
				
			}
		}
		//
		pbr( object.material, object );
		function pbr( material, object, materialLocation ) {
			if ( material == null ) {

				return

			}
			if ( material[0] != null ) {

				material.forEach( function (m, i) {
					pbr( m, object, i );
				} )

			} else {
				var oldMaterial = material.__proto__;
				var newMaterial = new THREE.MeshStandardMaterial( {
					shadowSide: THREE.BackSide,
					roughness: ( oldMaterial.roughness || (oldMaterial.shininess / 100) * 3  || 0.3 ),
					dithering: true
				} );
				for ( var i in oldMaterial ) {

					if ( typeof oldMaterial[i] == "function" || i == "uuid" || i == "id" || i == "type" || i == "userData" || i == "__proto__" || i == "needsUpdate" ) {

						continue

					}
					if ( newMaterial[i] != null ) {

						newMaterial[i] = oldMaterial[i]

					}

				}
				if ( oldMaterial.bumpMap != null ) {
					
					newMaterial.bumpMap = oldMaterial.bumpMap
					
				}
				if ( oldMaterial.normalMap != null ) {
					
					newMaterial.normalMap = oldMaterial.normalMap
					
				}
				newMaterial.envMap = objCamera.renderTarget.texture;
				newMaterial.shadowSide = THREE.BackSide;
				if ( materialLocation != null ) {

					object.material[materialLocation] = new Physijs.createMaterial(
						newMaterial
					)

				} else {

					object.material = new Physijs.createMaterial(
						newMaterial
					)

				}

			}
		}
		object.pbrPingPong(this);
		object.pbrPingPong(this);
		
	}
}
function remove ( object ) {
	activeScene.objects.remove( object.mesh || object )
}
function dynamicResize () {
	var x = activeScene;
	window.addEventListener( "resize", function () {
		x.camera.aspect = window.innerWidth / window.innerHeight;
		x.camera.updateProjectionMatrix();
		x.renderer.setSize( window.innerWidth, window.innerHeight );
		if ( x.composer ) {

			x.composer.setSize( window.innerWidth, window.innerHeight );

		}
	} );
}
function setLoadEvent ( extras = {} ) {
	activeScene.loadManager = new THREE.LoadingManager();
	activeScene.loadManager.onStart = function () {
		console.log( true );
	}
	activeScene.loadManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
		extras.element.value = ( itemsLoaded / itemsTotal ) * 100;
		console.log( true );
	}
	activeScene.loadManager.onLoad = extras.loadCallback;
	//
}
function setKeyControls ( obj, speed = 2.5, jumpHeight = 4 ) {
	var x = activeScene;
	obj = obj.mesh || obj;
	window.addEventListener( "keydown", function ( e ) {
		e = e || event;
		x.keys[e.keyCode] = e.type;
		x.keys[e.keyCode] = true;
	} );
	window.addEventListener( "keyup", function ( e ) {
		e = e || event;
		x.keys[e.keyCode] = false;
	} );
	x.extraFunctions.push( checkKeys );

	function checkKeys() {
		speed = x.playerSpeed || speed;
		//
		obj.rotation.set( 0, obj.cameraRotation.y, 0 );
		obj.__dirtyRotation = true;
		//
		if ( x.skipCheckingKeys ) {

			return;

		}
		//
		x.extraKeyControls.forEach( function ( f ) {
			f( x.keys )
		} )
		//
		if ( x.keys[x.mappedKeys.forward] ) {

			var y = x.camera.getWorldDirection( new THREE.Vector3() );
			var z = obj.getLinearVelocity();
			//
			obj.setLinearVelocity( new THREE.Vector3( y.x * speed, z.y, y.z * speed ) );
			//sprinting
			if ( x.keys[x.mappedKeys.sprint] ) {

				obj.setLinearVelocity( new THREE.Vector3( y.x * ( speed + 3.5 ), z.y, y.z * ( speed + 3.5 ) ) );

			}
			//moving left and right
			if ( x.keys[x.mappedKeys.left] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					45,
					x.camera.getWorldDirection( new THREE.Vector3() ),
					true
				).add( new THREE.Vector3( 0, obj.position.y, 0 ) );
				//
				obj.setLinearVelocity( new THREE.Vector3( y.x * ( speed - .5 ), 0, y.z * ( speed - .5 ) ) );
				return

			}
			if ( x.keys[x.mappedKeys.right] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-45,
					x.camera.getWorldDirection( new THREE.Vector3() ),
					true
				).add( new THREE.Vector3( 0, obj.position.y, 0 ) );
				//
				obj.setLinearVelocity( new THREE.Vector3( y.x * ( speed - .5 ), z.y, y.z * ( speed - .5 ) ) );
				return

			}

		}
		if ( x.keys[x.mappedKeys.backward] ) {

			var y = x.camera.getWorldDirection( new THREE.Vector3() );
			var z = obj.getLinearVelocity();
			//
			obj.setLinearVelocity( new THREE.Vector3( -y.x * speed, z.y, -y.z * speed ) );
			//moving left and right
			if ( x.keys[x.mappedKeys.left] ) {

				var velocity = obj.getLinearVelocity();
				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-45,
					x.camera.getWorldDirection( new THREE.Vector3() ),
					true
				).add( new THREE.Vector3( 0, obj.position.y, 0 ) );
				//
				obj.setLinearVelocity( new THREE.Vector3( -( y.x * ( speed - .5 ) ), velocity.y, -( y.z * ( speed - .5 ) ) ) );
				return

			}
			if ( x.keys[x.mappedKeys.right] ) {

				var velocity = obj.getLinearVelocity();
				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					45,
					x.camera.getWorldDirection( new THREE.Vector3() ),
					true
				).add(new THREE.Vector3( 0, obj.position.y, 0 ));
				//
				obj.setLinearVelocity( new THREE.Vector3( -( y.x * ( speed - .5 ) ), velocity.y, -( y.z * ( speed - .5 ) ) ) );
				return

			}

		}
		if ( x.keys[x.mappedKeys.left] ) {

			var velocity = obj.getLinearVelocity();
			var y = protonjs.rotateVector3(
				new THREE.Vector3( 0, 1, 0 ),
				90,
				x.camera.getWorldDirection( new THREE.Vector3() ),
				true
			).add(new THREE.Vector3( 0, obj.position.y, 0 ));
			//
			obj.setLinearVelocity( new THREE.Vector3( y.x * ( speed - .5 ), velocity.y, y.z * ( speed - .5 ) ) );

		}
		if ( x.keys[x.mappedKeys.right] ) {

			var velocity = obj.getLinearVelocity();
			var y = protonjs.rotateVector3(
				new THREE.Vector3( 0, 1, 0 ),
				-90,
				x.camera.getWorldDirection( new THREE.Vector3() ),
				true
			).add(new THREE.Vector3( 0, obj.position.y, 0 ));
			//
			obj.setLinearVelocity( new THREE.Vector3( y.x * ( speed - .5 ), velocity.y, y.z * ( speed - .5 ) ) );

		}
		if ( x.keys[x.mappedKeys.jump] && obj.jumping != true ) {
			var rotation = x.camera.rotation,
				z = obj.getLinearVelocity();
			obj.setLinearVelocity( new THREE.Vector3( z.x, jumpHeight, z.z ) );
			obj.jumping = true;
			x.extraFunctions.push( check );
			x.camera.rotation.set( rotation.x, rotation.y, rotation.z );

			function check() {
				if ( obj._physijs.touches.length > 0 ) {
					obj.jumping = false;
					x.extraFunctions.splice( x.extraFunctions.indexOf( check ), 1 );
				}
			}

		}
	}
}
function toggleDoor( door ){
	var x = activeScene;
	if ( door.opening ) {

		return

	}
	door.opening = true;
	door.isOpen = toggle( door.isOpen );
	var checkForRotations = x.extraFunctions.push(function(){

		if ( Math.abs( parseInt( angle( door.rotation.y - door.initialRotation ) ) -  parseInt( angle( door.oldRotation - door.initialRotation ) ) ) > 5 ) {
			
			x.extraFunctions.splice( checkForRotations - 1, 1 );
			var checkForEnding = function () {
				var rotation = door.rotation.clone().y;
				if ( parseInt( angle( door.rotation.y - door.initialRotation ) ) <= 91 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= 89 ||
					parseInt( angle( door.rotation.y - door.initialRotation ) ) <= -89 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= -91 ||
					parseInt( angle( door.rotation.y - door.initialRotation ) ) <= 2 && parseInt( angle( door.rotation.y - door.initialRotation ) ) >= -2 ||
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
					x.extraFunctions.splice( x.extraFunctions.indexOf( checkForEnding ), 1 );
					door.opening = false;
					//
					door.setLinearVelocity( new THREE.Vector3() );
					door.setLinearFactor( new THREE.Vector3() );
					door.setAngularVelocity( new THREE.Vector3() );
					door.setAngularFactor( new THREE.Vector3() );
					door.rotation.y = rotation;
					door.__dirtyRotation = true;
					return;

				}
			}
			x.extraFunctions.push( checkForEnding );

		}

	});
	door.setAngularFactor( new THREE.Vector3( 1, 1, 1 ) );
	door.setLinearFactor( new THREE.Vector3( 1, 1, 1 ) );
	//
	door.setLinearVelocity( new THREE.Vector3( 1, 1, 1 ) );
	door.applyImpulse(
		new THREE.Vector3( 8, 8, 8 ).multiply( door.open ? new THREE.Vector3( 1, 1, 1 ) :  new THREE.Vector3( -1, -1, -1 ) ),
		door.position.sub( door.initialPosition )
	);
}
function makeDoor ( door, width = 2.5 ){
	var x = activeSene;
	if ( door.mesh ) {

		door = door.mesh

	}
	//
	door.open = true;
	//
	door.initialRotation = door.rotation.y;
	door.initialPosition = door.position.clone();
	door.oldRotation = door.rotation.y;
	door.setAngularFactor( new THREE.Vector3() );
	door.pickupable = true;
	door.isOpen = false;
	door.openable = true;
	door.pickupDistance = 4;
	door.onUse = function () {

		if( door.openable ) {
			x.toggleDoor( door )
		}

	}
	door.returnAfterUse = true;
	var vector = new THREE.Vector3( ( width / 2 ), -1, 0 );
	vector = protonjs.rotateVector3(
		new THREE.Vector3( 0, 1, 0 ),
		door.rotation.y,
		vector,
		false,
		true
	).add( door.position );
	door.constraint = new Physijs.HingeConstraint(
		door,
		vector,
		new THREE.Vector3( 0, 1, 0 )
	);
	x.objects.addConstraint( door.constraint );
	door.constraint.setLimits(
		radian( -90 ) + door.rotation.y,
		radian( 90 ) + door.rotation.y,
		10,
		0.1
	);
	door.constraint.enableAngularMotor( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0.5, 0 ) );
	door.constraint.disableMotor();
}
function addPortal2ZoomControls ( ) {
	var x = activeScene.camera,
		oldZoom = 1;
	window.addEventListener( "wheel", function ( e ) {
		if ( e.deltaY < 0 ) {

			if ( x.zoom != 3 ) {

				oldZoom = x.zoom;

			}
			x.zoom = 3;
			x.updateProjectionMatrix();

		}
		if ( e.deltaY > 0 ) {

			x.zoom = oldZoom;
			x.updateProjectionMatrix();

		}
	} );
}
function setCameraControls ( extras = {} ) {
	var x = activeScene,
		returningObject = {},
		posY = 0;
	extras.distance = extras.distance || new THREE.Vector3();
	extras.xSensivity = extras.xSensivity || 10;
	extras.ySensivity = extras.ySensivity || 10;
	
	//
	
	returningObject.init = function () {
		document.body.requestPointerLock();
		protonjs.resume();
		init();
	}
	
	//
	
	function init(){
		var localPosClone = x.crosshair.localPosition.clone();
		
		extras.cameraParent.add( x.camera );
		extras.cameraParent.cameraRotation = new THREE.Vector3();
		
		if ( extras.invisibleParent ) {
			
			extras.cameraParent.material.transparent = true;
			extras.cameraParent.material.opacity = 0.001;
			if ( typeof extras.cameraParent.material == "object" ) {

				extras.cameraParent.material.forEach( function ( material ) {
					material.transparent = true;
					material.opacity = 0.001;
				} );

			}
			
		}
		
		//
		
		var oldMovement = 0;
		switch( extras.type ){
			
			case "thirdperson":
				
				x.camera.position.set( 0, 0, -(extras.distance.z || 5) );
				x.camera.lookAt( x.camera.parent.position );
				break;
			
			default:
			
				x.camera.position.set( 0, 0, 0 )
				
				if ( extras.distance != 5 ) {
					
					x.camera.position.set( extras.distance.x, extras.distance.y, extras.distance.z);
					
				}
			
		}
		window.addEventListener( "mousemove", function ( e ) {
			if ( !protonjs.paused ) {
			
				x.crosshair.__localPosition = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-radian( e.movementX / extras.xSensivity ),
					localPosClone, 
					false,
					true
				);
				
				//
				
				if ( ( (x.cameraType == "thirdperson" || extras.type == "thirdperson" ) &&
					( ( ( x.camera.position.y - e.movementY / extras.ySensivity ) > -9 ||
					( x.camera.position.y - e.movementY / extras.ySensivity ) < 9 ) ) ) ||
					x.cameraType != "thirdperson" ) {
					
					x.crosshair.__localPosition.y -= e.movementY / ( extras.ySensivity * 30 )
					
					if ( x.cameraType == "thirdperson" || extras.type == "thirdperson" ) {
						
						x.camera.position.y = ( posY += e.movementY / extras.ySensivity )
						
					}
					
				}
				
			}
		} );
		x.extraFunctions.push( function () {
			x.camera.parent.rotation.y = radian( 90 );
			x.camera.parent.__dirtyRotation = true;
			x.crosshair.position = x.crosshair.__localPosition.clone().add( x.camera.parent.position );
			
			var pos = x.crosshair.position.clone();
			pos.y = x.camera.parent.position.y;
			x.camera.parent.lookAt( pos );
			x.camera.lookAt( x.crosshair.position );
			
			x.camera.parent.__dirtyRotation = true;
		} );
		setPickingUpControls();
	}
	
	//
	
	x.crosshair = {}
	x.crosshair.localPosition = new THREE.Vector3(0, 0, 1);
	x.crosshair.__localPosition = new THREE.Vector3(0, 0, 0);
	
	//
	
	protonjs.pause();
	returningObject.crosshair = x.crosshair;
	return returningObject;
}
function setPickingUpControls () {
	var x = activeScene;
	x.extraFunctions.push( function () {
		x.objects.children.forEach( function ( child ) {
			checkObjects( child )
		} );
	} );

	function checkObjects( child ) {
		if ( child.pickupable != true ) {

			return;

		}
		if ( child.children ) {

			child.children.forEach( function ( child ) {
				checkObjects( child )
			} );

		}
		if( child.alreadyNeared && x.crosshair.position.distanceTo( child.position ) > ( child.nearDistance || 2 ) ) {
			
			child.alreadyNeared = false
			
		}
		if ( x.crosshair.position.distanceTo( child.position ) <= ( child.nearDistance || 2 ) && child.onNear && !child.alreadyNeared ) {

			child.onNear();
			child.alreadyNeared = true;

		}
		if ( child.pickingUp ) {
			
			child.mass = 0;
			child.position.set(
				x.crosshair.position.x + ( x.crosshair.localPosition.x * 1.5 ),
				x.crosshair.position.y + ( x.crosshair.localPosition.y * 1.5 ),
				x.crosshair.position.z + ( x.crosshair.localPosition.z * 1.5 )
			);
			child.rotation.set(0, 0, 0);
			child.__dirtyRotation = true;
			child.__dirtyPosition = true;
			
		}
		if ( child.pickingUp == "wrapping" ) {
			
			child.mass = child.oldMass;
			child.setLinearVelocity( new THREE.Vector3() );
			child.pickingUp = null;

		}
	}
	window.addEventListener( "keypress", function () {
		x.objects.children.forEach( function ( child ) {
			checkKeypress( child );
		} );
	} )

	function checkKeypress( child ) {
		if ( child.children ) {

			child.children.forEach( function ( child ) {
				checkKeypress( child )
			} );

		}
		if ( child.pickupable != true ) {

			return

		}
		if ( x.keys[x.mappedKeys.use] && x.crosshair.position.distanceTo( child.position ) <= ( child.pickupDistance || 2 ) && child.pickedUp != true && window.pickingUpChild == null) {
			
			if ( child.onUse ) {

				child.onUse();
				if ( child.returnAfterUse ) {
					
					return

				}

			}

			child.pickingUp = true;
			if ( child.oldMass != 0 ) {
				
				child.oldMass = child.mass;
				
			}
			child.oldPos = child.position.clone();
			child.distance = x.crosshair.position.distanceTo( child.position );
			x.crosshair.style.display = "none";
			return;
			
		}
		if ( x.keys[x.mappedKeys.use] && child.pickingUp == true ) {

			child.pickingUp = false;
			x.crosshair.style.display = null;
			child.pickingUp = "wrapping";

		}
	}
}
//creates and handles meshes
function createMesh( mesh, name ){
	mesh.name = name;
	meshes.push( mesh )
	return mesh;
}
function createCube( name, width, height, depth, segments, mass ) {
	var material = new THREE.MeshStandardMaterial(),
		geometry = new THREE.BoxGeometry( width, height, depth, segments, segments, segments ),
		cube = new Physijs.BoxMesh(
			geometry,
			material,
			mass
		);
	return createMesh( cube, name );
}
function createSphere( name, radius, segments, mass ) {
	var material = new THREE.MeshStandardMaterial(),
		geometry = new THREE.SphereGeometry( radius, segments, segments ),
		sphere = new Physijs.SphereMesh(
			geometry,
			material,
			mass
		);
	return createMesh( sphere, name );
}
function createCylinder( name, radiusTop, radiusBottom, height, segments, mass ) {
	var material = new THREE.MeshStandardMaterial(),
		geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, segments  ),
		sphere = new Physijs.CylinderMesh(
			geometry,
			material,
			mass
		);
	return createMesh( sphere, name );
}
function createLight( name, intensity, type, color ) {
	var light;
	switch( type ){
		
		case "directional":
		
			light = new THREE.DirectionalLight( new THREE.Color( color ), intensity )
			light.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.25, 1000 );
			light.shadow.radius = 1.5;
			light.shadow.bias = -0.00005;
			break
			
		case "point":
		
			light = new THREE.PointLight( new THREE.Color( color ), intensity )
			light.shadow.radius = 1.5;
			light.shadow.bias = -0.00005;
			break
		
		default:
		
			light = new THREE.SpotLight( new THREE.Color( color ), intensity )
			light.shadow.camera = new THREE.OrthographicCamera( -( 100 ), 100, 100, -( 100 ), 0.25, 1000 );
			light.castShadow = true;
			//very low quality: 1024
			//low quality: 2048
			//medium quality: 8192
			//high quality: 16384
			light.shadow.mapSize.width = 8192;
			light.shadow.mapSize.height = 8192;
			light.penumbra = 1;
			light.shadow.radius = 1.5;
			light.shadow.bias = -0.00005;
			break
			
	}
	return createMesh( light, name );
}
function getMeshByName( name ) {
	return meshes.forEach( function( mesh ){
		
		if ( mesh.name == name ) {
			
			return mesh
			
		}
		
	} )
}
//stuff to handle and organise those functions
self.onmessage = function( data ){
	switch ( data.data.type ){
		
		case "function":
			activeScene = data.data
			activeScene.crosshair = crosshair
			for ( var i in activeScene ) {
				
				if ( typeof activeScene[ i ] == "string" && activeScene[ i ].includes( "<<string>>" ) ) {
					
					activeScene[ i ] = JSON.parse( activeScene[ i ] )
					
				}
				
			}
			eval( data.data.function + "( activeScene." + data.data.params.join( ", activeScene." ) + ")" )
			break
		
		default:
			meshes = [];
			data.data.forEach(function(vertices){
				var geometry = new THREE.Geometry;
				geometry.vertices = vertices || [];
				meshes.push(new THREE.Mesh(
					geometry,
					new THREE.MeshBasicMaterial()
				))
			})
		
	}
//	activeScene.type = "return";
	console.log("meshes", meshes)
//	postMessage( activeScene );
}