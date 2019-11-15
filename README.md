# proton
The Proton engine is a game engine that is designed to focus on 3 things:
- Performance
- Ease of use
- Uniformity across platforms  
...and is right now only developed for the web.
# How can I just use the thing?
proton.js -- the only version of this -- has been tested to work on Google Chrome.
If you're using Proton3D locally on Google Chrome, you must enable the flag `--disable-web-security` with `--user-data-dir` to bypass some CORS issue that I forgot about a long time ago. On Windows 10, it would look like this:
```
chrome.exe --disable-web-security --user-data-dir=./temp/
```
Make sure no other windows of the browser are open!

# Alright! How do I contribute?
Well, you're in luck because I don't really know what to put here.
Everything is (at leased supposed to be) written in (Mr.doob's Code Style)[https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2] (with an exclaimer in proton.js for the constant `proton`), and make sure to make your own branch(es) before changing this git.

# What are the goals/disclaimers for the proton engine?
- I just started moving to GitHub, so I have no idea how this thing works.
- The Proton engine is designed to be cross-platform (or more specifically, cross-programming-language) so that developers can use the same code across different platforms and "base-engines".
- I initially planned for this engine to use all lowercase text, but things might be looking different.
