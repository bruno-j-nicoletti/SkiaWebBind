# Skia WASM Library
A minimal library that allows a program written in C++ that uses the [skia](https://skia.org/) drawing library to execute in the browser and draw on a HTML canvas.

Very much a work in progress at the moment and not ready to be used.

## Building
I have only built this on MacOS, but I expect it to work on any UNIX-alike. No idea about Windows. 

* First install the [emsdk](https://emscripten.org/docs/getting_started/downloads.html) and activated it as per instructions on the webpage.
* have a working version of `make` installed
* type `make`
    * this will take a very long time as it is downloading and compiling several thousand files files. This is quite dull.

This should...
* download skia source code into `thirdparty/skia`,
* build skia and related libraries for web assembly
    * the results will be in the `build` directory
        * libSkia.a
* build libSkiaWebBind.a
* build a simple example using the web bindings and skia

**!NOTE!**
Skia will be built with the emsdk you activated, not the one it uses to build CanvasKit.

## Running the example
Start a web server in your checkout, for example...
```
python3 -m http.server
```

Browse into `build/example` and open `logoExample.html`. You should see a canvas with the SkiaLogo over a background slowly changing colours . 

## TODOs/Issues
* Parameterise creation of the web binding
    * eg: attribs.powerPreference
* How to handle HTML canvas resizing and any other relevant canvas events?
* Package up the JS side of it all
    * or provide a minimal shell?
* be able to build with exceptions enabled
    * currently borks on linking with missing symbols if `-fwasm-exceptions` is enabled
* call the skia build process from cmake, not make
* software mode fall back
