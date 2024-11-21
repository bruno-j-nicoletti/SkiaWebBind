# Skia WASM Library
- objective is to...
    - have a c++ library to link to, with minimal js/hmtl wrappings
    - hide as much as possible of the html/js gubbins from the client C++ code

## Next Steps
- optimise the generated JS and run the closure compiler
  - currently borks if I do that
- build skia to emscripten as part of the process
    - with or without RTTI
- figure out event loops so updates happen
- figure out how to handle resize events
- UI interaction
