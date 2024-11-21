/*
 * Copyright 2024 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#pragma once

#include "include/core/SkSurface.h"
#include <emscripten.h>
#include <emscripten/bind.h>

namespace SWB {
  namespace Impl {
    emscripten::val& jsModule();

    auto defineBindings() -> void;
    struct Init : public emscripten::internal::InitFunc
    {
      Init()
        : InitFunc(defineBindings) {};
    };
  } // namespace Impl

  /// Draw the skia logo. Demo code.
  auto drawSkiaLogo(SkCanvas* canvas) -> void;

  /// A surface bound to a canvas in a web browser
  class WebSurface {
  public:
    WebSurface(const char* canvasID);
    ~WebSurface();

    auto surface() const -> SkSurface&
    {
      return *surface_;
    }
    auto makeCurrent() -> void;
    auto flush() -> void;

  protected:
    emscripten::val surfaceJS_;
    emscripten::val contextJS_;
    sk_sp<SkSurface> surface_;

    /// What are we drawing on
    enum class BackendEnum
    {
      eCPU,
      eWebGL
      // eWebGPU // oneday!
    };
    BackendEnum backend_;
  };
} // namespace SWB

#define SWB_INIT_BINDINGS static SWB::Impl::Init SWB_Init_instance;
