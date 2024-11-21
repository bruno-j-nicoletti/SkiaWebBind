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


// Adds compile-time JS functions to augment the SkiaWebBind interface.
// Implementations in this file are considerate of GPU builds, i.e. some
// behavior is predicated on whether or not this is being compiled alongside
// webgl.js or webgpu.js.
(function(theModule) {
    theModule._extraInitializations = theModule._extraInitializations || [];
    theModule._extraInitializations.push(function() {
        // Takes in an html id or a canvas element
        theModule.MakeSWSurface = function(idOrElement) {
            var canvas = idOrElement;
            var isHTMLCanvas = typeof HTMLCanvasElement !== 'undefined' && canvas instanceof HTMLCanvasElement;
            var isOffscreenCanvas = typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas;
            if (!isHTMLCanvas && !isOffscreenCanvas) {
                canvas = document.getElementById(idOrElement);
                if (!canvas) {
                    throw 'Canvas with id ' + idOrElement + ' was not found';
                }
            }
            // Maybe better to use clientWidth/height.  See:
            // https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
            var pixelLen = canvas.width * canvas.height * 4; // it's 8888, so 4 bytes per pixel

            // Allocate the buffer of pixels to be drawn into.
            var pixelPtr = theModule._malloc(pixelLen);

            // Experiments with using RasterDirect vs Raster showed a 10% slowdown
            // over the traditional Surface::MakeRaster approach. This was exacerbated when
            // the surface was drawing to Premul and we had to convert to Unpremul each frame
            // (up to a 10x further slowdown).
            var surface = theModule.Surface._makeRasterDirect(canvas.width, canvas.height, pixelPtr, canvas.width * 4);
            if (surface) {
                surface._canvas = null;
                surface._width = canvas.width;
                surface._height = canvas.height;
                surface._pixelLen = pixelLen;
                surface._pixelPtr = pixelPtr;
                surface._canvas = canvas;
            }
            surface.isSoftware = true;
            surface.isWebGL = false;
            return surface;
        };

        // Don't over-write the MakeSurface set by gpu.js if it exists.
        if (!theModule.MakeSurface) {
            theModule.MakeSurface = theModule.MakeSWSurface;
        }


        // For GPU builds, simply proxies to native code flush.  For CPU builds,
        // also updates the underlying HTML canvas, optionally with dirtyRect.
        theModule.Surface.prototype.flush = function(dirtyRect) {
            theModule.setCurrentContext(this._context);
            this._flush();
            // Do we have an HTML canvas to write the pixels to?
            // We will not have a canvas if this a GPU build, for example.
            if (this._canvas) {
                var pixels = new Uint8ClampedArray(theModule.HEAPU8.buffer, this._pixelPtr, this._pixelLen);
                var imageData = new ImageData(pixels, this._width, this._height);

                if (!dirtyRect) {
                    this._canvas.getContext('2d').putImageData(imageData, 0, 0);
                } else {
                    this._canvas.getContext('2d').putImageData(imageData, 0, 0,
                        dirtyRect[0], dirtyRect[1],
                        dirtyRect[2] - dirtyRect[0],
                        dirtyRect[3] - dirtyRect[1]);
                }
            }
        };

        // Call dispose() instead of delete to clean up the underlying memory.
        // TODO(kjlubick) get rid of this and just wrap around delete().
        theModule.Surface.prototype.dispose = function() {
            if (this._pixelPtr) {
                theModule._free(this._pixelPtr);
            }
            this.delete();
        };

        theModule.setCurrentContext = theModule.setCurrentContext || function() {
            // no op if this is a cpu-only build.
        };

        theModule.getCurrentGrDirectContext = theModule.getCurrentGrDirectContext || function() {
            // No GrDirectContexts without a GPU backend.
            return null;
        };
    });
}(Module)); // When this file is loaded in, the high level object is "Module";
