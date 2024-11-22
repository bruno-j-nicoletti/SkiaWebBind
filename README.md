# Skia WASM Library
A minimal library that allows a program written in C++ that uses the [skia](https://skia.org/) drawing library to execute in the browser and draw on a HTML canvas.

Very much a work in progress at the moment and not ready to be used.

## Known issues
  - compiling with `-pthreads` will cause C++->JS function calls to fail
     - specifically `_emval_get_method_caller` called in C++ doesn't get called in JS to register how C++ is calling the JS function
     - possibly linked to https://github.com/emscripten-core/emscripten/issues/15557


## License

Some of this code is based on the `CanvasKit` JS library, which is part of the Skia project. As such it copies some google code, this is indicated in several files and references the LICENSE.GOOGLE file.
