Proton3DInterpreter = class {

	init( extras, scene ) {

		var interpreter = this;

		// Auto graphics
		switch ( extras.graphicsRating ) {

			case 1 / 10:
				break;

			case 2 / 10:
				break;

			case 3 / 10:
				break;

			case 4 / 10:
				break;

			case 5 / 10:
				break;

			case 6 / 10:
				break;

			case 7 / 10:
				break;

			case 8 / 10:
				break;

			case 9 / 10:
				break;

			case 10 / 10:
				break;

		}

		// Sets up the scene
		this.dynamicResize( scene );

		// Creates everything HTML
		this.element = document.createElement( "scene" );
		this.canvas = document.createElement( "canvas" );

		// Resize break
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
		var sky = new Proton3DObject( { type: "sky" } );

		// Creates a camera
		this.camera = new Proton3DObject( { type: "perspectivecamera", x: 0, y: 0, z: 5 } );
		this.camera.setPosition( 0, 0, 5 )

		// Creates a thing called a "HemisphericLight"
		new BABYLON.HemisphericLight( "ambientLight", new BABYLON.Vector3( 0, 1, 0 ), this.scene )
		
		// Spotlight
		var light = new Proton3DObject( { type: "spotlight" } );
		window.light = light;
		light.setPosition( 0, 5, 0 )
		light.lookAt( 0, 0, 1 )

		// Postprocessing
		/*var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [ camera ]);
		defaultPipeline.chromaticAberrationEnabled = true;
		defaultPipeline.chromaticAberration.aberrationAmount = 3;
		defaultPipeline.grainEnabled = true;
		defaultPipeline.grain.animated = true;
		defaultPipeline.grain.intensity = 3;
		defaultPipeline.fxaaEnabled = true;
		defaultPipeline.bloomEnabled = true;
		defaultPipeline.depthOfFieldEnabled = true;
		defaultPipeline.depthOfField.focusDistance = 10000;
		var ssao = new BABYLON.SSAORenderingPipeline( "ssaopipeline", this.scene, { ssaoRatio: 1, combineRatio: 1.0 }, [ camera ] );
		ssao.fallOff = 0.000001;
		ssao.area = 1;
		ssao.radius = 0.0001;
		ssao.totalStrength = 1.0;
		ssao.base = 0.5;*/

		
		// Ground
		var ground = BABYLON.MeshBuilder.CreateBox( "ground", { width: 10, height: .5, depth: 10 }, this.scene );
		ground.receiveShadows = true;
		ground.material = new BABYLON.StandardMaterial( "groundmaterial", this.scene );
		ground.material.diffuseColor = new BABYLON.Color3( 0.1, 0.3, 0.2 );
		ground.material.roughness = 1;
		ground.material.metalness = 1;

		// Physics
		var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
		var physicsPlugin = new BABYLON.AmmoJSPlugin();
		this.scene.enablePhysics(gravityVector, physicsPlugin);

		// Box
		var height = 10;
		window.cube = function() {

			var box = BABYLON.MeshBuilder.CreateBox( "box", { height: 1, width: 1, depth: 1 }, interpreter.scene );
			box.position.y = height;
			box.material = new BABYLON.StandardMaterial( "boxmaterial", interpreter.scene );
			box.receiveShadows = true;
			//shadowGenerator.addShadowCaster( box )
			box.physicsImpostor = new BABYLON.PhysicsImpostor( box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1 }, interpreter.scene );

		}
		ground.physicsImpostor = new BABYLON.PhysicsImpostor( ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene );

		// glTF files!
		function mergeSameMaterials( objects ) {

			var similarNames = [];
			var newObjects = [];
			objects.forEach( ( object ) => {

				if ( object.name.includes( "_primitive" ) ) {

					object.realName = object.name.substr( 0, object.name.indexOf( "_primitive" ) );
					if ( similarNames.indexOf( object.realName ) == -1 ) similarNames.push( object.realName )

				}

			} );

			similarNames.forEach( ( name ) => {
				//
				var similarMeshes = [];
				var similarMaterials = [];
				objects.forEach( ( object ) => {

					if ( object.name && object.name.includes( name ) ) {

						similarMeshes.push( object )
						similarMaterials.push( object.material )

					}

				} );

				newObjects.push( BABYLON.Mesh.MergeMeshes( similarMeshes, undefined, undefined, undefined, undefined, similarMaterials ) )

			} )

			return newObjects;

		}
		




		// Sets up the canvas
		this.element.appendChild( this.canvas );
		document.body.appendChild( this.element );

		// Updates the scene
		this.engine.runRenderLoop( function() {

			interpreter.updateScene( scene )

		} );

		// Starts the scene
		this.updateScene( scene );

		// Done!
		return this.canvas;

	}

	// Updates a scene in Proton
	updateScene( scene ) {

		var i = this
		// pausing
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
	dynamicResize( scene ) {

		var interpreter = this;
		window.addEventListener( "resize", function () {

			interpreter.engine.resize();

		} );

	}

	// Adds an object to the scene
	addToScene( object, scene ) {

		console.error( "In Babylon.js, objects are already initiated to scenes when you create them." )

	}

	// Removes an object from a scene
	removeFromScene( object ) {

		this.scene.removeMesh( getMeshByName( object.name ) );

	}

	// Does whatever when Proton resumes
	resume() {

		// Whatever

	}

	// Creates a shadow caster
	createShadowGenerator( light ) {

		var shadowGenerator = new BABYLON.ShadowGenerator( 1024, light );
		shadowGenerator.setDarkness( 0.5 );
		shadowGenerator.usePercentageCloserFiltering = true;
		shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
		shadowGenerator.bias = -0.005;
		this.shadowGenerators.push( shadowGenerator )

	}


	// Creating and modifing Proton3DObjects
	create3DObject( extras, object ) {

		var interpreter = this;
		if ( extras.x == undefined ) extras.x = 0;
		if ( extras.y == undefined ) extras.y = 0;
		if ( extras.z == undefined ) extras.z = 0;
		switch ( extras.type ) {

			case "perspectivecamera":
				
				// Creates the camera
				var camera = new BABYLON.FreeCamera( object.name, new BABYLON.Vector3(0, 0, 1), interpreter.scene);
				camera.setTarget(BABYLON.Vector3.Zero());
				camera.attachControl(true);
				meshes.push( camera );

				// Adds Proton functions
				object.changeFOV = (value) => {

					object.fov = value;

				};

				// Done
				break;

			case "spotlight":
				
				// Creates the spotlight
				var light = new BABYLON.SpotLight( object.name, new BABYLON.Vector3( extras.x, extras.y, extras.z ), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, this.scene );
				light.setDirectionToTarget( new BABYLON.Vector3( 0, 0, 0 ) );
				light.name = object.name;
				meshes.push( light );

				// Adds shadows
				this.createShadowGenerator( light );

				// Done
				break;

			case "pointlight":
				
				// Creates the light
				//...

				// Done
				break;

			case "sky":
				
				var sky = BABYLON.Mesh.CreateBox( "skybox", 10000, this.scene, false, BABYLON.Mesh.BACKSIDE );
				sky.material = new BABYLON.SkyMaterial( "sky", this.scene );
				sky.material.inclination = 0.1;

				/*for ( var i in extras ) {

					// set the value
					if ( sky.material.uniforms[ i ] ) {

						object[ i ] = extras[ i ];
						sky.material.uniforms[ i ].value = extras[ i ];

					}

				}*/

				if ( extras.sun ) {

					//
					object.sun = extras.sun;
					object.sun.setPosition(
						object.sunPosition.x,
						object.sunPosition.y,
						object.sunPosition.z
					);
					//
					this.changeValue = ( id, value ) => {

						sky.material.uniforms[ id ].value = value;

					};

					this.changeSunPosition = ( value ) => {

						sky.material.uniforms[ "sunPosition" ].value = value;
						//
						object.sun.setPosition(
							value.x,
							value.y,
							value.z
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
				cube.receiveShadows = true;
				cube.name = object.name;
				meshes.push( cube );

				// cube stuff
				object.width = extras.width;
				object.height = extras.height;
				object.depth = extras.depth;

				// More stuff. I don't know what it does. (Well, I do, I just don't know why.)
				for ( var i in extras ) {

					if ( extras[ i ] && object[ i ] == undefined ) {

						object[ i ] = extras[ i ];

					}

				}

				break;

			case "sphere":
				
				extras.type = "sphere";
				
				// Creates the sphere
				//??

				sphere.name = object.name;
				meshes.push( sphere );

				// Creates some properties
				object.radius = 1;

				// Again, no idea why this is here.
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
					mesh.material.forEach( function ( material, i ) {

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

		// Sets the rotation if there is none
		getMeshByName( object.name ).rotation = getMeshByName( object.name ).rotation || BABYLON.Vector3.Zero();

		// creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if ( getMeshByName( object.name ).material && extras.type != "sky" && ! extras.mesh ) {

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
	Proton3DObject = {
		makeInvisible( P3DObject ) {

			Object.defineProperty( getMeshByName( P3DObject.name ).material, "visible", { configurable: false, writable: false, value: false } );
			Object.defineProperty( getMeshByName( P3DObject.name ), "visible", { configurable: false, writable: false, value: false } );

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

		},
		playAudio( src, listener = new THREE.AudioListener(), P3DObject ) {

			var audio = new Audio( src );
			audio.play();
			return audio;

		},
		applyImpulse( force, offset = new THREE.Vector3( 0, 0, 0 ), P3DObject ) {

			offset = new THREE.Vector3( offset.x, offset.y, offset.z );
			getMeshByName( P3DObject.name ).applyImpulse( force, offset );

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

		},
		getPickup( P3DObject ) {

		},
		makeListeningObject( P3DObject ) {

			getMeshByName( P3DObject.name ).add( new THREE.AudioListener() );

		},
		setLinearVelocity( x = getMeshByName( P3DObject.name ).getLinearVelocity().x, y = getMeshByName( P3DObject.name ).getLinearVelocity().y, z = getMeshByName( P3DObject.name ).getLinearVelocity().z, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.setLinearVelocity( new BABYLON.Vector3( x, y, z ) );

		},
		setAngularVelocity( x = getMeshByName( P3DObject.name ).getAngularVelocity().x, y = getMeshByName( P3DObject.name ).getAngularVelocity().y, z = getMeshByName( P3DObject.name ).getAngularVelocity().z, P3DObject ) {

			getMeshByName( P3DObject.name ).physics.setAngularVelocity( new BABYLON.Vector3( x, y, z ) );

		},
		setDamping( linear, angular, P3DObject ) {

			getMeshByName( P3DObject.name ).setDamping( linear, angular );

		},
		setLinearFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).setLinearFactor( new BABYLON.Vector3( x, y, z ) );

		},
		setAngularFactor( x = 0, y = 0, z = 0, P3DObject ) {

			getMeshByName( P3DObject.name ).setAngularFactor( new BABYLON.Vector3( x, y, z ) );

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
			getMeshByName( P3DObject.name ).__dirtyRotation = true;

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
			getMeshByName( P3DObject.name ).__dirtyPosition = true;

		},
		getRotation( P3DObject ) {

			return getMeshByName( P3DObject.name ).rotation;

		},
		getPosition( P3DObject ) {

			return getMeshByName( P3DObject.name ).position;

		},
		applyLocRotChange( P3DObject ) {

			getMeshByName( P3DObject.name ).__dirtyPosition = true;
			getMeshByName( P3DObject.name ).__dirtyRotation = true;

		},
		getLinearVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getLinearVelocity();

		},
		getAngularVelocity( P3DObject ) {

			return getMeshByName( P3DObject.name ).physics.getAngularVelocity();

		},
		isMesh( object, P3DObject ) {

			// the object has to be a proton3dobject, as with all of these functions.
			return object.name == P3DObject.name;

		},
		getWorldDirection( P3DObject ) {

			if ( getMeshByName( P3DObject.name ).getWorldDirection ) {

				return getMeshByName( P3DObject.name ).getWorldDirection( new THREE.Vector3() );

			} else {

				var point = new THREE.Mesh(
						new THREE.BoxBufferGeometry( 0.001, 0.001, 0.001 ),
						new THREE.MeshBasicMaterial()
					),
					mesh = getMeshByName( P3DObject.name );
				point.position.set( 0, 0.5, 2 );
				mesh.add( point );
				var position = ( new THREE.Vector3() ).setFromMatrixPosition( point.matrixWorld );
				mesh.remove( point );
				return position.sub( getMeshByName( P3DObject.name ).position );

			}

		},
		lookAt( x = 0, y = 0, z = 0, P3DObject ) {

			if ( getMeshByName( P3DObject.name ).setDirectionToTarget ) {
			
				getMeshByName( P3DObject.name ).setDirectionToTarget( new BABYLON.Vector3( x, y, z ) );
			
			}

			if ( getMeshByName( P3DObject.name ).lookAt ) {

				getMeshByName( P3DObject.name ).lookAt( new BABYLON.Vector3( x, y, z ) );
				getMeshByName( P3DObject.name ).__dirtyRotation = true;

			}

		},
		getWorldPosition( P3DObject ) {

			return ( new THREE.Vector3() ).setFromMatrixPosition( getMeshByName( P3DObject.name ).matrixWorld );

		},
		getWorldRotation( P3DObject ) {

			return getMeshByName( P3DObject.name ).getWorldQuaternion( new THREE.Euler() );

		},
		getCollidingObjects( P3DObject ) {

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

		// variables
		var loader,
			// The object itself
			x = {},
			interpreter = extras.interpreter,
			scene;
		// output stuff
		x.objects = [];
		x.animations = [];
		x.raw = null;

		// Gets the loader and loads the file:
		// Sets extras.type (what the loader should expect to be loading)
		if ( extras.type == undefined ) extras.type = "gltf";
		extras.type = extras.type.toLowerCase();
		// Decides whether the file is a glTF or FBX file and loads it, and then sends that information to a unified load-finish function.
		if ( extras.type == "gltf" ) {

			loader = new THREE.GLTFLoader( extras.loadManager );
			loader.load( extras.path, function ( object ) {

				finishLoad( object );

			} );

		} else {

			loader = new THREE.FBXLoader( extras.loadManager );
			loader.load( extras.path, function ( object ) {

				finishLoad( object );

			} );

		}

		// gets the loaded objects and completes the function
		function finishLoad( load ) {

			scene = extras.type == "gltf" ? load.scene : load;
			// "registers" each object as a physics object
			if ( extras.noPhysics != true ) {

				scene.children.forEach( loadObjectPhysics );

			} else {

				if ( extras.starterPos ) {

					scene.position.add( extras.starterPos );

				}

				scene.children.forEach( function ( child ) {

					if ( extras.starterPos && child.position ) {

						child.position.add( extras.starterPos );

					}

					// armature
					if ( child.name.toLowerCase().includes( "armature" ) && extras.armature ) {

						child.children[ child.children.length - 1 ].armature = child;

					}

				} );


			}

			// shadows
			scene.children.forEach( castShadow );
			function castShadow( c ) {

				if ( extras.castShadow != false ) {

					c.castShadow = true;

				}

				if ( extras.receiveShadow != false ) {

					c.receiveShadow = true;

				}

				if ( c.children ) c.children.forEach( castShadow );

			}

			// animations
			if ( load.animations && load.animations.length ) {

				if ( extras.starterPos ) {

					scene.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z );

				}

				var mixer = new THREE.AnimationMixer( scene ),
					clock = 1 / 60;
				for ( var i in load.animations ) {

					var animation = {
						rootAction: mixer.clipAction( load.animations[ i ] ),
						repeat: false,
						playing: false,
						play: function ( animatingObjects = [], presetPosition = undefined, presetRotation = undefined ) {

							// 	presetPosition = new THREE.Vector3( 0, 0, 0 )
							if ( this.playing ) {

								console.error( "An animation is currently in progress. Stop the current animation before playing it again." );
								return;

							}

							// variables
							var x = this,
								tracks = [];
							this.animatingObjects = animatingObjects;
							// creating a new action and making its values relative to an object
							this.action = { ...this.rootAction };
							this.animatingObjects.forEach( function ( P3DObject ) {

								var object = getMeshByName( P3DObject.name );
								x.action._clip.tracks.forEach( function ( track, i ) {

									if ( track.name.includes( object.name.replace( /_copy/ig, "" ) ) ) {

										if ( track.name.includes( "position" ) ) {

											var xyz = 0, values = [], position = presetPosition || object.position;
											track.values.forEach( function ( value ) {

												var result = value;
												if ( xyz == 0 ) {

													result = value + position.x;

												}

												if ( xyz == 1 ) {

													result = value + position.y;

												}

												if ( xyz == 2 ) {

													result = value + position.z;

												}

												values.push( result );
												//
												xyz ++;
												if ( xyz == 3 ) xyz = 0;

											} );
											tracks[ i ] = new THREE.KeyframeTrack( track.name, track.times, values );

										}

										if ( track.name.includes( "quaternion" ) ) {

											var wxyz = 0, values = [], quaternion = presetRotation || object.quaternion;
											track.values.forEach( function ( value ) {

												var result = value;
												if ( wxyz == 0 ) {

													result = value + quaternion.x;

												}

												if ( wxyz == 1 ) {

													result = value + quaternion.y;

												}

												if ( wxyz == 2 ) {

													result = value + quaternion.z;

												}

												if ( wxyz == 3 ) {

													// 	result = value + quaternion.w

												}

												values.push( result );
												//
												wxyz ++;
												if ( wxyz == 4 ) wxyz = 0;

											} );
											tracks[ i ] = new THREE.KeyframeTrack( track.name, track.times, values );

										}

									}

								} );

							} );
							this.action._clip = new THREE.AnimationClip( x.action._clip.name, x.action._clip.duration, tracks );
							this.action = mixer.clipAction( this.action._clip );
							//
							var x = this,
								actionMatches = [
									"clampwhenfinished",
									"enabled",
									"loop",
									"paused",
									"repetitions",
									"time",
									"timescale",
									"weight",
									"zeroslopeatend",
									"zeroslopeatstart"
								];
							for ( var i in action ) {

								if ( actionMatches.indexOf( i.toLowerCase() ) != - 1 ) x.action[ i ] = action[ i ];

							}

							//
							this.action.clampWhenFinished = true;
							this.action.repetitions = this.repeat ? Infinity : 0;
							this.action.enabled = true;
							this.action.paused = false;
							this.playing = true;
							this.action.play();
							var action = this.action;
							this.animation = setInterval( function () {

								if ( action.paused ) {

									x.stop();
									return;

								}

								// update all animating objects
								mixer.update( clock );
								// add the position of all animating objects with its initial position
								x.animatingObjects.forEach( function ( object ) {

									object.applyLocRotChange();
									object.__animationLastPosition = object.position.clone();
									object.__animationLastRotation = getMeshByName( object.name ).quaternion.clone();

								} );

							}, 30 );

						},
						stop: function () {

							this.action.stop();
							this.action.reset();
							this.rootAction.stop();
							this.rootAction.reset();
							this.action.paused = true;
							this.playing = false;
							if ( this.animation ) {

								clearInterval( this.animation );

							}

							if ( this.animatingObjects ) {

								this.animatingObjects.forEach( function ( object ) {

									if ( object.__animationLastPosition ) {

										object.setPosition(
											object.__animationLastPosition.x,
											object.__animationLastPosition.y,
											object.__animationLastPosition.z
										);
										object.applyLocRotChange();

									}

									if ( object.__animationLastRotation ) {

										getMeshByName( object.name ).quaternion.copy( object.__animationLastRotation );
										object.applyLocRotChange();

									}

									object.__animationLastPosition = undefined;
									object.__animationLastRotation = undefined;

								} );

							}

						}
					};
					animation.name = animation.rootAction._clip.name;
					animation.rootAction.paused = true;
					x.animations[ i ] = animation;

				}

				x.animations.stopAll = function () {

					x.animations.forEach( function ( animation ) {

						animation.stop();

					} );
					mixer.stopAllAction();

				};

			}

			// creating Proton3D objects
			scene.children.forEach( convertObjectToProton3D );
			x.getObjectByName = function ( name ) {

				return x.objects.find( function ( child ) {

					return child.name.includes( name );

				} );

			}
			;

			x.raw = scene;
			//
			x.objects.forEach( function ( object ) {

				Proton.scene.add( object );

			} );
			Proton.scene.add( scene );
			if ( extras.onload ) {

				extras.onload( scene );

			}

			if ( x.onload ) {

				x.onload( scene );

			}

		}

		function convertObjectToProton3D( mesh ) {

			if ( mesh.children ) {

				mesh.children.forEach( convertObjectToProton3D );

			}

			if ( ! mesh.material && ! mesh.geometry ) {

				return;

			}

			// build the 3d object
			var object = new Proton3DObject( { mesh: mesh, noPhysics: extras.noPhysics } );

			if ( mesh.__physicsArmatureParent ) {

				// sets the skeleton in the P3DObject to that in the three.js object.
				object.armature = mesh.armature;
				object.skeleton = mesh.skeleton;
				mesh.__physicsArmatureParent.object = object;

			}

			if ( object.armature ) {

				if ( mesh.__physicsArmatureParent ) {

					// sets the position of the mesh to be 0, 0, and 0.
					mesh.position.set( 0, 0, 0 );

					// "hides" the physics object
					delete mesh.__physicsArmatureParent.material.visible;
					Object.defineProperty( mesh.__physicsArmatureParent.material, "visible", { configurable: false, writable: false, value: false } );

					// sets the P3DMaterial in the physics object to be rerouting to the material in the armature
					mesh.__physicsArmatureParent.p3dParent.material = object.material;

					// adds the armature to the physics object
					mesh.__physicsArmatureParent.add( object.armature );
					mesh.armatureObject = true;
					mesh.__physicsArmatureParent.p3dParent.physicsObject = true;
					object.armature.add( getMeshByName( object.name ) );

				} else {

					object.armature.add( getMeshByName( object.name ) );

				}

			}

			// adds the object to the output of objects
			x.objects.push( object );
			meshes.push( mesh );
			interpreter.initToScene( object, Proton.scene );

		}

		function loadObjectPhysics( child, i ) {

			var m = "Box", c = child;
			// armature
			if ( child.name.toLowerCase().includes( "armature" ) && extras.armature ) {

				c = child.children[ child.children.length - 1 ].clone();
				extras.accountForExtraProperties = true;

			}

			// geometry stuff
			if ( c.isMesh && c.geometry != undefined ) {

				// 'bakes' the scale into the geometry
				c.geometry = c.geometry.type.toLowerCase() == "buffergeometry" ? new THREE.Geometry().fromBufferGeometry( c.geometry ) : c.geometry;
				c.geometry.vertices.forEach( function ( vertex ) {

					vertex.multiply( c.scale );

				} );
				// adds the starter position to the object's position.
				if ( extras.starterPos ) {

					c.position.add( extras.starterPos );

				}

			} else {

				// if the object is not a mesh, forget about it.
				if ( c.children ) {

					c.children.forEach( loadObjectPhysics );

				}

				if ( c.position && extras.starterPos ) {

					c.position.add( extras.starterPos );

				}

				return;

			}

			// if the object has a --noPhysics flag in its name, forget about it.
			if ( c.name && c.name.includes( " --noPhysics" ) ) {

				return;

			}

			// makes the geometry type (m) equal extras.objectType
			if ( extras.objectType ) m = extras.objectType.charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );
			// if the object has a --geometry flag in its name, extras.objectType will be overridden with this.
			if ( c.name && c.name.includes( "--geometry-" ) ) {

				m = c.name.slice( c.name.indexOf( "--geometry-" ) + 11, c.name.length );
				m = m.charAt( 0 ).toUpperCase() + m.slice( 1 );
				if ( m.includes( "_" ) ) {

					m = m.slice( 0, m.indexOf( "_" ) );

				}

			}

			// same as above, but for mass.
			var mass = extras.mass || 0;
			// same as above, but with a flag.
			if ( c.name && c.name.includes( "--mass" ) ) {

				mass = c.name.slice( c.name.indexOf( "--mass-" ) + 7, c.name.length );
				if ( mass.includes( "_" ) ) {

					mass = mass.slice( 0, mass.indexOf( "_" ) );

				}

				mass = parseFloat( mass );

			}

			// creates a physijs object
			var physicalObject = new Physijs[ m + "Mesh" ](
				c.geometry,
				c.material,
				mass,
				{ mass: mass, friction: extras.friction, restitution: extras.restitution }
			);
			// sets the physics object's position, rotation and mass
			physicalObject.position.copy( c.position );
			physicalObject.quaternion.copy( c.quaternion );
			physicalObject.rotation.copy( c.rotation );
			physicalObject.__dirtyPosition = true;
			physicalObject.__dirtyRotation = true;
			// armature
			if ( extras.armature ) {

				// clones the physics object's material
				physicalObject.material = physicalObject.material.clone();

				// adds the physics object to the object list
				scene.add( physicalObject );
				scene.add( child );

				// adds the armature to the object list
				child.children[ child.children.length - 1 ].armature = child;
				child.children[ child.children.length - 1 ].__physicsArmatureParent = physicalObject;
				child.rotation.y += Proton.degToRad( 180 );
				c = child.children[ child.children.length - 1 ];

				return;

			}

			// gives the properties of the physics object to the child
			physicalObject.children = c.children;
			var propertiesToOmit = [
				// the object's position, rotation, and scale
				"position",
				"rotation",
				"quaternion",
				"scale",
				// the object's uuid, id, type, and name
				"uuid",
				"id",
				"type",
				"name",
				// the object's parent and children
				"parent",
				"children"
			];
			for ( var i in physicalObject ) {

				// if the property is not a property we should omit...
				if ( propertiesToOmit.indexOf( i.toLowerCase() ) == - 1 ) {

					// ...set that property in the child (initial) object.
					c[ i ] = physicalObject[ i ];

				}

			}

			c.scale.copy( physicalObject.scale );
			// done

		}

		return x;

	}

	// creating and modifing Proton3DMaterials
	create3DMaterial( extras, P3DMaterial, parentObject ) {

		if ( ! extras.material ) {

			var material = eval( "new THREE.Mesh" + ( extras.materialType ? ( extras.materialType.charAt( 0 ).toUpperCase() + extras.materialType.slice( 1 ) ) : "Standard" ) + "Material()" );
			material.name = P3DMaterial.name;
			material.transparent = true;
			materials.push( material );
			// 	parentObject.material = material;

		} else {

			extras.material.name = P3DMaterial.name;
			extras.material.transparent = true;
			materials.push( extras.material );
			if ( extras.materialLocation != undefined || extras.materialLocation != null ) {

				parentObject.material[ extras.materialLocation ] = extras.material;

			} else {

				parentObject.material = extras.material;

			}

		}
		
	}

	Proton3DMaterial = {
		setEmissiveColor( color, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).emissive = new THREE.Color( color );

		},
		getEmissiveColor( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).emissive.getStyle();

		},
		setWireframe( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).wireframeIntensity = value;

		},
		getWireframe( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).wireframeIntensity;

		},
		setEmissive( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).emissiveIntensity = value;

		},
		getEmissive( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).emissiveIntensity;

		},
		setColor( hexString, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).color = new THREE.Color( hexString );

		},
		getColor( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).color.getStyle();

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

			getMaterialByName( P3DMaterial.name ).transparent = true;
			getMaterialByName( P3DMaterial.name ).opacity = value;

		},
		getOpacity( P3DMaterial ) {

			return getMaterialByName( P3DMaterial.name ).opacity;

		},
		makeTransparent( value, P3DMaterial ) {

			getMaterialByName( P3DMaterial.name ).opacity = 0.001;
			getMaterialByName( P3DMaterial.name ).depthWrite = false;

		}
	}

	// changing mesh geometry and materials
	createMeshGeometry( obj, extras = {} ) {

		switch ( extras.type.toLowerCase() ) {

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

				// finish the function (  important  )
				var geometry = new THREE.SphereGeometry( geoParameters.radius, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );
				if ( extras.useBufferGeometry ) {

					geometry = new THREE.SphereBufferGeometry( geoParameters.radius, geoParameters.widthSegments, geoParameters.heightSegments, geoParameters.depthSegments );

				}

				//
				return {
					geometry: geometry,
					parameters: geoParameters
				};

			case "cylinder":
				var geoParameters = ( obj || {
					radiusTop: ( extras.radiusTop || 1 ),
					radiusBottom: ( extras.radiusBottom || 1 ),
					radialSegments: ( extras.cylinderSegments || 100 ),
					heightSegments: ( extras.cylinderSegments || 100 ),
					height: ( extras.height || 1 )
				} );
				for ( var i in extras ) {

					if ( geoParameters[ i ] ) {

						geoParameters[ i ] = extras[ i ];

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

				// finish the function (  important  )
				var geometry = new THREE.CylinderGeometry( geoParameters.radiusTop, geoParameters.radiusBottom, geoParameters.height, geoParameters.radialSegments, geoParameters.heightSegments );
				if ( ! extras.useBufferGeometry ) {

					geometry = new THREE.CylinderBufferGeometry( geoParameters.radiusTop, geoParameters.radiusBottom, geoParameters.height, geoParameters.radialSegments, geoParameters.heightSegments );

				}

				//
				return {
					geometry: geometry,
					parameters: geoParameters
				};

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

				// finish the function (important)
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

	}

	// Creates a material in three.js
	createMeshMaterial( extras = {} ) {

		extras = extras || {};
		var materialParameters = {
			color: new THREE.Color( extras.color || "#fff" ),
			map: null,
			wireframe: ( extras.wireframe || false )
		};
		if ( extras.bumpMap ) {

			var bump = new THREE.TextureLoader( extras.loadManager ).load( extras.bumpMap );
			bump.wrapS = THREE.RepeatWrapping;
			bump.wrapT = THREE.RepeatWrapping;
			bump.repeat.set( ( extras.bumpMapRepeat || 1 ), ( extras.bumpMapRepeat || 1 ) );
			materialParameters.bumpMap = bump;

		}

		if ( extras.normalMap ) {

			var normal = new THREE.TextureLoader( extras.loadManager ).load( extras.normalMap );
			normal.wrapS = THREE.RepeatWrapping;
			normal.wrapT = THREE.RepeatWrapping;
			normal.repeat.set( ( extras.normalMapRepeat || 1 ), ( extras.normalMapRepeat || 1 ) );
			materialParameters.normalMap = normal;

		}

		if ( extras.roughnessMap ) {

			var rough = new THREE.TextureLoader( extras.loadManager ).load( extras.roughnessMap );
			rough.wrapS = THREE.RepeatWrapping;
			rough.wrapT = THREE.RepeatWrapping;
			rough.repeat.set( ( extras.roughMapRepeat || 1 ), ( extras.roughMapRepeat || 1 ) );
			materialParameters.roughnessMap = rough;

		}

		if ( extras.displacementMap ) {

			var displacement = new THREE.TextureLoader( extras.loadManager ).load( extras.displacementMap );
			displacement.wrapS = THREE.RepeatWrapping;
			displacement.wrapT = THREE.RepeatWrapping;
			displacement.repeat.set( ( extras.displacementMapRepeat || 1 ), ( extras.displacementMapRepeat || 1 ) );
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

		// finish the function (  important  )
		var material;
		switch ( extras.materialType ) {

			case "standard":

				material = new THREE.MeshStandardMaterial( materialParameters );
				return finish( extras );
				break;

			case "toon":

				material = new THREE.MeshToonMaterial( materialParameters );
				return finish( extras );
				break;

			case "physical":

				material = new THREE.MeshPhysicalMaterial( materialParameters );
				return finish( extras );
				break;

			case "phong":

				material = new THREE.MeshPhongMaterial( materialParameters );
				return finish( extras );
				break;

			case "normal":

				material = new THREE.MeshNormalMaterial( materialParameters );
				return finish( extras );
				break;

			case "matcap":

				material = new THREE.MeshMatcapMaterial( materialParameters );
				return finish( extras );
				break;

			case "lambert":

				material = new THREE.MeshLambertMaterial( materialParameters );
				return finish( extras );
				break;

			case "distance":

				material = new THREE.MeshDistanceMaterial( materialParameters );
				return finish( extras );
				break;

			case "depth":

				material = new THREE.MeshDepthMaterial( materialParameters );
				return finish( extras );
				break;

			case "basic":

				material = new THREE.MeshBasicMaterial( materialParameters );
				return finish( extras );
				break;

			default:
				material = new THREE.MeshLambertMaterial( materialParameters );
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
			};

		}

	}

	// Listens for key events
	onKeyDown( callback ) {

		window.addEventListener( "keydown", function ( e ) {

			if ( e.keyCode == 32 ) e.preventDefault();
			callback( e.keyCode );

		} );

	}

	onKeyUp( callback ) {

		window.addEventListener( "keyup", function ( e ) {

			e.preventDefault();
			callback( e.keyCode );

		} );

	}

	// Hides the pointer through [element].requestPointerLock
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

			crosshairElement.style.display = null;

		};

		crosshairElement.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(  -50%, -50%  );
			height: 21px;
			width: 21px;
			image-rendering: auto !important;
			background: url(  "data:image / png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAKXnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjarZhpliMrDoX / s4peArNgOYzn9A56 + f0JIp1DDa + yuu2qjDAmQOheSVc26z// 3uZfvILzxcQkJdecLa9YY / WNm2Lv616djefv / ZCe79zncfP6wjMUuIb7Ma9nfmM8vT8g8Rnvn8eNjGed8izkXgufV9Cd9X4 + Rj4LBX / H3fPZ1OeBlj8c5 / nvx7Pss / jXz1FwxkysF7zxK7hg79 + 7U8CKUEPjms9f8Xe0hXT + hpB + 9J95ue4nDnzdffGffbMsvLvjLvR2rPzFT / mF1Ofx8NrGf7LI + dfO / hPU23b78fXBf3vPsve6p2sxG9yVn0O9HeXcMZFFYjiPZd7C / 8S9nHflXWyzA9QmR + 2GPYerzuPr7aKbrrnt1rkONzAx + uVxt / d ++HDGCu6vfhxQor7d9mLAZ4YCKgPkAsP + ZYs7 + 1bdj80KO0 / HTO9YzPHEp7f5OvC3708L7a00d86Wl6 + wyytlMUOR07 / MigeI69N0 / OvMvdivLwU2gGA6bi4csNl + l + jJvXMrHJyDTYap0d54cTKfBXAReyeMcQEEbHYhueyseC / O4ccCPg3LfYi + g4BLJvmJlT6GkAGneN2bZ8SduT75O0x6AYhE0AjQEECAFWOKmXgrUKiZFFJMKeUkqaSaWg455pRzlqx5qkmQKEmyiBSp0koosaSSi5RSamnV10AaS6bmKrXUWltj0xYbazXmNwa676HHnnru0kuvvQ3oM + JIIw8ZZdTRpp9hkgLMzFNmmXW25RZUWnGllZessupqG67tsONOO2 / ZZdfdXqg9qH5G7Styv0fNPaj5A5TOk3fUGBZ5W8JpOkmKGYj56EBcFAEI7RUzW1yMXpFTzGz1wZClPFYmBWc6RQwE43I + bffC7h25X + Jm8O53cfM / Q84odP8P5IxC9wG5H3H7CWqznXQbDkAahfiUDBkIPyas0nxpWpe + ee2rj12Mr5uFfCw9Br3rQgYlanzCbkmrz2XrLivxZcFLkQORybZWOJE1Zee0Q9hG9s4T + yWv6rBr7ZoBa87CGq3YwNQVkuwBxlPCXrMwUli7rxjbTnO7tocRf1fHcT4Ip4d1PvSd4 + 4JkHY / duZda5c8Ci4SGd3VsebA4p0WHKCKkJ59ybu3XHuHXdlXCb3jaL4d4OZ2L7J6HJg9GQ1Sc3BlbMFBNfW13G4pmdxqHDzIl1OKPjDr2iyCcZKcVho74bw + 5StHhioiXVlfA9NqZFJSNfLc / C / X5P02c1KZnFNblpJ4TpKhKg + BZ03mctBqdzDlK8ySGbN6TfpGeOjDFg6XhhqBzappxsbqHpMvu4 / Ausds6Oo6vgEB5vRfm2W + eY4Fo + 0gdJWL4rKNoKPrGzbe76YnbtuDYrE + tMNfa3G / 8me2qggkz6KEvcJgly24ZBvic6p67EP6BNYVp0968nTM + OOr + fUEUrElHFpO5J + rDWdxS0UHZGhx4ra5wlxFwTJLtcMcdaeWSF8SojKRIkUlurGp34WodYkzXnL10tT4 / Fp7ZgM80PEHfn1wM2u6f84C5qdfVNInt1HvNuS + wwJHyPDiDu / ZqGrmqnd70ohaplhabsiLScUNsfvYR7YKk1R6n / Z1qp2KfrpO6LUl21I3DORK + dJgCqOHNSOhuvDmN3Jbjc5gt + Ih1MKYJ2acWNHStigcVJ96uJf1uz7VopkP7V1QXpLuDwbB9HmcGrqA6Hg4pPaeaScN6BnafNAsGZoCIVxc2g34RTaHjIbPM + Cd + h0OvsjBmg60YYYZCm0Q1 / jPyljRjiV3VEd8nEQryctTfiU1XXAqCrkwLdsFBLuagwbiDvs1ZpyrLR + mASd7wrpaS6AeMeeMS / ZbofVs1yljuQU1xqDC9tC8N3uUU3URt7VRC9zxqRImkZg1Bw1osKm2eh + pF5sSSOLe241m9i0t1EPbtt2CiN7d6n / M0LTvqId9TbcoPrvFGuRUnbznzqEMzKeO9oisWRycCrCWZrPv + VxLRE2bAjdos3ZJ9BRLxccIdfqe0kzohk2 + WmNjSa0UkJZznLOjLRKCvVPxivaTTcv0WNXkvkrfhapj0QaOHD1xQ2pttd4SwHC8TKoqgSzgNX3HMXYXidQ42mG6i21jWQbLQmUvcAMlJxX1KzR6SvdciybySwNClqJ1JgZSIFWsaZPkWLdiFqpWp / JNEe7KODFWSb / wvJ402 + Qjx1EDGBn2cAFct6N + ZyDNZjNn5747bqgUeMCI1a0558rM6GXAhknFgTzSlhZ0UkuhGm0YoAe / HDB6Cw3w22XKmi + m0HjBlJoOUzpKyW6VTCFvoCnjRZNkd89GZpWHJSvHgp3rYUk6QkFZwnkQW78vV7 + oa3Ajc4ilcCo1 + HepQRpQrbk7SX + 4Qw1aGMIKizo1DO07Gl2K0IzgZ5jRyEMK5DjUAEqlBjUeTKAGmjVlSJ9Lv571ZnlWB6De80Baolmipl0L7ZUY2vMwsDRmmytlKvkLQQm2iSaEzeqRAGjIre2p8FHrjEr3gBrv8OnJl8Qb4c + 5oMCTHcGNiM9J5zvd0UYTBtyGEFYuIeDxzhzmKraHEXDO5zX7w4im2nAoI + ZhhKJNXbukOHDLJ7grPu + qF2gutjZBQXNqxJfaEZzcQJ + NxiS9RdMG7QSmU3bn96q9TbE0qk1pyi4W0qquIeQ7Ny3e8TEs4QIKNxXTnUTX67g1zuaqQPXij9djBwsjDaWpWrG5RLsvaEoZU6U + gs3XVOhRIyFzpOkVOZ5exo5eKVWnlkXOWQz7 + u1FS5YktF7VZxzZbiJO26kWS0OXaH4rBl5LGWDtkCWMGbpmce1pbUljadLWVM6G / k1efedq3m7Sk4OQLeQNdDRF8MiWQ79zj + hxjyDolN / ocZaWm1O4zQXhKbBRG7SqBVS5iaRiIh7 / E4Fpfq88pTwSeHlu4xUKiA + HD45mmFWrFvQ05BcNFtimSJJlZVIwkx5Ig0BDykXXbub9Ex996yraUmsCRuOrBIhefXTsKZrFtd / Q39OSxrAmb3K5b9rJC5inWpg59EHyHyoSBXPDWw9nItFij1PnUh2tima2ez6VUtR79J4qGaWT / uYCIED5jtcVXOavus + XUjtuA / hG0FI3K6RZ800lxkJ8Hf3ZyKlr0Q + jYtCd4vXnTe2BfNfmh6gvJKmVEW9iVGQrXFWtR8nQ2MDxGxBhPMJTlANFW4aL4k + Sgfl2r / C6to6CJWuSzPGaNjWTHkYlYjtB + jCyHV5p66haBRD0UZ1wFNpdarcciKjDUmP / JkJ / cmUhlWOWbG7nh347k5Fp0X1Mb / 02Qo9yhsq43TaZTTpp73TbNGFG2 + 2g2k6GpuHKo6T + jb9Pd6 + pBxIKJQLp0PdyWi4Laq3rvlodEfmjL4PIQqqNRFeBcvCnjd3BruA61TSoLY7SkSkZS39JODWD5Hh / S5hHRkQB / rS99sJhUG / UThS5BoBmOhikQXVaYQVef1dCEECYhoJVpiUfSA / ZtxgQ7PX0N9PfTBTakfNTmxOCA0HV5vwaD3rFllkRWP8FPvsaKYhf9VwAAAGFaUNDUElDQyBQUk9GSUxFAAB4nH2RPUjDQBzFX1O1RSoOdlBxyFCdLIqKOEoVi2ChtBVadTC59ENo0pCkuDgKrgUHPxarDi7Oujq4CoLgB4iLq5Oii5T4v6TQIsaD4368u / e4ewcI9TJTzY5xQNUsIxWPidncihh4RReCEDCGAYmZeiK9kIHn + LqHj693UZ7lfe7P0aPkTQb4ROJZphsW8Trx9Kalc94nDrOSpBCfE48adEHiR67LLr9xLjos8MywkUnNEYeJxWIby23MSoZKPEUcUVSN8oWsywrnLc5qucqa9 + QvDOW15TTXaQ4hjkUkkIQIGVVsoAwLUVo1UkykaD / m4R90 / ElyyeTaACPHPCpQITl + 8D / 43a1ZmJxwk0IxoPPFtj + GgcAu0KjZ9vexbTdOAP8zcKW1 / JU6MPNJeq2lRY6A3m3g4rqlyXvA5Q7Q / 6RLhuRIfppCoQC8n9E35YC + W6B71e2tuY / TByBDXS3dAAeHwEiRstc83h1s7 + 3fM83 + fgBjZ3KhWgKGVwAAAAZiS0dEADcASwDADel / eAAAAAlwSFlzAAAuIwAALiMBeKU / dgAAAAd0SU1FB + MGCAIyI1pj764AAAAqSURBVDjL7dUxEQAADMJA / EuGgUpoh455D7lIR0kqAIu2 / SzKNuUBr48az6wTuvSPBCoAAAAASUVORK5CYII="  )
		`;
		document.body.appendChild( crosshairElement );
		return crosshairElement;

	}

	// Some nonessential variables
	PI = Math.PI
	audio = Audio
	storage = localStorage
};