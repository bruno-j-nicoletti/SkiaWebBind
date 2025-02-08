#include <GLES3/gl3.h>
#include <algorithm>
#include <array>
#include <emscripten/html5.h>
#include <iostream>
#include <print>

#include "include/core/SkColorSpace.h"
#include "include/core/SkSurface.h"
#include "include/gpu/ganesh/GrDirectContext.h"
#include "include/gpu/ganesh/SkSurfaceGanesh.h"
#include "include/gpu/ganesh/gl/GrGLBackendSurface.h"
#include "include/gpu/ganesh/gl/GrGLDirectContext.h"
#include "include/gpu/ganesh/gl/GrGLInterface.h"
#include "include/gpu/ganesh/gl/GrGLMakeWebGLInterface.h"
#include "src/gpu/ganesh/GrRecordingContextPriv.h"
#include "src/gpu/ganesh/gl/GrGLDefines.h"

#include "skiaWebBind.h"

namespace SWB {
  namespace {
    // set the current context to be the given one
    inline auto makeCurrentWebGLContext(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE contextHandle) -> bool
    {
      auto result = emscripten_webgl_make_context_current(contextHandle);
      if (result != EMSCRIPTEN_RESULT_SUCCESS) {
        std::println("SkiaWebBind: cannot set webGL context, error code was {}.", result);
        return false;
      }
      return true;
    }

    // Implementation of the web surface
    class WebSurfaceImpl : public WebSurface {
    public:
      WebSurfaceImpl(const std::string_view canvasID, EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webGLContext)
        : canvasID_(canvasID)
        , webGLContext_(webGLContext)
      {
      }

      virtual ~WebSurfaceImpl() = default;

      virtual auto surface() const -> SkSurface&
      {
        return *skSurface_;
      }

      virtual auto surfacePtr() const -> sk_sp<SkSurface>
      {
        return skSurface_;
      }

      virtual auto makeCurrent() -> bool
      {
        return makeCurrentWebGLContext(webGLContext_);
      }

      virtual auto flush() -> void
      {
        skgpu::ganesh::FlushAndSubmit(skSurface_);
      }

      std::string canvasID_;
      EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webGLContext_;
      sk_sp<const GrGLInterface> skGLInterface_;
      sk_sp<GrDirectContext> skContext_;
      std::optional<GrBackendRenderTarget> skRenderTarget_;
      sk_sp<SkSurface> skSurface_;
    };
  } // namespace

  ////////////////////////////////////////////////////////////////////////////////
  auto makeWebSurface(const std::string& canvasID) -> std::shared_ptr<WebSurface>
  {
    const char* canvasCStr = canvasID.c_str();

    int width = 0, height = 0;
    {
      EMSCRIPTEN_RESULT result = emscripten_get_canvas_element_size(canvasCStr, &width, &height);
      if (result != EMSCRIPTEN_RESULT_SUCCESS) {
        std::println("SkiaWebBind: cannot get size of canvas {}, error code was {}.", canvasID, result);
        return {};
      }
    }
    // initialise default attributes
    EmscriptenWebGLContextAttributes attribs;
    emscripten_webgl_init_context_attributes(&attribs);

    attribs.alpha                        = 1;
    attribs.depth                        = 1;
    attribs.stencil                      = 8;
    attribs.antialias                    = 0;
    attribs.premultipliedAlpha           = 1;
    attribs.preserveDrawingBuffer        = 0;
    attribs.powerPreference              = EM_WEBGL_POWER_PREFERENCE_HIGH_PERFORMANCE;
    attribs.failIfMajorPerformanceCaveat = 0;
    attribs.enableExtensionsByDefault    = 1;
    attribs.explicitSwapControl          = 0;
    attribs.renderViaOffscreenBackBuffer = 0;
    attribs.majorVersion                 = 2;
    attribs.minorVersion                 = 0;

    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webGLContext = emscripten_webgl_create_context(canvasCStr, &attribs);
    if (webGLContext == 0) {
      std::println("SkiaWebBind: cannot make webGL context for canvas {}", canvasID);
      return {};
    }

    if (not makeCurrentWebGLContext(webGLContext)) {
      return {};
    }

    auto result = std::make_shared<WebSurfaceImpl>(canvasID, webGLContext);

    result->skGLInterface_ = GrGLInterfaces::MakeWebGL();
    if (not result->skGLInterface_) {
      std::println("SkiaWebBind: cannot make skia webGL interface for canvas '{}'.", canvasID);
      return {};
    }

    result->skContext_ = GrDirectContexts::MakeGL(result->skGLInterface_);
    if (not result->skContext_) {
      std::println("SkiaWebBind: cannot make skia webGL context for canvas '{}'.", canvasID);
      return {};
    }

    GrGLint sampleCnt;
    glGetIntegerv(GL_SAMPLES, &sampleCnt);

    GrGLint stencil;
    glGetIntegerv(GL_STENCIL_BITS, &stencil);

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glClearColor(0, 0, 0, 0);
    glClearStencil(0);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
    result->skContext_->resetContext(kRenderTarget_GrGLBackendState | kMisc_GrGLBackendState);

    // The on-screen canvas is FBO 0. Wrap it in a Skia render target so Skia can render to it.
    GrGLFramebufferInfo info;
    info.fFBOID = 0;

    auto colorSpace         = SkColorSpace::MakeSRGB();
    SkColorType colorType   = kRGBA_8888_SkColorType;
    info.fFormat            = GR_GL_RGBA8;
    result->skRenderTarget_ = GrBackendRenderTargets::MakeGL(width, height, sampleCnt, stencil, info);

    // make the skia surface
    result->skSurface_ = SkSurfaces::WrapBackendRenderTarget(result->skContext_.get(),
                                                             *result->skRenderTarget_,
                                                             kBottomLeft_GrSurfaceOrigin,
                                                             kRGBA_8888_SkColorType,
                                                             colorSpace,
                                                             nullptr);
    if (not result->skSurface_) {
      std::println("SkiaWebBind: cannot make skia surface for canvas '{}'.", canvasID);
      return {};
    }

    return result;
  }

  ////////////////////////////////////////////////////////////////////////////////
  WebSurface::~WebSurface() {}
} // namespace SWB
