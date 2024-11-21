////////////////////////////////////////////////////////////////////////////////
// Copyright 2018 Google LLC
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE.GOOGLE file.
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Copyright 2024 Bruno Nicoletti
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
////////////////////////////////////////////////////////////////////////////////

//
// This externs file prevents the Closure JS compiler from minifying away
// names of objects created by Emscripten.
// Basically, by defining empty objects and functions here, Closure will
// know not to rename them.  This is needed because of our pre-js files,
// that is, the JS we hand-write to bundle into the output. That JS will be
// hit by the closure compiler and thus needs to know about what functions
// have special names and should not be minified.
//
// Emscripten does not support automatically generating an externs file, so we
// do it by hand. The general process is to write some JS code, and then put any
// calls to SkiaWebBind or related things in here. Running ./compile.sh and then
// looking at the minified results or running the Release trybot should
// verify nothing was missed. Optionally, looking directly at the minified
// pathkit.js can be useful when developing locally.
//
// Docs:
//   https://github.com/cljsjs/packages/wiki/Creating-Externs
//   https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System
//
// Example externs:
//   https://github.com/google/closure-compiler/tree/master/externs
//

var SkiaWebBind = {
    MakeSurface: function() {},

    GetWebGLContext: function() {},
    MakeWebGLDirectContext: function() {},
    MakeOnScreenGLSurface: function() {},
    MakeWebGLSurface: function() {},

    MakeSWSurface: function() {},

    setCurrentContext: function() {},

    // Defined by emscripten.
    createContext: function() {},

    // Added by debugger when it extends the module
    MinVersion: function() {},

    // private API (i.e. things declared in the bindings that we use
    // in the pre-js file)
    _MakeWebGLDirectContext: function() {},
    _MakeOnScreenGLSurface: function() {},

    // Objects and properties on SkiaWebBind
    GrDirectContext: {},

    Surface: {
        isSoftware: {},
        isWebGL: {},
        _context: {},

        // private API
        _flush: function() {},
        _makeRasterDirect: function() {},
        delete: function() {},
    },


    // Things Enscriptem adds for us
    /**
     * @type {Float32Array}
     */
    HEAPF32: {},
    /**
     * @type {Float64Array}
     */
    HEAPF64: {},
    /**
     * @type {Uint8Array}
     */
    HEAPU8: {},
    /**
     * @type {Uint16Array}
     */
    HEAPU16: {},
    /**
     * @type {Uint32Array}
     */
    HEAPU32: {},
    /**
     * @type {Int8Array}
     */
    HEAP8: {},
    /**
     * @type {Int16Array}
     */
    HEAP16: {},
    /**
     * @type {Int32Array}
     */
    HEAP32: {},

    _main: function() {},
    _malloc: function() {},
    _free: function() {},
    onRuntimeInitialized: function() {},
};


SkiaWebBind.Surface.prototype.dispose = function() {};
SkiaWebBind.Surface.prototype.flush = function() {};

var ImageData = {
    /**
     * @type {Uint8ClampedArray}
     */
    data: {},
    height: {},
    width: {},
};

// Not sure why this is needed - might be a bug in emsdk that this isn't properly declared.
function loadWebAssemblyModule() {};

// This is a part of emscripten's webgl glue code. Preserving this attribute is necessary
// to override it in the puppeteer tests
var LibraryEGL = {
    contextAttributes: {
        majorVersion: {}
    }
}
