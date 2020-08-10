# MapScript Keywords / Functions
| Keyword/Function                                                                                                            | Description                                    |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------: |
| `log()`                                                                                                                     | Equivalent to `console.log`.                   |
| `true`                                                                                                                      |                                                |
| `false`                                                                                                                     |                                                |
| `this`                                                                                                                      | Same as in JavaScript.                         |
| `init( graphicsRating (float), sky (boolean) )`                                                                             | Initializes the main scene.                    |
| `//`                                                                                                                        | A single-line comment.                         |
| `set`                                                                                                                       | Same as JavaScript's `var`.                    |
| `set global`                                                                                                                | Sets a global variable.                        |
| `new`                                                                                                                       | Same as in JavaScript.                         |
| `{}`                                                                                                                        | Same as in JavaScript.                         |
| `[]`                                                                                                                        | Same as in JavaScript.                         |
| `function`                                                                                                                  | Same as in JavaScript.                         |
| `importObject( { src: url, mass: float, onload: function, onuse: function, interactable: boolean, pickupable: boolean } )`  | Imports an object via a file (ex: glTF).       |
| `toggle( boolean )`                                                                                                         | Returns `!boolean`                             |
| `degToRad( deg )`                                                                                                           | Converts a measurement in degrees to radians.  |
| `radToDeg( rad )`                                                                                                           | Converts a measurement in radians to degrees.  |
| `cls( { init: [function], [variables/functions] } )`                                                                        | Returns an object class.                       |
| `interval( function, timeout )`                                                                                             | Same as JavaScript's setInterval.              |
| `timeout( function, timeout )`                                                                                              | Same as JavaScript's setTimeout.               |