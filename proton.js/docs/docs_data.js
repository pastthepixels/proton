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
					description: "Gets the object's position. Setting this position may not affect an object's position. Use setPosition() instead."
				},
				{
					name: "rotation",
					type: "Vector3 (three.js)",
					description: "Gets the object's rotation. Setting this position may not affect an object's rotation. Use setRotation() instead."
				},
				{
					name: "pickupDistance",
					type: "float",
					description: "Gets the minimum distance required before a player can press a key to pick up the object. However, the object must have 'interacting' enabled with the function setPickup() before a player can use or pick up the object."
				},
				{
					name: "onNear",
					type: "function",
					description: "A function to be called when a player is within a range set by the object's pickupDistance property. This does not need the objects's 'interacting' ability to be enabled."
				},
				{
					name: "onUse",
					type: "function",
					description: "A function to be called when a player picks up an object. When calling setPickup(), this can be set to be the only code that runs when a player interacts with an object. This needs the objects's 'picking up' ability to be enabled with setPickup()."
				},
				{
					name: "mass",
					type: "float",
					description: "Gets the object's mass."
				},
			],
			functions: [
				{
					name: "playAudio( src (url), listener (three.js AudioListener) )",
					description: "Plays audio. You need a three.js AudioListener to do this. It is that simple."
				},
				{
					name: "applyImpulse( force (float), offset (three.js Vector3) )",
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
					description: "Gets the function to be called when the player interacts with the object"
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
					description: "Returns an object's ability to be interacted with, and wether it should skip 'picking up' code."
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
					name: "setLinearFactor( x (float), y (float), z (float) )",
					description: "Sets the linear dampening of an object. With the default Proton3DInterpreter, see Physijs' docs for more info."
				},
				{
					name: "setAngularFactor( x (float), y (float), z (float) )",
					description: "Sets the angular dampening of an object. With the default Proton3DInterpreter, see Physijs' docs for more info."
				},
				{
					name: "setAngularFactor( x (float), y (float), z (float) )",
					description: "Sets the angular dampening of an object. With the default Proton3DInterpreter, see Physijs' docs for more info."
				},
				{
					name: "addEventListener( name (string), callback (function) )",
					description: "With the default Proton3DInterpreter, this function adds an event listener to the three.js object corrisponding to the Proton3D object."
				},
				{
					name: "removeEventListener( name (string), callback (function) )",
					description: "With the default Proton3DInterpreter, this function removes an event listener to the three.js object corrisponding to the Proton3D object."
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
					description: "Gets the object's linear velocity in the three.js Vector3"
				},
				{
					name: "getAngularVelocity()",
					description: "Gets the object's angular velocity in the three.js Vector3"
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
				"Proton3DObject (universal)"
			],
			functions: [
				/*
				{
					name: "getShadowOptions( ... (?), ... (?) )",
					description: "..."
				}
				*/
			],
		},
		{
			name: "Proton3DObject (imported)",
			description: "An object in Proton3D. It can either be imported via a '.obj' file or a glTF file.",
			use: "protonjs.importObject( ... )",
			
			properties: [
				"Proton3DObject (universal)"
			],
			functions: [
				/*
				{
					name: "getShadowOptions( ... (?), ... (?) )",
					description: "..."
				}
				*/
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
				/*
				{
					name: "getShadowOptions( ... (?), ... (?) )",
					description: "..."
				}
				*/
			],
		},
		{
			name: "Proton3DObject (light)",
			description: "An light in Proton3D. It can be a point light or a directional light.",
			use: "new Proton3DObject( { type: (string; ['pointlight', 'directionallight' ]) } )",
			
			properties: [
				"Proton3DObject (universal)"
			],
			functions: [
				/*
				{
					name: "getShadowOptions( ... (?), ... (?) )",
					description: "..."
				}
				*/
			],
		}
	]
}