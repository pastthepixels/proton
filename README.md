![logo](./images/logo/logo.png/)
The Proton engine is a free and open source game engine with these core focuses:
- Performance
- Ease of use
- Flexibility
and
- Being a different game engine: one where both novices and experts can program their games with code instead of visual environments.

# To-Do

1. ~~~[ ] Rewrite Proton in Python <-- I'm experimenting with Panda3D + https://github.com/Moguri/panda3d-gltf/ + https://github.com/Moguri/panda3d-simplepbr/ (to get a freshly baked model from the Blenders to your computer effortlessly)~~~
2. ~~~[ ] Create a new format for maps that can be created in Blender (because Python)~~~
3. ~~~[ ] Add Proton examples~~~
Turns out it's way better for me to just make Proton in JavaScript and use [Electron](https://www.electronjs.org).
I've rewritten the engine for BabylonJS and I'm currently making documentation on using Proton.
Hopefully, in the future, Proton will be able to help you with more than just programming a game -- maybe something like a quick setup program for the terminal?

# How can I use Proton?
Check out the getting started guide at [proton-documentation.readthedocs.io](https://proton-documentation.readthedocs.io/)!

# How do I contribute?
DISCLAIMER: I have never contributed to anything nor have I been contributed to as of yet. If by any means you know of a better way to do this, please let me know!
- Make new contributions to the `beta` branch: don't add new commits to the `stable` branch.
- Make sure your code hasn't broken the engine by running self-tests first.
- All code is written in [Mr.doob's Code Style™](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2).

# What are the goals/disclaimers for the Proton engine?
- All stable releases are guaranteed to not be changed in such a way as to break code designed for older versions, unless a migration guide is issued.
- Proton is an in-development engine. I don't know what I'm going to do with it, but I promise to work on it for a long time!
