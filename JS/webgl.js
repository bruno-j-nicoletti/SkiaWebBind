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
// Specifically, anything that should only be on the WebGL version of canvaskit.
// Functions in this file are supplemented by cpu.js.
(function(theModule) {
    theModule._extraInitializations = theModule._extraInitializations || [];
    theModule._extraInitializations.push(function() {
        function get(obj, attr, defaultValue) {
            if (obj && obj.hasOwnProperty(attr)) {
                return obj[attr];
            }
            return defaultValue;
        }

        theModule.GetWebGLContext = function(canvas, attrs) {
            if (!canvas) {
                throw 'null canvas passed into makeWebGLContext';
            }
            var contextAttributes = {
                'alpha': get(attrs, 'alpha', 1),
                'depth': get(attrs, 'depth', 1),
                'stencil': get(attrs, 'stencil', 8),
                'antialias': get(attrs, 'antialias', 0),
                'premultipliedAlpha': get(attrs, 'premultipliedAlpha', 1),
                'preserveDrawingBuffer': get(attrs, 'preserveDrawingBuffer', 0),
                'preferLowPowerToHighPerformance': get(attrs, 'preferLowPowerToHighPerformance', 0),
                'failIfMajorPerformanceCaveat': get(attrs, 'failIfMajorPerformanceCaveat', 0),
                'enableExtensionsByDefault': get(attrs, 'enableExtensionsByDefault', 1),
                'explicitSwapControl': get(attrs, 'explicitSwapControl', 0),
                'renderViaOffscreenBackBuffer': get(attrs, 'renderViaOffscreenBackBuffer', 0),
            };

            if (attrs && attrs['majorVersion']) {
                contextAttributes['majorVersion'] = attrs['majorVersion']
            } else {
                // Default to WebGL 2 if available and not specified.
                contextAttributes['majorVersion'] = (typeof WebGL2RenderingContext !== 'undefined') ? 2 : 1;
            }

            // This check is from the emscripten version
            if (contextAttributes['explicitSwapControl']) {
                throw 'explicitSwapControl is not supported';
            }
            // Creates a WebGL context and sets it to be the current context.
            // These functions are defined in emscripten's library_webgl.js
            var handle = GL.createContext(canvas, contextAttributes);
            if (!handle) {
                return null;
            }
            GL.makeContextCurrent(handle);
            // Emscripten does not enable this by default and Skia needs this to handle certain GPU
            // corner cases.
            GL.currentContext.GLctx.getExtension('WEBGL_debug_renderer_info');
            return handle;
        };

        theModule.deleteContext = function(handle) {
            GL.deleteContext(handle);
        };

        // Create the Skia web GL direct device context
        theModule.MakeWebGLDirectContext = function(webGLContextHandle) {
            if (!this.setCurrentContext(webGLContextHandle)) {
                return null;
            }
            var skiaDirectGLContext = this._MakeWebGLDirectContext();
            if (!skiaDirectGLContext) {
                return null;
            }
            // This context is an index into the emscripten-provided GL wrapper.
            skiaDirectGLContext._context = webGLContextHandle;
            var oldDelete = skiaDirectGLContext.delete.bind(skiaDirectGLContext);
            // We need to make sure we are focusing on the correct webgl context
            // when Skia cleans up the context.
            skiaDirectGLContext['delete'] = function() {
                theModule.setCurrentContext(this._context);
                oldDelete();
            }.bind(skiaDirectGLContext);
            webGLContextHandle = skiaDirectGLContext;
            return skiaDirectGLContext;
        };

        // idOrElement can be of types:
        //  - String - in which case it is interpreted as an id of a
        //          canvas element.
        //  - HTMLCanvasElement - in which the provided canvas element will
        //          be used directly.
        theModule.MakeWebGLSurface = function(idOrElement, attrs) {
            var canvas = idOrElement;
            var isHTMLCanvas = typeof HTMLCanvasElement !== 'undefined' && canvas instanceof HTMLCanvasElement;
            var isOffscreenCanvas = typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas;
            if (!isHTMLCanvas && !isOffscreenCanvas) {
                canvas = document.getElementById(idOrElement);
                if (!canvas) {
                    throw 'Canvas with id ' + idOrElement + ' was not found';
                }
            }

            var ctx = this.GetWebGLContext(canvas, attrs);

            var surface;

            if (ctx != null) {
                var skiaDirectGLContext = this.MakeWebGLDirectContext(ctx);
                if (skiaDirectGLContext && this.setCurrentContext(skiaDirectGLContext._context)) {
                    // Note that canvas.width/height here is used because it gives the size of the buffer we're
                    // rendering into. This may not be the same size the element is displayed on the page, which
                    // controlled by css, and available in canvas.clientWidth/height.
                    surface = this._MakeOnScreenGLSurface(skiaDirectGLContext, canvas.width, canvas.height);
                    if (surface) {
                        surface._context = skiaDirectGLContext._context;
                        surface.isSoftware = false;
                        surface.isWebGL = true;
                    }
                }
            }

            if (surface == undefined || surface == null) {
                Debug('falling back from GPU implementation to a SW based one');
                // we need to throw away the old canvas (which was locked to
                // a webGL context) and create a new one so we can
                var newCanvas = canvas.cloneNode(true);
                var parent = canvas.parentNode;
                parent.replaceChild(newCanvas, canvas);
                // add a class so the user can detect that it was replaced.
                newCanvas.classList.add('ck-replaced');

                surface = theModule.MakeSWSurface(newCanvas);
            }
            else {
                console.log("Skia Web Binding : Made WebGL surface");
            }
            return surface;
        };

        // Default to trying WebGL first.
        theModule.MakeSurface = theModule.MakeWebGLSurface;

        theModule.setCurrentContext = function(webGLContextHandle) {
            if (!webGLContextHandle) {
                return false;
            }
            return GL.makeContextCurrent(webGLContextHandle);
        };

        theModule.getCurrentGrDirectContext = function() {
            if (GL.currentContext && GL.currentContext.skiaDirectContext &&
                !GL.currentContext.skiaDirectContext['isDeleted']()) {
                return GL.currentContext.skiaDirectContext;
            }
            return null;
        };

    });
}(Module)); // When this file is loaded in, the high level object is "Module";
