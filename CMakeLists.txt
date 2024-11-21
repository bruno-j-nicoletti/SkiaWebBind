cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

project(SkiaWebBind VERSION 0.1)

IF (NOT ${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
  message(FATAL_ERROR "SkiaWebBind need to be compiled with emscripten to WASM, currently building to ${CMAKE_SYSTEM_NAME}.")
endif()

if (NOT DEFINED SKIA_ROOT_DIR)
  message(FATAL_ERROR "Need set SKIA_ROOT_DIR to point to the directory with the skia checkout.")
endif()

set(SKIA_WEB_BIND_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR})
set(SKIA_WEB_BIND_BINARY_DIR ${CMAKE_CURRENT_BINARY_DIR})
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_SCAN_FOR_MODULES OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS YES)
set(CMAKE_FIND_PACKAGE_REDIRECTS_DIR ${CMAKE_BINARY_DIR})

message(${PROJECT_NAME} ": compiler id is " ${CMAKE_CXX_COMPILER_ID} " VERSION IS " ${CMAKE_CXX_COMPILER_VERSION})

# add compile caching if ccache is installed on the system
find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
  set(CXX_COMPILER_LAUNCHER  "${CCACHE_PROGRAM}" CACHE INTERNAL "")
  set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
  message("Enabled compiler caching")
endif()


add_compile_options(-fwasm-exceptions)
add_compile_options(-pthread)
add_compile_options(-DSK_FORCE_8_BYTE_ALIGNMENT)
add_compile_options(-DSK_DISABLE_LEGACY_PARAGRAPH_UNICODE=1)
add_compile_options(-DSK_RELEASE)
add_compile_options(-DSK_GANESH)
add_compile_options(-DSK_DISABLE_LEGACY_SHADERCONTEXT)
add_compile_options(-DSK_GL)
add_compile_options(-DCK_ENABLE_WEBGL)
add_compile_options(-DNDEBUG)
add_compile_options(-DSK_TRIVIAL_ABI=[[clang::trivial_abi]])
add_compile_options(-DSK_FONTMGR_FREETYPE_EMBEDDED_AVAILABLE)
add_compile_options(-DSK_TYPEFACE_FACTORY_FREETYPE)
add_compile_options(-DSK_HAS_WUFFS_LIBRARY)
add_compile_options(-DSK_CODEC_DECODES_GIF)
add_compile_options(-DSK_CODEC_DECODES_BMP)
add_compile_options(-DSK_CODEC_DECODES_WBMP)
add_compile_options(-DSK_ENABLE_PRECOMPILE)
add_compile_options(-DSKNX_NO_SIMD)
add_compile_options(-DSK_DISABLE_TRACING)
add_compile_options(-DSK_DISABLE_EFFECT_DESERIALIZATION)
add_compile_options(-DCANVASKIT_NO_ALIAS_FONT)
add_compile_options(-DSK_ASSUME_WEBGL=1)
add_compile_options(-DSWB_ENABLE_WEBGL=1)

add_compile_options(-Wno-attributes)
add_compile_options(-ffp-contract=off)
add_compile_options(-fstrict-aliasing)
add_compile_options(-fPIC)
add_compile_options(-fvisibility=hidden)
add_compile_options(-O3)
add_compile_options(-std=c++17)
add_compile_options(-fvisibility-inlines-hidden)
add_compile_options(-fno-exceptions)
add_compile_options(-DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0)
add_compile_options(-fno-rtti)

add_library(SkiaWebBind STATIC
  "src/swbJSModule.cpp"
  "src/swbSkiaLogo.cpp"
  "src/swbSurface.cpp")

target_include_directories(SkiaWebBind
  PUBLIC
  include
  ${SKIA_ROOT_DIR}
)

set(SKIA_WEB_BIND_JS_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/JS/cpu.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/debug.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/externs.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/interface.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/loadSkiaWebBind.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/postamble.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/preamble.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/release.js;${CMAKE_CURRENT_SOURCE_DIR}/JS/webgl.js)

# add this to link options to client targets to generate appropriate .js and .wasm
set(SKIA_WEB_BIND_LINK_OPTIONS
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/release.js"
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/CPU.js"
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/webgl.js"
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/preamble.js"
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/interface.js"
  "SHELL:--pre-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/postamble.js"
  "SHELL:--extern-post-js ${SKIA_WEB_BIND_ROOT_DIR}/JS/loadSkiaWebBind.js"
  --bind
  -Wl,--whole-archive
  -sEXPORT_NAME=SkiaWebBindInit
  -sALLOW_MEMORY_GROWTH
  ${SKIA_WEB_BIND_BINARY_DIR}/libSkiaWebBind.a
  -Wl,--no-whole-archive
  ${SKIA_ROOT_DIR}/out/skiawebbinding_wasm/libskia.a
  -sMODULARIZE
  -sUSE_WEBGL2=1
  -sMAX_WEBGL_VERSION=2
  -sWASM=1
  -sINVOKE_RUN=0
  -sIGNORE_MISSING_MAIN=0
  -sDYNAMIC_EXECUTION=0
  -sDISABLE_EXCEPTION_CATCHING
  -sNODEJS_CATCH_EXIT=0
  -fno-rtti
  -sNO_EXIT_RUNTIME=1
  -sINITIAL_MEMORY=128MB
  -sSTRICT=1
  -sASSERTIONS=0
  --no-entry
  -sEXIT_RUNTIME
  -lembind
  -lGL
)

add_subdirectory(example)
