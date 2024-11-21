set(CMAKE_EXECUTABLE_SUFFIX ".js")

add_executable(Example
  "main.cpp")

target_include_directories(Example
  PUBLIC
  include
  ${SKIA_ROOT_DIR}
)

target_link_options(Example
  PUBLIC
  ${SKIA_WEB_BIND_LINK_OPTIONS}
  -sEXPORTED_FUNCTIONS=[_main,_malloc,_free]
)

# double linking, but I can't figure another way to do whole library imports
# and add a dependency to the SkiaWebBind
target_link_libraries(Example PRIVATE SkiaWebBind)

add_custom_command(
  TARGET Example POST_BUILD
  COMMAND js-beautify -r "$<TARGET_FILE:Example>"
  VERBATIM)

add_custom_command(
  TARGET Example POST_BUILD
  COMMAND cp example.js example.wasm ${CMAKE_CURRENT_SOURCE_DIR}
  VERBATIM)

set_property(TARGET Example PROPERTY OUTPUT_NAME example)

set_property(TARGET Example PROPERTY LINK_DEPENDS ${SKIA_WEB_BIND_JS_SOURCES})
