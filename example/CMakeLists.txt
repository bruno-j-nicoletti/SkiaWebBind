set(CMAKE_EXECUTABLE_SUFFIX ".html")

# Hack to force regeneration of the final HTML
add_custom_command(OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/exampleHTMLDummy.cpp
    COMMAND ${CMAKE_COMMAND} -E touch ${CMAKE_CURRENT_BINARY_DIR}/exampleHTMLDummy.cpp
    DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/example.html)

add_executable(Example
  "main.cpp"
  "drawLogo.cpp"
  ${CMAKE_CURRENT_BINARY_DIR}/exampleHTMLDummy.cpp
)

# double linking, but I can't figure another way to do whole library imports
# and add a dependency to the SkiaWebBind
target_link_libraries(Example PRIVATE SkiaWebBind)

target_link_options(Example
  PUBLIC
  -Wl,--no-whole-archive
  ${SKIA_WEB_BIND_BINARY_DIR}/libskia.a
  -O3
  -sUSE_WEBGL2=1
  -sDYNAMIC_EXECUTION=1
  -sALLOW_MEMORY_GROWTH
  -sMAX_WEBGL_VERSION=2
  -sWASM=1
  -sINITIAL_MEMORY=512MB
  --shell-file ${CMAKE_CURRENT_SOURCE_DIR}/example.html
  -lGL
)

set_property(TARGET Example PROPERTY OUTPUT_NAME logoExample)
