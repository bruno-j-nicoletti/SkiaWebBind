#!/usr/bin/env python3

"""
build-skia.py

This script automates the process of building Skia libraries for various platforms
(macOS, iOS, and Windows). It handles the setup of the build environment, cloning
of the Skia repository, configuration of build parameters, and compilation of the
libraries. The script also includes functionality for creating universal binaries
for macOS and a Swift Package and XCFramework for iOS.

Usage:
    python3 build-skia.py <platform> [options]

For detailed usage instructions, run:
    python3 build-skia.py --help

Copyright (c) 2024 Oli Larkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Callable

# Define ANSI color codes
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def colored_print(message, color):
    print(f"{color}{message}{Colors.ENDC}")

# Shared constants
SKIA_GIT_URL = "https://github.com/google/skia.git"


ROOT_DIR = Path(__file__).resolve().parent
BUILD_DIR = Path(__file__).resolve().parent / "build"
SRC_DIR = ROOT_DIR / "thirdparty"
SKIA_SRC_DIR = SRC_DIR / "skia"
TMP_DIR = BUILD_DIR / "tmp" / "skia"
ACTIVATE_EMSDK_PATH = SKIA_SRC_DIR / "bin" / "activate-emsdk"

# Platform-specific constants
MAC_MIN_VERSION = "10.15"
IOS_MIN_VERSION = "13.0"

# Unicode backend configuration
USE_LIBGRAPHEME = False  # Set to True to use libgrapheme instead of ICU

# Shared libraries
LIBS = [
        "libskia.a", "libskottie.a", "libskshaper.a", "libsksg.a",
        "libskparagraph.a", "libsvg.a", "libskunicode_core.a",
        "libskunicode_libgrapheme.a" if USE_LIBGRAPHEME else "libskunicode_icu.a"
    ]


# Directories to package
PACKAGE_DIRS = [
    "include",
    "modules/skottie",
    "modules/skparagraph",
    "modules/skshaper",
    "modules/skresources",
    "modules/skunicode",
    "modules/skcms",
    "modules/svg",
    "src/core",
    "src/base",
    "src/utils",
    "src/xml",
    # "third_party/externals/icu/source/common/unicode"
]

DONT_PACKAGE = [
    "android"
]

BASIC_GN_ARGS = """
cc = "clang"
cxx = "clang++"
"""

# Shared GN args
RELEASE_GN_ARGS = f"""
skia_use_system_libjpeg_turbo = false
skia_use_system_libpng = false
skia_use_system_zlib = false
skia_use_system_expat = false
skia_use_system_icu = false
skia_use_system_harfbuzz = false

skia_use_libwebp_decode = false
skia_use_libwebp_encode = false
skia_use_xps = false
skia_use_dng_sdk = false
skia_use_expat = true
skia_use_gl = true
skia_use_icu = {"false" if USE_LIBGRAPHEME else "true"}
skia_use_libgrapheme = {"true" if USE_LIBGRAPHEME else "false"}

skia_enable_graphite = true
skia_enable_svg = true
skia_enable_skottie = true
skia_enable_pdf = false
skia_enable_gpu = true
skia_enable_skparagraph = true
"""

# Platform-specific GN args
WASM_GN_ARGS = """
    target_os = "wasm"
    is_component_build = false
    is_trivial_abi = true
    werror = true
    skia_use_angle = false
    skia_use_dng_sdk = false
    skia_use_webgl = true
    skia_use_webgpu = false
    skia_use_expat = false
    skia_use_fontconfig = false
    skia_use_freetype = true
    skia_use_libheif = false
    skia_use_libjpeg_turbo_decode = true
    skia_use_libjpeg_turbo_encode = false
    skia_use_no_jpeg_encode = true
    skia_use_libpng_decode = true
    skia_use_libpng_encode = true
    skia_use_no_png_encode = false
    skia_use_libwebp_decode = true
    skia_use_libwebp_encode = false
    skia_use_no_webp_encode = true
    skia_use_lua = false
    skia_use_piex = false
    skia_use_system_freetype2 = false
    skia_use_vulkan = false
    skia_use_wuffs = true
    skia_use_zlib = true
    skia_enable_ganesh = true
    skia_enable_graphite = false
    skia_build_for_debugger = false
    skia_enable_skottie = false
    skia_use_client_icu = false
    skia_use_icu4x = false
    skia_use_harfbuzz = true
    skia_use_system_harfbuzz = false
    skia_enable_fontmgr_custom_directory = false
    skia_enable_fontmgr_custom_embedded = true
    skia_enable_fontmgr_custom_empty = true
    skia_use_freetype_woff2 = true
    skia_enable_skshaper = true
    """


def patchLines(path : Path, patchFunc : Callable[[Any, str], None]) -> None :
    with open(path, "r") as file:
        lines = file.readlines()

    with open(path, "w") as file:
        for line in lines:
            patchFunc(file, line)


class SkiaBuildScript:
    def __init__(self):
        self.config = "Release"
        self.branch = None
        self.platform = "wasm"

    def parse_arguments(self):
        parser = argparse.ArgumentParser(description="Build Skia for WebAssembly")
        parser.add_argument("-config", choices=["Debug", "Release"], default="Release", help="Build configuration")
        parser.add_argument("-branch", help="Skia Git branch to checkout", default="main")
        parser.add_argument("-emsdk", help="Optional path to the emsdk to use, defaults to skia's default.", default=None)
        parser.add_argument("--shallow", action="store_true", help="Perform a shallow clone of the Skia repository")
        args = parser.parse_args()


        self.emsdk = args.emsdk
        self.branch = args.branch
        self.shallow_clone = args.shallow

    def generate_gn_args(self) :
        output_dir = TMP_DIR / f"{self.platform}_{self.config}"
        gn_args = BASIC_GN_ARGS

        if self.config == 'Debug':
            gn_args += f"is_debug = true\n"
        else:
            gn_args += WASM_GN_ARGS
            gn_args += RELEASE_GN_ARGS
            gn_args += "is_debug = false\n"
            gn_args += "is_official_build = true\n"
        gn_args += "target_cpu = \"wasm\"\n"

        if self.emsdk :
            gn_args += f"""skia_emsdk_dir = "{self.emsdk}" """

        colored_print(f"Generating gn args for {self.platform} settings:", Colors.OKBLUE)
        colored_print(f"{gn_args}", Colors.OKGREEN)

        subprocess.run(["./bin/gn", "gen", str(output_dir), f"--args={gn_args}"], check=True)

    def build_skia(self) :
        output_dir = TMP_DIR / f"{self.platform}_{self.config}"

        # Get the list of libraries for the current platform
        libs_to_build = LIBS

        # Construct the ninja command with all library targets
        ninja_command = ["ninja", "-C", str(output_dir)] + libs_to_build

        # Run the ninja command
        try:
            subprocess.run(ninja_command, check=True)
            colored_print(f"Successfully built targets for {self.platform}", Colors.OKGREEN)
        except subprocess.CalledProcessError as e:
            colored_print(f"Error: Build failed for {self.platform}", Colors.FAIL)
            print(f"Ninja command: {' '.join(ninja_command)}")
            print(f"Error details: {e}")
            sys.exit(1)

    def move_libs(self) :
        src_dir = TMP_DIR / f"{self.platform}_{self.config}"
        dest_dir = BUILD_DIR
        dest_dir.mkdir(parents=True, exist_ok=True)

        # Copy the libraries
        for lib in LIBS :
            src_file = src_dir / lib
            dest_file = dest_dir / lib
            if src_file.exists():
                shutil.copy2(str(src_file), str(dest_file))
                colored_print(f"Copied {lib} to {dest_dir}", Colors.OKGREEN)
            else:
                colored_print(f"Warning: {lib} not found in {src_dir}", Colors.WARNING)

    # Combine the various skia libraries into a single static library for each platform
    def combine_libraries(self, platform):
        colored_print(f"Combining libraries for {platform}...", Colors.OKBLUE)
        output_lib = lib_dir / "libSkia.a"
        input_libs = [str(lib_dir / lib) for lib in LIBS if (lib_dir / lib).exists()]

        if input_libs:
            libtool_command = ["libtool", "-static", "-o", str(output_lib)] + input_libs
            subprocess.run(libtool_command, check=True)
            colored_print(f"Created combined library: {output_lib}", Colors.OKGREEN)
        else:
            colored_print(f"No libraries found to combine for {platform}", Colors.WARNING)

    def package_headers(self, dest_dir):
        colored_print(f"Packaging headers to {dest_dir}...", Colors.OKBLUE)
        dest_dir.mkdir(parents=True, exist_ok=True)

        for dir_path in PACKAGE_DIRS:
            src_path = SKIA_SRC_DIR / dir_path
            if src_path.exists() and src_path.is_dir():
                for root, dirs, files in os.walk(src_path):
                    # Remove excluded directories
                    dirs[:] = [d for d in dirs if d not in DONT_PACKAGE]

                    for file in files:
                        if file.endswith('.h'):
                            src_file = Path(root) / file
                            rel_path = src_file.relative_to(SKIA_SRC_DIR)

                            # Check if the file is in an excluded directory
                            if not any(exclude in rel_path.parts for exclude in DONT_PACKAGE):
                                dest_file = dest_dir / rel_path
                                dest_file.parent.mkdir(parents=True, exist_ok=True)
                                shutil.copy2(src_file, dest_file)
                                # print(f"Copied {rel_path} to {dest_file}")


    def setup_skia_repo(self):
        colored_print(f"Setting up Skia repository (branch: {self.branch})...", Colors.OKBLUE)
        if not SKIA_SRC_DIR.exists():
            clone_command = ["git", "clone"]
            if self.shallow_clone:
                clone_command.extend(["--depth", "1"])
            clone_command.extend(["--branch", self.branch, SKIA_GIT_URL, str(SKIA_SRC_DIR)])
            subprocess.run(clone_command, check=True)

            os.chdir(SKIA_SRC_DIR)
            colored_print("Syncing Deps...", Colors.OKBLUE)
            subprocess.run(["python3", "tools/git-sync-deps"], check=True)
        else:
            os.chdir(SKIA_SRC_DIR)
            fetch_command = ["git", "fetch"]
            if self.shallow_clone:
                fetch_command.extend(["--depth", "1"])
            fetch_command.extend(["origin", self.branch])
            subprocess.run(fetch_command, check=True)
            subprocess.run(["git", "checkout", self.branch], check=True)
            subprocess.run(["git", "reset", "--hard", f"origin/{self.branch}"], check=True)

        # patch here
        colored_print("Skia repository setup complete.", Colors.OKGREEN)

    def generate_gn_args_summary(self) :
        gn_args = BASIC_GN_ARGS + WASM_GN_ARGS + RELEASE_GN_ARGS
        gn_args += f"""
        is_debug = {"true" if self.config == 'Debug' else "false"}
        is_official_build = {"false" if self.config == 'Debug' else "true"}
        target_cpu = "wasm"
        """
        return gn_args.strip()

    def write_gn_args_summary(self):
        summary_file = BUILD_DIR / "gn_args.txt"
        summary_file.parent.mkdir(parents=True, exist_ok=True)

        with open(summary_file, "w") as f:
            f.write(f"Skia Build Summary for {self.platform}\n")
            f.write(f"Configuration: {self.config}\n")
            f.write("GN Arguments:\n")
            f.write(self.generate_gn_args_summary())
            f.write("\n")
        colored_print(f"GN args summary written to {summary_file}", Colors.OKGREEN)

    def run(self):
        self.parse_arguments()
        self.setup_skia_repo()
        self.generate_gn_args()
        self.build_skia()
        self.move_libs()
        self.package_headers(BUILD_DIR / "include")

        self.write_gn_args_summary()

        colored_print(f"Build completed successfully for {self.platform} {self.config}", Colors.OKGREEN)

        colored_print(f"Build completed successfully for {self.platform} {self.config} ", Colors.OKGREEN)

if __name__ == "__main__":
    SkiaBuildScript().run()
