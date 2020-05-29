![logo](./images/logo/logo.png/)
The Proton engine is a game engine that is designed to focus on 3 things:
- Performance
- Ease of use
- Uniformity across platforms\
...and, right now, is only developed for the web.
## How can I use Proton?
### ProtonJS
ProtonJS has been tested to work on Google Chrome.
If you're using Proton3D locally on Google Chrome, you must enable the flag `--disable-web-security` with `--user-data-dir` to bypass CORS-related issues. On Windows 10, it should look like this:
```
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir=C:/tmp/ChromeData
```
If you don't have a good processor, it's good idea to disable v-sync. You can do that with the flags `--disable-gpu-vsync` and `--disable-frame-rate-limit`. With every flag, it would look like this:
```
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir=C:/tmp/ChromeData --disable-gpu-vsync --disable-frame-rate-limit
```

## How do I contribute?
Well, you're in luck, because I don't really know what to put here.
What I do know is that everything is (at leased supposed to be) written in [Mr.doob's Code Style](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2).

## What are the goals/disclaimers for the Proton engine?
- The Proton engine is designed to be cross-platform (or more specifically, cross-programming-language) via MapScript so that developers can use the same code across different platforms and "base-engines".
- All stable releases are guaranteed to not be changed in such a way as to break code designed for older versions.

## What's the current roadmap for the Proton engine?
- [ ] Improve MapScript
- [ ] Add a list of examples for ProtonJS
- [ ] Move ProtonJS to MapScript (so that porting the engine would just mean creating a MapScript interpreter)