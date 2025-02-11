# Skia WASM Library
A minimal library that allows a program written in C++ that uses the [skia](https://skia.org/) drawing library to execute in the browser and draw on a HTML canvas.

Very much a work in progress at the moment and not ready to be used.

## Building
I have only built this on MacOS, but I expect it to work on any UNIX-alike. *I have no idea about Windows.*

* install the [emsdk](https://emscripten.org/docs/getting_started/downloads.html) and activated it as per instructions on the webpage,
* have a working version of `make` installed,
* have a working version of `git` installed,
* install google's [gn](https://gn.googlesource.com/gn/+/d2e84de8617407cfab0233afc557102cc499e9be/README.md) build system, which is needed to build Skia to WASM,
* have python3 installed, needed for the `build-skia.py` which slaps the `gn` build configuration into appropriate shape to build to WASM,
* issue the command `make`
    * this will take a very long time as it is downloading and compiling several thousand files files.

This should...
* download skia source code into `thirdparty/skia`,
* build skia and related libraries for web assembly
    * the results will be in the `build` directory
        * `build/libskia.a`
        * `build/libskottie.a`
        * `build/libskparagraph.a`
        * `build/libsksg.a`
        * `build/libskshaper.a`
        * `build/libskunicode_core.a`
        * `build/libskunicode_icu.a`
* build the web binding lib...
    * `build/libSkiaWebBind.a`
* build a simple C++ example program that uses the web bindings
    * `build/example/logoExample.html`
    * `build/example/logoExample.js`
    * `build/example/logoExample.wasm`

**NOTE**
Skia will be built with the emsdk you activated, not the one it uses to build CanvasKit.

**NOTE**
The final link phase of the demo takes quite a while as -O3 has been passed to the linker. This substantially reduces the size of the generated webassembly. To speed
up linking, remove the -O3 flag from `example/CMakeLists.txt`.

## Running the example
Start a web server in your checkout, for example...
```
python3 -m http.server
```

In a web browser, got to `build/example` and open `logoExample.html`. You should see a canvas with the SkiaLogo over a background slowly changing colours .

## TODOs/Issues
* Parameterise creation of the web binding
    * eg: attribs.powerPreference
* How to handle HTML canvas resizing and any other relevant canvas events?
* be able to build with exceptions enabled
    * currently borks on linking with missing symbols if `-fwasm-exceptions` is enabled
* call the skia build process from cmake, not make
* software mode fall back
* more docs.
