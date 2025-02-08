# Skia WASM Library
A minimal library that allows a program written in C++ that uses the [skia](https://skia.org/) drawing library to execute in the browser and draw on a HTML canvas.

Very much a work in progress at the moment and not ready to be used.

## TODO
* parameterise creation of the web binding
    * eg: attribs.powerPreference
* how to handle HTML canvas resizing and any other canvas events
* package up the JS side of it all
* be able to build with exceptions enabled
    * currently borks on linking with missing symbols if `-fwasm-exceptions` is enabled
* call the whole skia build process from cmake
