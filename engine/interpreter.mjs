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

import { Mesh, Material, UTILS, OBJECT_TYPES, CAMERA_TYPES } from "./Proton.mjs";

/* CONSTANTS */
export const SCRIPT_SOURCES = {
	primary: ["https://cdn.babylonjs.com/babylon.js", true], // Format== [url, isModule]
	secondary: [
		["https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js", true],
		["https://cdn.babylonjs.com/loaders/babylonjs.loaders.js", true],
		["https://cdn.babylonjs.com/ammo.js", false]
	]
};

/*
	~> loc:2
	Proton3DInterpreter
*/
export class ObjectList {

	meshes = [];

	materials = [];

	meshIDCounter = 0;

	materialIDCounter = 0;

	giveMeshID() { this.meshIDCounter++; return this.meshIDCounter - 1; }

	giveMaterialID() { this.materialIDCounter++; return this.materialIDCounter - 1; }

	getMesh(protonMesh) {

		return this.meshes.find(function (mesh) {

			return mesh.protonID === protonMesh.id;

		});

	}

	getMaterial(protonMaterial) {

		return this.materials.find(function (material) {

			return material.protonID === protonMaterial.id;

		});

	}

}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//
//\\ Proton's default interpreter   //
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
export class Interpreter {

	element = document.createElement("scene");

	canvas = document.createElement("canvas");

	shadowGenerators = [];

	objectList = new ObjectList();

	postprocessing = {
		enabled: false,
		bloom: true,
		ssao: true,
		fxaa: true,
		usePCSS: false,
		anisotropicFilteringLevel: 4
	}

	init(scene) {

		// Sets up the scene
		this.protonScene = scene;
		this.dynamicResize(scene);

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
		this.scene = new BABYLON.Scene(this.engine);
		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		// Physics
		this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());

		// Sets up the canvas
		this.element.appendChild(this.canvas);
		document.body.appendChild(this.element);

		// Updates the scene
		var materialLength = 0; // For anisotropic filtering (see below)
		this.engine.runRenderLoop(() => { this.updateScene(scene) });

	}

	setPostprocessing() {

		this.pipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.objectList.getMesh(this.protonScene.camera)]);
		if (this.postprocessing.bloom) this.pipeline.bloomEnabled = true;
		if (this.postprocessing.fxaa) this.pipeline.fxaaEnabled = true;
		if (this.postprocessing.ssao) this.ssao = new BABYLON.SSAORenderingPipeline("ssao", this.scene, { ssaoRatio: 0.5, combineRatio: 1.0 }, [this.objectList.getMesh(this.camera)]);

	}

	// Updates a scene in Proton
	updateScene(protonScene) {

		// Pausing (or skips if no camera as available). Note that the activeCamera property belongs to a BabylonJS scene and not one created by Proton!
		if (protonScene.paused == true || this.scene.activeCamera == undefined) {

			return;

		}

		// Renders the scene
		this.scene.render();

		// Updates the scene
		protonScene.update();

	}

	// Dynamically resizes the scene when the page is resized
	dynamicResize() {

		var interpreter = this;
		window.addEventListener("resize", function () {

			interpreter.engine.resize();

		});

	}

	// Removes an object from a scene
	removeFromScene(object) {

		this.scene.removeMesh(this.objectList.getMesh(object));

	}

	// Does whatever when Proton resumes/pauses
	resume() {

		this.scene.physicsEnabled = true;

	}

	pause() {

		this.scene.physicsEnabled = false;

	}

	// Gets objects a mesh is colliding with
	getCollidingObjects(P3DObject) {

		var collisions = [];
		this.scene.meshes.forEach((mesh) => { // Runs through all the meshes and runs a collision detection function on all of them. If they are colliding with the P3DObject, add them to an array which will be returned at the end of the function.

			if (!mesh.p3dParent || !mesh.physics) return;
			var contact = new Ammo.ConcreteContactResultCallback();
			contact.hasContact = false;
			contact.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) { // https://medium.com/@bluemagnificent/collision-detection-in-javascript-3d-physics-using-ammo-js-and-three-js-31a5569291ef

				let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

				const distance = contactPoint.getDistance();

				if (distance > 0) return;

				this.hasContact = true;

			}
			this.scene.getPhysicsEngine()._physicsPlugin.world.contactPairTest(mesh.physics.physicsBody, this.objectList.getMesh(P3DObject).physics.physicsBody, contact);
			if (contact.hasContact && mesh.p3dParent != P3DObject) collisions.push(mesh.p3dParent)

		});
		return collisions

	}

	// Creates a shadow generator
	createShadowGenerator(light) {

		if ( light instanceof BABYLON.DirectionalLight ) {

			light.shadowGenerator = new BABYLON.CascadedShadowGenerator(2048, light);
			/*this.objectList.getMesh( this.protonScene.camera ).maxZ = */light.shadowGenerator.shadowMaxZ = 100;
			light.shadowGenerator.splitFrustum();
			light.shadowGenerator.bias = 0.005;

		} else if ( light instanceof BABYLON.SpotLight ) {

			light.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
			light.usePercentCloserFiltering = true;
			light.shadowGenerator.bias = 0.005;

		}

		this.shadowGenerators.push(light.shadowGenerator);

	}

	// Rotates a vector
	rotateVector3(vector, euler) {

		// https://www.html5gamedevs.com/topic/15079-rotating-a-vector/
		var quaternion = BABYLON.Quaternion.FromEulerAngles(euler.x, euler.y, euler.z);
		var matrix = new BABYLON.Matrix();
		quaternion.toRotationMatrix(matrix);
		var rotatedVect = BABYLON.Vector3.TransformCoordinates(vector, matrix);
		return rotatedVect;

	}

	// Sets camera controls
	setCameraControls(params) {

		// Creates a capsule to do the collisions and physics stuff for us
		var object = new Mesh("playerPhysics", {
			type: OBJECT_TYPES.Capsule,
			height: params.height != undefined ? params.height + 2 : 5,
			radius: 10,
			friction: 1,
			restitution: 0,
			mass: 60,
			castShadow: false,
			noPhysics: params.noPhysics,
			// setTimeout is bad.
			// I can't use it.

			// But I can.
			//  'Cause that's the way I like to live my life 🎵
			// 🎵 and I think that everything's gonna be fine.
			onReady: () => setTimeout(function () {
				object.setAngularFactor(0, 0, 0);
				object.material.makeTransparent();
				params.cameraParent.position.set(0, 0, 0);
			}, 500)
		}, this.protonScene);
		params.cameraParent.physicsObject = object;
		params.cameraParent.position.set(0, 0, 0);
		object.add(params.cameraParent);
		params.type == CAMERA_TYPES.first ? object.add(this.protonScene.camera) : object.add(this.protonScene.thirdCamera);

		// Sets the camera's position
		var cameraPosition = params.cameraParent.position.add(new BABYLON.Vector3(params.distance.x, params.distance.y, params.distance.z));
		this.protonScene.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

		// Does regular stuff
		var mouseMoveFunction, beforeRenderFunction, clickFunction, keyDownFunction; // Functions that handle various events. keyDownFunction and clickFunction are optional.
		switch (params.type) {

			case CAMERA_TYPES.first:

				mouseMoveFunction = (e) => {

					if (!this.protonScene.paused) {

						this.protonScene.camera.rotation.y += UTILS.degToRad(e.movementX / params.sensitivity);
						if (this.protonScene.camera.rotation.x + UTILS.degToRad(e.movementY / params.sensitivity) < 1.57 &&
							this.protonScene.camera.rotation.x + UTILS.degToRad(e.movementY / params.sensitivity) > -1.57) {

							this.protonScene.camera.rotation.x += UTILS.degToRad(e.movementY / params.sensitivity);

						}

						// Sets the crosshair's position
						this.protonScene.crosshair.localPosition = this.protonScene.camera.getWorldDirection();

						// Sets the rotation of the player mesh
						params.cameraParent.rotation.y = this.protonScene.camera.rotation.y;

					}

				};

				// Defines a "getter" for the crosshair's GLOBAL position which computes it when you request it.
				Object.defineProperty(this.protonScene.crosshair, "position", { get: () => { return object.position.clone().add(this.protonScene.crosshair.localPosition).add(this.protonScene.camera.position); } });

				break;

			case CAMERA_TYPES.third:

				// Enables/disables controls in Babylon on "pointerlockchange"
				document.addEventListener("pointerlockchange", () => {

					if (!document.pointerLockElement) {

						this.protonScene.thirdCamera.disable();// Disables camera controls when there is no pointer lock

					} else {

						this.protonScene.thirdCamera.enable();// Does the exact opposite as above

					}

				}, false);

				// Sets functions to enable + disable camera controls
				this.protonScene.thirdCamera.disable = () => this.objectList.getMesh(this.protonScene.thirdCamera).detachControl(this.canvas);
				this.protonScene.thirdCamera.enable = () => this.objectList.getMesh(this.protonScene.thirdCamera).attachControl(this.canvas);

				// Creates variables
				var animating, deg; // Wether the player is turning around and the angle (almost) in which it should be facing, in degrees (hence the name "deg")

				// Sets some camera properties
				this.objectList.getMesh(this.protonScene.thirdCamera).inertia = 0;
				this.objectList.getMesh(this.protonScene.thirdCamera).radius = params.distance.x;
				this.objectList.getMesh(this.protonScene.thirdCamera).angularSensibilityX = 1000 - 60 * params.sensitivity;
				this.objectList.getMesh(this.protonScene.thirdCamera).angularSensibilityY = 1000 - 60 * params.sensitivity;
				// Sets this camera as the active one.
				this.scene.activeCamera = this.objectList.getMesh(this.protonScene.thirdCamera);
				this.protonScene.thirdCamera.active = true;

				// Now for the functions.
				mouseMoveFunction = (e) => {

					if (!Proton.paused) {

						this.protonScene.crosshair.localPosition = this.protonScene.thirdCamera.position.clone().multiply(new BABYLON.Vector3(-.1, 0, -.1));

					}

				};
				beforeRenderFunction = () => {

					// Sets the crosshair's position
					this.protonScene.crosshair.position = object.position.clone().add(this.protonScene.crosshair.localPosition);

					// Rotates the player
					deg = UTILS.radToDeg(this.objectList.getMesh(this.protonScene.thirdCamera).alpha)
					if (deg > 360) deg = deg - 360;
					if (deg < 360) deg = deg + 360;
					if (!animating && Object.values(this.protonScene.keys).indexOf(true) > -1) params.cameraParent.rotation.y = UTILS.degToRad(-deg + 90);

				};
				keyDownFunction = () => {

					if (Math.abs(params.cameraParent.rotation.y - UTILS.degToRad(-deg + 90)) >= 1 && animating != true) {

						animating = true;
						var origin = new BABYLON.Vector3(0, params.cameraParent.rotation.y, 0);
						Proton.animate(origin, {
							x: 0,
							y: UTILS.degToRad(-deg + 90),
							z: 0,
						}, {
							step: function () {

								params.cameraParent.rotation.y = origin.y;

							},
							callback: () => animating = false,
							duration: 400
						});

					}

				}
				clickFunction = () => {

					if (document.pointerLockElement) keyDownFunction();

				}

		}
		if (keyDownFunction) document.body.addEventListener("keydown", keyDownFunction);
		if (clickFunction) document.body.addEventListener("click", clickFunction);
		this.scene.registerBeforeRender(beforeRenderFunction);
		this.onMouseMove(mouseMoveFunction);

	}


	// Creating and modifing Proton3DObjects
	create3DObject(options, object) {

		var interpreter = this;
		switch (options.type) {

			case OBJECT_TYPES.PerspectiveCamera:

				// Creates the camera
				var camera = new BABYLON.UniversalCamera(object.name, new BABYLON.Vector3(0, 0, 1), interpreter.scene);
				camera.minZ = .1;
				camera.maxZ = 1000;
				camera.fov = options.fov != undefined ? options.fov : 1;
				camera.setTarget(BABYLON.Vector3.Zero());
				camera.protonID = object.id;
				this.objectList.meshes.push(camera);

				// Adds Proton functions
				object.changeFOV = (value) => {

					object.fov = value;

				};

				// Done
				break;

			case OBJECT_TYPES.ThirdPerspectiveCamera:

				// Creates the camera
				var camera = new BABYLON.ArcRotateCamera(object.name, 0, 0, 10, new BABYLON.Vector3(0, 0, 0), interpreter.scene);
				camera.minZ = .1;
				camera.maxZ = 1000;
				camera.fov = options.fov != undefined ? options.fov : 1;
				camera.protonID = object.id;
				this.objectList.meshes.push(camera);

				// Adds Proton functions
				object.changeFOV = (value) => {

					object.fov = value;

				};

				// Done
				break;

			case OBJECT_TYPES.SpotLight:

				// Creates the spotlight
				var light = new BABYLON.SpotLight(object.name, new BABYLON.Vector3(options.position.x, options.position.y, options.position.z), new BABYLON.Vector3(0, -1, 0), UTILS.degToRad(60), 0, this.scene);
				light.setDirectionToTarget(new BABYLON.Vector3(0, 0, 0));
				light.protonID = object.id;
				this.objectList.meshes.push(light);

				object.setIntensity = (value) => light.intensity = value;
				object.setAngle = (value) => light.angle = value;

				// Adds shadows
				if (options.shadows != false) this.createShadowGenerator(light);

				// Done
				break;

			case OBJECT_TYPES.DirectionalLight:

				// Creates the directional light
				var light = new BABYLON.DirectionalLight(object.name, new BABYLON.Vector3(0, 0, 0), this.scene);
				light.position = new BABYLON.Vector3(options.position.x, options.position.y, options.position.z);
				light.protonID = object.id;
				this.objectList.meshes.push(light);

				object.setIntensity = (value) => light.intensity = value;
				object.setAngle = (value) => light.angle = value;
				object.setTarget = (vector) => light.setDirectionToTarget(new BABYLON.Vector3(vector.x, vector.y, vector.z));

				// Adds shadows
				if (options.shadows != false) this.createShadowGenerator(light);

				// Done
				break;

			case OBJECT_TYPES.Sky:

				var sky = BABYLON.Mesh.CreateBox("skybox", 10000, this.scene, false, BABYLON.Mesh.BACKSIDE);
				sky.material = new BABYLON.SkyMaterial("sky", this.scene);
				sky.material.inclination = 0.1;
				sky.material.useSunPosition = true;

				object.setSunPosition = (x, y, z) => {

					sky.material.sunPosition.set(
						x,
						y,
						z
					);

				};

				if (options.sun != undefined) {

					sky.sun = options.sun;
					sky.sun.position.set(
						sky.sunPosition.x,
						sky.sunPosition.y,
						sky.sunPosition.z
					);

					object.setSunPosition = (x, y, z) => {

						sky.material.sunPosition.set(
							x,
							y,
							z
						);

						object.sun.position.set(
							x,
							y,
							z
						);

					};

				}

				sky.protonID = object.id;
				this.objectList.meshes.push(sky);
				break;

			case OBJECT_TYPES.Cube:

				options.type = "cube";

				// Makes the cube
				var cube = BABYLON.MeshBuilder.CreateBox(object.name, { width: options.width, height: options.height, depth: options.depth }, this.scene);
				cube.protonID = object.id;
				this.objectList.meshes.push(cube);

				// Shadows
				cube.receiveShadows = true;

				// cube stuff
				object.width = options.width;
				object.height = options.height;
				object.depth = options.depth;

				// Copies parameters to the object
				for (var i in options) {

					if (options[i] && object[i] == undefined) {

						object[i] = options[i];

					}

				}

				break;

			case OBJECT_TYPES.Sphere:

				options.type = "sphere";

				// Makes the sphere
				var sphere = BABYLON.MeshBuilder.CreateSphere(object.name, { diameter: options.radius * 2 }, this.scene);
				sphere.protonID = object.id;
				this.objectList.meshes.push(sphere);

				// Shadows
				sphere.receiveShadows = true;

				// Creates some properties
				object.radius = 1;

				// Copies parameters to the object
				for (var i in options) {

					if (options[i] && object[i] == undefined) {

						object[i] = options[i];

					}

				}

				break;

			case OBJECT_TYPES.Capsule:

				options.type = "capsule";

				// Makes the capsule
				var capsule = BABYLON.MeshBuilder.CreateCapsule(object.name, { radius: 1, height: options.height, capSubdivisions: 12, tessellation: 12, topCapSubdivisions: 12 }, this.scene);
				capsule.protonID = object.id
				this.objectList.meshes.push(capsule);
				capsule.name = object.name;

				// Shadows
				capsule.receiveShadows = true;

				// Creates some properties
				object.radius = options.radius;
				object.height = options.height;

				// Copies parameters to the object
				for (var i in options) {

					if (options[i] && object[i] == undefined) {

						object[i] = options[i];

					}

				}

				break;

			default: // For imported meshes

				var mesh = options.mesh;

				if (!mesh.material[0]) {

					object.material = new Material(object, {
						material: mesh.material
					}, this.protonScene);

				} else {

					var y = object;
					object.material = [];
					mesh.material.forEach((material, i) => {

						y.material.push(new Material(mesh, {
							material: material,
							materialLocation: i
						}, this.protonScene));

					});

				}

				mesh.protonID = object.id;
				this.objectList.meshes.push(mesh);

		}

		// Shadows
		if (this.objectList.getMesh(object).geometry && options.type != "sky" && options.castShadow != false) interpreter.shadowGenerators.forEach((generator) => generator.addShadowCaster(this.objectList.getMesh(object), true));


		// Sets the rotation if there is none
		if (this.objectList.getMesh(object).rotation == undefined) this.objectList.getMesh(object).rotation = BABYLON.Vector3.Zero();

		// creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if (options.type != "sky" && options.type != "camera" && options.type != undefined) {

			object.material = options.material || new Material(this.objectList.getMesh(object), {
				name: options.materialName,
				material: this.objectList.getMesh(object).material,
				materialType: options.materialType
			}, this.protonScene);

		}

		// Sets the mesh's "parent"
		this.objectList.getMesh(object).p3dParent = object;

		// Makes the mesh (player) invisible
		if (options.invisible) object.makeInvisible();

	}



	init3DObject(extras, object) {

		// Physics
		var impostorType = "";
		if (extras.physicsImpostor != undefined) impostorType = BABYLON.PhysicsImpostor[extras.physicsImpostor];
		switch (extras.type) {

			case "cube":

				var cube = this.objectList.getMesh(object);
				// Physics
				if (extras.noPhysics != true) {

					if (impostorType == "") impostorType = BABYLON.PhysicsImpostor.BoxImpostor;
					cube.physics = new BABYLON.PhysicsImpostor(cube, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined ? extras.restitution : .1,
						friction: extras.friction != undefined ? extras.friction : 1,
					}, this.scene);

				}
				break;

			case "capsule":

				var capsule = this.objectList.getMesh(object);
				// Physics
				if (extras.noPhysics != true) {

					if (impostorType == "") impostorType = BABYLON.PhysicsImpostor.MeshImpostor;
					capsule.physics = new BABYLON.PhysicsImpostor(capsule, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined ? extras.restitution : .1,
						friction: extras.friction != undefined ? extras.friction : 1,
					}, this.scene);

				}
				break;

			case "sphere":

				var sphere = this.objectList.getMesh(object);
				// Physics
				if (extras.noPhysics != true) {

					if (impostorType == "") impostorType = BABYLON.PhysicsImpostor.SphereImpostor;
					sphere.physics = new BABYLON.PhysicsImpostor(sphere, impostorType, {
						mass: extras.mass || 0,
						restitution: extras.restitution != undefined ? extras.restitution : .1,
						friction: extras.friction != undefined ? extras.friction : 1,
					}, this.scene);

				}

		}

		// Sets reflections (where possible)
		this.setReflections(this.objectList.getMesh(object), this);

		// onReady: Where the magic happens
		if (object.onReady) object.onReady()

	}

	setReflections(mesh, interpreter) {

		if (interpreter.scene.meshes.indexOf(mesh) == -1) return; // First needs to see if the object is a mesh in the first place.

		if (!mesh.reflectionProbe && (mesh.material != undefined && mesh.material.azimuth/*Determines if the material is a sky by a property of a SkyMaterial*/ == undefined)) {

			if (mesh.p3dParent.mirror == true) {

				if (mesh.material.roughness == 0) { mesh.material.roughness = 1 }
				// Creates a reflection probe
				mesh.reflectionProbe = new BABYLON.ReflectionProbe(mesh.id + "_rp", 128, this.scene);
				mesh.reflectionProbe.attachToMesh(mesh);
				mesh.material.reflectionTexture = mesh.reflectionProbe.cubeTexture;

				// Adds all objects in the scene to the reflection probe
				this.scene.meshes.forEach((object) => { mesh.reflectionProbe.renderList.push(object) });

			}

			// Real time filtering blurs the reflection texture depending on the object's roughness value.
			mesh.material.realTimeFiltering = true;

			//Ensuring that reflections do not drown out shadows
			mesh.material.environmentIntensity = .5;
			mesh.material.directIntensity = 1.5;

		}

	}

	setEnvironmentMap(url) { // Must be HDR

		this.scene.environmentTexture = new BABYLON.HDRCubeTexture(url, this.scene, 256, false, true, false, true); // Preset parameters from https://doc.babylonjs.com/divingDeeper/materials/using/HDREnvironment

	}

	Mesh = {
		interpreter: this, // Becuase when you have the "this" keyword in a function it refers to this object an not the instance of Proton3DInterpreter
		makeInvisible(P3DObject) {

			P3DObject.material.makeTransparent();
			if (P3DObject.material.subMaterials) P3DObject.material.subMaterials.forEach((material) => material.makeTransparent());
			this.interpreter.objectList.getMesh(P3DObject).isVisible = false

		},
		getShadowOptions(P3DObject) {

			return {
				cast: this.interpreter.objectList.getMesh(P3DObject).castShadow || false,
				receive: this.interpreter.objectList.getMesh(P3DObject).receiveShadow
			};

		},
		setShadowOptions(cast = null, receive = null, P3DObject) {

			// Casting will be set when an object is added to a scene
			this.interpreter.objectList.getMesh(P3DObject).receiveShadow = receive != undefined ? receive : this.interpreter.objectList.getMesh(P3DObject).receiveShadow;
			if (cast) {

				this.interpreter.shadowGenerators.forEach((generator) => generator.addShadowCaster(this.interpreter.objectList.getMesh(P3DObject)));

			} else {

				this.interpreter.shadowGenerators.forEach((generator) => generator.removeShadowCaster(this.interpreter.objectList.getMesh(P3DObject)));

			}

		},
		applyImpulse(force, offset = new BABYLON.Vector3(0, 0, 0), P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.applyImpulse(force, offset)

		},
		delete(P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).dispose();

		},
		setMass(value, P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.mass = value;

		},
		getMass(P3DObject) {

			return this.interpreter.objectList.getMesh(P3DObject).physics.mass;

		},
		setOnUse(useFunction, P3DObject) {

			P3DObject.__onUse = useFunction;

		},
		setOnNear(nearFunction, P3DObject) {

			P3DObject.__onNear = nearFunction;

		},
		getOnUse(P3DObject) {

			return P3DObject.__onUse;

		},
		getOnNear(P3DObject) {

			return P3DObject.__onNear;

		},
		setLinearVelocity(x, y, z, P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.physicsBody.setLinearVelocity(new Ammo.btVector3(x, y, z));

		},
		setAngularVelocity(x, y, z, P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.physicsBody.setAngularVelocity(new Ammo.btVector3(x, y, z));

		},
		setLinearFactor(x, y, z, P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.physicsBody.setLinearFactor(new Ammo.btVector3(x, y, z));

		},
		setAngularFactor(x, y, z, P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).physics.physicsBody.setAngularFactor(new Ammo.btVector3(x, y, z));

		},
		setRotation(x, y, z, P3DObject) {

			if (x == undefined) {

				x = P3DObject.rotation.x;

			}

			if (y == undefined) {

				y = P3DObject.rotation.y;

			}

			if (z == undefined) {

				z = P3DObject.rotation.z;

			}

			this.interpreter.objectList.getMesh(P3DObject).rotation.set(x, y, z);

		},
		setPosition(x, y, z, P3DObject) {

			if (typeof x === "object") {

				this.interpreter.objectList.getMesh(P3DObject).position.set(x.x, x.y, x.z);

			}

			if (x == undefined) {

				x = P3DObject.position.x;

			}

			if (y == undefined) {

				y = P3DObject.position.y;

			}

			if (z == undefined) {

				z = P3DObject.position.z;

			}

			this.interpreter.objectList.getMesh(P3DObject).position.set(x, y, z);

		},
		getRotation(P3DObject) {

			return this.interpreter.objectList.getMesh(P3DObject).rotation;

		},
		getPosition(P3DObject) {

			return this.interpreter.objectList.getMesh(P3DObject).position;

		},
		getLinearVelocity(P3DObject) {

			return this.interpreter.objectList.getMesh(P3DObject).physics.getLinearVelocity();

		},
		getAngularVelocity(P3DObject) {

			return this.interpreter.objectList.getMesh(P3DObject).physics.getAngularVelocity();

		},
		getWorldDirection(P3DObject) {

			return this.interpreter.rotateVector3(
				new BABYLON.Vector3(0, 0, 1),
				P3DObject.rotation
			);

		},
		lookAt(x = 0, y = 0, z = 0, P3DObject) {

			if (this.interpreter.objectList.getMesh(P3DObject).setDirectionToTarget) {

				this.interpreter.objectList.getMesh(P3DObject).setDirectionToTarget(new BABYLON.Vector3(x, y, z));

			}

			if (this.interpreter.objectList.getMesh(P3DObject).setTarget) {

				this.interpreter.objectList.getMesh(P3DObject).setTarget(new BABYLON.Vector3(x, y, z));

			}

			if (this.interpreter.objectList.getMesh(P3DObject).lookAt) {

				this.interpreter.objectList.getMesh(P3DObject).lookAt(new BABYLON.Vector3(x, y, z));

			}

		},
		getWorldPosition(P3DObject) {

			// https://forum.babylonjs.com/t/understanding-how-to-get-set-world-position-rotation-and-scale-in-a-hierarchy/5087
			var worldMatrix = this.interpreter.objectList.getMesh(P3DObject).getWorldMatrix();
			var quatRotation = new BABYLON.Quaternion();
			var position = new BABYLON.Vector3();
			var scale = new BABYLON.Vector3();
			worldMatrix.decompose(scale, quatRotation, position);
			return position;

		},
		add(object, P3DObject) {

			this.interpreter.objectList.getMesh(object).parent = this.interpreter.objectList.getMesh(P3DObject);
			object.parent = P3DObject;

		},
		remove(P3DObject) {

			this.interpreter.objectList.getMesh(P3DObject).dispose();

		}
	}

	importObject(extras) {

		// Variables
		var object = {},
			interpreter = this;

		// Supports whatever Babylon.js supports right now -- glTF, obj, and babylon files are supported
		load();
		async function load() {

			// Loads the mesh
			var mesh = await BABYLON.SceneLoader.ImportMeshAsync("", extras.path, "", interpreter.scene);
			var meshes = mergeSameMaterials(mesh.meshes);

			// Loads shadows
			if (extras.noShadows) extras.receiveShadows = extras.castShadow = false;
			loadShadows(meshes);

			// Turns the loaded mesh to a Proton3DObject
			object.objects = meshToProton(meshes);

			// Loads physics
			if (!extras.noPhysics) loadPhysics(meshes);

			// Sets the starter position (if any)
			if (extras.position) {

				object.objects.forEach((P3DObject) => {

					var pos = P3DObject.position.add(new BABYLON.Vector3(extras.position.x, extras.position.y, extras.position.z));
					P3DObject.position.set(pos.x, pos.y, pos.z);

				})

			}

			// Now you can initialize the object

			object.realObjects = meshes;
			if (extras.onReady) {

				object.onReady = extras.onReady;
				object.onReady();

			}

		}

		// Merges materials for glTF files
		function mergeSameMaterials(objects) {

			var similarNames = [];
			var newObjects = [];
			objects.forEach((object) => {

				// Alters the material before doing anything else to it
				if (object.material) {

					object.material.usePhysicalLightFalloff = false;

				}

				// Merges objects if they've been split from glTF
				if (object.name.includes("_primitive")) {

					object.realName = object.name.substr(0, object.name.indexOf("_primitive"));
					if (similarNames.indexOf(object.realName) == -1) similarNames.push(object.realName)

				} else {

					if (object.parent && object.parent.name && object.parent.name.includes("root")) object.parent = undefined;// If the object is somehow tied to this "root" thing, get rid of the root object.
					newObjects.push(object);

				}

			});

			similarNames.forEach((name) => {
				//
				var similarMeshes = [];
				var similarMaterials = [];
				objects.forEach((object) => {

					if (object.name && object.name.includes(name)) {


						similarMeshes.push(object);
						similarMaterials.push(object.material);

					}

				});

				newObjects.push(BABYLON.Mesh.MergeMeshes(similarMeshes, true, true, undefined, false, true))

			});

			return newObjects;

		}

		// Creates physics meshes for imported meshes
		function loadPhysics(meshes) {

			meshes.forEach((mesh) => {

				mesh.physics = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor[extras.physicsImpostor != undefined ? extras.physicsImpostor : "ConvexHullImpostor"], {
					mass: extras.mass || 0,
					restitution: extras.restitution != undefined ? extras.restitution : .1,
					friction: extras.friction != undefined ? extras.friction : 1,
				}, interpreter.scene);

			});

		}

		// Loads shadows for imported meshes
		function loadShadows(meshes) {

			meshes.forEach((mesh) => {

				mesh.receiveShadows = extras.receiveShadows != undefined ? extras.receiveShadows : true;
				if (extras.castShadow != false) interpreter.shadowGenerators.forEach((generator) => generator.addShadowCaster(mesh));

			});

		}

		// Converts the meshes to Proton object
		function meshToProton(meshes, parent = undefined) {//parent==Something you don't have to worry about.

			var objects = [];
			meshes.forEach((mesh) => {

				if (mesh.children) {

					mesh.children.forEach(meshToProton, object, root);

				}

				if (!mesh.material && !mesh.geometry) {

					return;

				}

				var object = new Mesh(mesh.name, { mesh: mesh, noPhysics: extras.noPhysics }, interpreter.protonScene);

				// Adds the object to the output of objects
				if (parent == undefined) {

					objects.push(object);

				} else {

					// Or to another objects
					parent.children.push(object);

				}

			});
			return objects;

		}

		return object;

	}

	// creating and modifing Proton3DMaterials
	create3DMaterial(extras, P3DMaterial, parentObject) {

		var material = extras.material;

		if (extras.material == undefined) {

			material = new BABYLON.PBRMaterial(P3DMaterial.name, this.scene);
			material.usePhysicalLightFalloff = false;
			material.protonID = P3DMaterial.id;
			material.roughness = 1;
			this.objectList.materials.push(material);
			parentObject.material = material;

		} else {

			material.protonID = P3DMaterial.id;
			this.objectList.materials.push(material);
			if (material.subMaterials) {

				P3DMaterial.subMaterials = [];
				material.subMaterials.forEach((material) => {

					P3DMaterial.subMaterials.push(new Material(parentObject, {
						material: material
					}, this.protonScene));

				});

			}

		}

		// Run whatever you want to alter all materials here

	}

	Material = {
		interpreter: this, // This is needed because when I write "this" in the functions it shows this object instead of the instance of a Proton3DInterpreter
		setEmissiveColor(color, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).emissiveColor = new BABYLON.Color3.FromHexString(color);

		},
		getEmissiveColor(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).emissiveColor.toHexString();

		},
		setWireframe(value, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).wireframe = value;

		},
		getWireframe(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).wireframe;

		},
		setEmissive(value, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).emissiveIntensity = value;

		},
		getEmissive(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).emissiveIntensity;

		},
		setColor(hexString, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).albedoColor = new BABYLON.Color3.FromHexString(hexString);

		},
		getColor(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).albedoColor.toHexString();

		},
		setRoughness(value, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).roughness = value;

		},
		setMetalness(value, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).metallic = value;

		},
		getRoughness(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).roughness;

		},
		getMetalness(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).metallic;

		},
		setOpacity(value, P3DMaterial) {

			this.interpreter.objectList.getMaterial(P3DMaterial).forceAlphaTest = true;
			this.interpreter.objectList.getMaterial(P3DMaterial).alpha = value;

		},
		getOpacity(P3DMaterial) {

			return this.interpreter.objectList.getMaterial(P3DMaterial).alpha;

		}
	}

	// Listens for key events
	onKeyDown(callback) {

		window.addEventListener("keydown", function (event) {

			// Why the heck event.keyCode is crossed out on VSCodium/Code I don't know.
			if (event.keyCode == 27) document.exitPointerLock();
			if (event.keyCode == 32) event.preventDefault();
			callback(event.keyCode);

		});

	}

	onKeyUp(callback) {

		window.addEventListener("keyup", function (e) {

			e.preventDefault();
			callback(e.keyCode);

		});

	}

	// Handles events for when the mouse is moved
	onMouseMove(callback) {

		window.addEventListener("mousemove", callback);

	}

	// Creates a crosshair in HTML
	crosshair() {

		var crosshairElement = document.createElement("div");
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
			height: 3px;
			width: 3px;
			background: rgba( 255, 255, 255, 0.25 );
			backdrop-filter: invert( 1 );
		`;
		document.body.appendChild(crosshairElement);
		return crosshairElement;

	}

	// Some nonessential variables
	audio = Audio
	storage = localStorage

};