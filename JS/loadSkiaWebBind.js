////////////////////////////////////////////////////////////////////////////////
// Copyright 2024 Bruno Nicoletti
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
////////////////////////////////////////////////////////////////////////////////
SkiaWebBind = null;

const loadSkiaWebBind = async function() {
    if (SkiaWebBind === null) {
        const swbLoader = SkiaWebBindInit({
            locateFile: (file) => file
        });
        SkiaWebBind = await swbLoader;
        SkiaWebBind.onRuntimeInitialized();
    }
    return SkiaWebBind;
}();
