/*
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE.GOOGLE file.
 */

/*
 * Copyright 2024 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "./skiaWebBind.h"
#include <iostream>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>

#include "include/core/SkColorSpace.h"
#include "include/core/SkSurface.h"

using namespace emscripten;
using WASMPointerU8 = uintptr_t;

#include "include/gpu/GpuTypes.h"
#include "include/gpu/ganesh/GrDirectContext.h"
#include "include/gpu/ganesh/GrExternalTextureGenerator.h"
#include "include/gpu/ganesh/SkImageGanesh.h"
#include "include/gpu/ganesh/SkSurfaceGanesh.h"
#include "src/gpu/ganesh/GrCaps.h"

#include "include/gpu/ganesh/GrBackendSurface.h"
#include "include/gpu/ganesh/GrTypes.h"
#include "include/gpu/ganesh/gl/GrGLBackendSurface.h"
#include "include/gpu/ganesh/gl/GrGLDirectContext.h"
#include "include/gpu/ganesh/gl/GrGLInterface.h"
#include "include/gpu/ganesh/gl/GrGLMakeWebGLInterface.h"
#include "include/gpu/ganesh/gl/GrGLTypes.h"
#include "src/gpu/RefCntedCallback.h"
#include "src/gpu/ganesh/GrProxyProvider.h"
#include "src/gpu/ganesh/GrRecordingContextPriv.h"
#include "src/gpu/ganesh/gl/GrGLDefines.h"

#include <GLES2/gl2.h>

namespace {
  sk_sp<GrDirectContext> MakeWebGLDirectContext()
  {
    // We assume that any calls we make to GL for the remainder of this function will go to the
    // desired WebGL Context.
    // setup interface.
    auto interface = GrGLInterfaces::MakeWebGL();
    // setup context
    return GrDirectContexts::MakeGL(interface);
  }

  sk_sp<SkSurface> MakeOnScreenGLSurface(sk_sp<GrDirectContext> dContext,
                                         int width,
                                         int height,
                                         int sampleCnt,
                                         int stencil)
  {
    // WebGL should already be clearing the color and stencil buffers, but do it again here to
    // ensure Skia receives them in the expected state.
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glClearColor(0, 0, 0, 0);
    glClearStencil(0);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
    dContext->resetContext(kRenderTarget_GrGLBackendState | kMisc_GrGLBackendState);

    // The on-screen canvas is FBO 0. Wrap it in a Skia render target so Skia can render to it.
    GrGLFramebufferInfo info;
    info.fFBOID = 0;

    auto colorSpace       = SkColorSpace::MakeSRGB();
    SkColorType colorType = kRGBA_8888_SkColorType;
    GrGLenum pixFormat    = GR_GL_RGBA8;

    info.fFormat = pixFormat;
    auto target  = GrBackendRenderTargets::MakeGL(width, height, sampleCnt, stencil, info);
    sk_sp<SkSurface> surface(SkSurfaces::WrapBackendRenderTarget(
      dContext.get(), target, kBottomLeft_GrSurfaceOrigin, kRGBA_8888_SkColorType, colorSpace, nullptr));
    return surface;
  }
} // namespace

// These objects have private destructors / delete methods - I don't think
// we need to do anything other than tell emscripten to do nothing.
namespace emscripten {
  namespace internal {
    template<typename ClassType>
    void raw_destructor(ClassType*);
  } // namespace internal
} // namespace emscripten

EMSCRIPTEN_BINDINGS(SkiaWebBinds)
{
  std::cout << "BINDING!\n";
  constant("gpu", true);

  class_<GrDirectContext>("GrDirectContext").smart_ptr<sk_sp<GrDirectContext>>("sk_sp<GrDirectContext>");

  function("_MakeWebGLDirectContext", &MakeWebGLDirectContext);
  constant("webgl", true);
  function("_MakeOnScreenGLSurface",
           optional_override([](sk_sp<GrDirectContext> dContext, int width, int height) -> sk_sp<SkSurface> {
             GrGLint sampleCnt;
             glGetIntegerv(GL_SAMPLES, &sampleCnt);

             GrGLint stencil;
             glGetIntegerv(GL_STENCIL_BITS, &stencil);

             return MakeOnScreenGLSurface(dContext, width, height, sampleCnt, stencil);
           }));

  class_<SkSurface>("Surface")
    .smart_ptr<sk_sp<SkSurface>>("sk_sp<Surface>")
    .class_function(
      "_makeRasterDirect",
      optional_override([](int width, int height, WASMPointerU8 pPtr, size_t rowBytes) -> sk_sp<SkSurface> {
        uint8_t* pixels       = reinterpret_cast<uint8_t*>(pPtr);
        SkImageInfo imageInfo = SkImageInfo::Make(width,
                                                  height,
                                                  SkColorType::kRGBA_8888_SkColorType,
                                                  SkAlphaType::kUnpremul_SkAlphaType,
                                                  SkColorSpace::MakeSRGB());
        return SkSurfaces::WrapPixels(imageInfo, pixels, rowBytes, nullptr);
      }),
      allow_raw_pointers())
    .function("_flush", optional_override([](SkSurface& self) {
                skgpu::ganesh::FlushAndSubmit(&self);
              }))
    .function("height", &SkSurface::height)
    .function("width", &SkSurface::width);
}
