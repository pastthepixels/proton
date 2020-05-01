var docs_data = {
	objects: [
		{
			name: "Proton3DObject (universal)",
			description: "An object in Proton3D. It can be an imported object, a light, camera, or mesh.",
			use: "new Proton3DObject( { type: (string; ['cube', 'sphere', 'cylinder' ... ]) } )",
			
			properties: [
				{
					name: "castShadow",
					type: "boolean",
					description: "Same as three.js' castShadow property."
				},
				{
					name: "receiveShadow",
					type: "boolean",
					description: "Same as three.js' receiveShadow property."
				},
				{
					name: "position",
					type: "Vector3 (three.js)",
					description: "Gets the object's position. Setting this position may not affect the object's position. Use setPosition() instead."
				},
				{
					name: "rotation",
					type: "Vector3 (three.js)",
					description: "Gets the object's rotation. Setting this position may not affect the object's rotation. Use setRotation() instead."
				},
				{
					name: "pickupDistance",
					type: "float",
					description: "Gets the minimum distance required before a player can press a key to interact with the object. However, the object must have 'interacting' enabled with the function setPickup() before a player can interact with the object."
				},
				{
					name: "onNear",
					type: "function",
					description: "A function to be called when a player is within a range set by the object's pickupDistance property. This does not need the object's 'interacting' ability to be enabled."
				},
				{
					name: "onUse",
					type: "function",
					description: "A function to be called when a player interacts with an object. When calling setPickup(), this can be set to be the only code that runs when a player interacts with an object. This needs the object's 'interacting' ability to be enabled with setPickup()."
				},
				{
					name: "mass",
					type: "float",
					description: "Gets the object's mass."
				}
			],
			functions: [
				{
					name: "playAudio( src (url), listener (three.js AudioListener) )",
					description: "Plays audio. You need a three.js AudioListener to do this. It is that simple."
				},
				{
					name: "makeInvisible()",
					description: "Makes the object completely invisible."
				},
				{
					name: "makePlayer( { type: 'firstperson' or 'thirdperson', head: Vector3 (the position of the player's head, relative to its position), invisible: boolean, gun: Proton3DObject, gunRotation: THREE.Vector3 (measurements are in radians), movementSpeed: float, jumpHeight: float } )",
					description: "Treats the object as a player, and initializes it as such."
				},
				{
					name: "applyImpulse( force (Vector3), offset (three.js Vector3) )",
					description: "Physijs' applyImpulse, if you have the default Proton3DInterpreter."
				},
				{
					name: "delete()",
					description: "Removes the object from any other parent object or its scene."
				},
				{
					name: "getMass()",
					description: "Gets an object's mass."
				},
				{
					name: "setMass( value (float) )",
					description: "Sets an object's mass."
				},
				{
					name: "setOnUse( useFunction (function) )",
					description: "Sets the function to be called when the object is interacted with."
				},
				{
					name: "getOnUse()",
					description: "Gets the function to be called when the player interacts with the object."
				},
				{
					name: "getOnNear()",
					description: "Gets the function to be called when the player is within the object's range set by its property pickupDistance."
				},
				{
					name: "getPickupDistance()",
					description: "Gets the distance required for a player to be from the object before a player can interact with it. See the description of the property pickupDistance for more info."
				},
				{
					name: "getPickup()",
					description: "Returns an object's ability to be interacted with, and whether it should skip 'picking up' code."
				},
				{
					name: "makeListeningObject( THREEListener (three.js AudioListener) )",
					description: "Puts an AudioListener in the object."
				},
				{
					name: "setLinearVelocity( x (float), y (float), z (float) )",
					description: "Sets the linear velocity of an object."
				},
				{
					name: "setAngularVelocity( x (float), y (float), z (float) )",
					description: "Sets the angular velocity of an object."
				},
				{
					name: "addLinearVelocity( x (float), y (float), z (float) )",
					description: "Adds a vector to the linear velocity of an object."
				},
				{
					name: "addAngularVelocity( x (float), y (float), z (float) )",
					description: "Adds a vector to the angular velocity of an object."
				},
				{
					name: "setLinearFactor( x (float), y (float), z (float) )",
					description: "Sets the linear dampening of an object. With the default Proton3DInterpreter, see Physijs' docs for more info."
				},
				{
					name: "setAngularFactor( x (float), y (float), z (float) )",
					description: "Sets the angular dampening of an object. With the default Proton3DInterpreter, see Physijs' docs for more info."
				},
				{
					name: "addEventListener( name (string), callback (function) )",
					description: "With the default Proton3DInterpreter, this function adds an event listener to the three.js object corresponding to the Proton3D object."
				},
				{
					name: "removeEventListener( name (string), callback (function) )",
					description: "With the default Proton3DInterpreter, this function removes an event listener to the three.js object corresponding to the Proton3D object."
				},
				{
					name: "setRotation( x (float), y (float), z (float) )",
					description: "Sets the object's rotation. If it has physics, make sure to call applyLocRotChange()."
				},
				{
					name: "setPosition( x (float), y (float), z (float) )",
					description: "Sets the object's position. If it has physics, make sure to call applyLocRotChange()."
				},
				{
					name: "animatePosition( x (float), y (float), z (float), time (float), step (function) )",
					description: "Sets the object's position through an easing animation."
				},
				{
					name: "getRotation()",
					description: "Gets the object's rotation in a three.js Euler. Changing this will not affect the object's rotation."
				},
				{
					name: "getPosition()",
					description: "Gets the object's position in a three.js Vector3. Changing this will not affect the object's position."
				},
				{
					name: "applyLocRotChange()",
					description: "A function to be called after the object has had its position or rotation changed."
				},
				{
					name: "getLinearVelocity()",
					description: "Gets the object's linear velocity in the three.js Vector3."
				},
				{
					name: "getAngularVelocity()",
					description: "Gets the object's angular velocity in the three.js Vector3."
				},
				{
					name: "isMesh()",
					description: "Returns true if the object is a mesh."
				},
				{
					name: "getWorldDirection()",
					description: "Returns a three.js Vector3 in the direction that the object is facing."
				},
				{
					name: "lookAt( x (float), y (float), z (float) )",
					description: "Makes an object point toward a three.js Vector3 created by the function's parameters."
				},
				{
					name: "getCollidingObjects()",
					description: "Gets an array of objects that an object is colliding with."
				},
				{
					name: "add( object (Proton3DObject) )",
					description: "Adds another object as a child object."
				},
				{
					name: "remove( object (Proton3DObject) )",
					description: "Removes a child object."
				}
			],
		},
		{
			name: "Proton3DObject (mesh)",
			description: "An object in Proton3D. It can either be a cube, sphere, or cylinder.",
			use: "new Proton3DObject( { type: (string; ['cube', 'sphere', 'cylinder']) } )",
			
			properties: [
				{
					name: "width (cube)",
					type: "float",
					description: "Gets the cube's width."
				},
				{
					name: "height (cube)",
					type: "float",
					description: "Gets the cube's height."
				},
				{
					name: "depth (cube)",
					type: "float",
					description: "Gets the cube's depth."
				},
				{
					name: "radius (sphere)",
					type: "float",
					description: "Gets the sphere's radius."
				},
				{
					name: "radiusTop (cylinder)",
					type: "float",
					description: "Gets the cylinder's top radius."
				},
				{
					name: "height (cylinder)",
					type: "float",
					description: "Gets the cylinder's height."
				},
				{
					name: "radiusBottom (cylinder)",
					type: "float",
					description: "Gets the cylinder's bottom radius."
				}
			],
			functions: [
				"Proton3DObject (universal)"
			],
		},
		{
			name: "Proton3DObject (imported)",
			description: "An object in Proton3D. It can either be imported via a '.obj' file or a glTF file.",
			use: "ProtonJS.importObject( { type: ['gltf', 'obj'], objPath: url (obj files only), mtlPath: url (obj files only) }, gltfPath: url (gltf files only), onload: function, armature: boolean, objectType: ['box', 'sphere', 'cylinder', 'concave', 'convex'] (Physijs mesh types), mass: float, armature: boolean (whether or not an imported object is just armature; the object in question must be the last child of the armature) } )",
			properties: [
				"Proton3DObject (universal)"
			],
			functions: [
				"Proton3DObject (universal)"
			],
		},
		{
			name: "Proton3DObject (camera)",
			description: "A camera in Proton3D. It can either be an orthographic or perspective camera.",
			use: "new Proton3DObject( { type: (string; ['orthographiccamera', 'perspectivecamera' ]) } )",
			
			properties: [
				"Proton3DObject (universal)"
			],
			functions: [
				{
					name: "changeViewingWidth( value (float) ) (orthographic)",
					description: "Changes the width of the camera."
				},
				{
					name: "changeViewingHeight( value (float) ) (orthographic)",
					description: "Changes the height of the camera."
				},
				{
					name: "changeNear( value (float) )",
					description: "Changes the 'near' value of the camera."
				},
				{
					name: "changeFar( value (float) )",
					description: "Changes the 'far' value of the camera."
				},
				{
					name: "changeAspectRatio( value (float) )",
					description: "Changes the aspect ratio of the camera."
				},
				{
					name: "changeFOV( value (float) ) (perspective)",
					description: "Changes the field of view of the camera."
				},
				{
					name: "setZoom( value (float) ) (perspective)",
					description: "Changes the 'zoom' of the camera."
				},
				{
					name: "getZoom() (perspective)",
					description: "Gets the 'zoom' of the camera."
				}
			],
		},
		{
			name: "Proton3DObject (light)",
			description: "An light in Proton3D. It can be a spotlight, a directional light, or a point light.",
			use: "new Proton3DObject( { type: ['spotlight', 'directionallight', 'pointlight' ] } )",
			
			properties: [
				{
					name: "radiusBottom (cylinder)",
					type: "float",
					description: "Gets the cylinder's bottom radius."
				}
			],
			functions: [
				{
					name: "changeColor( hexString (string) )",
					description: "Changes the color of the light with a CSS color string."
				},
				{
					name: "changeAngle( value (float) ) (spotlight)",
					description: "Changes the spot light's angle."
				},
				{
					name: "changeIntensity( value (float) ) ",
					description: "Changes the light's intensity."
				},
				{
					name: "setTargetPosition( position (vector3) ) (spotlight)",
					description: "Changes the position of the spotlight's target."
				}
			],
		},
		{
			name: "Proton3DScene",
			description: "An scene in Proton3D. Since Proton.JS can handle at most one scene, a scene is pre-made when all scripts are loaded. It can be accessed via ProtonJS.scene and is not pre-initialized.",
			use: "new Proton3DScene()",
			
			properties: [
				{
					name: "mappedKeys",
					type: "object",
					description: "An array containing actions and their matching key codes. It can be edited."
				},
				{
					name: "mappedKeys",
					type: "object",
					description: "An array containing actions and their matching key codes. It can be edited."
				},
				{
					name: "extraFunctions",
					type: "array",
					description: "An array containing all functions to be called repeatedly when the computer is idle. It can be edited."
				},
				{
					name: "priorityExtraFunctions",
					type: "array",
					description: "An array containing all functions to be called repeatedly when each frame is called. It can be edited."
				},
				{
					name: "element",
					type: "htmlelement",
					description: "The element wrapper in the DOM containing the scene's canvas."
				},
				{
					name: "audio",
					type: "htmlelement",
					description: "An audio element."
				},
				{
					name: "soundtrack",
					type: "htmlelement",
					description: "Another audio element."
				},
				{
					name: "objectList",
					type: "array",
					description: "An array of the scene's objects."
				},
				{
					name: "gun",
					type: "proton3dobject",
					description: "The player's weapon."
				},
				{
					name: "crosshair",
					type: "object",
					description: "Created from setCameraControls() and ProtonJS.crosshair() (optional). Its position value is a three.js Vector3."
				}
			],
			functions: [
				{
					name: "init( { antialias: boolean, shaderQuality: [ 'low', 'medium', 'high' ], pbr: boolean, gravity: float, bloom: boolean, hdr: boolean, dynamicToneMapping: boolean, pixelatedScene: boolean, pbrTexture: string (url), livePBR: boolean, dynamicResolution: boolean, pcfSoftShadows: boolean, anisotropicFiltering: boolean (requires pbr to be true), shadowLOD: float (max shadow map width/height) } )",
					description: "Perhaps the most important Proton3D function. It initializes a scene."
				},
				{
					name: "getObjectList()",
					description: "Gets the scene's Proton3D objects."
				},
				{
					name: "add( object (Proton3DObject) )",
					description: "Adds an object."
				},
				{
					name: "remove( object (Proton3DObject) )",
					description: "Removes an object."
				},
				{
					name: "dynamicResize()",
					description: "When called, the scene will automatically resize to the browser window's size."
				},
				{
					name: "setKeyControls( obj (Proton3DObject), speed (float), jumpHeight (float), extras ( { gunAnimation: boolean } ) )",
					description: "Corresponds 'yer keys to the player's movement."
				},
				{
					name: "makeDoor( door (Proton3DObject), width (float), faceInwards (boolean) )",
					description: "Makes an object a door that opens when interacted with."
				},
				{
					name: "setCameraControls( { xSensitivity: float, ySensitivity: float,  distance: three.js Vector3, invisibleParent: boolean, cameraParent: Proton3DObject, gun: Proton3DObject } )",
					description: "Adds a camera to the player."
				},
				{
					name: "pickUpObject( object (Proton3DObject) )",
					description: "Picks up any object, no matter what."
				},
				{
					name: "setPickingUpControls()",
					description: "Sets controls for object interactions. It is automatically called by setCameraControls()."
				}
			],
		},
		{
			name: "GameCode",
			description: "All the code in your game. Calling [GameCode].autoStart() will start your code once all scripts have loaded. If you don't use GameCode to store all of your code with the default Proton3DInterpreter, you'll get an error for a missing three.js variable.",
			use: "new GameCode( code (function) )",
			
			properties: [
				{
					name: "code",
					type: "function",
					description: "Your code."
				},
			],
			functions: [
				{
					name: "run()",
					description: "Runs your code."
				},
				{
					name: "autoStart()",
					description: "Runs your code once all scripts have loaded. It will periodically update and create the property loadingPercentage."
				}
			]
		},
		{
			name: "RepeatingAudio",
			description: "Audio that repeats as long as requried and can have beginning and end parts. The class RepeatingPositionalAudio is just like this, except it uses three.js PositionalAudio. It requires an extra argument for a THREE.AudioListener.",
			use: "new RepeatingAudio( beginning (url), middle (url, looping part) )",
			
			properties: [
				{
					name: "audio",
					type: "audioelement",
					description: "An HTML element that'll be used by the object."
				},
				{
					name: "repeatingTimes",
					type: "float",
					description: "The max number of times the middle section of the audio will repeat."
				},
				{
					name: "loops",
					type: "float",
					description: "The current number of loops the audio has undergone."
				},
				{
					name: "beginning",
					type: "url",
					description: "The first section of the audio."
				},
				{
					name: "middle",
					type: "url",
					description: "The middle section of the audio."
				},
				{
					name: "end",
					type: "url",
					description: "The last section of the audio (optional)."
				},
			],
			functions: [
				{
					name: "play",
					description: "Plays the audio."
				},
				{
					name: "pause",
					description: "Pauses the audio."
				},
				{
					name: "reset",
					description: "Pauses and resets the audio."
				},
			]
		}
	]
}