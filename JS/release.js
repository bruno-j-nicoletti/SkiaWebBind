////////////////////////////////////////////////////////////////////////////////
// Copyright 2018 Google LLC
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE.GOOGLE file.
////////////////////////////////////////////////////////////////////////////////

function Debug(msg) {
    // by leaving this blank, closure optimizes out calls (and the messages)
    // which trims down code size and marginally improves runtime speed.
}
/** @const */
var IsDebug = false;
