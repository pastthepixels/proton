//graphix and performance
const Proton3DInterpreter_proto = {

	//creating and modifing Proton3DScenes -- loc:10.1
	create3DScene( extras ) {
		extras.refreshRate = extras.refreshRate || this.refreshRate || 10
		extras.antialias = extras.antialias || false;
		//variables
		this.canvas = document.createElement( "canvas" );
		this.context = this.canvas.getContext( "webgl2" );
		this.objects = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer( {
			alpha: true,
			antialias: extras.antialias,
			canvas: this.canvas,
			context: this.context,
			precision: "lowp"
		} );
		this.renderer.setSize( extras.width, extras.height );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		//physics
		this.timeStep = 1 / 60;
		this.bodies = {};
		this.world = new CANNON.World();
		this.world.gravity.set( 0, -9.81, 0 );
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.solver.iterations = 10;
		//some element - y stuff
		extras.element.appendChild( this.canvas );
		//updating a scene
		Proton3DInterpreter.render( extras.scene )
		//PBR
		this.PBRCamera = new THREE.CubeCamera( 1, 10, 32, {
			type: THREE.FloatType
		} );
		this.objects.add( this.PBRCamera );
		this.PBRCamera.renderTarget.texture.format = THREE.RGBAFormat;
		this.PBRCamera.renderTarget.texture.generateMipmaps = true;
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
		
		//physics
		object.touches = [];
		var obj = object.name? getMeshByName( object.name ) : object;
		this.bodies[ object.name ] = obj.body;
		obj.body? this.world.addBody( obj.body ) : null;
		if ( obj.body != null ) {
			
			obj.body.addEventListener( "collision", function () {
				object.touches.push( 1 )
				console.log(true);
			} )
			obj.body.addEventListener( "endContact", function () {
				removeFromArray( object.touches, 1 )
				console.log(object.touches);
			} )
			
		}
		
		
		
		//physically based rendering
		var skipPBRReplacement = object.skipPBRReplacement,
			skipPBRReplacement_light = object.skipPBRReplacement_light,
			object = obj,
			oldMaterial = object.material;
		if ( scene.usePBR != false && !skipPBRReplacement && !skipPBRReplacement_light && object.material ) {

			object.pbr = function (scene = Proton3DInterpreter, PBRCamera = scene.PBRCamera) {
				PBRCamera.position.copy( object.position );
				PBRCamera.rotation.copy( object.rotation );
				PBRCamera.update( scene.renderer, scene.objects );
				if ( object.material[0] != null ) {

					object.material.forEach( function ( material ) {
						material.envMap = PBRCamera.renderTarget.texture
					} )

				} else {

					object.material.envMap = PBRCamera.renderTarget.texture

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
			//	"alphaTest",
				"aoMap",
				"aoMapIntensity",
			//	"blendDst",
			//	"blendDstAlpha",
			//	"blendEquation",
			//	"blendEquationAlpha",
			//	"blendSrc",
			//	"blendSrcAlpha",
			//	"blending",
				"bumpMap",
				"bumpScale",
			//	"clipIntersection",
			//	"clipShadows",
			//	"clippingPlanes",
			//	"colorWrite",
			//	"combine",
			//	"depthFunc",
			//	"depthTest",
			//	"depthWrite",
				"displacementBias",
				"displacementMap",
				"displacementScale",
			//	"dithering",
				"emmisive",
				"emmisiveIntensity",
				"emmisiveMap",
				"envMap",
				"envMapIntensity",
				"flatShading",
			//	"fog",
				"lightMap",
				"lightMapIntensity",
			//	"lights",
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
				newMaterial.envMap = Proton3DInterpreter.PBRCamera.renderTarget.texture;
				newMaterial.shadowSide = THREE.BackSide;
				newMaterial.color = oldMaterial.color;

			} else {

				newMaterial = hasProto? material.__proto__ : material

			}
			if ( materialLocation != null ) {

				var m = hasProto? new Physijs.createMaterial(
					newMaterial,
					0.999,
					0.111
				) : newMaterial;
				m.transparent = true;
				object.material[materialLocation] = m;
				if ( materialName ) {

					getMaterialByName( materialName ).name += "__OBSOLETE"
					m.name = materialName;
					materials.push( m )

				}

			} else {

				var m = hasProto? new Physijs.createMaterial(
					newMaterial,
					0.999,
					0.111
				) : newMaterial;
				m.transparent = true;
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
		this.objects.remove( getMeshByName( object.name ) || object );
		( object.name? getMeshByName( object.name ) : object ).body? this.world.removeBody( ( object.name? getMeshByName( object.name ) : object ).body ) : null;
		this.bodies[ object.name ] = undefined;
	},
	render( scene ) {
		//physics
		this.world.step( this.timeStep );
		this.objects.children.forEach( function ( child ) {
			if ( child.body && !child._dirtyAnimation ) {

				child.position.copy( child.body.position );
				child.quaternion.copy( child.body.quaternion );

			}
			if ( child._dirtyAnimation ) {
				
				child._dirtyAnimation = false;
				
			}
		} )
		//rendering using renderer.render
		if ( this.composer ) {

			this.composer.render();

		} else {

			this.renderer.render( this.objects, getMeshByName( scene.camera.name ) );

		}
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
				spotlight.shadow.camera = new THREE.OrthographicCamera( -( 100 ), 100, 100, -( 100 ), 0.25, 1000 );
				spotlight.castShadow = true;
				//very low quality: 1024
				//low quality: 2048
				//medium quality: 8192
				//high quality: 16384
				spotlight.shadow.mapSize.width = 8192;
				spotlight.shadow.mapSize.height = 8192;
				spotlight.penumbra = 1;
				spotlight.shadow.radius = 1.5;
				spotlight.shadow.bias = -0.00005;
				spotlight.name = object.name;
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
				var directionallight = new THREE.DirectionalLight( new THREE.Color( extras.color || "#fff" ), extras.intensity || 15 )
				directionallight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.25, 1000 );
				directionallight.shadow.radius = 1.5;
				directionallight.shadow.bias = -0.00005;
				directionallight.name = object.name;
				meshes.push( directionallight );
				//
				object.changeColor = function ( hexString ) {
					directionallight.color = new THREE.Color( hexString )
				}
				object.changeIntensity = function ( value ) {
					directionallight.intensity = value
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
				var cube = new THREE.Mesh(
					Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
					Proton3DInterpreter.createMeshMaterial( extras ).material
				);
				cube.name = object.name;
				meshes.push( cube );
				//cube stuff
				object.width = extras.width || 1;
				object.height = extras.height || 1;
				object.depth = extras.depth || 1;
				//c u b e  s t u f f
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
				//physics
				cube.shape = new CANNON.Box( new CANNON.Vec3( object.width / 2, object.height / 2, object.depth / 2 ) );
				cube.body = new CANNON.Body( { mass: ( extras.mass != null? extras.mass : 1 ) * 50 } )
				cube.body.addShape( cube.shape )
				cube.body.position.set( cube.position.x, cube.position.y, cube.position.z );
				break

			case "sphere":
				extras.type = "sphere";
				//creates the base variables
				var sphere = new THREE.Mesh(
					Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
					Proton3DInterpreter.createMeshMaterial( extras ).material
				);
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
				//physics
				sphere.body = new CANNON.Body( { mass: ( extras.mass != null? extras.mass : 1 ) * 50 } );
				sphere.shape = new CANNON.Sphere( object.radius / 2 );
				sphere.body.addShape( sphere.shape )
				sphere.body.position.set( sphere.position.x, sphere.position.y, sphere.position.z )
				break

			case "cylinder":
				extras.type = "cylinder"
				//create the base variables
				var cylinder = new THREE.Mesh(
					Proton3DInterpreter.createMeshGeometry( null, extras ).geometry,
					Proton3DInterpreter.createMeshMaterial( extras ).material
				)
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
				//physics
				cylinder.body = new CANNON.Body( { mass: ( extras.mass != null? extras.mass : 1 ) * 50 } );
				cylinder.shape = new CANNON.Cylinder( object.radiusTop / 2, object.radiusBottom / 2, 1, 10 );
				cylinder.quat = new CANNON.Quaternion( 0.5, 0, 0, 0.5 );
				cylinder.quat.normalize();
				cylinder.body.addShape( cylinder.shape, new CANNON.Vec3(), cylinder.quat );
				cylinder.body.position.set( cylinder.position.x, cylinder.position.y, cylinder.position.z );
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
				material: getMeshByName( object.name ).material
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
		applyImpulse( force, offset = new THREE.Vector3( 0, 0, 0 ), P3DObject ) {
			offset = new CANNON.Vec3( offset.x, offset.y, offset.z );
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

				x = new CANNON.Vec3(
					x * ( getMeshByName( P3DObject.name ).linearFactor? getMeshByName( P3DObject.name ).linearFactor.x : 1 ),
					y * ( getMeshByName( P3DObject.name ).linearFactor? getMeshByName( P3DObject.name ).linearFactor.y : 1 ),
					z * ( getMeshByName( P3DObject.name ).linearFactor? getMeshByName( P3DObject.name ).linearFactor.z : 1 )
				)

			}
			getMeshByName( P3DObject.name ).body.velocity.set( x.x, x.y, x.z )
		},
		setAngularVelocity( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {
				
				x = new CANNON.Vec3(
					x * ( getMeshByName( P3DObject.name ).angularFactor? getMeshByName( P3DObject.name ).angularFactor.x : 1 ),
					y * ( getMeshByName( P3DObject.name ).angularFactor? getMeshByName( P3DObject.name ).angularFactor.y : 1 ),
					z * ( getMeshByName( P3DObject.name ).angularFactor? getMeshByName( P3DObject.name ).angularFactor.z : 1 )
				)

			}
			getMeshByName( P3DObject.name ).body.angularDamping = 1 - ( x.x * x.y * x.z )
		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = new THREE.Vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).body.linearDamping = 1 - ( x.x * x.y * x.z )
		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {
			if ( !x.x ) {

				x = new THREE.Vector3( x, y, z )

			}
			getMeshByName( P3DObject.name ).angularFactor = x
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
			if ( getMeshByName( P3DObject.name ).body ) {
				
				getMeshByName( P3DObject.name ).body.quaternion = new CANNON.Quaternion( getMeshByName( P3DObject.name ).quaternion.clone().x, getMeshByName( P3DObject.name ).quaternion.clone().y, getMeshByName( P3DObject.name ).quaternion.clone().z, getMeshByName( P3DObject.name ).quaternion.clone().w )
			
			}
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
			getMeshByName( P3DObject.name ).body? getMeshByName( P3DObject.name ).body.position.set( x, y, z ): getMeshByName( P3DObject.name ).position.set( x, y, z );
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
			return new THREE.Vector3( getMeshByName( P3DObject.name ).body.velocity.x, getMeshByName( P3DObject.name ).body.velocity.y, getMeshByName( P3DObject.name ).body.velocity.z )
		},
		getAngularVelocity( P3DObject ) {
			return new THREE.Vector3( getMeshByName( P3DObject.name ).body.angularVelocity.x, getMeshByName( P3DObject.name ).body.angularVelocity.y, getMeshByName( P3DObject.name ).body.angularVelocity.z )
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
				
				getMeshByName( P3DObject.name ).lookAt( new THREE.Vector3( x, y, z ) )
				if ( getMeshByName( P3DObject.name ).body ) {
					
					getMeshByName( P3DObject.name ).body.quaternion = new CANNON.Quaternion( getMeshByName( P3DObject.name ).quaternion.clone().x, getMeshByName( P3DObject.name ).quaternion.clone().y, getMeshByName( P3DObject.name ).quaternion.clone().z, getMeshByName( P3DObject.name ).quaternion.clone().w )
				
				}
			}
		},
		getWorldPosition( P3DObject ) {
			return ( new THREE.Vector3() ).setFromMatrixPosition( getMeshByName( P3DObject.name ).matrixWorld )
		},
		getCollidingObjects( P3DObject ) {
			return getMeshByName( P3DObject.name ).touches
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
							finishLoad( object, object.detail.loaderRootNode )
						} );
					} );

				} else {

					loader.load( extras.objPath, function ( object ) {
						finishLoad( object, object.detail.loaderRootNode )
					} );

				}
				break;

			case "gltf":

				loader = new THREE.GLTFLoader( extras.loadManager );
				loader.load( extras.gltfPath, function ( object ) {
					finishLoad( object, object.scene )
				} );
				break;

		}
		//finishes the loading stuff
		function finishLoad( object, threeObject ) {
			mesh = threeObject;
			mesh.children.forEach( function ( child ) {
				if ( child.isGroup ) {
					child.children.forEach( function ( child_child ) {
						mesh.add( child_child )
					} )
					mesh.remove( child )
				}
			} )
			if ( extras.noPhysics != true ) {

				mesh.children.forEach( function ( c, i ) {
					var m,
						oldGeometry;
					//some geometry stuff  {
					if ( c.isMesh && c.geometry != null && !c._physijs ) {
						
						c.updateMatrix();
						c.geometry = new THREE.Geometry().fromBufferGeometry( c.geometry );
						c.geometry.vertices.forEach( function ( vertex ) {
							vertex.multiply( c.scale );
						} );
						c.scale.set( 1, 1, 1 );
						if ( extras.starterPos && extras.fileType.toLowerCase() === "gltf" ) {

							c.position.add( extras.starterPos )

						}

					} else if ( !c._physijs ) {

						if ( c.position && extras.starterPos ) {

							c.position.add( extras.starterPos );

						}
						objects.push( c );
						return;

					} else if ( c._physijs ) {

						return

					}
					if ( c.name && c.name.includes( " --noPhysics" ) ) {

						objects.push( c );
						return;

					}
					//some material stuff
					function toMeshPhongMaterial( material ) {
						var newmaterial = new THREE.MeshPhongMaterial();
						if ( material.type === "MeshPhongMaterial" ) {

							return Physijs.createMaterial(
								material,
								1,
								0
							);

						}
						for ( var i in material ) {
							if ( typeof material[ i ] === "function" || material[ i ] === material.type || material[ i ] === material.id || material[ i ] === material.uuid ) {

								continue

							}
							newmaterial[ i ] = material[ i ]
						}
						return Physijs.createMaterial(
							newmaterial,
							1,
							0
						);
					}
					if ( c.material[ 0 ] != null ) {

						c.material.forEach( function ( material, i ) {
							c.material[ i ] = toMeshPhongMaterial( material )
						} )

					} else {

						c.material = toMeshPhongMaterial( c.material )

					}
					//}
					if ( extras.objectType ) {

						switch ( typeof extras.objectType ) {

							case "object":

								extras.objectType[ i ].charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );
								break;

							default:

								m = extras.objectType.charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );

						}

					}
					if ( c.name && c.name.includes( "--geometry-" ) ) {

						m = c.name.slice( c.name.indexOf( "--geometry-" ) + 11, c.name.length )
						m = m.charAt( 0 ).toUpperCase() + m.slice( 1 );
						if ( m.includes( "_" ) ) {

							m = m.slice( 0, m.indexOf( "_" ) );

						}

					}
					//
					if ( extras.collisionMaterialTransparent ) {

						extras.collisionMaterial = new THREE.MeshBasicMaterial();
						extras.collisionMaterial.transparent = true;
						extras.collisionMaterial.opacity = 0.001;
						extras.collisionMaterial.depthWrite = false;

					}
					//
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
					if ( c.name && c.name.includes( "--mass" ) ) {

						mass = c.name.slice( c.name.indexOf( "--mass-" ) + 7, c.name.length )
						if ( mass.includes( "_" ) ) {

							mass = mass.slice( 0, mass.indexOf( "_" ) );

						}
						mass = parseFloat( mass );

					}
					//
					extras.physicsMeshScaling = extras.physicsMeshScaling || new THREE.Vector3( 1, 1, 1 );
					var vector = extras.starterPos? extras.starterPos.clone().add( c.position ) : c.position;
					//
					c.geometry.computeBoundingBox();
					c.boundingBox = c.geometry.boundingBox;
					c.geometry.computeBoundingSphere();
					c.boundingSphere = c.geometry.boundingSphere;
					//
					c.shape = new CANNON.Box(
						new CANNON.Vec3(
							( ( c.boundingBox.max.x - c.boundingBox.min.x ) * extras.physicsMeshScaling.x ) * 0.48,
							( ( c.boundingBox.max.y - c.boundingBox.min.y ) * extras.physicsMeshScaling.y ) * 0.48,
							( ( c.boundingBox.max.z - c.boundingBox.min.z ) * extras.physicsMeshScaling.z ) * 0.48
						)
					);
					var body = new CANNON.Body( { mass: mass * 50 } );
					body.addShape( c.shape );
					body.position.set( vector.x, vector.y, vector.z );
					body.quaternion = new CANNON.Quaternion( c.quaternion.clone().x, c.quaternion.clone().y, c.quaternion.clone().z, c.quaternion.clone().w )
					c.body = body;
					
					/*
					var helper = new THREE.Mesh(
						new THREE.BoxGeometry(
							( ( c.boundingBox.max.x - c.boundingBox.min.x ) * extras.physicsMeshScaling.x ) * 0.48,
							( ( c.boundingBox.max.y - c.boundingBox.min.y ) * extras.physicsMeshScaling.y ) * 0.48,
							( ( c.boundingBox.max.z - c.boundingBox.min.z ) * extras.physicsMeshScaling.z ) * 0.48
						),
						new THREE.MeshBasicMaterial()
					);
					helper.position.set( vector.x, vector.y, vector.z );
					extras.objects.add( helper );
					*/
					
					mesh.children.push( c );
					objects.push( c );
					c.geometry = new THREE.BufferGeometry().fromGeometry( c.geometry );
					if ( mesh.children.length === 1 ) {

						mesh = mesh.children[ 0 ];

					}
				} );

			} else {

				if ( extras.starterPos ) {

					mesh.position.add( extras.starterPos )

				}
				mesh.children.forEach( function ( child ) {
					if ( extras.starterPos ) {

						child.position.add( extras.starterPos )

					}
					objects.push( child )
				} )


			}
			mesh.children.forEach( castShadow );

			function castShadow( c ) {
				if ( extras.castShadow ) {

					c.castShadow = true

				}
				if ( extras.receiveShadow ) {

					c.receiveShadow = true

				}
				c.children.forEach( castShadow );
			}
			//animations
			if ( extras.fileType.toLowerCase() === "gltf" && object.animations && object.animations.length ) {

				x.animations = [];
				if ( extras.starterPos ) {

					mesh.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z );
					object.scene.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z );

				}
				for ( var i in object.animations ) {
					var mixer = new THREE.AnimationMixer( mesh );
					var animation = {
						action: mixer.clipAction( object.animations[i] ),
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
										clearInterval(animation);
										action.paused = true;
										return;

									}
									mixer.update( frame += 0.005 );
									mesh.children.forEach( function ( object ) {
										if ( animatingObjects.indexOf(object) > -1 ) {

											object.position.add(extras.starterPos);

										}
										object._dirtyAnimation = true
									} );
								}, 16 )
						}
					}
					animation.action.paused = true;
					x.animations[ i ] = animation;
				}
			}
			//
			x.children = [];
			objects.forEach( function ( mesh, i ) {
				var object = new Proton3DObject( { mesh: mesh, noPhysics: extras.noPhysics } )
				x.children.push( object )
				if ( extras.objects ) {

					extras.objects.add( object )

				}
			} )
			//
			if ( extras.onload ) {

				extras.onload( threeObject );

			}
			if ( x.onload ) {

				x.onload( threeObject );

			}
		}
	},

	//creating and modifing Proton3DMaterials -- loc:10.3
	create3DMaterial( extras, P3DMaterial, parentObject ){
		if ( !extras.material ) {

			var material = new THREE.MeshStandardMaterial()
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
			return getMaterialByName( P3DMaterialname ).wireframeIntensity
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
		vector = protonjs.rotateVector3(
			new THREE.Vector3( 0, 1, 0 ),
			door.getRotation().y,
			vector,
			false,
			true
		);
		vector = protonjs.rotateVector3(
			new THREE.Vector3( 1, 0, 0 ),
			door.getRotation().x,
			vector,
			false,
			true
		);
		vector = protonjs.rotateVector3(
			new THREE.Vector3( 0, 0, 1 ),
			door.getRotation().z,
			vector,
			false,
			true
		).add( door.getPosition() );
		//gets the "opening velocity" (see line 2722 in toggleDoor for more info)
		door.getOpeningVelocity = function ( velocity = new THREE.Vector3( 1, 1, 1 ), addExtraStuff = true ) {
			velocity = protonjs.rotateVector3(
				new THREE.Vector3( 1, 0, 0 ),
				door.getRotation().x,
				velocity,
				false,
				true
			);
			velocity = protonjs.rotateVector3(
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
					widthSegments: ( extras.sphereSegments || 100 ),
					heightSegments: ( extras.sphereSegments || 100 ),
					depthSegments: ( extras.sphereSegments || 100 )
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
protonjs.importObject = Proton3DInterpreter_proto.importObject

for ( var i in Proton3DInterpreter_proto ) {
	Proton3DInterpreter[ i ] = Proton3DInterpreter_proto[ i ]
}

Proton3DScene.prototype.oldCameraControls = Proton3DScene.prototype.setCameraControls;
Proton3DScene.prototype.setCameraControls = function( extras = {} ) {
	//CRUICAL FOR CANNON
	getMeshByName( extras.cameraParent.name ).body.linearDamping = 0.5
	getMeshByName( extras.cameraParent.name ).body.angularDamping = 1
	return this.oldCameraControls( extras )
}

Proton3DScene.prototype.setKeyControls = function( obj, speed = 2.5, jumpHeight = 4 ) {
	var x = this;
	window.addEventListener( "keydown", function ( e ) {
		e = e || event;
		x.keys[e.keyCode] = e.type;
		x.keys[e.keyCode] = true;
	} );
	window.addEventListener( "keyup", function ( e ) {
		e = e || event;
		x.keys[e.keyCode] = false;
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
		if ( x.keys[x.mappedKeys.forward] ) {

			var y = obj.getWorldDirection(),
				z = obj.getLinearVelocity();
			//
			move(y, z, speed, false, true)
			//sprinting
			if ( x.keys[x.mappedKeys.sprint] ) {

				move(y, z, speed + 3.5)

			}
			//moving left and right
			if ( x.keys[x.mappedKeys.left] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					45,
					obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
					true
				).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
				//
				move(y, z, speed - 0.5)
				return

			}
			if ( x.keys[x.mappedKeys.right] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-45,
					obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
					true
				).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
				//
				move(y, z, speed - 0.5)
				return

			}

		}
		if ( x.keys[x.mappedKeys.backward] ) {

			var y = obj.getWorldDirection(),
				z = obj.getLinearVelocity();
			//
			move(y, z, speed, true, true)
			//moving left and right
			if ( x.keys[x.mappedKeys.left] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					-45,
					obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
					true
				).add( new THREE.Vector3( 0, obj.getPosition().y, 0 ) );
				//
				move(y, z, speed - 0.5, true)
				return

			}
			if ( x.keys[x.mappedKeys.right] ) {

				var y = protonjs.rotateVector3(
					new THREE.Vector3( 0, 1, 0 ),
					45,
					obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
					true
				).add(new THREE.Vector3( 0, obj.getPosition().y, 0 ));
				//
				move(y, z, speed - 0.5, true)
				return

			}

		}
		if ( x.keys[x.mappedKeys.left] ) {

			var z = obj.getLinearVelocity();
			var y = protonjs.rotateVector3(
				new THREE.Vector3( 0, 1, 0 ),
				90,
				obj.getWorldDirection().multiply( new THREE.Vector3( 1, 0, 1, ) ),
				true
			).add(new THREE.Vector3( 0, obj.getPosition().y, 0 ));
			//
			move(y, z, speed - 0.5)

		}
		if ( x.keys[x.mappedKeys.right] ) {

			var z = obj.getLinearVelocity();
			var y = protonjs.rotateVector3(
				new THREE.Vector3( 0, 1, 0 ),
				-90,
				obj.getWorldDirection(),
				true
			).add(new THREE.Vector3( 0, obj.getPosition().y, 0 ));
			//
			move(y, z, speed - 0.5)

		}
		if ( x.keys[x.mappedKeys.jump] && obj.notCollidingWithStuff != false ) {

			var rotation = x.camera.getRotation(),
				z = obj.getLinearVelocity();
			obj.setLinearVelocity( z.x, jumpHeight, z.z );
			obj.notCollidingWithStuff = false;
			getMeshByName( obj.name ).body.addEventListener( "collide", function () {
				obj.notCollidingWithStuff = null;
			} )

		}
	}
	function move ( y, z, speed, negatise = false, forward = false ) {
		if ( x.noclip ) {

			var pos = obj.position.clone().add( new THREE.Vector3( y.x * (speed / 10) * ( negatise? -1 : 1 ) , forward? ( x.camera.getWorldDirection().y * (speed / 10) * ( negatise? -1 : 1 ) ) : 0, y.z * (speed / 10) * ( negatise? -1 : 1 )  ) )
			obj.setPosition( pos.x, pos.y, pos.z )

		} else {

			obj.setLinearVelocity( y.x * speed * ( negatise? -1 : 1 ), z.y, y.z * speed * ( negatise? -1 : 1 ) );

		}

	}
}