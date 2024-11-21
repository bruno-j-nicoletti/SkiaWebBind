/*
 * Copyright 2024 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "./skiaWebBind.h"
#include <iostream>

#include "include/gpu/ganesh/SkSurfaceGanesh.h"

namespace SWB {
  using namespace emscripten;

  namespace Impl {
    emscripten::val& jsModule()
    {
      static emscripten::val theModule = val::global("SkiaWebBind");
      assert(not(theModule.isUndefined() or theModule.isNull()));
      return theModule;
    }
  } // namespace Impl

  WebSurface::WebSurface(const char* canvasID)
  {
    auto& module   = Impl::jsModule();
    val canvasIDJS = val(canvasID);
    surfaceJS_     = module.call<val>("MakeSurface", canvasIDJS);
    assert(not(surfaceJS_.isNull() or surfaceJS_.isUndefined()));
    surface_ = surfaceJS_.as<sk_sp<SkSurface>>();
    assert(surface_.get() != nullptr);
    contextJS_ = surfaceJS_["_context"]; // can be undefined
    if (surfaceJS_["isSoftware"].isTrue()) {
      backend_ = BackendEnum::eCPU;
    }
    else if (surfaceJS_["isWebGL"].isTrue()) {
      backend_ = BackendEnum::eWebGL;
    }
    else {
      assert(false);
    }
  }

  WebSurface::~WebSurface()
  {
    surfaceJS_.call<val>("delete");
  }

  auto WebSurface::flush() -> void
  {
    switch (backend_) {
      case BackendEnum::eCPU:
        surfaceJS_.call<val>("flush");
        break;
      case BackendEnum::eWebGL:
        skgpu::ganesh::FlushAndSubmit(surface_);
        break;
    }
  }

  auto WebSurface::makeCurrent() -> void
  {
    switch (backend_) {
      case BackendEnum::eCPU:
        break;

      case BackendEnum::eWebGL:
        Impl::jsModule().call<val>("setCurrentContext", contextJS_);
        break;
    }
  }
} // namespace SWB
