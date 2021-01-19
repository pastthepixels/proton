ProtonJS Beta 1.0
=================

## What is ProtonJS, anyway?
ProtonJS needs two parts to run: a scene and the Proton3DInterpreter, which takes ProtonJS "inputs" (e.g. `cube.setPosition( 1, 2, 3 )`) and turns them into inputs for any 3D engine (`cube.position.set( 1, 2, 3 )`). Keep in mind that it uses three.js' `Vector3` object for 3D coordinates. If you prefer to see detailed docs, open the HTML file at `docs/docs.html`.

## Third party software
- three.js + addons --> `git clone https://github.com/mrdoob/threejs.git`
- Physijs --> `git clone https://github.com/chandlerprall/Physijs.git`

## How to navigate to sections
To get to various sections throughout ProtonJS, press Control+F and type `loc:[location number]`.

## Table of contents
### Dependencies
- Loading the default Proton3DInterpreter's dependencies --> 1
### Every class, variable, and function (assorted)
- Enhancing window.setTimeout and window.setInterval --> 2
- Clauses and Provisions --> 3
### ProtonJS
- Proton3D --> 4
- Proton3DInterpreter --> 4.3
- Proton3D Tools --> 4.5
- ProtonJS (variable) --> 5
### MapScript
- MapScript --> 6