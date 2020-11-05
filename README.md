![logo](./images/logo/logo.png/)
The Proton engine is a game engine that is designed to focus on 3 things:
- Performance
- Ease of use
- Uniformity across platforms\
...and, right now, is only developed for the web.

# To-Do
1. [ ] Rewrite Proton in Python <-- I'm experimenting with Panda3D + https://github.com/Moguri/panda3d-gltf/ + https://github.com/Moguri/panda3d-simplepbr/ (to get a freshly baked model from the Blenders to your computer effortlessly)
2. [ ] Create a new format for maps that can be created in Blender (because Python)
3. [ ] Add Proton examples

# How can I use Proton?
## ProtonJS
ProtonJS has been tested to work on Chromium.
If you're using Proton3D locally on Chromium, you have to enable the flag `--disable-web-security` with `--user-data-dir` to bypass CORS-related issues. On Linux, it should look like this (note that Windows users can replace `chromium-browser` with the path to Chrome's executable, and `/tmp` for a temporary directory, and that you can also use Chromium):
```
chromium-browser --disable-web-security --user-data-dir=/tmp/chrome
```
If you don't have a good processor, it's a good idea to disable v-sync. You can do that with the flags `--disable-gpu-vsync` and `--disable-frame-rate-limit`. With all flags, it should look like this:
```
chromium-browser --disable-web-security --user-data-dir=/tmp/chrome --disable-gpu-vsync --disable-frame-rate-limit
```

# How do I contribute?
- Make new contributions to the `beta` branch: don't add new commits to the `stable` branch.
- Make sure your code hasn't broken the engine by running self-tests first.
- All code is written in [Mr.doob's Code Style™](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2).

# What are the goals/disclaimers for the Proton engine?
- The Proton engine is designed to be cross-platform (or more specifically, cross-programming-language) via MapScript so that developers can use the same code across different platforms and "base-engines".
    - MapScript is deprecated now; I really don't want to spend time making GDScript's 3000th clone in the hope that will "standardize everything"
    - On that note, I'm going to try to switch to Python/make Proton code a little more "native" (nobody wants to make a full game that can on run in Chromium)
- All stable releases are guaranteed to not be changed in such a way as to break code designed for older versions, unless a migration guide is issued.
