"use strict";
/*
                                                                                                                                                    ///
////////////////        ///////////                //////////        ////                    //////////       ////   ////////                      ///        /////////////
   ///       ////         //////    ///////        //       //        ///                    //       //       ///////      ////                            //
   ///        ////        ///           //       ///         ///      ///                  ///         ///       ///             ///              /////     ///
   ///         ////       ///            /       ///         ///      ///                  ///         ///       ///             ///               ////    ///
   ///        ////        ///                    ///         ///      ////////             ///         ///       ///             ///                ///      ///
   /////////////          ///                    ///         ///      ///                  ///         ///       ///             ///                ///      ///////////
   ///                    ///                    ///         ///      ///                  ///         ///       ///             ///                ///                ////
   ///                    ///                    ///         ///      ///         //       ///         ///       ///             ///                ///                   //
  ////                   ////                    //         //        ////      ////         //       //        ////             ///     ////       ///                 ///
 /////                  /////                      //////////           ///////////          //////////        //////           ////     ////       ///      /////////////
                                                                                                                                                    ///
                                                                                                                                                    ///
                                                                                                                                                    ///
                                                                                                                                                    //
                                                                                                                                        ////      ///
																																	        ////////
	[proton.js beta 1.0]
	[DISCLAIMER -- I'M STILL LOOKING FOR BUGS. IF YOU SEE ONE, JUST TELL ME. I CURRENTLY HAVE NO OPEN DOCUMENT TO STORE THEM ON.]
	[third party software]
		>> three js ( and extra related software, found under its branches ) @ mrdoob/threejs
		>> jquery @ jquery.com
		>> inset.js @ patlillis/inset.js
	[locations of sections]
	To get to locations in notepad++, press Control+F
	and type
	"loc:[location number]"
	Locations of sections:
		add extra scripts | 1
		variables | 2
		constants | 3
		render extra features | 4
		draw and render objects | 5
		extra functions | 6
		prepare all pausing | 7
		misc ( includes some content from third parties.
			  see for details and credit ) | 8
		proton3d | 9 - 10
	[readme]
	Welcome!
		proton.js aims to help developers make
	games with great graphics and preformance, in
	a smaller amount of time than it usually takes
	to make them. As an added bonus, it also is
	also designed to be easy to use. Because of
	that, your code can be neatly ordered and easy
	to read, even without comments.
		Different canvases are organised as scenes.
	In order to create a scene, call the function
	"new protonjs.scene()". To initialise it, call
	the function ( from the scene )
	"[scene].init( [width], [height], [parent ( HTMLElement )] )".
	Different scenes are actually HTML elements.
	To view them from JavaScript, type
	"[scene].element". Scenes can also have cameras.
	To create a new camera, type
	"new protonjs.camera". And to append one to any
	scene, type "[scene].camera = [camera]". Every
	object in proton.js, is, well, an object. A
	camera looks like this:
	{
		x: 0,
		y: 0,
		z: 1
	}
    You can change the x, y, or z to be whatever
	you'd like. However, in order for the x and y
	of the camera to work, you need to have a canvas
	bigger than the scene. The camera's height and
	width are actually the scene's height and width.
	You can change those by changing the style of the
	scene element.
		Things in the scene are called objects.
	A scene's object list looks like this:
	[
		{x: 0, y: 0, height: 20, width: 20},
		{x: 0, y: 0, height: 40, width: 40}
	]
	and you can get to it by typing this:
	"[scene].objects". Each object's z-index is
	determined by it's place in the array. There
	are many ways to create an object. The recommended
	way to do so is by typing this:
	"new protonjs.square( [extras] )". Of course, there
	are other functions like it, that also have different
	parameters. Objects also have parameters. For examplem
	here are some:
	{
		x: 20 [the x of the object],
		y: 20 [the y of the object],
		height: 20 [the height of the object],
		width: 20 [the width of the object],
		color: "black" [the color of the object, if it is being filled. Can either be rgb, hex, or a value name.]
		alpha: 0.6 [the transparency of the object, out of 1.0]
	}
	To push an object, just type
	"[scene].objects.push( [object] )".
	...and that's the basics. Good luck using proton.js to make great games!
	//Note, as of August 7, 2019:
	proton3d is similar to protonjs using canvas2d,
	except it's structured a little differently and
	it uses three.js. Please refer to the proton3d
	examples, as there's no documentation ( yet ).
	In order for proton3d to work, please launch
	chromium with the flag --disable-web-security.
	You can launch the dedicated batch file on
	Windows. Make sure not to use any other
	site on this edition of Chromium, as other
	websites could have negative effects on your
	computer.
*/
//\\//\\//\\//\\//\\//\\// //
//\\ add extra scripts \// //loc:1
//\\//\\//\\//\\//\\//\\// //
//do not forget to use the meta viewport tag
document.writeln( '<meta name="viewport" content="width = device-width, initial-scale = 1.0">' );
//jquery: required
document.writeln( '<script src="https://code.jquery.com/jquery-3.4.1.js"></script>' );
document.writeln( '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>' );
//inset shadows for canvas2d
document.writeln( '<script src="https://unpkg.com/inset.js@1.0.2/dist/inset.browser.js"></script>' );
//roboto. all of it.
document.writeln( '<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed|Roboto+Mono|Roboto+Slab" rel="stylesheet">' );
//proton3d: threejs
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/build/three.js"></script>' );
//proton3d models: threejs
document.writeln( '<script src="https://unpkg.com/three@0.99.0/examples/js/loaders/MTLLoader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.99.0/examples/js/loaders/LoaderSupport.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.105.0/examples/js/loaders/OBJLoader2.js"></script>' );
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/js/loaders/GLTFLoader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.105.0/examples/js/utils/BufferGeometryUtils.js"></script>' );
//threejs effects
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/postprocessing/EffectComposer.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/postprocessing/ShaderPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/postprocessing/RenderPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/postprocessing/MaskPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/math/SimplexNoise.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/shaders/CopyShader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/postprocessing/SSAOPass.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/shaders/SSAOShader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.99.0/examples/js/shaders/FXAAShader.js"></script>' );
document.writeln( '<script src="https://unpkg.com/three@0.99.0/examples/js/modifiers/SubdivisionModifier.js"></script>' );
//proton3d physics: physijs | ammo.js
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physi.js"></script>' );
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/kripken/ammo.js@master/builds/ammo.js"></script>' );
//proton3d controls: threejs
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/PointerLockControls.js"></script>' )
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/OrbitControls.js"></script>' )
document.writeln( '<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/controls/TrackballControls.js"></script>' )
//three.js' sky shader, by https://github.com/zz85
document.writeln( '<script src="https://unpkg.com/three@0.106.0/examples/js/objects/Sky.js"></script>' )
//\\//\\//\\//\\// //
//\\ variables \// // loc:2
//\\//\\//\\//\\// //
window.scenes = 0;
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
	" * ": [
		"image-rendering: -moz-crisp-edges",
		"image-rendering: -webkit-crisp-edges",
		"image-rendering: pixelated"
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
	"button": [
		"border: 3px solid black",
		"padding: 15px",
		"background: rgba(  255, 255, 255, 0.5  )",
		"font-family: Roboto Mono",
		"transition: all 0.3s ease"
	],
	"button:hover": [
		"background: black",
		"color: white"
	]
}
const protonjs = {
	version: 1.0,
	display_version: "beta 1.0",
	paused: false,
	scene: function ( renderer = "proton2d" ) {
		scenes++;
		switch ( renderer ) {

			case "proton3d":

				return new Proton3DScene();
				break;

			default:

				return jQuery.extend( true, {}, Proton2DScene );

		}
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
	setKeyDown: function ( scene ) {
		window.addEventListener( "keydown", function ( e ) {
			scene.onKeyDown( e, scene )
		} );
	},
	setKeyUp: function ( scene ) {
		window.addEventListener( "keyup", function ( e ) {
			scene.onKeyUp( e, scene )
		} );
	},
	create2DUpdate: function ( scene = {} ) {
		return scene.update = function () {
			if ( protonjs.paused ) {

				requestAnimationFrame( scene.update );
				return;

			}
			scene.render();
			requestAnimationFrame( scene.update );
		}
	},
	watermark: function ( parent = document.body ) {
		parent.appendChild( Element( "watermark", "proton.js " + this.display_version ) );
	},
	camera: function ( extras = {} ) {
		if ( extras.parent ) {

			this.parent = extras.parent;

		}
		this.x = 0;
		this.y = 0;
		this.z = 1;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	player: function ( extras = {} ) {
		this.x = 20;
		this.y = 20;
		this.width = 50;
		this.height = 50;
		this.health = 100;
		this.maxHealth = 100;
		this.speed = 5;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	square: function ( extras = {} ) {
		this.x = 20;
		this.y = 20;
		this.width = 50;
		this.height = 50;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	line: function ( extras = {} ) {
		this.stroke = true;
		this.line = extras.points;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	polygon: function ( extras = {} ) {
		this.y = 20;
		this.x = 20;
		this.poly = extras.points;
		this.stroke = true;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	sun: function ( extras = {} ) {
		this.x = 20;
		this.y = 20;
		this.width = 90;
		this.castShadow = true;
		this.glare = true;
		this.height = 10;
		this.globalCompositeOperation = "lighter";
		this.radialGradient = {
			innerRadius: 0.005,
			stops: [
				[0.07, "#FDFEFD"],
				[0.49, "#FFFF9700"]
			]
		};
		this.circle = true;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	particle: function ( extras = {} ) {
		this.x = 20;
		this.y = 20;
		this.width = 1;
		this.height = 1;
		for ( var i in extras ) {
			this[i] = extras[i];
		}
	},
	text: function ( extras = {} ) {
		this.x = 20;
		this.y = 20;
		this.width = 50;
		this.height = 50;
		this.dynamicTextHeight = true;
		this.text = ( extras.text || "" );
		this.fontFamily = "Roboto Mono";
		this.fontSize = 20;
		this.textColor = "white";
		for ( var i in extras ) {
			this[i] = extras[i];
		}
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
	setMovingInterval: function ( a, b ) {
		this.interval = setInterval( function () {
			a( this );
		}, b );
		this.code = a;
	},
	setCreationInterval: function ( a, b ) {
		this.interval = setInterval( function () {
			a( this );
		}, b );
		this.code = a;
	},
	particleFromObject: function ( parent, extras = {} ) {
		var numbers;
		if ( typeof extras.scene === "string" ) {

			extras.scene = window[extras.scene];

		}
		var interval = setInterval( function () {
			numbers = [random( 1, 20 ), -random( 1, 20 )];
			var posincreaseY = numbers[random( 0, numbers.length )],
				posincreaseX = numbers[random( 0, numbers.length )];
			if ( posincreaseX === posincreaseY ) {

				posincreaseX = numbers[random( 0, numbers.length )]

			}
			var particle = new protonjs.particle( extras );
			particle.x = ( parent.x + ( parent.width / 2 ) );
			particle.y = ( parent.y + ( parent.height / 2 ) );
			protonjs.setMovingInterval( function ( interval ) {
				if ( particle.y > extras.scene.canvas.height || particle.y < 0 || particle.x < 0 || particle.x > extras.scene.canvas.width ) {

					clearInterval( interval );
					extras.scene.remove( particle );

				}
				particle.y += posincreaseY;
				particle.x += posincreaseX;
			}, 20 );
			extras.scene.objects.push( particle );
		}, extras.speed || 10 );
		return interval
	},
	pause: function () {
		this.paused = true;
		if ( window.onpause ) {

			window.onpause();

		}
	},
	resume: function () {
		this.paused = false;
		if ( window.onresume ) {

			window.onresume();

		}
	},
	screenShake: function ( scene, intensity, duration = 1000, callback = null ) {
		var shakeInt = setInterval( function () {
			scene.element.style.transform = "scale(" + ( ( intensity / 100 ) + 1 ) + "," + ( ( intensity / 100 ) + 1 ) + ") translate(" + betterRandom( -intensity, intensity ) + "px, " + betterRandom( -intensity, intensity ) + "px)";
		}, 10 );
		window.shake = {
			interval: shakeInt,
			scene: scene,
			callback: callback
		}
		if ( duration > 0 ) {
			
			setTimeout( function () {
				clearInterval( shakeInt );
				scene.element.style.transform = null;
				if ( callback ) {
					
					callback()
					
				}
			}, duration )
			
		}
		
	},
	clearScreenShake: function () {
		if ( window.shake ) {
		
			clearInterval( window.shake.interval );
			window.shake.scene.element.style.transform = null;
			if ( window.shake.callback ) {
				
				window.shake.callback()
				
			}
			window.shake = null;
		
		}
	},
	
	//picklescript
	
	pickleScriptKeywords: {
		"use": function ( parameter, variables ) {
			return parameter
		},
		"thirdperson": function () {
			
		},
		"set": function ( parameter, variables, commands, i ) {
			switch( parameter ) {
				
				case "position":
					if ( protonjs.picklePlayer ) {
						
						protonjs.picklePlayer.setPosition( commands[ i + 2 ][ 0 ], commands[ i + 2 ][ 1 ], commands[ i + 2 ][ 2 ] )
						
					}
					break;
					
				default:
					if ( commands.indexOf( "in" ) > -1 ) {
						
						variables[ commands[ 3 ] ][ commands[ 1 ] ] = commands[ 5 ]
						
					} else {
						
						variables[ commands[ 1 ] ] = commands[ 3 ]
						
					}
				
			}
		},
		"log": function ( parameter, variables, commands ) {
			console.log(parameter, commands);
			if ( variables[ parameter ] != null ) {
				
				console.log( variables[ parameter ] )
				return
				
			} else {
				
				console.log( parameter )
				
			}
		},
		"pos": function ( parameter, variables, commands, i ) {
			variables[ commands[ i - 2 ] ].setPosition( commands[ i ][0], commands[ i ][1], commands[ i ][2] )
		},
		"rot": function ( parameter, variables, commands, i ) {
			variables[ commands[ i - 3 ] ].setRotation( commands[ i - 1 ][0], commands[ i - 1 ][1], commands[ i - 1 ][2] )
		},
		"import": function( parameter, variables ) {
			if ( parameter.includes( ".glb" ) || parameter.includes( ".gltf" ) ) {
				
				return protonjs.importObject({
					fileType: "gltf",
					objects: protonjs.pickleScene.objects,
					gltfPath: parameter,
					accountForExtraProperties: true,
					mass: 1
				})
				
			} else if (  parameter.includes( ".obj" ) ){
				
				return protonjs.importObject({
					fileType: "obj",
					objects: protonjs.pickleScene.objects,
					objPath: parameter,
					mtlPath: parameter.replace( ".obj", ".mtl" ),
					mass: 1
				})
				
			} else if ( protonjs.pickleScriptObjects[ parameter ] != null ) {
				
				return protonjs.pickleScriptObjects[ parameter ]()
				
			}
		},
		"float": function ( parameter ) {
			
		},
		"int": function () {
			
		},
		"string": function () {
			
		},
		"array": function () {
			
		},
		"start": function () {
			
		}
	},
	pickleScriptObjects: {
		"floor": function () {
			var cube = new Proton3DObject({
				type: "cube",
				x: 0,
				y: -3,
				z: 0,
				height: 0.1,
				width: 1000,
				depth: 1000,
				materialType: "phong",
				receiveShadow: true,
				mass: 0,
				friction: 1,
				restitution: 0,
				useBufferGeometry: true,
				bumpMapRepeat: 400,
				roughnessMapRepeat: 400,
				bumpMap: "../models/textures/grass.png",
				roughnessMap: "../models/textures/grass.png",
				shininess: 0.01,
				color: "#000801"
			})
			protonjs.pickleScene.add( cube )
			return cube
		}
	},
	importPickleScript: function ( fileLocation ) {
		var request = new XMLHttpRequest();
		//step one: read the file
		request.open("GET", fileLocation, false);
		request.send();
		//step two: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
		var commands = request.responseText.split( "\n" );
		var variables = {};
		commands.forEach( function ( command, i ) {
			
			var isBrackets = false,
				isComment = false,
				bracketString = "",
				toRemove = [];
			commands[ i ] = command.split( " " );
			commands[ i ].forEach( function ( object, ii ) {
				
				switch ( object ) {
					
					case "array":
						toRemove.push( object );
						isBrackets = true;
						return
					
				}
				if ( isBrackets || object.includes( "[" ) ) {
					bracketString += object
					if ( object.includes( "]" ) ) {
						
						commands[ i ][ ii ] = JSON.parse( bracketString );
						toRemove.forEach( function ( remove ) {
							removeFromArray( commands[ i ], remove );
						} )
						bracketString = "";
						toRemove = [];
						isBrackets = false;
						return;
						
					} else {
						
						toRemove.push( object );
					
					}
					
				}
				
			} )
			commands[ i ].start = function () {
				
				commands[ i ].forEach( function ( keyword, ii ) {
					
					var variable;
					if ( keyword.includes( "//" ) || isComment ) {
						
						isComment = true;
						return;
						
					}
					if ( protonjs.pickleScriptKeywords[ keyword ] != null ) {
						
						variable = protonjs.pickleScriptKeywords[ keyword ]( commands[ i ][ ii + 1 ], variables, commands[ i ], i )
						if ( commands[ i ][ ii + 2 ] === "as" ) {
						
							variables[ commands[ i ][ ii + 3 ].trim() ] = variable;
							
						}
					}
					
				} )
				
			}
			if( command.includes( "start" ) ) {
				
				commands.forEach( function ( startingcommand ) {
					
					if ( startingcommand.start ) {
						
						startingcommand.start()
						
					}
					
				} )
				
			}
			
		} )
		return commands;
	}
}
const Proton2DScene = {
	keys: {},
	mappedKeys: {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		pause: 27
	},
	objects: [],
	remove: function ( object ) {
		( this.objects.indexOf( object ) > -1 )? this.objects.splice( this.objects.indexOf( object ), 1 ) : false
	},
	setTransition: function ( string, time ) {
		this.canvas.style.webkitTransition = "all " + time + "s " + string
	},
	setFilter: function ( string, value ) {
		this.canvas.style.webkitFilter = string + "(  " + value + "  )"
	},
	resetFilter: function ( string, value ) {
		this.canvas.style.webkitFilter = null;
	},
	init: function ( extras = {} ) {
		//create the scene's elements (  in the DOM  )
		this.element = document.createElement( "scene" );
		this.offscreenCanvas = new OffscreenCanvas(
			extras.width || window.innerWidth,
			extras.height || window.innerHeight
		);
		this.canvas = document.createElement( "canvas" );
		this.canvas.width = this.offscreenCanvas.width;
		this.canvas.height = this.offscreenCanvas.height;
		this.audio = new Audio();
		//create the offscreen context
		this.offscreenContext = this.offscreenCanvas.getContext( "2d" );
		this.offscreenContext.imageSmoothingEnabled = false;
		this.offscreenContext.globalCompositeOperation = "source - over";
		//create the context
		this.context = this.canvas.getContext( "2d" );
		this.context.imageSmoothingEnabled = false;
		this.context.globalCompositeOperation = "source - over";
		this.element.appendChild( this.canvas );
		//ifs
		if ( extras.parent == undefined ) {

			document.body.appendChild( this.element );

		} else if ( extras.parent ) {

			extras.parent.appendChild( this.element );

		}
		//event listeners
		var scene = this;
		window.addEventListener( "click", function ( e ) {
			scene.onclick( e )
		} );
		window.addEventListener( "mousemove", function ( e ) {
			scene.onMouseMove( e );
			if ( window["mousedown"] ) {

				scene.onMouseDrag( e );

			}
		} );
		window.addEventListener( "mousedown", function ( e ) {
			window["mousedown"] = true;
		} );
		window.addEventListener( "mouseup", function ( e ) {
			if ( window["mousedown"] ) {

				scene.onMouseDragUp( e );

			}
			window["mousedown"] = false;
		} );
		//watching for variables
		this.extraBackgroundInfo = "";
		scene.watch( "background", function ( id, oldval, newval ) {
			this.canvas.style.background = this.extraBackgroundInfo + newval;
		} );
		//compile
		this.element.style.height = this.canvas.height + "px";
		this.element.style.width = this.canvas.width + "px";
		requestAnimationFrame( protonjs.create2DUpdate( this ) );
	},
	switchAudio: function ( audioSourceFile ) {
		if ( this.audio.crossfade ) {

			var audio = this.audio,
				volume = ( audio.volume || 1 );
			//fade the volume to 0
			$( this.audio ).animate( {
				volume: 0
			}, ( ( audio.fadeTime / 2 ) || 500 ), function () {
				audio.src = audioSourceFile;
				audio.play();
				//animate the volume to what it was before
				$( audio ).animate( {
					volume: volume
				}, ( ( audio.fadeTime / 2 ) || 500 ) );
			} );

		} else {

			this.audio.pause();
			this.audio.src = audioSourceFile;
			this.audio.play();

		}
	},
	dynamicResize: function ( extras = {} ) {
		var canvas = this.canvas,
			element = this.element,
			offscreenCanvas = this.offscreenCanvas;
		//resizes the scene
		element.style.height = ( extras.elementSize || "100%" );
		element.style.width = ( extras.elementSize || "100%" );
		//creates a faulty callback if there is none
		extras.callback = ( extras.callback || function () {} )
		//resizes the scene again when the screen size changes
		window.addEventListener( "resize", function () {
			switch ( extras.changeHeightWidth ) {

				case "height":
					offscreenCanvas.height = window.innerHeight;
					offscreenCanvas.height = window.innerHeight;
					break;

				case "width":
					canvas.width = window.innerWidth;
					offscreenCanvas.width = window.innerWidth;
					break;

				default:
					offscreenCanvas.height = window.innerHeight;
					canvas.height = window.innerHeight;
					canvas.width = window.innerWidth;
					offscreenCanvas.width = window.innerWidth;

			}
			extras.callback();
		} );
	},
	clear: function () {
		this.offscreenContext.clearRect( this.element.scrollLeft, this.element.scrollTop, this.element.offsetWidth, this.element.offsetHeight );
	},
	render: function () {
		var scene = this;
		this.clear();
		this.objects = this.objects.sort( sortMultiple( "castShadow", "changeBackground", "zIndex", "glare" ) );
		this.objects.forEach( function ( i ) {
			renderProtonExtras( i, scene.offscreenContext, scene, scene.objects, scene.offscreenContext );
			scene.renderEach2d( i, scene.offscreenContext, scene.objects, scene );
			if ( i.glare ) {

				renderEachGlare( i, scene.offscreenContext, scene, scene.objects );

			}
			if ( i.castShadow && i.changeBackground ) {

				scene.extraBackgroundInfo += "radial - gradient(  circle at " + ( i.x + ( i.width / 2 ) ) + "px " + ( i.y + ( i.height / 2 ) ) + "px, rgba(  255, 255, 255, 0.55  ) 5px, rgba(  255, 255, 255, 0  ) " + ( i.width * ( i.backgroundBrightness || 3 ) ) + "px  ), ";

			}
		} );
		this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		this.context.drawImage( this.offscreenCanvas, 0, 0 );
		this.updateCamera();
	},
	renderEach2d: function ( i, ctx, obj, scene, visCtx, extras = {} ) {
		//percentages
		if ( i.x_percent ) {

			i.x = ( i.x_percent / 100 ) * ( scene.canvas.width );
			if ( i.x_percent === 50 ) {
				i.x = ( window.innerWidth / 2 ) - ( i.width / 2 )
			}

		}
		if ( i.y_percent ) {

			i.y = ( i.y_percent / 100 ) * ( scene.canvas.height );
			if ( i.y_percent === 50 ) {
				i.y = ( window.innerHeight / 2 ) - ( i.height / 2 )
			}

		}
		if ( i.width_percent ) {

			i.width = ( i.width_percent / 100 ) * ( scene.canvas.width );

		}
		if ( i.height_percent ) {

			i.height = ( i.height_percent / 100 ) * ( scene.canvas.height );

		}
		//if a percentage cannot be correected, do this and then move on.
		if ( i.x > ctx.canvas.width || i.y > ctx.canvas.height ||
			scene.element && i.x > ( scene.element.scrollLeft + scene.element.width ) || scene.element && i.y > ( scene.element.scrollTop + scene.element.height ) ) {

			return;

		}
		//
		var x = i.x,
			y = i.y,
			height = i.height,
			width = i.width;
		//initiate each render
		ctx.save();
		ctx.lineWidth = i.lineWidth;
		ctx.lineCap = i.lineCap;
		ctx.lineJoin = i.lineJoin;
		ctx.fillStyle = ( i.color || "black" );
		ctx.strokeStyle = ( i.strokeColor || i.color || "black" );
		ctx.globalAlpha = 1;
		if ( i.alpha ) {

			ctx.globalAlpha = i.alpha

		}
		ctx.globalCompositeOperation = ( i.globalCompositeOperation || "source - over" );
		//transformations
		//i.rotate example: - 360 to 360
		if ( i.rotate ) {

			ctx.translate( i.x - ( width / -2 ), i.y - ( height / -2 ) );
			ctx.rotate( i.rotate * Math.PI / 180 );
			x = width / -2;
			y = height / -2;

		}
		//i.scale example:  {scaleWidth: (  up to  ) 1, scaleHeight: (  up to  ) 1}
		if ( i.scale ) {

			ctx.scale( i.scale["scaleWidth"], i.scale["scaleHeight"] );

		}
		//shadows
		//i.shadow example:  {blur: 200, x: 0, y: 0, color: "black"}
		if ( !extras.noEffects ) {

			if ( i.shadow && i.shadow.inset ) {

				ctx.shadowInset = true;

			}
			if ( i.shadow ) {

				ctx.shadowBlur = i.shadow.blur;
				ctx.shadowSkew = 5;
				ctx.shadowOffsetY = ( i.shadow.y || null );
				ctx.shadowOffsetX = ( i.shadow.x || null );
				ctx.shadowColor = ( i.shadow.color || "black" );

			}

		}
		//rendering
		renderObject( i, x, y, ctx, obj, scene, visCtx );
		//drawing
		drawObject( i, x, y, ctx, obj, scene, visCtx );
		ctx.restore();
	},
	updateCamera: function () {
		if ( this.camera == undefined ) {

			this.element.scrollLeft = 0;
			this.element.scrollTop = 0;
			return;

		}
		this.element.scrollLeft = this.camera.x;
		this.element.scrollTop = this.camera.y;
		if ( this.element.scrollTop === 4 ) {

			this.element.scrollTop = 0

		}
	},
	onKeyDown: function ( e, scene ) {
		e = e || event;
		scene.keys[e.keyCode] = e.type;
		scene.keys[e.keyCode] = true;
	},
	onKeyUp: function ( e, scene ) {
		e = e || event;
		scene.keys[e.keyCode] = false;
	},
	onclick: function ( e ) {
		this.objects.forEach( function ( i ) {
			if ( i.onclick && mouseCheck( e, i ) ) {

				i.onclick( e );

			}
		} )
	},
	onMouseMove: function ( e ) {
		this.objects.forEach( function ( i ) {
			if ( i.onmousemove && mouseCheck( e, i ) ) {

				i.onmousemove( e );

			}
		} )
	},
	onMouseDrag: function ( e ) {
		this.objects.forEach( function ( i ) {
			if ( i.onmousedrag && mouseCheck( e, i ) ) {

				i.onmousedrag( e );

			}
		} )
	},
	onMouseDragUp: function ( e ) {
		this.objects.forEach( function ( i ) {
			if ( i.onmousedragup && mouseCheck( e, i ) ) {

				i.onmousedragup( e );

			}
		} )
	},
	animatePNG: function ( target, image, size, maxFrames, repeatThings, hangOn, callback ) {
		if ( target.beginImageClip == undefined ) {

			target.imgBackup = target.image.src;
			target.beginImageClip = {
				x: 0,
				y: 0
			}

		}
		//sets the image clip size
		target.imageClip = {
			x: size[0],
			y: size[1]
		}
		//clips the image
		target.image.src = image;
		target.beginImageClip.x += size[0];
		target.frameNo++;
		if ( target.beginImageClip.x === getImgXY( image ).width ) {

			target.beginImageClip.x = 0;
			target.beginImageClip.y += size[1]

		}
		if ( target.beginImageClip.y >= getImgXY( image ).height || target.frameNo >= ( maxFrames - 1 ) ) {

			if ( hangOn ) {
				if ( callback ) {

					callback();

				}
				return true;
			}
			//resets the image
			if ( repeatThings && !repeatThings && hangOn != true ) {

				this.resetFromAnimatePNG( target );
				if ( callback ) {

					target.frameNo = 0;
					callback();

				}
				return true;

			}
			target.frameNo = 0;
			target.beginImageClip.y = 0;
		}
		target.animating = true;
		return false;
	},
	resetFromAnimatePNG: function ( target ) {
		target.image.src = target.imgBackup;
		target.beginImageClip = null;
		target.frameNo = 0;
		target.imageClip = null;
		target.animating = false;
	}
}
//\\//\\//\\//\\//\\//\\//\\// //
//\\ rendering extra features \// //loc:4
//\\//\\//\\//\\//\\//\\//\\// //
const renderProtonExtras = function ( i, ctx, scene, obj ) {
	if ( scene.gravity && i.velocityY != null && i.noGravity != true ) {

		renderGravity( i, ctx, scene, obj );

	}
	if ( i.castShadow ) {

		obj.forEach( function ( ii ) {
			if ( ii.dynamicShadowBlur ) {
				var shadowX = ( ( ii.x + ( ii.width / 2 ) ) - ( i.x + ( i.width / 2 ) ) ) / ( ii.recieveShadowSensitivity || 1 );
				var shadowY = ( ( ii.y + ( ii.height / 2 ) ) - ( i.y + ( i.height / 2 ) ) ) / ( ii.recieveShadowSensitivity || 1 );
				ii.shadow.blur = Math.sqrt( ( shadowX * shadowX ), ( shadowY * shadowY ) ) + ( ii.shadowBlurSensitivity || 50 );
			}
			if ( ii.recieveShadow == undefined || ii === i ) {
				return
			}
			if ( ii.shadow == undefined ) {
				ii.shadow = {
					blur: 200,
					color: "black",
					x: 0,
					y: 0,
					inset: false
				}
			}
			ii.shadow.x = ( ( ii.x + ( ii.width / 2 ) ) - ( i.x + ( i.width / 2 ) ) ) / ( ii.recieveShadowSensitivity || 1 );
			ii.shadow.fullShadow = true;
			ii.shadow.y = ( ( ii.y + ( ii.height / 2 ) ) - ( i.y + ( i.height / 2 ) ) ) / ( ii.recieveShadowSensitivity || 1 );
		} );

	}
	if ( i.solid ) {

		obj.forEach( function ( ii ) {
			if ( ii === i ) {
				return
			}
			if ( ii.noColliding ) {
				return
			}
			solid( ii, i, scene );
		} );

	}
	if ( i.oncollision ) {

		if ( i.oncollision_target == undefined && i.oncollision_targets == undefined ) {
			obj.forEach( function ( ii ) {
				if ( ii === i ) {
					return
				}
				if ( i.oncollision_experimental ) {
					experimentalSolid( i, ii, scene );
					return;
				}
				oncollision( i, ii, scene );
			} );
		}

		//
		if ( i.oncollision_target ) {

			if ( i.oncollision_experimental ) {
				experimentalSolid( i, i.oncollision_target, scene );
				return;
			}
			oncollision( i, i.oncollision_target, scene );

		}
		if ( i.oncollision_targets ) {

			i.oncollision_targets.forEach( function ( ii ) {
				if ( ii === i ) {
					return
				}
				if ( i.oncollision_experimental ) {
					experimentalSolid( i, ii, scene );
					return;
				}
				experimentalSolid( i, ii, scene );
			} );

		}
	}
	if ( i.follow ) {

		renderFollow( i, ctx, scene, obj );

	}
	//i.dynamics example:  {"property in the variable": "script"}
	if ( i.dynamics ) {

		renderDynamics( i, ctx, scene, obj );

	}
}
const renderDynamics = function ( i, ctx, scene, obj ) {
	for ( var v in i.dynamics ) {
		switch ( typeof i.dynamics[v] ) {

			case "string":

				if ( v.includes( "." ) ) {

					var split = JSON.parse( JSON.stringify( v ) ).split( "." );
					i[split[0]][split[1]] = eval( i.dynamics[v] );

				} else {

					i[v] = eval( i.dynamics[v] );

				}
				break;

			case "function":

				i[v] = i.dynamics[v]( i );
				break;

			default:

				i[v] = i.dynamics[v];

		}
	}
}
const renderFollow = function ( i, ctx, scene, obj ) {
	var onTop = 0;
	if ( i.follow.onTop ) {

		onTop = i.height;

	}
	if ( i.follow.x ) {

		i.x = i.follow.parent.x - ( i.follow.xSpace || 0 );

	}
	if ( i.follow.y ) {

		i.y = i.follow.parent.y - ( i.follow.ySpace || 0 ) - onTop;

	}
	if ( i.follow.center && i.follow.center.x ) {

		i.x -= ( i.width / 2 ) - ( i.follow.parent.width / 2 );

	}
	if ( i.follow.center && i.follow.center.y ) {

		i.y -= ( i.height / 2 ) - ( i.follow.parent.height / 2 );

	}
	if ( i.follow.x == undefined && i.follow.y == undefined ) {

		i.x = i.follow.parent.x - ( i.follow.xSpace || 0 );
		i.y = i.follow.parent.y - ( i.follow.ySpace || 0 ) - onTop;

	}
}
const renderEachGlare = function ( i, ctx, scene, obj ) {
	if ( i.glare ) {

		renderGlare( i, ctx, scene, obj );

	}
}
const renderGlare = function ( i, ctx, scene, obj ) {
	if ( i.glareShadow == undefined && i.noGlareShadow != true ) {

		i.glareShadow = document.createElement( "div" );
		i.glareShadow.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom:0;
		`;
		i.glareShadow.style.boxShadow = ( i.radialGradient.stops[0][1] ) + " 0px 0px " + ( i.glareBrightness || 400 ) + "px  inset";
		scene.element.appendChild( i.glareShadow );

	}
	if ( i.glareShadow && scene.camera ) {

		var glareNum,
			distanceX = ( ( scene.camera.x + ( $( scene.element ).width() / 2 ) ) - ( i.x + ( i.width / 2 ) ) ) / ( i.glareShadowSensitivity || 1 ),
			distanceY = ( ( scene.camera.y + ( $( scene.element ).height() / 2 ) ) - ( i.y + ( i.height / 2 ) ) ) / ( i.glareShadowSensitivity || 1 ),
			anotherGlareNum = Math.sqrt( ( distanceX * distanceX ), ( distanceY * distanceY ) ),
			maxBlur = 500,
			glareN2 = ( ( anotherGlareNum ) * 100 ) / maxBlur;
		glareNum = ( 100 - glareN2 + 0 ) * ( i.glareBlurSensitivity || 3.5 );
		if ( glareNum < 0 ) {

			glareNum = 0;

		}
		i.glareShadow.style.boxShadow = ( i.radialGradient.stops[0][1] ) + " 0px 0px " + glareNum + "px - 15px inset";

	}
	if ( i.noLensFlare != true ) {

		createLensFlare( i, ctx, scene, obj );

	}
}
const renderGravity = function ( i, ctx, scene, obj ) {
	//add velocity
	i.velocityY += scene.gravity + ( i.weight || 0 );
	//max acceleration
	if ( scene.maxAcceleration && i.velocityY > scene.maxAcceleration ) {

		i.velocityY = scene.maxAcceleration

	}
	//add velocity to y
	i.y += i.velocityY;
	//an event for when bottom of screen is reached
	var bottom = scene.canvas.height - i.height;
	if ( i.y > bottom ) {

		i.y = bottom;
		//bouncing
		if ( i.bounce != null ) {

			i.velocityY = -( i.velocityY * i.bounce );
			//rotation
			if ( i.circle != null ) {

				if ( i.velocityX === 0 ) {
					i.velocityX = i.velocityY;
					if ( random( 0, 20 ) >= 10 ) {

						i.velocityX = i.velocityX * -1

					}
				}

				i.hitBottom = true;
			}

		}

	}
	if ( !i.onTop && i.velocityY2 < 0 ) {

		i.velocityY2 = null;

	}
	//going left or right when bouncing
	if ( i.hitBottom != null ) {

		if ( i.velocityX > 0.1 ) {

			i.velocityX -= 0.1;

		}
		if ( i.velocityX < 0 ) {

			i.velocityX += 0.1;

		}
		i.x += i.velocityX;

	}
	//rotate === velocity
	if ( i.dynamicRotate != null && i.rotate != 0 ) {

		i.rotate += i.velocityX;

	}
	if ( i.velocityX === 0.049999999999992356 ) {

		i.hitBottom = false;
		i.velocityX === 0;

	}
}
const experimentalSolid = function ( shapeA, shapeB, scene ) {
	if ( !( ( shapeB.x + shapeB.width ) > ( shapeA.x - 100 ) &&
			( shapeB.x + shapeB.width ) < ( shapeA.x + shapeA.width + 100 ) &&
			( shapeB.y ) > ( shapeA.y - 100 ) &&
			( shapeB.y + 100 ) < ( shapeA.y + shapeA.height + 100 ) ) ) {

		return;

	}
	if ( shapeA.offscreen == undefined ) {

		shapeA.offscreen = new OffscreenCanvas( scene.canvas.height, scene.canvas.width );
		shapeA.offscreenCtx = shapeA.offscreen.getContext( "2d" );

	}
	if ( shapeB.offscreen == undefined ) {

		shapeB.offscreen = new OffscreenCanvas( scene.canvas.height, scene.canvas.width );
		shapeB.offscreenCtx = shapeB.offscreen.getContext( "2d" );

	}
	//creates the variables
	var xa = shapeA.x + shapeA.width,
		xb = shapeB.x + shapeB.width,
		ya = shapeA.y + shapeA.height,
		yb = shapeB.y + shapeB.height,
		collisionSquare = {
			x: Math.max( shapeA.x, shapeB.x ),
			y: Math.max( shapeA.y, shapeB.y ),
			width: Math.min( xa, xb ) - Math.max( shapeA.x, shapeB.x ),
			height: Math.min( ya, yb ) - Math.max( shapeA.y, shapeB.y )
		};
	//clear the canvasii
	shapeA.offscreenCtx.clearRect( 0, 0, scene.canvas.width, scene.canvas.height );
	shapeB.offscreenCtx.clearRect( 0, 0, scene.canvas.width, scene.canvas.height );
	//render everything in a seperate canvas
	scene.renderEach2d( shapeA, shapeA.offscreenCtx, scene.objects, {
		canvas: shapeA.offscreen
	}, null, {
		effectsOff: true
	} );
	scene.renderEach2d( shapeB, shapeB.offscreenCtx, scene.objects, {
		canvas: shapeB.offscreen
	}, null, {
		effectsOff: true
	} );
	//preform the thing
	experimentalSolidPartTwo( shapeA, shapeB, collisionSquare )
}
const experimentalSolidPartTwo = function ( a, b, collisionSquare ) {
	try {
		var imageDataA = a.offscreenCtx.getImageData( collisionSquare.x, collisionSquare.y, collisionSquare.width, collisionSquare.height ).data,
			imageDataB = b.offscreenCtx.getImageData( collisionSquare.x, collisionSquare.y, collisionSquare.width, collisionSquare.height ).data;
	} catch {
		return;
	}
	for ( var i = 3; i < imageDataA.length; i += 4 ) {
		if ( imageDataA[i] > 0 && imageDataB[i] > 0 ) {

			if ( a.oncollision ) {
				var e = {
					this: a,
					collidee: b
				}
				a.oncollision( e );
			}

		}
	}
}
const solid = function ( shapeA, shapeB ) {
	var xa = ( shapeA.x + ( shapeA.width / 2 ) ) - ( shapeB.x + ( shapeB.width / 2 ) ),
		ya = ( shapeA.y + ( shapeA.height / 2 ) ) - ( shapeB.y + ( shapeB.height / 2 ) ),
		ha = ( shapeA.height / 2 ) + ( shapeB.height / 2 ),
		wa = ( shapeA.width / 2 ) + ( shapeB.width / 2 );
	if ( Math.abs( xa ) < wa && Math.abs( ya ) < ha ) {

		var oX = wa - Math.abs( xa ),
			oY = ha - Math.abs( ya );
		if ( oX >= oY ) {

			if ( ya > 0 ) {

				if ( shapeA.solid != true ) {

					shapeA.y += oY;

				}

			} else {
				shapeA.y -= oY;
				if ( shapeA.velocityY ) {

					shapeA.onTopObj = shapeB;
					shapeA.onTop = true;
					if ( shapeA.bounce === 0 || shapeA.bounce == undefined ) {

						shapeA.velocityY = 0;

					}
					onTopBounce( shapeA );

				}
			}

		} else {

			if ( xa >= 0 ) {

				shapeA.x += oX;

			} else {

				shapeA.x -= oX;

			}

		}
	} else {

		shapeA.onTop = false;

	}
}
const onTopBounce = function ( i, ii ) {
	if ( i.onTop && i.bounce && scene.gravity && i.velocityY && i.noGravity != true ) {

		i.y = i.onTopObj.y - i.height;
		//bouncing
		if ( i.bounce ) {

			i.velocityY = -( i.velocityY * i.bounce );
			//rotation
			if ( i.circle ) {

				if ( i.velocityX === 0 ) {

					i.velocityX = i.velocityY;
					if ( random( 0, 20 ) >= 10 ) {

						i.velocityX = i.velocityX * -1

					}

				}
				i.hitBottom = true;

			}
		}

	}
}
const createLensFlare = function ( i, ctx, scene, obj ) {
	//alpha
	var alpha,
		distanceX = ( ( scene.element.scrollLeft + ( $( scene.element ).width() / 2 ) ) - ( i.x + ( i.width / 2 ) ) ),
		distanceY = ( ( scene.element.scrollTop + ( $( scene.element ).height() / 2 ) ) - ( i.y + ( i.height / 2 ) ) ),
		anotherGlareNum = Math.sqrt( ( distanceX * distanceX ), ( distanceY * distanceY ) ),
		maxBlur = 500,
		glareN2 = ( ( anotherGlareNum ) * 100 ) / maxBlur,
		alpha = ( 100 - glareN2 + 0 ) / 100;
	if ( alpha < 0 || alpha === 0 ) {

		alpha = 0.00000000001;

	}
	//lens flares
	var camera = {
		x: scene.element.scrollLeft,
		y: scene.element.scrollTop,
		height: $( scene.element ).height(),
		width: $( scene.element ).width()
	};
	if ( i.lensFlares == undefined ) {

		i.lensFlares = [
			addLensFlareHex( random( camera.x, camera.x + scene.element.offsetWidth ), random( camera.y, camera.y + scene.element.offsetHeight ), ctx, scene, obj, i.radialGradient.stops[0][1] ),
			addLensFlareCircle( camera.x + 90, camera.y, ctx, scene, obj, i.radialGradient.stops[0][1] ),
			addLensFlareHex( camera.x, camera.y + 30, ctx, scene, obj, i.radialGradient.stops[0][1] ),
			addLensFlareHex( random( camera.x, camera.x + scene.element.offsetWidth ), random( camera.y, camera.y + scene.element.offsetHeight ), ctx, scene, obj, i.radialGradient.stops[0][1] ),
			//
			addLensFlareCircle( camera.x + 90, camera.y, ctx, scene, obj, i.radialGradient.stops[0][1] ),
			addLensFlareCircle( camera.x, camera.y + 30, ctx, scene, obj, i.radialGradient.stops[0][1] ),
			addLensFlareHex( random( camera.x, camera.x + scene.element.offsetWidth ), random( camera.y, camera.y + scene.element.offsetHeight ), ctx, scene, obj, i.radialGradient.stops[0][1] )
		]

	}
	i.lensFlares.forEach( function ( e ) {
		var height = Math.abs( scene.element.offsetHeight - ( i.y + ( i.height / 2 ) ) );
		var width = Math.abs( scene.element.scrollLeft + ( scene.element.offsetWidth / 2 ) - ( i.x + ( i.width / 2 ) ) ),
			width2 = ( scene.element.scrollLeft + ( scene.element.offsetWidth / 2 ) - ( i.x + ( i.width / 2 ) ) );
		var posX = ( ( e.posNum ) * width2 );
		var posY = ( ( e.posNum ) * height );
		e.x = posX + ( i.x + ( i.width / 2 ) );
		e.y = posY
		e.alpha = alpha / 2;
		scene.renderEach2d( e, ctx, scene, i.lensFlares );
	} );
}
const addLensFlareHex = function ( x, y, ctx, scene, obj, color ) {
	var colors = ["red", "green", "blue", "black"],
		color = ( color || colors[Math.floor( Math.random() * colors.length )] ),
		size = random( 1.0, 4.0 ),
		alpha = random( 1, 10 ) / 100,
		obj = new protonjs.square( {
			x: x,
			y: y,
			scale: {
				scaleWidth: size,
				scaleHeight: size
			},
			poly: [
				[20, 0],
				[80, 0],
				[110, 50],
				[80, 100],
				[20, 100],
				[-10, 50]
			],
			lineJoin: "round",
			stroke: true,
			lineWidth: 20,
			fill: true,
			noStrokeOpacityOverlap: true,
			strokeColor: color,
			color: color,
			alpha: alpha,
			posNum: random( 30, 100 ) / 100
		} );
	return obj;
}
const addLensFlareCircle = function ( x, y, ctx, scene, obj, color ) {
	var colors = ["red", "green", "blue", "black"],
		color = ( color || colors[Math.floor( Math.random() * colors.length )] ),
		size = random( 1.0, 8.0 ),
		alpha = random( 1, 10 ) / 100,
		obj = new protonjs.square( {
			x: x,
			y: y,
			scale: {
				scaleWidth: size,
				scaleHeight: size
			},
			circle: true,
			strokeColor: color,
			color: color,
			alpha: alpha,
			posNum: random( 30, 100 ) / 100
		} );
	return obj;
}
//\\//\\//\\//\\//\\//\\//\\//\\  //
//\\ draw and render objects / \\  //loc:5
//\\//\\//\\//\\//\\//\\//\\//\\  //
const drawObject = function ( i, x, y, ctx, obj, scene, visCtx ) {
	//filling
	//i.image = new Image(); i.image.src example: "source / path / to / image. * "
	if ( i.image && i.animating != true && i.pattern == undefined ) {

		//i.clipImage * examples:
		//	x: number
		//	y: number
		//	height and width: number
		if ( i.clipImageX == undefined ) {

			ctx.drawImage( i.image, ( i.imageX || x ), ( i.imageY || y ), ( i.imageWidth || i.width ), ( i.imageHeight || i.height ) );

		} else {

			ctx.drawImage( i.image, i.clipImageX, i.clipImageY, i.clipImageWidth, i.clipImageHeight, ( i.imageX || x ), ( i.imageY || y ), ( i.imageWidth || i.width ), ( i.imageHeight || i.height ) );

		}

	} else if ( i.borderRadius == undefined && i.animating != true && i.doNotFill != true && i.circle != true && i.ellipse != true && i.poly == undefined && i.line == undefined || i.pattern ) {

		ctx.beginPath();
		ctx.rect( x, y, i.width, i.height );
		ctx.closePath();

	}
	//i.animating example: true or false
	if ( i.animating ) {

		ctx.drawImage( i.image, i.beginImageClip.x, i.beginImageClip.y, i.imageClip.x, i.imageClip.y, x, y, i.width, i.height );

	}
	//i.stroke example: true or false
	if ( i.stroke ) {

		ctx.stroke();

	}
	//i.noStrokeOpacityOverlap example: true or false
	if ( i.noStrokeOpacityOverlap ) {

		ctx.translate( i.x, i.y );
		ctx.scale( ( i.width - ( i.lineWidth / 2 ) ) / 65, ( i.height - ( i.lineWidth / 2 ) ) / 65 );
		x = i.width - ( i.lineWidth * 1.72 );
		y = i.height - ( i.lineWidth * 1.72 );
		renderObject( i, x, y, ctx, obj, scene );

	}
	//i.fill example: true, false, or null
	if ( i.fill ||
		i.stroke == undefined && i.fill == undefined && i.image == undefined && i.pattern == undefined ) {

		ctx.fill();

	}
	//patterns
	//i.pattern example: true or false
	if ( i.pattern ) {

		ctx.translate( i.x, i.y );
		ctx.fillStyle = ctx.createPattern( i.image, i.pattern );
		ctx.fillRect( 0, 0, i.width, i.height );

	}
	//text
	//i.text example: string
	if ( i.text ) {

		var x2 = x,
			y2 = y,
			st = ctx.fillStyle,
			sst = ctx.strokeStyle,
			fontSize = ( i.fontSize || 30 );
		ctx.fillStyle = ( i.textColor || "black" );
		ctx.font = fontSize + "px " + ( i.fontFamily || "Roboto" );
		ctx.strokeStyle = ( i.textColor || "black" );
		ctx.lineWidth = ( i.textLineWidth || 1 );
		var wrap = wordWrap( ctx, i.text, i.x + ( i.padding || 0 ), i.y + ( i.padding || 0 ) + fontSize, fontSize, i.width - ( i.padding || 0 ), i.strokeText, i.centerText );
		if ( i.dynamicTextHeight ) {
			i.height = wrap + ( ( i.padding || 0 ) * 2 ) + ( i.padding || 0 );
		}
		ctx.lineWidth = null;
		ctx.fillStyle = st;
		ctx.strokeStyle = sst;
		ctx.textAlign = null;

	}
}
const renderObject = function ( i, x, y, ctx, obj, scene, visCtx ) {
	//i.circle example: true or false
	if ( i.circle ) {

		i.height = i.width;
		ctx.beginPath();
		ctx.arc( x + ( i.width / 2 ), y + ( i.height / 2 ), i.width / 2, 0, 2 * Math.PI );
		ctx.closePath();

	}
	//i.ellipse example: true or false
	if ( i.ellipse ) {

		ctx.beginPath();
		ctx.ellipse( x + ( i.width / 2 ), y + ( i.height / 2 ), i.width / 2, i.height / 2, 0, 0, 2 * Math.PI );
		ctx.closePath();

	}
	//i.poly example: [ [ordered pair (  in a percentage  )], [ordered pair (  in a percentage  )]... ]
	if ( i.poly ) {

		ctx.beginPath();
		ctx.moveTo( ( ( i.poly[0] / 100 ) * i.width ) + x, ( ( i.poly[1] / 100 ) * i.height ) + y );
		i.poly.forEach( function ( p ) {
			ctx.lineTo( ( ( p[0] / 100 ) * i.width ) + x, ( ( p[1] / 100 ) * i.height ) + y );
		} );
		ctx.closePath();

	}
	//i.line example: [ [ordered pair], [ordered pair]... ]
	if ( i.line ) {

		ctx.beginPath();
		ctx.moveTo( i.line[0], i.line[1] );
		i.line.forEach( function ( p ) {
			ctx.lineTo( p[0], p[1] );
		} );
		ctx.closePath();

	}
	//borders
	//i.borderRadius example: number
	if ( i.borderRadius && i.poly == undefined && i.line == undefined && i.image == undefined ) {

		ctx.roundRect( x, y, i.width, i.height, i.borderRadius );

	}
	//i.clip example: true or false
	if ( i.clip ) {

		ctx.clip();
		ctx.fill();

	}
	//gradients
	//i.linearGradient example: [ [stop, color], [stop, color]... ]
	if ( i.linearGradient ) {

		var endX = i.x,
			endY = i.y + i.height,
			beginX = i.x,
			beginY = i.y;
		if ( i.gradientRotate ) {
			var angle = i.gradientRotate / 180 * Math.PI;
			endX = beginX + Math.cos( angle ) * i.width;
			endY = beginY + Math.sin( angle ) * i.height;
		}
		var grd = ctx.createLinearGradient( beginX, beginY, endX, endY );
		i.linearGradient.forEach( function ( j ) {
			grd.addColorStop( j[0], j[1] );
		} );
		ctx.fillStyle = grd;

	}
	//i.radialGradient example:  {innerRadius: 5, stops: [ [stop, color], [stop, color]... ]}
	if ( i.radialGradient ) {

		var grd = ctx.createRadialGradient( ( i.x + ( i.width / 2 ) ), ( i.y + ( i.height / 2 ) ), i.radialGradient.innerRadius, ( i.x + ( i.width / 2 ) ), ( i.y + ( i.height / 2 ) ), i.height );
		i.radialGradient.stops.forEach( function ( i ) {
			grd.addColorStop( i[0], i[1] );
		} );
		ctx.fillStyle = grd;

	}
}
//\\//\\//\\//\\//\\//\\  //
//\\ extra functions / \\  //loc:6
//\\//\\//\\//\\//\\//\\  //
const createLinearGradient = function ( x, y, length, angle2, scene ) {
	var x2, y2, angle;
	angle = +angle2 / 180 * Math.PI;
	x2 = x + Math.cos( angle ) * length;
	y2 = y + Math.sin( angle ) * length;
	return scene.context.createLinearGradient( x, y, x2, y2 );
}
const random = function ( a, b ) {
	if ( a.toString().includes( "." ) || b.toString().includes( "." ) ) {

		return Math.random() * ( a - b ) + b;

	}
	return Math.floor( ( Math.random() * b ) + a );
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const betterRandom = function ( a, b ) {
	var min = Math.ceil( a );
	var max = Math.floor( b );
	return Math.floor( Math.random() * ( max - min ) ) + min;
}
const randomColor = function () {
	var letters = "0123456789ABCDEF";
	var color = "#";
	for ( var i = 0; i < 6; i++ ) {
		color += letters[Math.floor( Math.random() * 16 )];
	}
	return color;
}
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
const getImgXY = function ( url ) {
	var img = new Image();
	img.src = url;
	return {
		width: img.width,
		height: img.height
	}
}
const mouseCheck = function ( a, b ) {
	if ( a.pageX < b.x + b.width &&
		a.pageX + 10 > b.x &&
		a.pageY < b.y + b.height &&
		a.pageY + 10 > b.y ) {

		return true;

	}
}
const toggle = function ( item ) {
	item === true ? item = false : item = true;
	item = item;
	return item;
}
//https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks/21574562
const wordWrap = function ( ctx, text, x, y, fontSize, width, stroke, center ) {
	width -= fontSize;
	text = text.split( " " );
	var currentLine = 0,
		idx = 1;
	if ( center ) {

		ctx.textAlign = "center";
		x = x + width / 2;

	}
	if ( width <= 0 ) {

		if ( stroke ) {

			ctx.strokeText( text, x, y );

		} else {

			ctx.fillText( text, x, y );

		}
		return;

	}
	while ( text.length > 0 && idx <= text.length ) {
		var str = text.slice( 0, idx ).join( " " ),
			w = ctx.measureText( str ).width;
		if ( w > width ) {

			if ( idx === 1 ) {

				idx = 2;

			}
			if ( stroke ) {

				ctx.strokeText( text.slice( 0, idx - 1 ).join( " " ), x, y + ( fontSize * currentLine ) );

			} else {

				ctx.fillText( text.slice( 0, idx - 1 ).join( " " ), x, y + ( fontSize * currentLine ) );

			}
			currentLine++;
			text = text.splice( idx - 1 );
			idx = 1;

		} else {

			idx++;

		}
	}
	if ( idx > 0 ) {

		if ( stroke ) {

			ctx.strokeText( text.join( " " ), x, y + ( fontSize * currentLine ) );

		} else {

			ctx.fillText( text.join( " " ), x, y + ( fontSize * currentLine ) );

		}

	}
	return ( currentLine * fontSize );
}
const oncollision = function ( one, two ) {
	var e = {
		this: one,
		collidee: two
	}
	if ( one.x < two.x + two.width &&
		one.x + one.width > two.x &&
		one.y < two.y + two.height &&
		one.height + one.y > two.y ) {

		one.oncollision( e );

	} else if ( two.whilenotcollided ) {

		two.whilenotcollided( e );

	}
}
//removing objects from arrays
const removeFromArray = function ( array, object ) {
	return ( array.indexOf( object ) > -1 ) ? [ array.splice( array.indexOf( object ), 1 ), array ] : false
}
//\\//\\//\\//\\//\\//\\//\\  //
//\\ prepare all pausing / \\  //loc:7
//\\//\\//\\//\\//\\//\\//\\  //
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
		if ( protonjs.paused ) {

			return;

		}
		code();
	}
	return window.oldOldSetInterval( newCode, delay );
}
////////////// //
//  misc  // //loc:8
////////////// //
//get a radian from an angle
const radian = function ( angle ) {
	return THREE.Math.degToRad( angle );
}
//get an angle from a radian
const angle = function ( radians ) {
	return THREE.Math.radToDeg( radians )
}
//create a round rectangle, courtesy of
//https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
CanvasRenderingContext2D.prototype.roundRect = function ( x, y, w, h, r ) {
	if ( w < 2 * r ) {

		r = w / 2

	}
	if ( h < 2 * r ) {

		r = h / 2

	};
	this.beginPath();
	this.moveTo( x + r, y );
	this.arcTo( x + w, y, x + w, y + h, r );
	this.arcTo( x + w, y + h, x, y + h, r );
	this.arcTo( x, y + h, x, y, r );
	this.arcTo( x, y, x + w, y, r );
	this.closePath();
	return this;
}
OffscreenCanvasRenderingContext2D.prototype.roundRect = CanvasRenderingContext2D.prototype.roundRect;
//sorting arrays, courtesy of user Ege ?zcan on:
//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
const sort = function ( property ) {
	var sortOrder = 1;
	if ( property[0] === "-" ) {

		sortOrder = -1;
		property = property.substr( 1 );

	}
	return function ( a, b ) {
		var result = ( a[property] < b[property] ) ? -1 : ( a[property] > b[property] ) ? 1 : 0;
		return result * sortOrder;
	}
}
const sortMultiple = function () {
	var props = arguments;
	return function ( obj1, obj2 ) {
		var i = 0,
			result = 0,
			numberOfProperties = props.length;
		while ( result === 0 && i < numberOfProperties ) {
			result = sort( props[i] )( obj1, obj2 );
			i++;
		}
		return result;
	}
}
//bringing back object.watch from user Eli Grey on:
//https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript
Object.defineProperty( Object.prototype, "watch", {
	enumerable: false,
	configurable: true,
	writable: false,
	value: function ( prop, handler ) {
		var oldval = this[prop],
			newval = oldval,
			getVal = function () {
				return this["_" + prop];
			},
			setVal = function ( val ) {
				var h = handler.call( this, prop, this["_" + prop], val );
				this["_" + prop] = val;
				return newval = h;
			};
		this["_" + prop] = this[prop];
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
const Canvas = function ( height, width ) {
	var c = document.createElement( "canvas" );
	c.height = height;
	c.width = width;
	return c;
}
/*
	~> loc:9
		~> there are locations 9.1 - 10.0 in this section.
	proton3d
*/
class Proton3DScene {
	constructor() {
		Physijs.scripts.worker = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/physijs_worker.js";
		Physijs.scripts.ammo = "https://cdn.jsdelivr.net/gh/chandlerprall/Physijs@master/examples/js/ammo.js";
		this.proton3d = true;
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
		extras.refreshRate = extras.refreshRate || this.refreshRate || 10
		extras.width = extras.width || window.innerWidth;
		extras.height = extras.height || window.innerHeight;
		extras.antialias = extras.antialias || false;
		//variables
		var scene = this;
		this.element = (extras.sceneElement || document.createElement( "scene" ));
		this.canvas = (extras.canvasElement || document.createElement( "canvas" ));
		this.context = this.canvas.getContext( "webgl2" );
		this.objects = new Physijs.Scene();
		this.objects.setGravity( new THREE.Vector3( 0, ( extras.gravity || -9.81 ), 0 ) );
		this.camera = new Proton3DObject({
			type: "perspectivecamera",
			viewportWidth: extras.width,
			viewportHeight: extras.height
		});
		this.renderer = new THREE.WebGLRenderer( {
			alpha: true,
			antialias: extras.antialias,
			canvas: this.canvas,
			context: this.context,
			powerPreference: "high-performance"
		} );
		this.renderer.setSize( extras.width, extras.height );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.audio = new Audio();
		//some element - y stuff
		this.element.appendChild( this.renderer.domElement );
		//ifs
		if ( extras.parent == undefined ) {

			document.body.appendChild( this.element );

		} else if ( extras.parent ) {

			extras.parent.appendChild( this.element );

		}
		//watching for variables
		this.background = ""
		this.backgroundImage = "";
		this.backgroundColor = "";
		scene.watch( "background", function ( id, oldval, newval ) {
			this.element.style.background = newval;
		} );
		scene.watch( "backgroundImage", function ( id, oldval, newval ) {
			this.canvas.style.background = newval;
		} );
		scene.watch( "backgroundColor", function ( id, oldval, newval ) {
			this._backgroundColor = newval;
			this.objects.background = new THREE.Color( newval );
		} );
		scene.update( scene );
		scene.updateExtraFunctions( scene );
		//objectList
		this.objectList = []
		//PBR
		scene.PBRCamera = new THREE.CubeCamera( 1, 10,  32, {
			type: THREE.FloatType
		} );
		scene.objects.add( scene.PBRCamera );
		scene.PBRCamera.renderTarget.texture.format = THREE.RGBAFormat;
		scene.PBRCamera.renderTarget.texture.generateMipmaps = true;
	}
	update( scene ) {
		requestAnimationFrame( function () {
			scene.update( scene )
		} );
		//pausing
		if ( protonjs.paused ) {
			
			return
			
		}
		//physics
		scene.objects.simulate()
		//extraFunctions
		scene.priorityExtraFunctions.forEach( function ( e ) {
			e();
		} );
		//rendering using renderer.render
		if ( scene.composer ) {

			scene.composer.render();

		} else {
			
			scene.renderer.render( scene.objects, getMeshByName( scene.camera.name ) );
		
		}
	}
	updateExtraFunctions( scene ) {
		requestIdleCallback( function () {
			scene.updateExtraFunctions( scene )
		} );
		//functions
		scene.extraFunctions.forEach( function ( e ) {
			if ( protonjs.paused && !e.continuePastPausing ) {
				
				return
				
			}
			e();
		} );
	}
	getObjectList() {
		return this.objectList
	}
	add( object ) {
		this.objects.add( object.name? getMeshByName( object.name ) : object );
		this.objectList.push( object )
		//physically based rendering
		var skipPBRReplacement = object.skipPBRReplacement,
			skipPBRReplacement_light = object.skipPBRReplacement_light,
			object = getMeshByName( object.name ) || object,
			oldMaterial = object.material,
			x = this;
		if ( this.usePBR != false && !skipPBRReplacement && !skipPBRReplacement_light && object.material ) {
			
			object.usePBRCamera = false;
			object.PBRCamera = this.PBRCamera;
			//
			object.pbr = function (scene, PBRCamera = scene.PBRCamera) {
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
			this.initPBR( object.material, object, undefined, undefined, skipPBRReplacement, object.material? object.material.name : null );
			object.pbr(this);
			
		} else if ( !skipPBRReplacement ) {
			
			this.initPBR( object.material, object, undefined, undefined, skipPBRReplacement, object.material? object.material.name : null, false );
		
		}
	}
	initPBR( material, object, materialLocation, scene = this, skipPBRReplacement = false, materialName, usePBRInTheFirstPlace = true ) {
		if ( material == undefined ) {

			return

		}
		if ( material[0] != null ) {

			material.forEach( function (m, i) {
				scene.initPBR( m, object, i, scene, skipPBRReplacement, m.name, usePBRInTheFirstPlace );
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
				newMaterial.envMap = scene.PBRCamera.renderTarget.texture;
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
	}
	remove( object ) {
		this.objects.remove( getMeshByName( object.name ) || object )
	}
	dynamicResize() {
		var x = this;
		window.addEventListener( "resize", function () {
			x.camera.changeAspectRatio( window.innerWidth / window.innerHeight );
			x.renderer.setSize( window.innerWidth, window.innerHeight );
			if ( x.composer ) {

				x.composer.setSize( window.innerWidth, window.innerHeight );

			}
		} );
	}
	setLoadEvent( extras = {} ) {
		this.loadManager = new THREE.LoadingManager();
		this.loadManager.onStart = function () {
			console.log( true );
		}
		this.loadManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
			extras.element.value = ( itemsLoaded / itemsTotal ) * 100;
			console.log( true );
		}
		this.loadManager.onLoad = extras.loadCallback;
		//
	}
	setKeyControls( obj, speed = 2.5, jumpHeight = 4 ) {
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
			if ( x.keys[x.mappedKeys.jump] && obj.getCollidingObjects().length > 0 ) {
				
				var rotation = x.camera.getRotation(),
					z = obj.getLinearVelocity();
				obj.setLinearVelocity( z.x, jumpHeight, z.z );
				x.objects.simulate()

			}
		}
		function move ( y, z, speed, negatise = false, forward = false ) {
			if ( x.noclip ) {
				
				var pos = obj.position.clone().add( new THREE.Vector3( y.x * (speed / 10) * ( negatise? -1 : 1 ) , forward? ( x.camera.getWorldDirection().y * (speed / 10) * ( negatise? -1 : 1 ) ) : 0, y.z * (speed / 10) * ( negatise? -1 : 1 )  ) )
				obj.setPosition( pos.x, pos.y, pos.z )
				
			} else {
				
				obj.setLinearVelocity( y.x * speed * ( negatise? -1 : 1 ), z.y, y.z * speed * ( negatise? -1 : 1 ) );
				x.objects.simulate()
				
			}
			
		}
	}
	toggleDoor( door ){
		var x = this;
		if ( !door.checkForEnding ) {
			
			door.isOpen = toggle( door.isOpen );
			var checkForRotations = this.priorityExtraFunctions.push(function(){
				if ( Math.abs( parseInt( angle( door.rotation.y - door.initialRotation ) ) -  parseInt( angle( door.oldRotation - door.initialRotation ) ) ) > 5 ) {
					
					x.priorityExtraFunctions.splice( checkForRotations - 1, 1 );
					door.checkForEnding = function () {
						var rotation = door.rotation.clone().y;
						console.log(angle(rotation))
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
							x.priorityExtraFunctions.splice( x.priorityExtraFunctions.indexOf( door.checkForEnding ), 1 );
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
					x.priorityExtraFunctions.push( door.checkForEnding );

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
	}
	makeDoor( door, width = door.width || 2.5, faceInwards = true ) {
		var x = this;
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
				x.toggleDoor( door )
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
		this.objects.addConstraint( door.constraint );
		door.constraint.setLimits(
			faceInwards? ( radian( 0 ) + door.getRotation().y ) : ( radian( -90 ) + door.getRotation().y ),
			faceInwards? ( radian( 90 ) + door.getRotation().y ) : ( radian( 0 ) + door.getRotation().y ),
			10,
			0.1
		);
		door.constraint.enableAngularMotor( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0.5, 0 ) );
		door.constraint.disableMotor();
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
			protonjs.resume();
			init();
		}
		
		//
		
		function init(){
			var localPosClone = x.crosshair.localPosition.clone();
			
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
						
						x.camera.setPosition( extras.distance.x, extras.distance.y, extras.distance.z);
						
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
					
					if ( ( (x.cameraType === "thirdperson" || extras.type === "thirdperson" ) &&
						( ( ( x.camera.getPosition().y - e.movementY / extras.ySensivity ) > -9 ||
						( x.camera.getPosition().y - e.movementY / extras.ySensivity ) < 9 ) ) ) ||
						x.cameraType != "thirdperson" ) {
						
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
		x.crosshair.localPosition = new THREE.Vector3(0, 0, 1);
		x.crosshair.__localPosition = new THREE.Vector3(0, 0, 0);
		//
		
		if ( !extras.cameraParent.parent ) {
			
			x.add( extras.cameraParent )
			
		}
		
		protonjs.pause();
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
				
				var pos = x.crosshair.position.clone().sub( x.camera.parent.position.clone() ).clone()
				child.mass = 0;
				child.setPosition(
					x.crosshair.position.x + ( pos.x * 1.5 ),
					x.crosshair.position.y + ( pos.y * 1.5 ),
					x.crosshair.position.z + ( pos.z * 1.5 )
				);
				child.setRotation(0, 0, 0);
				
			}
			if ( child.pickingUp === "wrapping" ) {
				
				child.mass = child.oldMass;
				child.setLinearVelocity( 0, 0, 0 );
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
			if ( child.__pickupable != true ) {

				return

			}
			if ( x.keys[x.mappedKeys.use] && x.crosshair.position.distanceTo( child.position ) <= ( child.__pickupDistance || 2 ) && child.pickingUp == null && window.pickingUpChild == undefined ) {
				
				if ( child.onUse ) {

					child.onUse();
					if ( child.__returnAfterPickup ) {
						
						return

					}

				}
				
				child.pickingUp = true;
				if ( child.oldMass != 0 ) {
					
					child.oldMass = child.mass;
					
				}
				child.oldPos = child.position.clone();
				child.distance = x.crosshair.position.distanceTo( child.position );
				x.crosshair.hide()
				return
				
			}
			if ( x.keys[x.mappedKeys.use] && child.pickingUp === true ) {

				child.pickingUp = false;
				x.crosshair.show()
				child.pickingUp = "wrapping";

			}
		}
	}
}
/*
	~> loc:9.1 > creating objects
	each object (  except for lights,
	which do not have a geometry or
	color  ) should look like this:
	 {
		width: #,
		height: #,
		depth: #,
		wireframeSegments: #,
		x: #,
		y: #,
		z: #,
		color: "",
		smoothShading: true / false,
		texture: "image file location",
		threeObject: three js object
	}
	this has to be done specially for
	each function, which means I cannot
	simplify this.
	here are all the objects you can create that are handled by proton.js:
	[cone, sphere, cube, cylinder, sun3d]
	otherwise, you'll need to make a model.
*/
const createBaseObj3dListeners = function ( obj, extras = {} ) {
	//setting stuff
	for ( var i in extras ) {
		if ( obj[ i ] == undefined ) {
			
			obj[ i ] = extras[ i ]
			
		}
	}
	//setting variables
	obj.x = ( extras.x || 0 );
	obj.y = ( extras.y || 0 );
	obj.z = ( extras.z || 0 );
	obj.color = ( extras.color || "white" );
	obj.texture = "";
	obj.smoothShading = false;
	obj.castShadow = ( extras.castShadow || true );
	obj.receiveShadow = ( extras.receiveShadow || false );
	//i've got to keep the x, y, and z values here because of compatability issues with older proton.js examples.
	obj.watch( "x", function ( id, oldval, newval ) {
		obj.setPosition( newval, undefined, undefined )
	} );
	obj.watch( "y", function ( id, oldval, newval ) {
		obj.setPosition( undefined, newval, undefined )
	} );
	obj.watch( "z", function ( id, oldval, newval ) {
		obj.setPosition( undefined, undefined, newval )
	} );
	if ( extras.x ) {

		obj.setPosition( extras.x, undefined, undefined )

	}
	if ( extras.y ) {

		obj.setPosition( undefined, extras.y, undefined )

	}
	if ( extras.z ) {

		obj.setPosition( undefined, undefined, extras.z )

	}
	//material
	obj.watch( "color", function ( id, oldval, newval ) {
		obj._color = newval;
		protonjs.__changeMeshMaterial( obj );
	} );
	obj.watch( "texture", function ( id, oldval, newval ) {
		obj._texture = newval;
		protonjs.__changeMeshMaterial( obj );
	} );
	obj.watch( "normalMap", function ( id, oldval, newval ) {
		obj._texture = newval;
		protonjs.__changeMeshMaterial( obj );
	} );
	obj.watch( "bumpMap", function ( id, oldval, newval ) {
		obj._bumpMap = val;
		protonjs.__changeMeshMaterial( obj );
	} );
	obj.watch( "wireframe", function ( id, oldval, newval ) {
		obj._wireframe = newval;
		protonjs.__changeMeshMaterial( obj );
	} );
	//castShadow
	if ( obj.castShadow ) {
		obj.castShadow = obj.castShadow
		if ( obj.children ) {

			obj.children.forEach( function ( c ) {
				c.castShadow = obj.castShadow
			} );

		}
	}
	//recieveShadow
	if ( obj.receiveShadow ) {

		obj.receiveShadow = obj.receiveShadow
		if ( obj.children ) {

			obj.children.forEach( function ( c ) {
				c.receiveShadow = obj.recieveShadow
			} );

		}

	}
}
protonjs.__changeMeshMaterial = function ( extras = {} ) {
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
/*
	loc:9.2
	models
	this supports obj files and gltf, which can be exported through blender.
	gltf file extensions require an extension to export: https://github.com/KhronosGroup/glTF-Blender-IO
*/
protonjs.importObject = function ( extras = {} ) {
	var loader,
		x = this;
	//gets the loader and loads the file
	switch ( extras.fileType.toLowerCase() ) {

		case "obj":
			loader = new THREE.OBJLoader2( extras.loadManager );
			loader.setLogging( false, false );
			if ( typeof extras.mtlPath === "string" ) {

				loader.loadMtl( extras.mtlPath, null, function ( materials ) {
					loader.setMaterials( materials );
					loader.load( extras.objPath, function ( object ) {
						finishLoad( object, object.detail.loaderRootNode );
					} );
				} );

			} else {

				loader.load( extras.objPath, function ( object ) {
					finishLoad( object, object.detail.loaderRootNode );
				} );

			}
			break;

		case "gltf":

			loader = new THREE.GLTFLoader( extras.loadManager );
			loader.load( extras.gltfPath, function ( object ) {
				x.gltf = object;
				finishLoad( object, object.scene );
			} );
			break;

	}
	//finishes the loading stuff
	function finishLoad( object, threeObject ) {
		getMeshByName( x.name ) = threeObject;
		x.children = getMeshByName( x.name ).children;
		if ( extras.useAsGroup ) {

			getMeshByName( x.name ) = new THREE.Group();
			getMeshByName( x.name ).add( threeObject );

		}
		if ( extras.noPhysics != true ) {

			x.physicalChildren = [];
			getMeshByName( x.name ).children.forEach( function ( c, i ) {
				var m,
					oldGeometry;
				//some geometry stuff  {
				if ( c.isMesh && c.geometry != null && !c._physijs ) {

					c.updateMatrix();
					oldGeometry = c.geometry.clone();
					c.geometry = new THREE.Geometry().fromBufferGeometry( c.geometry );
					if ( extras.accountForExtraProperties ) {

						c.geometry.vertices.forEach( function ( vertex ) {
							vertex.multiply( c.scale );
						} );

					}
					if ( extras.starterPos && extras.fileType.toLowerCase() === "gltf" ) {

						c.position.add( extras.starterPos )

					}

				} else if ( !c._physijs ) {
					
					if ( c.position && extras.starterPos ) {
						
						c.position.add( extras.starterPos );
						
					}
					extras.objects.add( c );
					return;

				} else if ( c._physijs ) {
					
					return
					
				}
				if ( extras.name && extras.name.includes( " --noPhysics" ) ) {

					extras.objects.add( c );
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
						if ( typeof material[i] === "function" || material[i] === material.type || material[i] === material.id || material[i] === material.uuid ) {

							continue;

						}
						newmaterial[i] = material[i]
					}
					return Physijs.createMaterial(
						newmaterial,
						1,
						0
					);
				}
				if ( c.material[0] != null ) {

					c.material.forEach( function ( material, i ) {
						c.material[i] = toMeshPhongMaterial( material )
					} )

				} else {

					c.material = toMeshPhongMaterial( c.material )

				}
				//}
				if ( extras.objectType ) {

					switch ( typeof extras.objectType ) {

						case "object":

							extras.objectType[i].charAt( 0 ).toUpperCase() + extras.objectType.slice( 1 );
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

							mass = extras.mass[i]
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
				var physicalObject = eval( `new Physijs.` + ( m || "Box" ) + `Mesh(
					(  extras.collisionGeometry || c.geometry  ),
					(  extras.collisionMaterial || c.material  ),
					mass
				)` );
				if(c.name && c.name.replace(/_/ig, " ").indexOf(" --") > -1){
					c.name = c.name.replace(/_/ig, " ").slice(0, c.name.indexOf(" --"));
				} else if(c.name){
					c.name = c.name.replace(/_/ig, " ")
				}
				physicalObject.name = c.name;
				physicalObject.userData = c.userData;
				x.physicalChildren.push( physicalObject );
				physicalObject.material.transparent = true;
				if ( extras.starterPos && extras.fileType.toLowerCase() != "gltf" ) {

					physicalObject.position.set(
						extras.starterPos.x + c.position.x,
						extras.starterPos.y + c.position.y,
						extras.starterPos.z + c.position.z,
					);
					physicalObject.__dirtyPosition = true;
					c.position.set(0, 0, 0)

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
				//
				if ( extras.useCollisionBox ) {

					extras.collisionBoxPosition = ( extras.collisionBoxPosition || new THREE.Vector3( 0, 0, 0 ) );
					c.position.set( extras.collisionBoxPosition.x, extras.collisionBoxPosition.y, extras.collisionBoxPosition.z );
					physicalObject.add( c );
					getMeshByName( x.name ).children.push( physicalObject );
					extras.objects.add( physicalObject );
					return;

				}
				if ( extras.accountForExtraProperties ) {

					getMeshByName( x.name ).children.push( physicalObject );
					extras.objects.add( physicalObject );
					return;

				}
				if ( extras.fileType != "gltf" ) {

					physicalObject.add( c );
					getMeshByName( x.name ).children.push( physicalObject );
					extras.objects.add( physicalObject );

				} else {

					physicalObject.children = c.children
					for ( var i in physicalObject ) {
						if ( i != "position" && i != "rotation" && i != "quaternion" && i != "scale" ) {
							c[i] = physicalObject[i];
						}
					}
					extras.objects.add( c );

				}
				physicalObject.geometry = new THREE.BufferGeometry().fromGeometry( physicalObject.geometry );
				c.geometry = new THREE.BufferGeometry().fromGeometry( c.geometry );
				if ( getMeshByName( x.name ).children.length === 1 ) {
					getMeshByName( x.name ) = getMeshByName( x.name ).children[0];
				}
			} );

		} else if ( extras.objects ) {
			
			if ( extras.starterPos ) {

				getMeshByName( x.name ).position.add( extras.starterPos )

			}
			extras.objects.add( getMeshByName( x.name ) )
			
		}
		getMeshByName( x.name ).children.forEach( castShadow );

		function castShadow( c ) {
			if ( extras.castShadow ) {

				c.castShadow = true

			}
			if ( extras.receiveShadow ) {

				c.receiveShadow = true

			}
			c.children.forEach( castShadow );
		}
		createBaseObj3dListeners( x, extras );
		if ( extras.onload ) {

			extras.onload( threeObject );

		}
		if ( x.onload ) {

			x.onload( threeObject );

		}
		if ( getMeshByName( x.name ).children.length === 1 && extras.noPhysics ) {

			getMeshByName( x.name ) = getMeshByName( x.name ).children[0];

		}
		//animations
		if ( extras.fileType.toLowerCase() === "gltf" && object.animations && object.animations.length ) {
			
			x.animations = [];
			if ( extras.starterPos ) {
				
				getMeshByName( x.name ).position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z);
				object.scene.position.set( extras.starterPos.x, extras.starterPos.y, extras.starterPos.z);
			
			}
			for ( var i in object.animations ) {
				var mixer = new THREE.AnimationMixer( getMeshByName( x.name ) );
				var animation = {
					action: mixer.clipAction( object.animations[i] ),
					play: function ( animatingObjects = [] ) {
						if ( !this.action.paused ) {
							
							return
							
						}
						animatingObjects.forEach( function ( obj, i ) {
							animatingObjects[ i ] = getMeshByName( obj.name )
						} )
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
								getMeshByName( x.name ).children.forEach( function ( object ) {
									if ( animatingObjects.indexOf(object) > -1 ) {
									
										object.position.add(extras.starterPos);
									
									}
									object.__dirtyPosition = true;
									object.__dirtyRotation = true;
								} );
							}, 16 )
					}
				}
				animation.action.paused = true;
				x.animations[i] = animation;
			}
			
		}
	}
	//creates the object
	this.x = ( extras.x || 0 );
	this.y = ( extras.y || 0 );
	this.z = ( extras.z || 0 );
	this.smoothShading = false;
	this.castShadow = ( extras.castShadow || true );
	this.receiveShadow = ( extras.receiveShadow || false );
}
//compatability
protonjs.importObj = function ( objects, objPath, mtlPath, extras = {} ) {
	var b = {
		fileType: "obj",
		objects: objects,
		objPath: objPath,
		mtlPath: mtlPath
	};
	for ( var i in extras ) {
		b[i] = extras[i];
	}
	return new protonjs.importObject( b );
}
/*
	loc:9.5
*/
protonjs.sky = function ( extras = {} ) {
	extras = extras || {};
	var x = this;
	this.mesh = new THREE.Sky();
	this.mesh.skipMaterialReplacement = true;
	this.mesh.scale.setScalar( 450000 );
	this.mesh.material.uniforms = {
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
	for ( var i in this.mesh.material.uniforms ) {
		this[i] = this.mesh.material.uniforms[i].value
		//set the listeners
		if ( i != "sunPosition" ) {

			this.watch( i, function ( id, oldval, newval ) {
				this.mesh.material.uniforms[id].value = newval;
			} );

		}
	}
	for ( var i in extras ) {
		//set the value
		if ( this.mesh.material.uniforms[i] ) {

			this[i] = extras[i];
			this.mesh.material.uniforms[i] = extras[i];

		}
	}
	if ( extras.sun ) {

		//
		this.sun = extras.sun;
		this.sun.mesh.position.set(
			this.sunPosition.x,
			this.sunPosition.y,
			this.sunPosition.z
		);
		this.sun.x = this.sun.mesh.position.x
		this.sun.y = this.sun.mesh.position.y
		this.sun.z = this.sun.mesh.position.z
		this.sun.mesh.__dirtyPosition = true;
		//
		this.watch( "sunPosition", function ( id, oldval, newval ) {
			this.mesh.material.uniforms[id].value = newval;
			//
			this.sun.mesh.position.set(
				newval.x,
				newval.y,
				newval.z
			);
			this.sun.x = newval.x;
			this.sun.y = newval.y;
			this.sun.z = newval.z;
			this.sun.mesh.__dirtyPosition = true;
		} );

	}
}
/*
	loc:9.6
	tools
*/
protonjs.crosshair = function ( crosshair ) {
	var crosshairElement = document.createElement( "div" );
	crosshairElement.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(  -50%, -50%  );
		height: 21px;
		width: 21px;
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
protonjs.rotateVector3 = function ( axis, angle, vector, normalize, cancelAutoAngle ) {
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
	loc:9.7
	changing geometries of meshes
*/
protonjs.__changeMeshGeometry = function( obj, extras = {} ) {
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
}


var proton3d;

function runWorkerFunction(fn, scene){
	var msgArray = {
			type: "function",
			paused: protonjs.paused
		}
	for ( var i in scene ) {
		if ( typeof scene[ i ] != "object" && typeof scene[ i ] != "function" ) {
			
			msgArray[ i ] = scene[ i ]
			
		}
	}
	switch ( fn ) {
		
		case "createCube":
			msgArray.function = "createCube";
			msgArray.params = [
				"name",
				"width",
				"height",
				"depth",
				"segments",
				"mass"
			]
			break;
			
		case "createSphere":
			msgArray.function = "createSphere";
			msgArray.params = [
				"name",
				"radius",
				"segments",
				"mass"
			]
			break;
		
		case "createCylinder":
			msgArray.function = "createCylinder";
			msgArray.params = [
				"name",
				"radiusTop",
				"radiusBottom",
				"height",
				"segments",
				"mass"
			]
			break;
			
		case "createLight":
			msgArray.function = "createLight";
			msgArray.params = [
				"name",
				"intensity",
				"type",
				"color"
			]
			break;
		
	}
	console.log( "before", msgArray );
	proton3d.postMessage( msgArray );
	function messageListener ( msg ) {
		if ( msg.data.type === "return" ) {
			
			if ( msg.data.paused != protonjs.paused ) {
				
				if ( protonjs.paused ) {
					
					protonjs.resume()
					
				} else {
					
					protonjs.pause()
					
				}
				
			}
			
			for ( var i in msg.data ) {
				if ( scene[ i ] != null ) {
					
					scene[ i ] = msg.data[ i ]
					
				}
			}
			
			console.log(msg.data);
			proton3d.removeEventListener( "message", messageListener );
			return msg.data.return;
			
		}
	}
	return proton3d.addEventListener( "message", messageListener )
}
protonjs.init3d = function ( worker, domBridge ) {
	document.writeln( '<script src=' + domBridge + '></script>' );
	proton3d = new Worker( worker );
}



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
				camera.name = this.name;
				meshes.push( camera )
				//
				this.setLinearVelocity = null;
				this.setLinearVelocity = null;
				this.getAngularVelocity = null
				this.getAngularVelocity = null;
				this.changeViewingWidth = function( value ) {
					camera.left = value / -1;
					camera.right = value / 1;
					camera.updateProjectionMatrix()
				}
				this.changeViewingHeight = function ( value ) {
					camera.top = value / 1;
					camera.bottom = value / -1;
					camera.updateProjectionMatrix()
				}
				this.changeNear = function ( value ) {
					camera.near = value
					camera.updateProjectionMatrix()
				}
				this.changeFar = function ( value ) {
					camera.far = value
					camera.updateProjectionMatrix()
				}
				this.changeAspectRatio = function ( value ) {
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
				camera.name = this.name;
				meshes.push( camera )
				//
				this.setLinearVelocity = null;
				this.setLinearVelocity = null;
				this.getAngularVelocity = null
				this.getAngularVelocity = null;
				this.changeFOV = function ( value ) {
					camera.fov = value;
					camera.updateProjectionMatrix()
				}
				this.changeAspectRatio = function ( value ) {
					camera.aspect = value;
					camera.updateProjectionMatrix()
				}
				this.getZoom = function () {
					return camera.zoom
				}
				this.setZoom = function ( value ) {
					camera.zoom = value
					camera.updateProjectionMatrix()
				}
				this.changeNear = function ( value ) {
					camera.near = value
					camera.updateProjectionMatrix()
				}
				this.changeFar = function ( value ) {
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
				spotlight.name = this.name;
				meshes.push( spotlight );
				//
				this.setLinearVelocity = null;
				this.setLinearVelocity = null;
				this.getAngularVelocity = null
				this.getAngularVelocity = null;
				this.changeColor = function ( hexString ) {
					spotlight.color = new THREE.Color( hexString )
				}
				this.changeIntensity = function ( value ) {
					spotlight.intensity = value
				}
				this.getIntensity = function ( value ) {
					return spotlight.intensity
				}
				//
				break;
			
			case "directionallight":
				var directionallight = new THREE.DirectionalLight( new THREE.Color( color ), intensity )
				directionallight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.25, 1000 );
				directionallight.shadow.radius = 1.5;
				directionallight.shadow.bias = -0.00005;
				directionallight.name = this.name;
				meshes.push( directionallight );
				//
				this.setLinearVelocity = null;
				this.setLinearVelocity = null;
				this.getAngularVelocity = null
				this.getAngularVelocity = null;
				this.changeColor = function ( hexString ) {
					directionallight.color = new THREE.Color( hexString )
				}
				this.changeIntensity = function ( value ) {
					directionallight.intensity = value
				}
				//
				break;
			
			case "sky":
				var sky = new THREE.Sky();
				
				this.skipPBRReplacement = true;
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
					this[ i ] = sky.material.uniforms[ i ].value
					//set the listeners
					if ( i != "sunPosition" ) {

						this.watch( i, function ( id, oldval, newval ) {
							sky.material.uniforms[ id ].value = newval;
						} );

					}
				}
				for ( var i in extras ) {
					//set the value
					if ( sky.material.uniforms[ i ] ) {

						this[ i ] = extras[ i ];
						sky.material.uniforms[ i ].value = extras[ i ];
					}
				}
				if ( extras.sun ) {

					//
					this.sun = extras.sun;
					this.sun.setPosition(
						this.sunPosition.x,
						this.sunPosition.y,
						this.sunPosition.z
					)
					//
					this.watch( "sunPosition", function ( id, oldval, newval ) {
						sky.material.uniforms[ id ].value = newval;
						//
						this.sun.setPosition(
							newval.x,
							newval.y,
							newval.z
						)
					} );

				}
				sky.name = this.name;
				meshes.push( sky )
				break
				
			case "cube":
				
				extras.type = "cube";
				//create the cube
				var cube;
				if ( extras.noPhysics ) {

					cube = new THREE.Mesh(
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material
					)

				} else {
					
					cube = new Physijs.BoxMesh(
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material,
						( extras.mass || 0 )
					)
					
				}
				cube.name = this.name;
				meshes.push( cube );
				//creates an array
				console.log(this)
				this.width = extras.width || 1;
				this.height = extras.height || 1;
				this.depth = extras.depth || 1;
				console.log(this.width);
				//creates listeners for each array
				createBaseObj3dListeners( this, extras );
				var obj = this;
				//geometry
				this.watch( "width", function ( id, oldval, newval ) {
					obj._width = newval;
					protonjs.__changeMeshGeometry( obj, obj, this.name );
				} );
				this.watch( "height", function ( id, oldval, newval ) {
					obj._height = newval;
					protonjs.__changeMeshGeometry( obj, obj, this.name );
				} );
				this.watch( "depth", function ( id, oldval, newval ) {
					obj._depth = newval;
					protonjs.__changeMeshGeometry( obj, obj, this.name );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && this[i] == undefined ) {

						this[i] = extras[i];

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
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material
					)

				} else {
					
					sphere = new Physijs.SphereMesh(
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material,
						( extras.mass || 0 )
					)
				
				}
				sphere.name = this.name;
				meshes.push( sphere );
				//creates some properties
				this.radius = 1;
				//adds listeners for each property
				var obj = this;
				createBaseObj3dListeners( this, extras );
				//geometry
				this.watch( "radius", function ( id, oldval, newval ) {
					obj._radius = newval;
					changeGeometryParameters( obj );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && this[i] == undefined ) {

						this[i] = extras[i];

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
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material
					)

				} else {
					
					new Physijs.CylinderMesh(
						protonjs.__changeMeshGeometry( null, extras ).geometry,
						protonjs.__changeMeshMaterial( extras ).material,
						( extras.mass || 0 )
					);
					
				}
				cylinder.name = this.name;
				meshes.push( cylinder );
				//creates extra values
				this.radiusTop = 1;
				this.radiusBottom = 1;
				this.height = 1;
				//creates listeners for each value
				var obj = this;
				createBaseObj3dListeners( this, extras );
				//
				this.watch( "radiusTop", function ( id, oldval, newval ) {
					obj._radiusTop = newval;
					protonjs.__changeMeshGeometry( obj );
				} );
				this.watch( "radiusBottom", function ( id, oldval, newval ) {
					obj._radiusTop = newval;
					protonjs.__changeMeshGeometry( obj );
				} );
				this.watch( "height", function ( id, oldval, newval ) {
					obj._height = newval;
					protonjs.__changeMeshGeometry( obj );
				} );
				//
				for ( var i in extras ) {
					if ( extras[i] && this[i] == undefined ) {

						this[i] = extras[i];

					}
				}
				break
				
			default:
				
				var mesh = extras.mesh;
				if ( mesh.name === "" || mesh.name == undefined ) {
					
					mesh.name = this.name
					
				} else {
					
					this.name = mesh.name
					
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
				namecheck( this )
				if ( !mesh.material[ 0 ] ) {
				
					this.material =  new Proton3DMaterial( this, {
						material: mesh.material
					} )
				
				} else {
					
					var y = this;
					this.material = [];
					mesh.material.forEach( function ( material, i ) {
						
						y.material.push( new Proton3DMaterial( mesh, {
							material: material,
							materialLocation: i
						} ) )
						
					} );
					
				}
				meshes.push( mesh );
			
		}
		//creates the mesh's material -- must be at the very end to ensure that the material is initialized with an object
		if ( getMeshByName( this.name ).material && extras.type != "sky" && !extras.mesh ) {
			
			this.material = extras.material || new Proton3DMaterial( getMeshByName( this.name ), {
				name: extras.materialName,
				material: getMeshByName( this.name ).material
			} )
			
		}
		//sets the mesh's parent
		getMeshByName( this.name ).p3dParent = this
		//sets the mesh's position + rotation
		this.setPosition( extras.x, extras.y, extras.z )
		this.setRotation( extras.rotationX, extras.rotationY, extras.rotationZ )
		//if you're not going to use physics, you can get scaling!
		if ( extras.noPhysics ) {
			
			this.getScale = function () {
				return getMeshByName( this.name ).scale
			}
			this.setScale = function ( x, y, z ) {
				if ( x == undefined ) {
					
					x = this.getScale().x
					
				}
				if ( y == undefined ) {
					
					y = this.getScale().y
					
				}
				if ( z == undefined ) {
					
					z = this.getScale().z
					
				}
				getMeshByName( this.name ).scale.set( x, y, z )
			}
			Object.defineProperty( this, "scale", {
				get: function() {
					return this.getScale()
				},
				set: function( vector ) {
					return this.setScale( vector.x, vector.y, vector.z )
				}
			} )
			
		}
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
		return {
			cast: getMeshByName( this.name ).castShadow,
			receive: getMeshByName( this.name ).receiveShadow
		}
	}
	setShadowOptions( cast = null, receive = null ) {
		getMeshByName( this.name ).castShadow = cast || getMeshByName( this.name ).castShadow
		getMeshByName( this.name ).receiveShadow = receive || getMeshByName( this.name ).receiveShadow
	}
	playAudio ( src, listener ) {
		var sound = new THREE.PositionalAudio( listener );
		getMeshByName( this.name ).add( sound );
		var audio = new Audio( src );
		sound.setMediaElementSource( audio );
		return audio;
	}
	applyImpulse( force, offset = new THREE.Vector3( 0, 0, 0 ) ) {
		getMeshByName( this.name ).applyImpulse( force, offset )
	}
	delete() {
		if ( this.children ) {
			
			this.children.forEach( function ( child ) {
				if ( child.parent ) {
					
					child.parent.remove( child )
					
				}
			} )
			
		}
		if ( this.parent ) {
			
			this.parent.remove( this )
			
		}
	}
	setMass( value ) {
		getMeshByName( this.name ).mass = value
	}
	getMass() {
		return getMeshByName( this.name ).mass
	}
	setOnUse( useFunction ){
		this.__onUse = useFunction
	}
	setOnNear( nearFunction ){
		this.__onNear = nearFunction
	}
	setPickupDistance( value ){
		this.__pickupDistance = value
	}
	setPickup( pickupness, returnAfterUse ) {
		this.__pickupable = pickupness
		this.__returnAfterPickup = returnAfterUse
	}
	getOnUse(){
		return this.__onUse
	}
	getOnNear(){
		return this.__onNear
	}
	getPickupDistance(){
		
	}
	getPickup() {
		
	}
	makeListeningObject( THREEListener = new THREE.AudioListener() ) {
		getMeshByName( this.name ).add( THREEListener )
	}
	setMeshVariable( name, value ) {
		getMeshByName( this.name )[ name ] = value
	}
	getMeshVariable( name ) {
		return getMeshByName( this.name )[ name ]
	}
	setLinearVelocity( x = 0, y = 0, z = 0 ) {
		if ( !x.x ) {
			
			x = new THREE.Vector3( x, y, z )
			
		}
		getMeshByName( this.name ).setLinearVelocity( x )
	}
	setAngularVelocity( x = 0, y = 0, z = 0 ) {
		if ( !x.x ) {
			
			x = new THREE.Vector3( x, y, z )
			
		}
		getMeshByName( this.name ).setAngularVelocity( x )
	}
	setLinearFactor( x = 0, y = 0, z = 0 ) {
		if ( !x.x ) {
			
			x = new THREE.Vector3( x, y, z )
			
		}
		getMeshByName( this.name ).setLinearFactor( x )
	}
	setAngularFactor( x = 0, y = 0, z = 0 ) {
		if ( !x.x ) {
			
			x = new THREE.Vector3( x, y, z )
			
		}
		getMeshByName( this.name ).setAngularFactor( x )
	}
	addEventListener( name, callback) {
		getMeshByName( this.name ).addEventListener( name, callback )
	}
	removeEventListener( name, callback) {
		getMeshByName( this.name ).removeEventListener( name, callback )
	}
	setRotation( x, y, z ) {
		if ( x == undefined ) {
			
			x = this.getRotation().x
			
		}
		if ( y == undefined ) {
			
			y = this.getRotation().y
			
		}
		if ( z == undefined ) {
			
			z = this.getRotation().z
			
		}
		getMeshByName( this.name ).rotation.set( x, y, z );
		getMeshByName( this.name ).__dirtyRotation = true
	}
	setPosition( x, y, z ) {
		if ( typeof x === "object" ) {
			
			getMeshByName( this.name ).position.set( x.x, x.y, x.z );
			
		}
		if ( x == undefined ) {
			
			x = this.getPosition().x
			
		}
		if ( y == undefined ) {
			
			y = this.getPosition().y
			
		}
		if ( z == undefined ) {
			
			z = this.getPosition().z
			
		}
		getMeshByName( this.name ).position.set( x, y, z );
		getMeshByName( this.name ).__dirtyPosition = true
	}
	getRotation() {
		return getMeshByName( this.name ).rotation//.clone()
	}
	getPosition() {
		return getMeshByName( this.name ).position//.clone()
	}
	applyLocRotChange(){
		getMeshByName( this.name ).__dirtyPosition = true
		getMeshByName( this.name ).__dirtyRotation = true
	}
	getLinearVelocity() {
		return getMeshByName( this.name ).getLinearVelocity()
	}
	getAngularVelocity() {
		return getMeshByName( this.name ).getAngularVelocity()
	}
	isMesh( object ) {
		//the object has to be a proton3dobject, as with all of these functions.
		return object.name == this.name
	}
	getWorldDirection() {
		if ( getMeshByName( this.name ).getWorldDirection ) {
		
			return getMeshByName( this.name ).getWorldDirection( new THREE.Vector3() )
		
		} else {
			
			var point = new THREE.Mesh(
					new THREE.BoxBufferGeometry( 0.001, 0.001, 0.001 ),
					new THREE.MeshBasicMaterial()
				),
				mesh = getMeshByName( this.name );
			point.position.set( 0, 0.5, 2 )
			mesh.add( point )
			var position = ( new THREE.Vector3() ).setFromMatrixPosition( point.matrixWorld );
			mesh.remove( point )
			return position.sub( getMeshByName( this.name ).position)
		
		}
	}
	lookAt( x = 0, y = 0, z = 0 ) {
		if ( getMeshByName( this.name ).lookAt ) {
			getMeshByName( this.name ).lookAt( new THREE.Vector3( x, y, z ) )
			getMeshByName( this.name ).__dirtyRotation = true;
		}
	}
	getWorldPosition() {
		return ( new THREE.Vector3() ).setFromMatrixPosition( getMeshByName( this.name ).matrixWorld )
	}
	getCollidingObjects() {
		return getMeshByName( this.name )._physijs.touches
	}
	add( object ) {
		getMeshByName( this.name ).add( getMeshByName( object.name ) );
		object.parent = this;
		this.children.push( object );
	}
	remove( object ) {
		getMeshByName( this.name ).remove( getMeshByName( object.name ) );
		object.parent = null;
		removeFromArray( this.children, object );
	}
}
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
		//creates a material
		if ( !extras.material ) {
			
			var material = new THREE.MeshStandardMaterial()
			material.name = this.name;
			material.transparent = true;
			materials.push( material )
		//	parentObject.material = material;
			
		} else {
			
			extras.material.name = this.name;
			extras.material.transparent = true;
			materials.push( extras.material )
			if ( extras.materialLocation != undefined || extras.materialLocation != null ) {
				
				parentObject.material[ extras.materialLocation ] = extras.material
				console.log("test", parentObject.material[ extras.materialLocation ] === extras.material)
				
			} else {
				
				parentObject.material = extras.material;
				
			}
			
		}
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
		getMaterialByName( this.name ).emmisive = new THREE.Color( color )
	}
	getEmmisiveColor() {
		return getMaterialByName( this.name ).emmisive.getStyle()
	}
	setWireframe( value ) {
		getMaterialByName( this.name ).wireframeIntensity = value
	}
	getWireframe() {
		return getMaterialByName( this.name ).wireframeIntensity
	}
	setEmmisive( value ) {
		getMaterialByName( this.name ).emmisiveIntensity = value
	}
	getEmmisive() {
		return getMaterialByName( this.name ).emmisiveIntensity
	}
	setColor( hexString ) {
		getMaterialByName( this.name ).color = new THREE.Color( hexString )
	}
	getColor() {
		return getMaterialByName( this.name ).color.getStyle()
	}
	setRoughness( value ) {
		getMaterialByName( this.name ).roughness = value
	}
	setMetalness( value ) {
		getMaterialByName( this.name ).metalness = value
	}
	getRoughness( value ) {
		return getMaterialByName( this.name ).roughness
	}
	getMetalness( value ) {
		return getMaterialByName( this.name ).metalness
	}
	setOpacity( value ) {
		getMaterialByName( this.name ).opacity = value
	}
	getOpacity() {
		return getMaterialByName( this.name ).opacity
	}
	makeTransparent( value ) {
		/*
		materials.splice( materials.indexOf( getMaterialByName( this.name ) ), 1 )
		var material = new THREE.MeshStandardMaterial()
		material.name = this.name;
		material.transparent = true;
		materials.push( material );
		*/
		//
		this.setOpacity( 0.001 );
		getMaterialByName( this.name ).depthWrite = false
	}
}

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
/*
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
*/

protonjs.importObject = function( extras = {} ) {
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
		if ( extras.noPhysics != true ) {

			mesh.children.forEach( function ( c, i ) {
				var m,
					oldGeometry;
				//some geometry stuff  {
				if ( c.isMesh && c.geometry != null && !c._physijs ) {

					c.updateMatrix();
				//	oldGeometry = c.geometry.clone();
					c.geometry = new THREE.Geometry().fromBufferGeometry( c.geometry );
					if ( extras.accountForExtraProperties ) {

						c.geometry.vertices.forEach( function ( vertex ) {
							vertex.multiply( c.scale );
						} );

					}
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
				physicalObject.name = c.name;
				physicalObject.userData = c.userData;
				physicalObject.material.transparent = true;
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
				//
				if ( extras.useCollisionBox ) {

					extras.collisionBoxPosition = ( extras.collisionBoxPosition || new THREE.Vector3( 0, 0, 0 ) );
					c.position.set( extras.collisionBoxPosition.x, extras.collisionBoxPosition.y, extras.collisionBoxPosition.z );
					physicalObject.add( c );
					mesh.children.push( physicalObject );
					objects.push( physicalObject );
					return;

				}
				if ( extras.accountForExtraProperties ) {

					mesh.children.push( physicalObject );
					objects.push( physicalObject );
					return;

				}
				if ( extras.fileType != "gltf" ) {

					physicalObject.add( c );
					mesh.children.push( physicalObject );
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
	//	createBaseObj3dListeners( x, extras );
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
	//creates the object
	/*
	this.x = ( extras.x || 0 );
	this.y = ( extras.y || 0 );
	this.z = ( extras.z || 0 );
	this.smoothShading = false;
	this.castShadow = ( extras.castShadow || true );
	this.receiveShadow = ( extras.receiveShadow || false );*/
}