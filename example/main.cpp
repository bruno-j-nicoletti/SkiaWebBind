/*
 * Copyright 2024 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "skiaWebBind.h"
#include <emscripten/html5.h>

#include "include/core/SkCanvas.h"
auto
drawSkiaLogo(SkCanvas* canvas) -> void;

extern "C"
{
  int main();
}

std::shared_ptr<SWB::WebSurface> gWebSurface;

void
draw()
{
  // background colour to cycle through
  static std::array<float, 3> colour           = { 0.5f, 0.5f, 0.5f };
  static std::array<float, 3> increments = { 0.002, 0.0013, 0.00053414 };

  // cycle the background colour
  for (int i = 0; i < 3; ++i) {
    colour[i] = colour[i] + increments[i];
    if (colour[i] > 1.0) {
      increments[i]  *= -1;
      colour[i] = 1.0;
    }
    else if (colour[i] < 0.0) {
      increments[i]  *= -1;
      colour[i] = 0.0;
    }
  }

  gWebSurface->makeCurrent();
  auto canvas = gWebSurface->surface().getCanvas();

  const SkColor background = SkColor4f(colour[0], colour[1], colour[2], 1.0f).toSkColor();
  canvas->clear(background);
  drawSkiaLogo(canvas);

  gWebSurface->flush();
}

int
main()
{
  static const char* kCanvasID = "#canvas";

  emscripten_set_canvas_element_size(kCanvasID, 816, 464);

  gWebSurface = SWB::makeWebSurface(kCanvasID);

  if (gWebSurface) {
    emscripten_set_main_loop(draw, 0, 1);
  }
  return 0;
}
