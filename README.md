![logo](./images/logo/logo.png/)
The Proton engine is a game engine that is designed to focus on 3 things:
- Performance
- Ease of use
- Uniformity across platforms\
...and, right now, is only developed for the web.

# To-Do
1. [ ] Move ProtonJS to MapScript
    - The goal is to create an engine written in MapScript (a work-in-progress scripting language like JavaScript designed specifically for game development) which functions in a way that we can just make MapScript interpreters for different programming languages and update Proton as a whole from one file.
2. [ ] Create examples for ProtonJS/Proton

# How can I use Proton?
## ProtonJS
ProtonJS has been tested to work on Google Chrome.
If you're using Proton3D locally on Chrome, you have to enable the flag `--disable-web-security` with `--user-data-dir` to bypass CORS-related issues. On Linux, it should look like this (note that Windows users can replace `google-chrome` with the path to Chrome's executable, and `/tmp` for a temporary directory, and that you can also use Chromium):
```
google-chrome --disable-web-security --user-data-dir=/tmp/chrome
```
If you don't have a good processor, it's a good idea to disable v-sync. You can do that with the flags `--disable-gpu-vsync` and `--disable-frame-rate-limit`. With all flags, it should look like this:
```
google-chrome --disable-web-security --user-data-dir=/tmp/chrome --disable-gpu-vsync --disable-frame-rate-limit
```

# How do I contribute?
- Make new contributions to the `beta` branch; do not add commits to the `stable` branch.
- Make sure your code hasn't broken the engine by running self-tests first.
- All code is written in [Mr.doob's Code Style™](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2).

# What are the goals/disclaimers for the Proton engine?
- The Proton engine is designed to be cross-platform (or more specifically, cross-programming-language) via MapScript so that developers can use the same code across different platforms and "base-engines".
- All stable releases are guaranteed to not be changed in such a way as to break code designed for older versions.
