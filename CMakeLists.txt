cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

project(SkiaWebBind VERSION 0.2)

set(CMAKE_CXX_STANDARD 26)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_SCAN_FOR_MODULES OFF)

IF (NOT ${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
  message(FATAL_ERROR "SkiaWebBind need to be compiled with emscripten to WASM, currently building to ${CMAKE_SYSTEM_NAME}.")
endif()

set(SKIA_WEB_BIND_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR})
set(SKIA_ROOT_DIR "${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/skia")
set(SKIA_WEB_BIND_BINARY_DIR ${CMAKE_CURRENT_BINARY_DIR})

message(${PROJECT_NAME} ": compiler id is " ${CMAKE_CXX_COMPILER_ID} " VERSION IS " ${CMAKE_CXX_COMPILER_VERSION})

# add compile caching if ccache is installed on the system
find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
  set(CXX_COMPILER_LAUNCHER  "${CCACHE_PROGRAM}" CACHE INTERNAL "")
  set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
  message("Enabled compiler caching")
endif()

#add_compile_options(-fwasm-exceptions)
add_compile_options(-pthread)
add_compile_options(-DSK_FORCE_8_BYTE_ALIGNMENT)
add_compile_options(-DSK_DISABLE_LEGACY_PARAGRAPH_UNICODE=1)
add_compile_options(-DSK_RELEASE)
add_compile_options(-DSK_GL)
add_compile_options(-DCK_ENABLE_WEBGL)
add_compile_options(-DNDEBUG)
add_compile_options(-DSK_TRIVIAL_ABI=[[clang::trivial_abi]])
add_compile_options(-DSK_FONTMGR_FREETYPE_EMBEDDED_AVAILABLE)
add_compile_options(-DSK_TYPEFACE_FACTORY_FREETYPE)
add_compile_options(-DSK_ENABLE_PRECOMPILE)
add_compile_options(-DSKNX_NO_SIMD)
add_compile_options(-DSK_DISABLE_TRACING)
add_compile_options(-DSK_DISABLE_EFFECT_DESERIALIZATION)
add_compile_options(-DCANVASKIT_NO_ALIAS_FONT)
add_compile_options(-DSK_ASSUME_WEBGL=1)
add_compile_options(-DSWB_ENABLE_WEBGL=1)
add_compile_options(-fno-exceptions)


add_compile_options(-Wno-attributes)
add_compile_options(-ffp-contract=off)
add_compile_options(-fstrict-aliasing)
add_compile_options(-fPIC)
add_compile_options(-fvisibility=hidden)
add_compile_options(-std=c++26)
add_compile_options(-fvisibility-inlines-hidden)
add_compile_options(-fdebug-compilation-dir=${CMAKE_CURRENT_SOURCE_DIR})
add_compile_options(-fno-rtti)

add_library(SkiaWebBind STATIC
  "src/swbWebSurface.cpp")

target_include_directories(SkiaWebBind
  PUBLIC
  include
  ${SKIA_ROOT_DIR}
)


add_subdirectory(example)
