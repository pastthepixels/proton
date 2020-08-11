# MapScript Keywords / Functions
| Keyword/Function                                                                                                            | Description                                    |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------: |
| `log()`                                                                                                                     | Equivalent to `console.log`.                   |
| `true`                                                                                                                      |                                                |
| `false`                                                                                                                     |                                                |
| `this`                                                                                                                      | Same as in JavaScript.                         |
| `init( graphicsRating (float), sky (boolean) )`                                                                             | Initializes the main scene.                    |
| `//`                                                                                                                        | A single-line comment.                         |
| `/*` and `*/`                                                                                                               | A multi-line comment.                          |
| `set`                                                                                                                       | Same as JavaScript's `var`.                    |
| `set global`                                                                                                                | Sets a global variable.                        |
| `new`                                                                                                                       | Same as in JavaScript.                         |
| `{}`                                                                                                                        | Same as in JavaScript.                         |
| `return`                                                                                                                    | Same as in JavaScript.                         |
| `[]`                                                                                                                        | Same as in JavaScript.                         |
| `function`                                                                                                                  | Same as in JavaScript.                         |
| `importObject( { src: url, mass: float, onload: function, onuse: function, interactable: boolean, pickupable: boolean } )`  | Imports an object via a file (ex: glTF).       |
| `toggle( boolean )`                                                                                                         | Returns `!boolean`                             |
| `degToRad( deg )`                                                                                                           | Converts a measurement in degrees to radians.  |
| `radToDeg( rad )`                                                                                                           | Converts a measurement in radians to degrees.  |
| `cls( { init: [function], [variables/functions] } )`                                                                        | Returns an object class.                       |
| `interval( function, timeout )`                                                                                             | Same as JavaScript's setInterval.              |
| `clearInterval( interval )` / `clearTimeout( timeout )`                                                                     | Same as in JavaScript.                         |
| `timeout( function, timeout )`                                                                                              | Same as JavaScript's setTimeout.               |
| `!` (as in `!true`)                                                                                                         | Same as Python's `not`.                        |
| `&&` (as in `true && false`)                                                                                                | Same as Python's `and`.                        |