/*
 * Copyright 2024 Bruno Nicoletti
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "emscripten/val.h"
#include "skiaWebBind.h"
#include <iostream>

#include "include/core/SkCanvas.h"

extern "C"
{
  int main();
}

int
main()
{
  SWB::WebSurface webSurface("canvasToDrawOn");
  webSurface.makeCurrent();

  SkCanvas* canvas         = webSurface.surface().getCanvas();
  const SkColor background = SK_ColorWHITE;
  canvas->clear(background);

  SWB::drawSkiaLogo(canvas);
  webSurface.flush();

  return 0;
}
