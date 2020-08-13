# MapScript Keywords / Functions
| Keyword/Function                                                                                                            | Description                                    |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------: |
| `print` (`print("Hello World!")`)                                                                                           | Equivalent to `console.log`.                   |
| `init( graphicsRating (float), sky (boolean) )`                                                                             | Initializes the main scene.                    |
| `var global`                                                                                                                | Sets a global variable.                        |
| `importObject( { src: url, mass: float, onload: function, onuse: function, interactable: boolean, pickupable: boolean } )`  | Imports an object via a file (ex: glTF).       |
| `toggle boolean` (`toggle true`)                                                                                            | Same as `!boolean`                             |
| `degToRad( deg )`                                                                                                           | Converts a measurement in degrees to radians.  |
| `radToDeg( rad )`                                                                                                           | Converts a measurement in radians to degrees.  |
| `interval( function, timeout )`                                                                                             | Same as JavaScript's setInterval.              |
| `clearInterval( interval )` / `clearTimeout( timeout )`                                                                     | Same as in JavaScript.                         |
| `timeout( function, timeout )`                                                                                              | Same as JavaScript's setTimeout.               |
