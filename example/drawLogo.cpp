#include "include/core/SkCanvas.h"
#include "include/core/SkColor.h"
#include "include/core/SkPaint.h"
#include "include/core/SkPath.h"
#include "include/core/SkRRect.h"
#include "include/effects/SkGradientShader.h"

auto
drawSkiaLogo(SkCanvas* canvas) -> void
{
  canvas->save();
  canvas->scale(4.0f, 4.0f);
  const SkColor rgb[]         = { 0xFFE94037, 0xFF70BF4F, 0xFF465BA6 };
  const SkColor lettering     = 0xFF292929;
  const SkColor lineColors[2] = { 0x30565656, 0xFF565656 };
  SkPath s, k, a, triangle;
  SkPaint p;
  p.setAntiAlias(true);

  canvas->scale(0.363f, 0.363f);

  p.setColor(rgb[1]);
  canvas->drawRect({ 326.0f, 82.25f, 343.9f, 249.2f }, p);
  p.setColor(rgb[0]);
  canvas->drawRect({ 310.2f, 82.25f, 327.0f, 249.2f }, p);
  p.setColor(rgb[2]);
  canvas->drawRect({ 342.9f, 82.25f, 358.87f, 249.2f }, p);

  p.setColor(lettering);
  canvas->drawCircle(335.355f, 45.965f, 29.25f, p);

  s.moveTo(34.63f, 100.63f);
  s.cubicTo(44.38f, 88.57f, 59.87f, 82.86f, 74.88f, 81.2f);
  s.cubicTo(97.4f, 78.5f, 120.27f, 83.25f, 140.87f, 92.37f);
  s.lineTo(127.12f, 127.14f);
  s.cubicTo(113.55f, 121.16f, 99.04f, 115.9f, 83.98f, 116.56f);
  s.cubicTo(78.86f, 116.75f, 72.88f, 118.54f, 70.71f, 123.69f);
  s.cubicTo(68.62f, 128.43f, 71.52f, 133.68f, 75.58f, 136.27f);
  s.cubicTo(91.49f, 146.66f, 110.67f, 151.38f, 125.46f, 163.6f);
  s.cubicTo(132.35f, 169.11f, 137.33f, 176.9f, 139.36f, 185.49f);
  s.cubicTo(142.55f, 199.14f, 140.94f, 214.31f, 133.13f, 226.17f);
  s.cubicTo(126.23f, 236.96f, 114.82f, 244.16f, 102.75f, 247.89f);
  s.cubicTo(87.95f, 252.51f, 72.16f, 252.21f, 56.88f, 250.78f);
  s.cubicTo(45.54f, 249.72f, 34.64f, 246.05f, 24.32f, 241.36f);
  s.lineTo(24.25f, 201.1f);
  s.cubicTo(38.23f, 208.15f, 53.37f, 213.15f, 68.98f, 214.75f);
  s.cubicTo(75.42f, 215.25f, 82.17f, 215.63f, 88.31f, 213.27f);
  s.cubicTo(92.84f, 211.53f, 96.4f, 206.93f, 95.86f, 201.93f);
  s.cubicTo(95.64f, 196.77f, 91.1f, 193.38f, 87.03f, 190.99f);
  s.cubicTo(71.96f, 182.67f, 54.94f, 177.66f, 41.5f, 166.57f);
  s.cubicTo(33.19f, 159.73f, 27.51f, 149.8f, 26.1f, 139.11f);
  s.cubicTo(24.09f, 125.88f, 25.91f, 111.25f, 34.63f, 100.63f);
  canvas->drawPath(s, p);

  k.moveTo(160.82f, 82.85f);
  k.lineTo(206.05f, 82.85f);
  k.lineTo(206.05f, 155.15f);
  k.lineTo(254.83f, 82.84f);
  k.lineTo(304.01f, 82.85f);
  k.lineTo(251.52f, 157.27f);
  k.lineTo(303.09f, 249.42f);
  k.lineTo(252.28f, 249.4f);
  k.lineTo(219.18f, 185.75f);
  k.lineTo(206.23f, 193.45f);
  k.lineTo(206.05f, 249.42f);
  k.lineTo(160.82f, 249.42f);
  k.lineTo(160.82f, 82.85f);
  canvas->drawPath(k, p);

  a.moveTo(426.45f, 218.16f);
  a.lineTo(480.705f, 218.16f);
  a.lineTo(489.31f, 249.4f);
  a.lineTo(538.54f, 249.42f);
  a.lineTo(483.56f, 82.18f);
  a.lineTo(423.43f, 82.17f);
  a.lineTo(369.13f, 249.42f);
  a.lineTo(418.5f, 249.47f);
  a.lineTo(453.75f, 109.83f);
  a.lineTo(471.77f, 181.28f);
  a.lineTo(430.5f, 181.28f);
  canvas->drawPath(a, p);

  triangle.reset();
  triangle.moveTo(362.64f, 257.32f);
  triangle.lineTo(335.292f, 293.392f);
  triangle.lineTo(307.8f, 257.48f);
  triangle.lineTo(362.64f, 257.32f);
  p.setColor(lettering);
  canvas->drawPath(triangle, p);

  // line
  const SkPoint pts[2] = { { 160.0f, 290.0f }, { 341.0f, 290.0f } };
  p.setShader(SkGradientShader::MakeLinear(pts, lineColors, nullptr, 2, SkTileMode::kClamp));
  if (true) {
    SkRRect rrect;
    rrect.setRectXY({ 138.0f, 291.0f, 341.0f, 300.0f }, 25.0f, 5.0f);
    canvas->drawRRect(rrect, p);
  }
  else {
    SkPath path;
    path.addRoundRect({ 138.0f, 291.0f, 341.0f, 299.95f }, 25.0f, 5.0f);
    canvas->drawPath(path, p);
  }
  canvas->restore();
}
