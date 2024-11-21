////////////////////////////////////////////////////////////////////////////////
// Copyright 2018 Google LLC
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE.GOOGLE file.
////////////////////////////////////////////////////////////////////////////////

// Adds JS functions to augment the SkiaWebBind interface.
// For example, if there is a wrapper around the C++ call or logic to allow
// chaining, it should go here.

// theModule.onRuntimeInitialized is called after the WASM library has loaded.
// Anything that modifies an exposed class (e.g. Path) should be set
// after onRuntimeInitialized, otherwise, it can happen outside of that scope.
theModule.onRuntimeInitialized = function() {
    // All calls to 'this' need to go in externs.js so closure doesn't minify them away.

    // Run through the JS files that are added at compile time.
    if (theModule._extraInitializations) {
        theModule._extraInitializations.forEach(function(init) {
            init();
        });
    }
}; // end theModule.onRuntimeInitialized, that is, anything changing prototypes or dynamic.
