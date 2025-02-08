/*
 * Copyright 2024-2025 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#pragma once

#include <memory>
#include <string>

#include "include/core/SkSurface.h"

/// Namespace for Skia Web Bind
namespace SWB {
  /// A surface bound to a canvas in a web browser
  class WebSurface {
  public:
    virtual ~WebSurface();

    /// Get the skia webgl surface, avoiding shared pointer atomic counting
    virtual auto surface() const -> SkSurface& = 0;

    /// Get the surface pointer
    virtual auto surfacePtr() const -> sk_sp<SkSurface> = 0;

    /// Make the GL context of this surface current
    virtual auto makeCurrent() -> bool = 0;

    /// Flush all draw commands
    virtual auto flush() -> void = 0;
  };

  /// Make a web surface
  ///
  /// If this fails for any reason, an empty shared pointer will be returned and
  /// a message will be written to the console.
  ///
  /// This assumes there is no current GL context on the given canvas
  ///
  /// FIXME! : options!!!
  auto makeWebSurface(const std::string& canvasID = "#canvas") -> std::shared_ptr<WebSurface>;
} // namespace SWB
