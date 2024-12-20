////////////////////////////////////////////////////////////////////////////////
// Copyright 2018 Google LLC
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE.GOOGLE file.
////////////////////////////////////////////////////////////////////////////////

// Adds compile-time JS functions to augment the SkiaWebBind interface.
(function(theModule) {


        // This intentionally dangles because we want all the
        // JS code to be in the same scope, but JS doesn't support
        // namespaces like C++ does. Thus, we simply include this
        // preamble.js file, all the source .js files and then postamble.js
        // to bundle everything in the same scope.
