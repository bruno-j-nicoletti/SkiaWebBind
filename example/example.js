var SkiaWebBindInit = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(moduleArg = {}) {

            var g = moduleArg,
                aa, ba;
            g.ready = new Promise((a, b) => {
                aa = a;
                ba = b
            });
            (function(a) {
                a.sd = a.sd || [];
                a.sd.push(function() {
                    a.MakeSWSurface = function(b) {
                        var c = b,
                            d = "undefined" !== typeof OffscreenCanvas && c instanceof OffscreenCanvas;
                        if (!("undefined" !== typeof HTMLCanvasElement && c instanceof HTMLCanvasElement || d || (c = document.getElementById(b), c))) throw "Canvas with id " + b + " was not found";
                        b = c.width * c.height * 4;
                        d = a._malloc(b);
                        var e = a.Surface._makeRasterDirect(c.width, c.height, d, 4 * c.width);
                        e && (e.Fd = null, e.ee = c.width, e.ce = c.height, e.de = b, e.Nd = d, e.Fd = c);
                        e.isSoftware = !0;
                        e.isWebGL = !1;
                        return e
                    };
                    a.MakeSurface || (a.MakeSurface = a.MakeSWSurface);
                    a.Surface.prototype.flush = function(b) {
                        a.setCurrentContext(this._context);
                        this._flush();
                        if (this.Fd) {
                            var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.Nd, this.de);
                            c = new ImageData(c, this.ee, this.ce);
                            b ? this.Fd.getContext("2d").putImageData(c, 0, 0, b[0], b[1], b[2] - b[0], b[3] - b[1]) : this.Fd.getContext("2d").putImageData(c, 0, 0)
                        }
                    };
                    a.Surface.prototype.dispose = function() {
                        this.Nd && a._free(this.Nd);
                        this.delete()
                    };
                    a.setCurrentContext = a.setCurrentContext || function() {};
                    a.Vd = a.Vd || function() {
                        return null
                    }
                })
            })(g);
            (function(a) {
                a.sd = a.sd || [];
                a.sd.push(function() {
                    function b(c, d, e) {
                        return c && c.hasOwnProperty(d) ? c[d] : e
                    }
                    a.GetWebGLContext = function(c, d) {
                        if (!c) throw "null canvas passed into makeWebGLContext";
                        var e = {
                            alpha: b(d, "alpha", 1),
                            depth: b(d, "depth", 1),
                            stencil: b(d, "stencil", 8),
                            antialias: b(d, "antialias", 0),
                            premultipliedAlpha: b(d, "premultipliedAlpha", 1),
                            preserveDrawingBuffer: b(d, "preserveDrawingBuffer", 0),
                            preferLowPowerToHighPerformance: b(d, "preferLowPowerToHighPerformance", 0),
                            failIfMajorPerformanceCaveat: b(d, "failIfMajorPerformanceCaveat",
                                0),
                            enableExtensionsByDefault: b(d, "enableExtensionsByDefault", 1),
                            explicitSwapControl: b(d, "explicitSwapControl", 0),
                            renderViaOffscreenBackBuffer: b(d, "renderViaOffscreenBackBuffer", 0)
                        };
                        e.majorVersion = d && d.majorVersion ? d.majorVersion : "undefined" !== typeof WebGL2RenderingContext ? 2 : 1;
                        if (e.explicitSwapControl) throw "explicitSwapControl is not supported";
                        c = ca(c, e);
                        if (!c) return null;
                        da(c);
                        m.wd.getExtension("WEBGL_debug_renderer_info");
                        return c
                    };
                    a.Ae = function(c) {
                        m === q[c] && (m = null);
                        "object" == typeof JSEvents && JSEvents.De(q[c].wd.canvas);
                        q[c] && q[c].wd.canvas && (q[c].wd.canvas.be = void 0);
                        q[c] = null
                    };
                    a.MakeWebGLDirectContext = function(c) {
                        if (!this.setCurrentContext(c)) return null;
                        var d = this._MakeWebGLDirectContext();
                        if (!d) return null;
                        d._context = c;
                        var e = d.delete.bind(d);
                        d["delete"] = function() {
                            a.setCurrentContext(this._context);
                            e()
                        }.bind(d);
                        return c = d
                    };
                    a.MakeWebGLSurface = function(c, d) {
                        var e = c,
                            f = "undefined" !== typeof OffscreenCanvas && e instanceof OffscreenCanvas;
                        if (!("undefined" !== typeof HTMLCanvasElement && e instanceof HTMLCanvasElement || f ||
                                (e = document.getElementById(c), e))) throw "Canvas with id " + c + " was not found";
                        c = this.GetWebGLContext(e, d);
                        var h;
                        null != c && (c = this.MakeWebGLDirectContext(c)) && this.setCurrentContext(c._context) && (h = this._MakeOnScreenGLSurface(c, e.width, e.height)) && (h._context = c._context, h.isSoftware = !1, h.isWebGL = !0);
                        if (void 0 == h || null == h) h = e.cloneNode(!0), e.parentNode.replaceChild(h, e), h.classList.add("ck-replaced"), h = a.MakeSWSurface(h);
                        return h
                    };
                    a.MakeSurface = a.MakeWebGLSurface;
                    a.setCurrentContext = function(c) {
                        return c ?
                            da(c) : !1
                    };
                    a.Vd = function() {
                        return m && m.Zd && !m.Zd.isDeleted() ? m.Zd : null
                    }
                })
            })(g);
            (function(a) {
                a.onRuntimeInitialized = function() {
                    a.sd && a.sd.forEach(function(b) {
                        b()
                    })
                }
            })(g);
            var ea = Object.assign({}, g),
                fa = "./this.program",
                ha = (a, b) => {
                    throw b;
                },
                ia = "object" == typeof window,
                ja = "function" == typeof importScripts,
                ka = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
                t = "",
                la, na, oa;
            if (ka) {
                var fs = require("fs"),
                    pa = require("path");
                t = ja ? pa.dirname(t) + "/" : __dirname + "/";
                la = (a, b) => {
                    a = a.startsWith("file://") ? new URL(a) : pa.normalize(a);
                    return fs.readFileSync(a, b ? void 0 : "utf8")
                };
                oa = a => {
                    a = la(a, !0);
                    a.buffer || (a = new Uint8Array(a));
                    return a
                };
                na = (a, b, c, d = !0) => {
                    a = a.startsWith("file://") ? new URL(a) : pa.normalize(a);
                    fs.readFile(a, d ? void 0 : "utf8", (e, f) => {
                        e ? c(e) : b(d ? f.buffer : f)
                    })
                };
                !g.thisProgram && 1 < process.argv.length && (fa = process.argv[1].replace(/\\/g, "/"));
                process.argv.slice(2);
                ha = (a, b) => {
                    process.exitCode =
                        a;
                    throw b;
                };
                g.inspect = () => "[Emscripten Module object]"
            } else if (ia || ja) ja ? t = self.location.href : "undefined" != typeof document && document.currentScript && (t = document.currentScript.src), _scriptDir && (t = _scriptDir), 0 !== t.indexOf("blob:") ? t = t.substr(0, t.replace(/[?#].*/, "").lastIndexOf("/") + 1) : t = "", la = a => {
                    var b = new XMLHttpRequest;
                    b.open("GET", a, !1);
                    b.send(null);
                    return b.responseText
                }, ja && (oa = a => {
                    var b = new XMLHttpRequest;
                    b.open("GET", a, !1);
                    b.responseType = "arraybuffer";
                    b.send(null);
                    return new Uint8Array(b.response)
                }),
                na = (a, b, c) => {
                    var d = new XMLHttpRequest;
                    d.open("GET", a, !0);
                    d.responseType = "arraybuffer";
                    d.onload = () => {
                        200 == d.status || 0 == d.status && d.response ? b(d.response) : c()
                    };
                    d.onerror = c;
                    d.send(null)
                };
            var qa = g.print || console.log.bind(console),
                y = g.printErr || console.error.bind(console);
            Object.assign(g, ea);
            ea = null;
            g.thisProgram && (fa = g.thisProgram);
            g.quit && (ha = g.quit);
            var ra;
            g.wasmBinary && (ra = g.wasmBinary);
            var noExitRuntime = g.noExitRuntime || !1;
            "object" != typeof WebAssembly && sa("no native wasm support detected");
            var ta, z, ua = !1,
                A, B, C, va, D, E, F, wa;

            function xa() {
                var a = ta.buffer;
                g.HEAP8 = A = new Int8Array(a);
                g.HEAP16 = C = new Int16Array(a);
                g.HEAP32 = D = new Int32Array(a);
                g.HEAPU8 = B = new Uint8Array(a);
                g.HEAPU16 = va = new Uint16Array(a);
                g.HEAPU32 = E = new Uint32Array(a);
                g.HEAPF32 = F = new Float32Array(a);
                g.HEAPF64 = wa = new Float64Array(a)
            }
            var ya, za = [],
                Aa = [],
                Ba = [],
                Ca = [],
                Da = [];

            function Ea() {
                var a = g.preRun.shift();
                za.unshift(a)
            }
            var Fa = 0,
                Ga = null,
                Ha = null;

            function sa(a) {
                if (g.onAbort) g.onAbort(a);
                a = "Aborted(" + a + ")";
                y(a);
                ua = !0;
                a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
                ba(a);
                throw a;
            }

            function Ia(a) {
                return a.startsWith("data:application/octet-stream;base64,")
            }
            var Ja;
            Ja = "example.wasm";
            if (!Ia(Ja)) {
                var Ka = Ja;
                Ja = g.locateFile ? g.locateFile(Ka, t) : t + Ka
            }

            function La(a) {
                if (a == Ja && ra) return new Uint8Array(ra);
                if (oa) return oa(a);
                throw "both async and sync fetching of the wasm failed";
            }

            function Ma(a) {
                if (!ra && (ia || ja)) {
                    if ("function" == typeof fetch && !a.startsWith("file://")) return fetch(a, {
                        credentials: "same-origin"
                    }).then(b => {
                        if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
                        return b.arrayBuffer()
                    }).catch(() => La(a));
                    if (na) return new Promise((b, c) => {
                        na(a, d => b(new Uint8Array(d)), c)
                    })
                }
                return Promise.resolve().then(() => La(a))
            }

            function Na(a, b, c) {
                return Ma(a).then(d => WebAssembly.instantiate(d, b)).then(d => d).then(c, d => {
                    y("failed to asynchronously prepare wasm: " + d);
                    sa(d)
                })
            }

            function Oa(a, b) {
                var c = Ja;
                return ra || "function" != typeof WebAssembly.instantiateStreaming || Ia(c) || c.startsWith("file://") || ka || "function" != typeof fetch ? Na(c, a, b) : fetch(c, {
                    credentials: "same-origin"
                }).then(d => WebAssembly.instantiateStreaming(d, a).then(b, function(e) {
                    y("wasm streaming compile failed: " + e);
                    y("falling back to ArrayBuffer instantiation");
                    return Na(c, a, b)
                }))
            }

            function Pa(a) {
                this.name = "ExitStatus";
                this.message = `Program terminated with exit(${a})`;
                this.status = a
            }
            var Qa = a => {
                for (; 0 < a.length;) a.shift()(g)
            };

            function Ra(a) {
                switch (a) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError(`Unknown type size: ${a}`);
                }
            }
            var Sa = void 0;

            function G(a) {
                for (var b = ""; B[a];) b += Sa[B[a++]];
                return b
            }
            var Ta = {},
                Ua = {},
                Va = {},
                Wa = void 0;

            function I(a) {
                throw new Wa(a);
            }
            var Xa = void 0;

            function Ya(a) {
                throw new Xa(a);
            }

            function J(a, b, c) {
                function d(k) {
                    k = c(k);
                    k.length !== a.length && Ya("Mismatched type converter count");
                    for (var n = 0; n < a.length; ++n) K(a[n], k[n])
                }
                a.forEach(function(k) {
                    Va[k] = b
                });
                var e = Array(b.length),
                    f = [],
                    h = 0;
                b.forEach((k, n) => {
                    Ua.hasOwnProperty(k) ? e[n] = Ua[k] : (f.push(k), Ta.hasOwnProperty(k) || (Ta[k] = []), Ta[k].push(() => {
                        e[n] = Ua[k];
                        ++h;
                        h === f.length && d(e)
                    }))
                });
                0 === f.length && d(e)
            }

            function Za(a, b, c = {}) {
                var d = b.name;
                a || I(`type "${d}" must have a positive integer typeid pointer`);
                if (Ua.hasOwnProperty(a)) {
                    if (c.ne) return;
                    I(`Cannot register type '${d}' twice`)
                }
                Ua[a] = b;
                delete Va[a];
                Ta.hasOwnProperty(a) && (b = Ta[a], delete Ta[a], b.forEach(e => e()))
            }

            function K(a, b, c = {}) {
                if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
                Za(a, b, c)
            }

            function $a(a) {
                I(a.dd.hd.ed.name + " instance already deleted")
            }
            var ab = !1;

            function bb() {}

            function cb(a) {
                --a.count.value;
                0 === a.count.value && (a.ld ? a.md.td(a.ld) : a.hd.ed.td(a.gd))
            }

            function db(a, b, c) {
                if (b === c) return a;
                if (void 0 === c.kd) return null;
                a = db(a, b, c.kd);
                return null === a ? null : c.he(a)
            }
            var eb = {},
                fb = [];

            function gb() {
                for (; fb.length;) {
                    var a = fb.pop();
                    a.dd.zd = !1;
                    a["delete"]()
                }
            }
            var hb = void 0,
                ib = {};

            function jb(a, b) {
                for (void 0 === b && I("ptr should not be undefined"); a.kd;) b = a.Dd(b), a = a.kd;
                return ib[b]
            }

            function kb(a, b) {
                b.hd && b.gd || Ya("makeClassHandle requires ptr and ptrType");
                !!b.md !== !!b.ld && Ya("Both smartPtrType and smartPtr must be specified");
                b.count = {
                    value: 1
                };
                return lb(Object.create(a, {
                    dd: {
                        value: b
                    }
                }))
            }

            function lb(a) {
                if ("undefined" === typeof FinalizationRegistry) return lb = b => b, a;
                ab = new FinalizationRegistry(b => {
                    cb(b.dd)
                });
                lb = b => {
                    var c = b.dd;
                    c.ld && ab.register(b, {
                        dd: c
                    }, b);
                    return b
                };
                bb = b => {
                    ab.unregister(b)
                };
                return lb(a)
            }

            function L() {}

            function mb(a) {
                if (void 0 === a) return "_unknown";
                a = a.replace(/[^a-zA-Z0-9_]/g, "$");
                var b = a.charCodeAt(0);
                return 48 <= b && 57 >= b ? `_${a}` : a
            }

            function nb(a, b) {
                a = mb(a);
                return {
                    [a]: function() {
                        return b.apply(this, arguments)
                    }
                } [a]
            }

            function ob(a, b, c) {
                if (void 0 === a[b].jd) {
                    var d = a[b];
                    a[b] = function() {
                        a[b].jd.hasOwnProperty(arguments.length) || I(`Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${a[b].jd})!`);
                        return a[b].jd[arguments.length].apply(this, arguments)
                    };
                    a[b].jd = [];
                    a[b].jd[d.xd] = d
                }
            }

            function pb(a, b, c) {
                g.hasOwnProperty(a) ? ((void 0 === c || void 0 !== g[a].jd && void 0 !== g[a].jd[c]) && I(`Cannot register public name '${a}' twice`), ob(g, a, a), g.hasOwnProperty(c) && I(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`), g[a].jd[c] = b) : (g[a] = b, void 0 !== c && (g[a].Ce = c))
            }

            function qb(a, b, c, d, e, f, h, k) {
                this.name = a;
                this.constructor = b;
                this.Ad = c;
                this.td = d;
                this.kd = e;
                this.le = f;
                this.Dd = h;
                this.he = k;
                this.re = []
            }

            function rb(a, b, c) {
                for (; b !== c;) b.Dd || I(`Expected null or instance of ${c.name}, got an instance of ${b.name}`), a = b.Dd(a), b = b.kd;
                return a
            }

            function sb(a, b) {
                if (null === b) return this.Pd && I(`null is not a valid ${this.name}`), 0;
                b.dd || I(`Cannot pass "${tb(b)}" as a ${this.name}`);
                b.dd.gd || I(`Cannot pass deleted object as a pointer of type ${this.name}`);
                return rb(b.dd.gd, b.dd.hd.ed, this.ed)
            }

            function ub(a, b) {
                if (null === b) {
                    this.Pd && I(`null is not a valid ${this.name}`);
                    if (this.Hd) {
                        var c = this.se();
                        null !== a && a.push(this.td, c);
                        return c
                    }
                    return 0
                }
                b.dd || I(`Cannot pass "${tb(b)}" as a ${this.name}`);
                b.dd.gd || I(`Cannot pass deleted object as a pointer of type ${this.name}`);
                !this.Gd && b.dd.hd.Gd && I(`Cannot convert argument of type ${b.dd.md?b.dd.md.name:b.dd.hd.name} to parameter type ${this.name}`);
                c = rb(b.dd.gd, b.dd.hd.ed, this.ed);
                if (this.Hd) switch (void 0 === b.dd.ld && I("Passing raw pointer to smart pointer is illegal"),
                    this.ue) {
                    case 0:
                        b.dd.md === this ? c = b.dd.ld : I(`Cannot convert argument of type ${b.dd.md?b.dd.md.name:b.dd.hd.name} to parameter type ${this.name}`);
                        break;
                    case 1:
                        c = b.dd.ld;
                        break;
                    case 2:
                        if (b.dd.md === this) c = b.dd.ld;
                        else {
                            var d = b.clone();
                            c = this.te(c, M(function() {
                                d["delete"]()
                            }));
                            null !== a && a.push(this.td, c)
                        }
                        break;
                    default:
                        I("Unsupporting sharing policy")
                }
                return c
            }

            function vb(a, b) {
                if (null === b) return this.Pd && I(`null is not a valid ${this.name}`), 0;
                b.dd || I(`Cannot pass "${tb(b)}" as a ${this.name}`);
                b.dd.gd || I(`Cannot pass deleted object as a pointer of type ${this.name}`);
                b.dd.hd.Gd && I(`Cannot convert argument of type ${b.dd.hd.name} to parameter type ${this.name}`);
                return rb(b.dd.gd, b.dd.hd.ed, this.ed)
            }

            function wb(a) {
                return this.fromWireType(D[a >> 2])
            }

            function N(a, b, c, d, e, f, h, k, n, p, u) {
                this.name = a;
                this.ed = b;
                this.Pd = c;
                this.Gd = d;
                this.Hd = e;
                this.qe = f;
                this.ue = h;
                this.Xd = k;
                this.se = n;
                this.te = p;
                this.td = u;
                e || void 0 !== b.kd ? this.toWireType = ub : (this.toWireType = d ? sb : vb, this.qd = null)
            }

            function xb(a, b, c) {
                g.hasOwnProperty(a) || Ya("Replacing nonexistant public symbol");
                void 0 !== g[a].jd && void 0 !== c ? g[a].jd[c] = b : (g[a] = b, g[a].xd = c)
            }
            var yb = [],
                zb = a => {
                    var b = yb[a];
                    b || (a >= yb.length && (yb.length = a + 1), yb[a] = b = ya.get(a));
                    return b
                },
                Ab = (a, b) => {
                    var c = [];
                    return function() {
                        c.length = 0;
                        Object.assign(c, arguments);
                        if (a.includes("j")) {
                            var d = g["dynCall_" + a];
                            d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b)
                        } else d = zb(b).apply(null, c);
                        return d
                    }
                };

            function P(a, b) {
                a = G(a);
                var c = a.includes("j") ? Ab(a, b) : zb(b);
                "function" != typeof c && I(`unknown function pointer with signature ${a}: ${b}`);
                return c
            }
            var Bb = void 0;

            function Cb(a) {
                a = Db(a);
                var b = G(a);
                Q(a);
                return b
            }

            function Eb(a, b) {
                function c(f) {
                    e[f] || Ua[f] || (Va[f] ? Va[f].forEach(c) : (d.push(f), e[f] = !0))
                }
                var d = [],
                    e = {};
                b.forEach(c);
                throw new Bb(`${a}: ` + d.map(Cb).join([", "]));
            }

            function Fb(a) {
                for (; a.length;) {
                    var b = a.pop();
                    a.pop()(b)
                }
            }

            function Gb(a) {
                var b = Function;
                if (!(b instanceof Function)) throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
                var c = nb(b.name || "unknownFunctionName", function() {});
                c.prototype = b.prototype;
                c = new c;
                a = b.apply(c, a);
                return a instanceof Object ? a : c
            }

            function Hb(a, b, c, d, e, f) {
                var h = b.length;
                2 > h && I("argTypes array size mismatch! Must at least get return value and 'this' types!");
                for (var k = null !== b[1] && null !== c, n = !1, p = 1; p < b.length; ++p)
                    if (null !== b[p] && void 0 === b[p].qd) {
                        n = !0;
                        break
                    } var u = "void" !== b[0].name,
                    v = "",
                    w = "";
                for (p = 0; p < h - 2; ++p) v += (0 !== p ? ", " : "") + "arg" + p, w += (0 !== p ? ", " : "") + "arg" + p + "Wired";
                v = `\n        return function ${mb(a)}(${v}) {\n        if (arguments.length !== ${h-2}) {\n          throwBindingError('function ${a} called with ${arguments.length} arguments, expected ${h-
2} args!');\n        }`;
                n && (v += "var destructors = [];\n");
                var l = n ? "destructors" : "null",
                    r = "throwBindingError invoker fn runDestructors retType classParam".split(" "),
                    x = [I, d, e, Fb, b[0], b[1]];
                k && (v += "var thisWired = classParam.toWireType(" + l + ", this);\n");
                for (p = 0; p < h - 2; ++p) v += "var arg" + p + "Wired = argType" + p + ".toWireType(" + l + ", arg" + p + "); // " + b[p + 2].name + "\n", r.push("argType" + p), x.push(b[p + 2]);
                k && (w = "thisWired" + (0 < w.length ? ", " : "") + w);
                v += (u || f ? "var rv = " : "") + "invoker(fn" + (0 < w.length ? ", " : "") + w + ");\n";
                if (n) v += "runDestructors(destructors);\n";
                else
                    for (p = k ? 1 : 2; p < b.length; ++p) h = 1 === p ? "thisWired" : "arg" + (p - 2) + "Wired", null !== b[p].qd && (v += h + "_dtor(" + h + "); // " + b[p].name + "\n", r.push(h + "_dtor"), x.push(b[p].qd));
                u && (v += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
                r.push(v + "}\n");
                return Gb(r).apply(null, x)
            }

            function Ib(a, b) {
                for (var c = [], d = 0; d < a; d++) c.push(E[b + 4 * d >> 2]);
                return c
            }

            function Jb() {
                this.pd = [void 0];
                this.Ud = []
            }
            var R = new Jb;

            function Kb(a) {
                a >= R.rd && 0 === --R.get(a).Yd && R.ke(a)
            }
            var Lb = a => {
                    a || I("Cannot use deleted val. handle = " + a);
                    return R.get(a).value
                },
                M = a => {
                    switch (a) {
                        case void 0:
                            return 1;
                        case null:
                            return 2;
                        case !0:
                            return 3;
                        case !1:
                            return 4;
                        default:
                            return R.ie({
                                Yd: 1,
                                value: a
                            })
                    }
                };

            function tb(a) {
                if (null === a) return "null";
                var b = typeof a;
                return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a
            }

            function Mb(a, b) {
                switch (b) {
                    case 2:
                        return function(c) {
                            return this.fromWireType(F[c >> 2])
                        };
                    case 3:
                        return function(c) {
                            return this.fromWireType(wa[c >> 3])
                        };
                    default:
                        throw new TypeError("Unknown float type: " + a);
                }
            }

            function Nb(a, b, c) {
                switch (b) {
                    case 0:
                        return c ? function(d) {
                            return A[d]
                        } : function(d) {
                            return B[d]
                        };
                    case 1:
                        return c ? function(d) {
                            return C[d >> 1]
                        } : function(d) {
                            return va[d >> 1]
                        };
                    case 2:
                        return c ? function(d) {
                            return D[d >> 2]
                        } : function(d) {
                            return E[d >> 2]
                        };
                    default:
                        throw new TypeError("Unknown integer type: " + a);
                }
            }
            var Ob = (a, b, c, d) => {
                    if (!(0 < d)) return 0;
                    var e = c;
                    d = c + d - 1;
                    for (var f = 0; f < a.length; ++f) {
                        var h = a.charCodeAt(f);
                        if (55296 <= h && 57343 >= h) {
                            var k = a.charCodeAt(++f);
                            h = 65536 + ((h & 1023) << 10) | k & 1023
                        }
                        if (127 >= h) {
                            if (c >= d) break;
                            b[c++] = h
                        } else {
                            if (2047 >= h) {
                                if (c + 1 >= d) break;
                                b[c++] = 192 | h >> 6
                            } else {
                                if (65535 >= h) {
                                    if (c + 2 >= d) break;
                                    b[c++] = 224 | h >> 12
                                } else {
                                    if (c + 3 >= d) break;
                                    b[c++] = 240 | h >> 18;
                                    b[c++] = 128 | h >> 12 & 63
                                }
                                b[c++] = 128 | h >> 6 & 63
                            }
                            b[c++] = 128 | h & 63
                        }
                    }
                    b[c] = 0;
                    return c - e
                },
                Pb = a => {
                    for (var b = 0, c = 0; c < a.length; ++c) {
                        var d = a.charCodeAt(c);
                        127 >= d ? b++ : 2047 >=
                            d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3
                    }
                    return b
                },
                Qb = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
                Rb = (a, b, c) => {
                    var d = b + c;
                    for (c = b; a[c] && !(c >= d);) ++c;
                    if (16 < c - b && a.buffer && Qb) return Qb.decode(a.subarray(b, c));
                    for (d = ""; b < c;) {
                        var e = a[b++];
                        if (e & 128) {
                            var f = a[b++] & 63;
                            if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | f);
                            else {
                                var h = a[b++] & 63;
                                e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | h : (e & 7) << 18 | f << 12 | h << 6 | a[b++] & 63;
                                65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 |
                                    e & 1023))
                            }
                        } else d += String.fromCharCode(e)
                    }
                    return d
                },
                Sb = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
                Tb = (a, b) => {
                    var c = a >> 1;
                    for (var d = c + b / 2; !(c >= d) && va[c];) ++c;
                    c <<= 1;
                    if (32 < c - a && Sb) return Sb.decode(B.subarray(a, c));
                    c = "";
                    for (d = 0; !(d >= b / 2); ++d) {
                        var e = C[a + 2 * d >> 1];
                        if (0 == e) break;
                        c += String.fromCharCode(e)
                    }
                    return c
                },
                Ub = (a, b, c) => {
                    void 0 === c && (c = 2147483647);
                    if (2 > c) return 0;
                    c -= 2;
                    var d = b;
                    c = c < 2 * a.length ? c / 2 : a.length;
                    for (var e = 0; e < c; ++e) C[b >> 1] = a.charCodeAt(e), b += 2;
                    C[b >> 1] = 0;
                    return b - d
                },
                Vb = a =>
                2 * a.length,
                Wb = (a, b) => {
                    for (var c = 0, d = ""; !(c >= b / 4);) {
                        var e = D[a + 4 * c >> 2];
                        if (0 == e) break;
                        ++c;
                        65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e)
                    }
                    return d
                },
                Xb = (a, b, c) => {
                    void 0 === c && (c = 2147483647);
                    if (4 > c) return 0;
                    var d = b;
                    c = d + c - 4;
                    for (var e = 0; e < a.length; ++e) {
                        var f = a.charCodeAt(e);
                        if (55296 <= f && 57343 >= f) {
                            var h = a.charCodeAt(++e);
                            f = 65536 + ((f & 1023) << 10) | h & 1023
                        }
                        D[b >> 2] = f;
                        b += 4;
                        if (b + 4 > c) break
                    }
                    D[b >> 2] = 0;
                    return b - d
                },
                Yb = a => {
                    for (var b = 0, c = 0; c < a.length; ++c) {
                        var d = a.charCodeAt(c);
                        55296 <= d && 57343 >= d && ++c;
                        b += 4
                    }
                    return b
                };

            function Zb(a, b) {
                var c = Ua[a];
                void 0 === c && I(b + " has unknown type " + Cb(a));
                return c
            }
            var $b = {};

            function ac(a) {
                var b = $b[a];
                return void 0 === b ? G(a) : b
            }
            var bc = [];

            function cc() {
                return "object" == typeof globalThis ? globalThis : Function("return this")()
            }

            function dc(a) {
                var b = bc.length;
                bc.push(a);
                return b
            }

            function ec(a, b) {
                for (var c = Array(a), d = 0; d < a; ++d) c[d] = Zb(E[b + 4 * d >> 2], "parameter " + d);
                return c
            }
            var fc = [];

            function gc(a) {
                var b = a.getExtension("ANGLE_instanced_arrays");
                b && (a.vertexAttribDivisor = function(c, d) {
                    b.vertexAttribDivisorANGLE(c, d)
                }, a.drawArraysInstanced = function(c, d, e, f) {
                    b.drawArraysInstancedANGLE(c, d, e, f)
                }, a.drawElementsInstanced = function(c, d, e, f, h) {
                    b.drawElementsInstancedANGLE(c, d, e, f, h)
                })
            }

            function hc(a) {
                var b = a.getExtension("OES_vertex_array_object");
                b && (a.createVertexArray = function() {
                    return b.createVertexArrayOES()
                }, a.deleteVertexArray = function(c) {
                    b.deleteVertexArrayOES(c)
                }, a.bindVertexArray = function(c) {
                    b.bindVertexArrayOES(c)
                }, a.isVertexArray = function(c) {
                    return b.isVertexArrayOES(c)
                })
            }

            function ic(a) {
                var b = a.getExtension("WEBGL_draw_buffers");
                b && (a.drawBuffers = function(c, d) {
                    b.drawBuffersWEBGL(c, d)
                })
            }
            var jc = 1,
                kc = [],
                S = [],
                lc = [],
                mc = [],
                nc = [],
                T = [],
                oc = [],
                q = [],
                U = [],
                pc = [],
                qc = [],
                rc = {},
                sc = {},
                tc = 4;

            function V(a) {
                uc || (uc = a)
            }

            function vc(a) {
                for (var b = jc++, c = a.length; c < b; c++) a[c] = null;
                return b
            }

            function ca(a, b) {
                a.rd || (a.rd = a.getContext, a.getContext = function(d, e) {
                    e = a.rd(d, e);
                    return "webgl" == d == e instanceof WebGLRenderingContext ? e : null
                });
                var c = 1 < b.majorVersion ? a.getContext("webgl2", b) : a.getContext("webgl", b);
                return c ? wc(c, b) : 0
            }

            function wc(a, b) {
                var c = vc(q),
                    d = {
                        handle: c,
                        attributes: b,
                        version: b.majorVersion,
                        wd: a
                    };
                a.canvas && (a.canvas.be = d);
                q[c] = d;
                ("undefined" == typeof b.je || b.je) && xc(d);
                return c
            }

            function da(a) {
                m = q[a];
                g.ze = W = m && m.wd;
                return !(a && !W)
            }

            function xc(a) {
                a || (a = m);
                if (!a.oe) {
                    a.oe = !0;
                    var b = a.wd;
                    gc(b);
                    hc(b);
                    ic(b);
                    b.Td = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
                    b.Wd = b.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
                    2 <= a.version && (b.nd = b.getExtension("EXT_disjoint_timer_query_webgl2"));
                    if (2 > a.version || !b.nd) b.nd = b.getExtension("EXT_disjoint_timer_query");
                    b.Be = b.getExtension("WEBGL_multi_draw");
                    (b.getSupportedExtensions() || []).forEach(function(c) {
                        c.includes("lose_context") || c.includes("debug") || b.getExtension(c)
                    })
                }
            }
            var m, uc;

            function yc(a, b) {
                W.bindFramebuffer(a, lc[b])
            }

            function zc(a) {
                W.bindVertexArray(oc[a])
            }

            function Ac(a) {
                W.clear(a)
            }

            function Dc(a, b, c, d) {
                W.clearColor(a, b, c, d)
            }

            function Ec(a) {
                W.clearStencil(a)
            }

            function Fc(a, b) {
                for (var c = 0; c < a; c++) {
                    var d = D[b + 4 * c >> 2];
                    W.deleteVertexArray(oc[d]);
                    oc[d] = null
                }
            }
            var Gc = [];

            function Hc(a, b, c, d) {
                W.drawElements(a, b, c, d)
            }

            function Ic(a, b, c, d) {
                for (var e = 0; e < a; e++) {
                    var f = W[c](),
                        h = f && vc(d);
                    f ? (f.name = h, d[h] = f) : V(1282);
                    D[b + 4 * e >> 2] = h
                }
            }

            function Jc(a, b) {
                Ic(a, b, "createVertexArray", oc)
            }

            function Kc(a, b) {
                E[a >> 2] = b;
                E[a + 4 >> 2] = (b - E[a >> 2]) / 4294967296
            }

            function Lc(a, b, c) {
                if (b) {
                    var d = void 0;
                    switch (a) {
                        case 36346:
                            d = 1;
                            break;
                        case 36344:
                            0 != c && 1 != c && V(1280);
                            return;
                        case 34814:
                        case 36345:
                            d = 0;
                            break;
                        case 34466:
                            var e = W.getParameter(34467);
                            d = e ? e.length : 0;
                            break;
                        case 33309:
                            if (2 > m.version) {
                                V(1282);
                                return
                            }
                            d = 2 * (W.getSupportedExtensions() || []).length;
                            break;
                        case 33307:
                        case 33308:
                            if (2 > m.version) {
                                V(1280);
                                return
                            }
                            d = 33307 == a ? 3 : 0
                    }
                    if (void 0 === d) switch (e = W.getParameter(a), typeof e) {
                        case "number":
                            d = e;
                            break;
                        case "boolean":
                            d = e ? 1 : 0;
                            break;
                        case "string":
                            V(1280);
                            return;
                        case "object":
                            if (null ===
                                e) switch (a) {
                                case 34964:
                                case 35725:
                                case 34965:
                                case 36006:
                                case 36007:
                                case 32873:
                                case 34229:
                                case 36662:
                                case 36663:
                                case 35053:
                                case 35055:
                                case 36010:
                                case 35097:
                                case 35869:
                                case 32874:
                                case 36389:
                                case 35983:
                                case 35368:
                                case 34068:
                                    d = 0;
                                    break;
                                default:
                                    V(1280);
                                    return
                            } else {
                                if (e instanceof Float32Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Array) {
                                    for (a = 0; a < e.length; ++a) switch (c) {
                                        case 0:
                                            D[b + 4 * a >> 2] = e[a];
                                            break;
                                        case 2:
                                            F[b + 4 * a >> 2] = e[a];
                                            break;
                                        case 4:
                                            A[b + a >> 0] = e[a] ? 1 : 0
                                    }
                                    return
                                }
                                try {
                                    d = e.name | 0
                                } catch (f) {
                                    V(1280);
                                    y("GL_INVALID_ENUM in glGet" + c + "v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + f + ")");
                                    return
                                }
                            }
                            break;
                        default:
                            V(1280);
                            y("GL_INVALID_ENUM in glGet" + c + "v: Native code calling glGet" + c + "v(" + a + ") and it returns " + e + " of type " + typeof e + "!");
                            return
                    }
                    switch (c) {
                        case 1:
                            Kc(b, d);
                            break;
                        case 0:
                            D[b >> 2] = d;
                            break;
                        case 2:
                            F[b >> 2] = d;
                            break;
                        case 4:
                            A[b >> 0] = d ? 1 : 0
                    }
                } else V(1281)
            }

            function Mc(a, b) {
                Lc(a, b, 0)
            }

            function Nc(a, b, c) {
                if (c) {
                    a = U[a];
                    b = 2 > m.version ? W.nd.getQueryObjectEXT(a, b) : W.getQueryParameter(a, b);
                    var d;
                    "boolean" == typeof b ? d = b ? 1 : 0 : d = b;
                    Kc(c, d)
                } else V(1281)
            }
            var Pc = a => {
                var b = Pb(a) + 1,
                    c = Oc(b);
                c && Ob(a, B, c, b);
                return c
            };

            function Qc(a) {
                var b = rc[a];
                if (!b) {
                    switch (a) {
                        case 7939:
                            b = W.getSupportedExtensions() || [];
                            b = b.concat(b.map(function(d) {
                                return "GL_" + d
                            }));
                            b = Pc(b.join(" "));
                            break;
                        case 7936:
                        case 7937:
                        case 37445:
                        case 37446:
                            (b = W.getParameter(a)) || V(1280);
                            b = b && Pc(b);
                            break;
                        case 7938:
                            b = W.getParameter(7938);
                            b = 2 <= m.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
                            b = Pc(b);
                            break;
                        case 35724:
                            b = W.getParameter(35724);
                            var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                            null !== c && (3 == c[1].length && (c[1] += "0"), b = "OpenGL ES GLSL ES " +
                                c[1] + " (" + b + ")");
                            b = Pc(b);
                            break;
                        default:
                            V(1280)
                    }
                    rc[a] = b
                }
                return b
            }

            function Rc(a, b) {
                if (2 > m.version) return V(1282), 0;
                var c = sc[a];
                if (c) return 0 > b || b >= c.length ? (V(1281), 0) : c[b];
                switch (a) {
                    case 7939:
                        return c = W.getSupportedExtensions() || [], c = c.concat(c.map(function(d) {
                            return "GL_" + d
                        })), c = c.map(function(d) {
                            return Pc(d)
                        }), c = sc[a] = c, 0 > b || b >= c.length ? (V(1281), 0) : c[b];
                    default:
                        return V(1280), 0
                }
            }

            function Sc(a) {
                return "]" == a.slice(-1) && a.lastIndexOf("[")
            }

            function Tc(a) {
                a -= 5120;
                return 0 == a ? A : 1 == a ? B : 2 == a ? C : 4 == a ? D : 6 == a ? F : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? E : va
            }

            function Uc(a, b, c, d, e) {
                a = Tc(a);
                var f = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
                    h = tc;
                return a.subarray(e >> f, e + d * (c * ({
                    5: 3,
                    6: 4,
                    8: 2,
                    29502: 3,
                    29504: 4,
                    26917: 2,
                    26918: 2,
                    29846: 3,
                    29847: 4
                } [b - 6402] || 1) * (1 << f) + h - 1 & -h) >> f)
            }

            function X(a) {
                var b = W.ge;
                if (b) {
                    var c = b.Cd[a];
                    "number" == typeof c && (b.Cd[a] = c = W.getUniformLocation(b, b.$d[a] + (0 < c ? "[" + c + "]" : "")));
                    return c
                }
                V(1282)
            }
            var Y = [],
                Vc = [],
                Wc = {},
                Yc = () => {
                    if (!Xc) {
                        var a = {
                                USER: "web_user",
                                LOGNAME: "web_user",
                                PATH: "/",
                                PWD: "/",
                                HOME: "/home/web_user",
                                LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                                _: fa || "./this.program"
                            },
                            b;
                        for (b in Wc) void 0 === Wc[b] ? delete a[b] : a[b] = Wc[b];
                        var c = [];
                        for (b in a) c.push(`${b}=${a[b]}`);
                        Xc = c
                    }
                    return Xc
                },
                Xc, Zc = [null, [],
                    []
                ],
                $c = (a, b) => {
                    var c = Zc[a];
                    0 === b || 10 === b ? ((1 === a ? qa : y)(Rb(c, 0)), c.length = 0) : c.push(b)
                },
                ad = a => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
                bd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                cd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            function dd(a) {
                var b = Array(Pb(a) + 1);
                Ob(a, b, 0, b.length);
                return b
            }
            for (var ed = (a, b, c, d) => {
                    function e(l, r, x) {
                        for (l = "number" == typeof l ? l.toString() : l || ""; l.length < r;) l = x[0] + l;
                        return l
                    }

                    function f(l, r) {
                        return e(l, r, "0")
                    }

                    function h(l, r) {
                        function x(ma) {
                            return 0 > ma ? -1 : 0 < ma ? 1 : 0
                        }
                        var H;
                        0 === (H = x(l.getFullYear() - r.getFullYear())) && 0 === (H = x(l.getMonth() - r.getMonth())) && (H = x(l.getDate() - r.getDate()));
                        return H
                    }

                    function k(l) {
                        switch (l.getDay()) {
                            case 0:
                                return new Date(l.getFullYear() - 1, 11, 29);
                            case 1:
                                return l;
                            case 2:
                                return new Date(l.getFullYear(), 0, 3);
                            case 3:
                                return new Date(l.getFullYear(),
                                    0, 2);
                            case 4:
                                return new Date(l.getFullYear(), 0, 1);
                            case 5:
                                return new Date(l.getFullYear() - 1, 11, 31);
                            case 6:
                                return new Date(l.getFullYear() - 1, 11, 30)
                        }
                    }

                    function n(l) {
                        var r = l.ud;
                        for (l = new Date((new Date(l.vd + 1900, 0, 1)).getTime()); 0 < r;) {
                            var x = l.getMonth(),
                                H = (ad(l.getFullYear()) ? bd : cd)[x];
                            if (r > H - l.getDate()) r -= H - l.getDate() + 1, l.setDate(1), 11 > x ? l.setMonth(x + 1) : (l.setMonth(0), l.setFullYear(l.getFullYear() + 1));
                            else {
                                l.setDate(l.getDate() + r);
                                break
                            }
                        }
                        x = new Date(l.getFullYear() + 1, 0, 4);
                        r = k(new Date(l.getFullYear(),
                            0, 4));
                        x = k(x);
                        return 0 >= h(r, l) ? 0 >= h(x, l) ? l.getFullYear() + 1 : l.getFullYear() : l.getFullYear() - 1
                    }
                    var p = D[d + 40 >> 2];
                    d = {
                        xe: D[d >> 2],
                        we: D[d + 4 >> 2],
                        Ld: D[d + 8 >> 2],
                        Qd: D[d + 12 >> 2],
                        Md: D[d + 16 >> 2],
                        vd: D[d + 20 >> 2],
                        od: D[d + 24 >> 2],
                        ud: D[d + 28 >> 2],
                        Ee: D[d + 32 >> 2],
                        ve: D[d + 36 >> 2],
                        ye: p ? p ? Rb(B, p) : "" : ""
                    };
                    c = c ? Rb(B, c) : "";
                    p = {
                        "%c": "%a %b %d %H:%M:%S %Y",
                        "%D": "%m/%d/%y",
                        "%F": "%Y-%m-%d",
                        "%h": "%b",
                        "%r": "%I:%M:%S %p",
                        "%R": "%H:%M",
                        "%T": "%H:%M:%S",
                        "%x": "%m/%d/%y",
                        "%X": "%H:%M:%S",
                        "%Ec": "%c",
                        "%EC": "%C",
                        "%Ex": "%m/%d/%y",
                        "%EX": "%H:%M:%S",
                        "%Ey": "%y",
                        "%EY": "%Y",
                        "%Od": "%d",
                        "%Oe": "%e",
                        "%OH": "%H",
                        "%OI": "%I",
                        "%Om": "%m",
                        "%OM": "%M",
                        "%OS": "%S",
                        "%Ou": "%u",
                        "%OU": "%U",
                        "%OV": "%V",
                        "%Ow": "%w",
                        "%OW": "%W",
                        "%Oy": "%y"
                    };
                    for (var u in p) c = c.replace(new RegExp(u, "g"), p[u]);
                    var v = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                        w = "January February March April May June July August September October November December".split(" ");
                    p = {
                        "%a": l => v[l.od].substring(0, 3),
                        "%A": l => v[l.od],
                        "%b": l => w[l.Md].substring(0, 3),
                        "%B": l => w[l.Md],
                        "%C": l => f((l.vd + 1900) /
                            100 | 0, 2),
                        "%d": l => f(l.Qd, 2),
                        "%e": l => e(l.Qd, 2, " "),
                        "%g": l => n(l).toString().substring(2),
                        "%G": l => n(l),
                        "%H": l => f(l.Ld, 2),
                        "%I": l => {
                            l = l.Ld;
                            0 == l ? l = 12 : 12 < l && (l -= 12);
                            return f(l, 2)
                        },
                        "%j": l => {
                            for (var r = 0, x = 0; x <= l.Md - 1; r += (ad(l.vd + 1900) ? bd : cd)[x++]);
                            return f(l.Qd + r, 3)
                        },
                        "%m": l => f(l.Md + 1, 2),
                        "%M": l => f(l.we, 2),
                        "%n": () => "\n",
                        "%p": l => 0 <= l.Ld && 12 > l.Ld ? "AM" : "PM",
                        "%S": l => f(l.xe, 2),
                        "%t": () => "\t",
                        "%u": l => l.od || 7,
                        "%U": l => f(Math.floor((l.ud + 7 - l.od) / 7), 2),
                        "%V": l => {
                            var r = Math.floor((l.ud + 7 - (l.od + 6) % 7) / 7);
                            2 >= (l.od + 371 - l.ud -
                                2) % 7 && r++;
                            if (r) 53 == r && (x = (l.od + 371 - l.ud) % 7, 4 == x || 3 == x && ad(l.vd) || (r = 1));
                            else {
                                r = 52;
                                var x = (l.od + 7 - l.ud - 1) % 7;
                                (4 == x || 5 == x && ad(l.vd % 400 - 1)) && r++
                            }
                            return f(r, 2)
                        },
                        "%w": l => l.od,
                        "%W": l => f(Math.floor((l.ud + 7 - (l.od + 6) % 7) / 7), 2),
                        "%y": l => (l.vd + 1900).toString().substring(2),
                        "%Y": l => l.vd + 1900,
                        "%z": l => {
                            l = l.ve;
                            var r = 0 <= l;
                            l = Math.abs(l) / 60;
                            return (r ? "+" : "-") + String("0000" + (l / 60 * 100 + l % 60)).slice(-4)
                        },
                        "%Z": l => l.ye,
                        "%%": () => "%"
                    };
                    c = c.replace(/%%/g, "\x00\x00");
                    for (u in p) c.includes(u) && (c = c.replace(new RegExp(u, "g"), p[u](d)));
                    c = c.replace(/\0\0/g, "%");
                    u = dd(c);
                    if (u.length > b) return 0;
                    A.set(u, a);
                    return u.length - 1
                }, fd = Array(256), gd = 0; 256 > gd; ++gd) fd[gd] = String.fromCharCode(gd);
            Sa = fd;
            Wa = g.BindingError = class extends Error {
                constructor(a) {
                    super(a);
                    this.name = "BindingError"
                }
            };
            Xa = g.InternalError = class extends Error {
                constructor(a) {
                    super(a);
                    this.name = "InternalError"
                }
            };
            L.prototype.isAliasOf = function(a) {
                if (!(this instanceof L && a instanceof L)) return !1;
                var b = this.dd.hd.ed,
                    c = this.dd.gd,
                    d = a.dd.hd.ed;
                for (a = a.dd.gd; b.kd;) c = b.Dd(c), b = b.kd;
                for (; d.kd;) a = d.Dd(a), d = d.kd;
                return b === d && c === a
            };
            L.prototype.clone = function() {
                this.dd.gd || $a(this);
                if (this.dd.Bd) return this.dd.count.value += 1, this;
                var a = lb,
                    b = Object,
                    c = b.create,
                    d = Object.getPrototypeOf(this),
                    e = this.dd;
                a = a(c.call(b, d, {
                    dd: {
                        value: {
                            count: e.count,
                            zd: e.zd,
                            Bd: e.Bd,
                            gd: e.gd,
                            hd: e.hd,
                            ld: e.ld,
                            md: e.md
                        }
                    }
                }));
                a.dd.count.value += 1;
                a.dd.zd = !1;
                return a
            };
            L.prototype["delete"] = function() {
                this.dd.gd || $a(this);
                this.dd.zd && !this.dd.Bd && I("Object already scheduled for deletion");
                bb(this);
                cb(this.dd);
                this.dd.Bd || (this.dd.ld = void 0, this.dd.gd = void 0)
            };
            L.prototype.isDeleted = function() {
                return !this.dd.gd
            };
            L.prototype.deleteLater = function() {
                this.dd.gd || $a(this);
                this.dd.zd && !this.dd.Bd && I("Object already scheduled for deletion");
                fb.push(this);
                1 === fb.length && hb && hb(gb);
                this.dd.zd = !0;
                return this
            };
            g.getInheritedInstanceCount = function() {
                return Object.keys(ib).length
            };
            g.getLiveInheritedInstances = function() {
                var a = [],
                    b;
                for (b in ib) ib.hasOwnProperty(b) && a.push(ib[b]);
                return a
            };
            g.flushPendingDeletes = gb;
            g.setDelayFunction = function(a) {
                hb = a;
                fb.length && hb && hb(gb)
            };
            N.prototype.me = function(a) {
                this.Xd && (a = this.Xd(a));
                return a
            };
            N.prototype.Sd = function(a) {
                this.td && this.td(a)
            };
            N.prototype.argPackAdvance = 8;
            N.prototype.readValueFromPointer = wb;
            N.prototype.deleteObject = function(a) {
                if (null !== a) a["delete"]()
            };
            N.prototype.fromWireType = function(a) {
                function b() {
                    return this.Hd ? kb(this.ed.Ad, {
                        hd: this.qe,
                        gd: c,
                        md: this,
                        ld: a
                    }) : kb(this.ed.Ad, {
                        hd: this,
                        gd: a
                    })
                }
                var c = this.me(a);
                if (!c) return this.Sd(a), null;
                var d = jb(this.ed, c);
                if (void 0 !== d) {
                    if (0 === d.dd.count.value) return d.dd.gd = c, d.dd.ld = a, d.clone();
                    d = d.clone();
                    this.Sd(a);
                    return d
                }
                d = this.ed.le(c);
                d = eb[d];
                if (!d) return b.call(this);
                d = this.Gd ? d.fe : d.pointerType;
                var e = db(c, this.ed, d.ed);
                return null === e ? b.call(this) : this.Hd ? kb(d.ed.Ad, {
                    hd: d,
                    gd: e,
                    md: this,
                    ld: a
                }) : kb(d.ed.Ad, {
                    hd: d,
                    gd: e
                })
            };
            Bb = g.UnboundTypeError = function(a, b) {
                var c = nb(b, function(d) {
                    this.name = b;
                    this.message = d;
                    d = Error(d).stack;
                    void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""))
                });
                c.prototype = Object.create(a.prototype);
                c.prototype.constructor = c;
                c.prototype.toString = function() {
                    return void 0 === this.message ? this.name : `${this.name}: ${this.message}`
                };
                return c
            }(Error, "UnboundTypeError");
            Object.assign(Jb.prototype, {
                get(a) {
                    return this.pd[a]
                },
                has(a) {
                    return void 0 !== this.pd[a]
                },
                ie(a) {
                    var b = this.Ud.pop() || this.pd.length;
                    this.pd[b] = a;
                    return b
                },
                ke(a) {
                    this.pd[a] = void 0;
                    this.Ud.push(a)
                }
            });
            R.pd.push({
                value: void 0
            }, {
                value: null
            }, {
                value: !0
            }, {
                value: !1
            });
            R.rd = R.pd.length;
            g.count_emval_handles = function() {
                for (var a = 0, b = R.rd; b < R.pd.length; ++b) void 0 !== R.pd[b] && ++a;
                return a
            };
            for (var W, Z = 0; 32 > Z; ++Z) Gc.push(Array(Z));
            var hd = new Float32Array(288);
            for (Z = 0; 288 > Z; ++Z) Y[Z] = hd.subarray(0, Z + 1);
            var jd = new Int32Array(288);
            for (Z = 0; 288 > Z; ++Z) Vc[Z] = jd.subarray(0, Z + 1);
            var kd = {
                Ya: function() {},
                ib: function(a, b, c, d, e) {
                    var f = Ra(c);
                    b = G(b);
                    K(a, {
                        name: b,
                        fromWireType: function(h) {
                            return !!h
                        },
                        toWireType: function(h, k) {
                            return k ? d : e
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: function(h) {
                            if (1 === c) var k = A;
                            else if (2 === c) k = C;
                            else if (4 === c) k = D;
                            else throw new TypeError("Unknown boolean type size: " + b);
                            return this.fromWireType(k[h >> f])
                        },
                        qd: null
                    })
                },
                u: function(a, b, c, d, e, f, h, k, n, p, u, v, w) {
                    u = G(u);
                    f = P(e, f);
                    k && (k = P(h, k));
                    p && (p = P(n, p));
                    w = P(v, w);
                    var l = mb(u);
                    pb(l, function() {
                        Eb(`Cannot construct ${u} due to unbound types`,
                            [d])
                    });
                    J([a, b, c], d ? [d] : [], function(r) {
                        r = r[0];
                        if (d) {
                            var x = r.ed;
                            var H = x.Ad
                        } else H = L.prototype;
                        r = nb(l, function() {
                            if (Object.getPrototypeOf(this) !== ma) throw new Wa("Use 'new' to construct " + u);
                            if (void 0 === O.rd) throw new Wa(u + " has no accessible constructor");
                            var Bc = O.rd[arguments.length];
                            if (void 0 === Bc) throw new Wa(`Tried to invoke ctor of ${u} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(O.rd).toString()}) parameters instead!`);
                            return Bc.apply(this, arguments)
                        });
                        var ma =
                            Object.create(H, {
                                constructor: {
                                    value: r
                                }
                            });
                        r.prototype = ma;
                        var O = new qb(u, r, ma, w, x, f, k, p);
                        O.kd && (void 0 === O.kd.Ed && (O.kd.Ed = []), O.kd.Ed.push(O));
                        x = new N(u, O, !0, !1, !1);
                        H = new N(u + "*", O, !1, !1, !1);
                        var Cc = new N(u + " const*", O, !1, !0, !1);
                        eb[a] = {
                            pointerType: H,
                            fe: Cc
                        };
                        xb(l, r);
                        return [x, H, Cc]
                    })
                },
                Ea: function(a, b, c, d, e, f, h, k) {
                    var n = Ib(c, d);
                    b = G(b);
                    f = P(e, f);
                    J([], [a], function(p) {
                        function u() {
                            Eb(`Cannot call ${v} due to unbound types`, n)
                        }
                        p = p[0];
                        var v = `${p.name}.${b}`;
                        b.startsWith("@@") && (b = Symbol[b.substring(2)]);
                        var w =
                            p.ed.constructor;
                        void 0 === w[b] ? (u.xd = c - 1, w[b] = u) : (ob(w, b, v), w[b].jd[c - 1] = u);
                        J([], n, function(l) {
                            l = [l[0], null].concat(l.slice(1));
                            l = Hb(v, l, null, f, h, k);
                            void 0 === w[b].jd ? (l.xd = c - 1, w[b] = l) : w[b].jd[c - 1] = l;
                            if (p.ed.Ed)
                                for (const r of p.ed.Ed) r.constructor.hasOwnProperty(b) || (r.constructor[b] = l);
                            return []
                        });
                        return []
                    })
                },
                j: function(a, b, c, d, e, f, h, k, n) {
                    var p = Ib(c, d);
                    b = G(b);
                    f = P(e, f);
                    J([], [a], function(u) {
                        function v() {
                            Eb(`Cannot call ${w} due to unbound types`, p)
                        }
                        u = u[0];
                        var w = `${u.name}.${b}`;
                        b.startsWith("@@") && (b =
                            Symbol[b.substring(2)]);
                        k && u.ed.re.push(b);
                        var l = u.ed.Ad,
                            r = l[b];
                        void 0 === r || void 0 === r.jd && r.className !== u.name && r.xd === c - 2 ? (v.xd = c - 2, v.className = u.name, l[b] = v) : (ob(l, b, w), l[b].jd[c - 2] = v);
                        J([], p, function(x) {
                            x = Hb(w, x, u, f, h, n);
                            void 0 === l[b].jd ? (x.xd = c - 2, l[b] = x) : l[b].jd[c - 2] = x;
                            return []
                        });
                        return []
                    })
                },
                v: function(a, b, c) {
                    a = G(a);
                    J([], [b], function(d) {
                        d = d[0];
                        g[a] = d.fromWireType(c);
                        return []
                    })
                },
                hb: function(a, b) {
                    b = G(b);
                    K(a, {
                        name: b,
                        fromWireType: function(c) {
                            var d = Lb(c);
                            Kb(c);
                            return d
                        },
                        toWireType: function(c, d) {
                            return M(d)
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: wb,
                        qd: null
                    })
                },
                r: function(a, b, c) {
                    c = Ra(c);
                    b = G(b);
                    K(a, {
                        name: b,
                        fromWireType: function(d) {
                            return d
                        },
                        toWireType: function(d, e) {
                            return e
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: Mb(b, c),
                        qd: null
                    })
                },
                m: function(a, b, c, d, e, f, h) {
                    var k = Ib(b, c);
                    a = G(a);
                    e = P(d, e);
                    pb(a, function() {
                        Eb(`Cannot call ${a} due to unbound types`, k)
                    }, b - 1);
                    J([], k, function(n) {
                        n = [n[0], null].concat(n.slice(1));
                        xb(a, Hb(a, n, null, e, f, h), b - 1);
                        return []
                    })
                },
                d: function(a, b, c, d, e) {
                    b = G(b); - 1 === e && (e = 4294967295);
                    e = Ra(c);
                    var f = k => k;
                    if (0 === d) {
                        var h = 32 - 8 * c;
                        f = k => k << h >>> h
                    }
                    c = b.includes("unsigned") ? function(k, n) {
                        return n >>> 0
                    } : function(k, n) {
                        return n
                    };
                    K(a, {
                        name: b,
                        fromWireType: f,
                        toWireType: c,
                        argPackAdvance: 8,
                        readValueFromPointer: Nb(b, e, 0 !== d),
                        qd: null
                    })
                },
                b: function(a, b, c) {
                    function d(f) {
                        f >>= 2;
                        var h = E;
                        return new e(h.buffer, h[f + 1], h[f])
                    }
                    var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][b];
                    c = G(c);
                    K(a, {
                        name: c,
                        fromWireType: d,
                        argPackAdvance: 8,
                        readValueFromPointer: d
                    }, {
                        ne: !0
                    })
                },
                o: function(a,
                    b, c, d, e, f, h, k, n, p, u, v) {
                    c = G(c);
                    f = P(e, f);
                    k = P(h, k);
                    p = P(n, p);
                    v = P(u, v);
                    J([a], [b], function(w) {
                        w = w[0];
                        return [new N(c, w.ed, !1, !1, !0, w, d, f, k, p, v)]
                    })
                },
                q: function(a, b) {
                    b = G(b);
                    var c = "std::string" === b;
                    K(a, {
                        name: b,
                        fromWireType: function(d) {
                            var e = E[d >> 2],
                                f = d + 4;
                            if (c)
                                for (var h = f, k = 0; k <= e; ++k) {
                                    var n = f + k;
                                    if (k == e || 0 == B[n]) {
                                        h = h ? Rb(B, h, n - h) : "";
                                        if (void 0 === p) var p = h;
                                        else p += String.fromCharCode(0), p += h;
                                        h = n + 1
                                    }
                                } else {
                                    p = Array(e);
                                    for (k = 0; k < e; ++k) p[k] = String.fromCharCode(B[f + k]);
                                    p = p.join("")
                                }
                            Q(d);
                            return p
                        },
                        toWireType: function(d,
                            e) {
                            e instanceof ArrayBuffer && (e = new Uint8Array(e));
                            var f = "string" == typeof e;
                            f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || I("Cannot pass non-string to std::string");
                            var h = c && f ? Pb(e) : e.length;
                            var k = Oc(4 + h + 1),
                                n = k + 4;
                            E[k >> 2] = h;
                            if (c && f) Ob(e, B, n, h + 1);
                            else if (f)
                                for (f = 0; f < h; ++f) {
                                    var p = e.charCodeAt(f);
                                    255 < p && (Q(n), I("String has UTF-16 code units that do not fit in 8 bits"));
                                    B[n + f] = p
                                } else
                                    for (f = 0; f < h; ++f) B[n + f] = e[f];
                            null !== d && d.push(Q, k);
                            return k
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: wb,
                        qd: function(d) {
                            Q(d)
                        }
                    })
                },
                l: function(a, b, c) {
                    c = G(c);
                    if (2 === b) {
                        var d = Tb;
                        var e = Ub;
                        var f = Vb;
                        var h = () => va;
                        var k = 1
                    } else 4 === b && (d = Wb, e = Xb, f = Yb, h = () => E, k = 2);
                    K(a, {
                        name: c,
                        fromWireType: function(n) {
                            for (var p = E[n >> 2], u = h(), v, w = n + 4, l = 0; l <= p; ++l) {
                                var r = n + 4 + l * b;
                                if (l == p || 0 == u[r >> k]) w = d(w, r - w), void 0 === v ? v = w : (v += String.fromCharCode(0), v += w), w = r + b
                            }
                            Q(n);
                            return v
                        },
                        toWireType: function(n, p) {
                            "string" != typeof p && I(`Cannot pass non-string to C++ string type ${c}`);
                            var u = f(p),
                                v = Oc(4 + u + b);
                            E[v >> 2] = u >> k;
                            e(p, v + 4, u + b);
                            null !== n &&
                                n.push(Q, v);
                            return v
                        },
                        argPackAdvance: 8,
                        readValueFromPointer: wb,
                        qd: function(n) {
                            Q(n)
                        }
                    })
                },
                jb: function(a, b) {
                    b = G(b);
                    K(a, {
                        pe: !0,
                        name: b,
                        argPackAdvance: 0,
                        fromWireType: function() {},
                        toWireType: function() {}
                    })
                },
                $a: () => !0,
                eb: function(a, b, c) {
                    a = Lb(a);
                    b = Zb(b, "emval::as");
                    var d = [],
                        e = M(d);
                    E[c >> 2] = e;
                    return b.toWireType(d, a)
                },
                f: function(a, b, c, d, e) {
                    a = bc[a];
                    b = Lb(b);
                    c = ac(c);
                    var f = [];
                    E[d >> 2] = M(f);
                    return a(b, c, f, e)
                },
                c: Kb,
                t: function(a) {
                    if (0 === a) return M(cc());
                    a = ac(a);
                    return M(cc()[a])
                },
                g: function(a, b) {
                    var c = ec(a, b),
                        d = c[0];
                    b = d.name + "_$" + c.slice(1).map(function(u) {
                        return u.name
                    }).join("_") + "$";
                    var e = fc[b];
                    if (void 0 !== e) return e;
                    e = ["retType"];
                    for (var f = [d], h = "", k = 0; k < a - 1; ++k) h += (0 !== k ? ", " : "") + "arg" + k, e.push("argType" + k), f.push(c[1 + k]);
                    var n = "return function " + mb("methodCaller_" + b) + "(handle, name, destructors, args) {\n",
                        p = 0;
                    for (k = 0; k < a - 1; ++k) n += "    var arg" + k + " = argType" + k + ".readValueFromPointer(args" + (p ? "+" + p : "") + ");\n", p += c[k + 1].argPackAdvance;
                    n += "    var rv = handle[name](" + h + ");\n";
                    for (k = 0; k < a - 1; ++k) c[k + 1].deleteObject &&
                        (n += "    argType" + k + ".deleteObject(arg" + k + ");\n");
                    d.pe || (n += "    return retType.toWireType(destructors, rv);\n");
                    e.push(n + "};\n");
                    a = Gb(e).apply(null, f);
                    e = dc(a);
                    return fc[b] = e
                },
                k: function(a, b) {
                    a = Lb(a);
                    b = Lb(b);
                    return M(a[b])
                },
                s: function(a) {
                    4 < a && (R.get(a).Yd += 1)
                },
                h: function(a) {
                    return M(ac(a))
                },
                e: function(a) {
                    var b = Lb(a);
                    Fb(b);
                    Kb(a)
                },
                a: () => {
                    sa("")
                },
                ab: () => performance.now(),
                F: function(a) {
                    W.activeTexture(a)
                },
                H: function(a, b) {
                    W.attachShader(S[a], T[b])
                },
                wb: function(a, b) {
                    W.beginQuery(a, U[b])
                },
                qb: function(a,
                    b) {
                    W.nd.beginQueryEXT(a, U[b])
                },
                I: function(a, b, c) {
                    W.bindAttribLocation(S[a], b, c ? Rb(B, c) : "")
                },
                J: function(a, b) {
                    35051 == a ? W.Od = b : 35052 == a && (W.yd = b);
                    W.bindBuffer(a, kc[b])
                },
                Ub: yc,
                Vb: function(a, b) {
                    W.bindRenderbuffer(a, mc[b])
                },
                Cb: function(a, b) {
                    W.bindSampler(a, pc[b])
                },
                K: function(a, b) {
                    W.bindTexture(a, nc[b])
                },
                nc: zc,
                rc: zc,
                L: function(a, b, c, d) {
                    W.blendColor(a, b, c, d)
                },
                M: function(a) {
                    W.blendEquation(a)
                },
                N: function(a, b) {
                    W.blendFunc(a, b)
                },
                Ob: function(a, b, c, d, e, f, h, k, n, p) {
                    W.blitFramebuffer(a, b, c, d, e, f, h, k, n, p)
                },
                O: function(a,
                    b, c, d) {
                    2 <= m.version ? c && b ? W.bufferData(a, B, d, c, b) : W.bufferData(a, b, d) : W.bufferData(a, c ? B.subarray(c, c + b) : b, d)
                },
                P: function(a, b, c, d) {
                    2 <= m.version ? c && W.bufferSubData(a, b, B, d, c) : W.bufferSubData(a, b, B.subarray(d, d + c))
                },
                Wb: function(a) {
                    return W.checkFramebufferStatus(a)
                },
                Q: Ac,
                S: Dc,
                T: Ec,
                Lb: function(a, b, c, d) {
                    return W.clientWaitSync(qc[a], b, (c >>> 0) + 4294967296 * d)
                },
                U: function(a, b, c, d) {
                    W.colorMask(!!a, !!b, !!c, !!d)
                },
                V: function(a) {
                    W.compileShader(T[a])
                },
                W: function(a, b, c, d, e, f, h, k) {
                    2 <= m.version ? W.yd || !h ? W.compressedTexImage2D(a,
                        b, c, d, e, f, h, k) : W.compressedTexImage2D(a, b, c, d, e, f, B, k, h) : W.compressedTexImage2D(a, b, c, d, e, f, k ? B.subarray(k, k + h) : null)
                },
                X: function(a, b, c, d, e, f, h, k, n) {
                    2 <= m.version ? W.yd || !k ? W.compressedTexSubImage2D(a, b, c, d, e, f, h, k, n) : W.compressedTexSubImage2D(a, b, c, d, e, f, h, B, n, k) : W.compressedTexSubImage2D(a, b, c, d, e, f, h, n ? B.subarray(n, n + k) : null)
                },
                Nb: function(a, b, c, d, e) {
                    W.copyBufferSubData(a, b, c, d, e)
                },
                Y: function(a, b, c, d, e, f, h, k) {
                    W.copyTexSubImage2D(a, b, c, d, e, f, h, k)
                },
                Z: function() {
                    var a = vc(S),
                        b = W.createProgram();
                    b.name =
                        a;
                    b.Kd = b.Id = b.Jd = 0;
                    b.Rd = 1;
                    S[a] = b;
                    return a
                },
                _: function(a) {
                    var b = vc(T);
                    T[b] = W.createShader(a);
                    return b
                },
                $: function(a) {
                    W.cullFace(a)
                },
                aa: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = kc[d];
                        e && (W.deleteBuffer(e), e.name = 0, kc[d] = null, d == W.Od && (W.Od = 0), d == W.yd && (W.yd = 0))
                    }
                },
                Xb: function(a, b) {
                    for (var c = 0; c < a; ++c) {
                        var d = D[b + 4 * c >> 2],
                            e = lc[d];
                        e && (W.deleteFramebuffer(e), e.name = 0, lc[d] = null)
                    }
                },
                ba: function(a) {
                    if (a) {
                        var b = S[a];
                        b ? (W.deleteProgram(b), b.name = 0, S[a] = null) : V(1281)
                    }
                },
                xb: function(a, b) {
                    for (var c =
                            0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = U[d];
                        e && (W.deleteQuery(e), U[d] = null)
                    }
                },
                rb: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = U[d];
                        e && (W.nd.deleteQueryEXT(e), U[d] = null)
                    }
                },
                Yb: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = mc[d];
                        e && (W.deleteRenderbuffer(e), e.name = 0, mc[d] = null)
                    }
                },
                Db: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = pc[d];
                        e && (W.deleteSampler(e), e.name = 0, pc[d] = null)
                    }
                },
                ca: function(a) {
                    if (a) {
                        var b = T[a];
                        b ? (W.deleteShader(b), T[a] = null) : V(1281)
                    }
                },
                Mb: function(a) {
                    if (a) {
                        var b = qc[a];
                        b ? (W.deleteSync(b), b.name = 0, qc[a] = null) : V(1281)
                    }
                },
                da: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = D[b + 4 * c >> 2],
                            e = nc[d];
                        e && (W.deleteTexture(e), e.name = 0, nc[d] = null)
                    }
                },
                oc: Fc,
                sc: Fc,
                ea: function(a) {
                    W.depthMask(!!a)
                },
                fa: function(a) {
                    W.disable(a)
                },
                ga: function(a) {
                    W.disableVertexAttribArray(a)
                },
                ha: function(a, b, c) {
                    W.drawArrays(a, b, c)
                },
                lc: function(a, b, c, d) {
                    W.drawArraysInstanced(a, b, c, d)
                },
                jc: function(a, b, c, d, e) {
                    W.Td.drawArraysInstancedBaseInstanceWEBGL(a, b, c, d, e)
                },
                hc: function(a, b) {
                    for (var c = Gc[a], d = 0; d < a; d++) c[d] = D[b +
                        4 * d >> 2];
                    W.drawBuffers(c)
                },
                ia: Hc,
                mc: function(a, b, c, d, e) {
                    W.drawElementsInstanced(a, b, c, d, e)
                },
                kc: function(a, b, c, d, e, f, h) {
                    W.Td.drawElementsInstancedBaseVertexBaseInstanceWEBGL(a, b, c, d, e, f, h)
                },
                bc: function(a, b, c, d, e, f) {
                    Hc(a, d, e, f)
                },
                ja: function(a) {
                    W.enable(a)
                },
                ka: function(a) {
                    W.enableVertexAttribArray(a)
                },
                yb: function(a) {
                    W.endQuery(a)
                },
                sb: function(a) {
                    W.nd.endQueryEXT(a)
                },
                Ib: function(a, b) {
                    return (a = W.fenceSync(a, b)) ? (b = vc(qc), a.name = b, qc[b] = a, b) : 0
                },
                la: function() {
                    W.finish()
                },
                ma: function() {
                    W.flush()
                },
                Zb: function(a,
                    b, c, d) {
                    W.framebufferRenderbuffer(a, b, c, mc[d])
                },
                _b: function(a, b, c, d, e) {
                    W.framebufferTexture2D(a, b, c, nc[d], e)
                },
                na: function(a) {
                    W.frontFace(a)
                },
                oa: function(a, b) {
                    Ic(a, b, "createBuffer", kc)
                },
                $b: function(a, b) {
                    Ic(a, b, "createFramebuffer", lc)
                },
                zb: function(a, b) {
                    Ic(a, b, "createQuery", U)
                },
                tb: function(a, b) {
                    for (var c = 0; c < a; c++) {
                        var d = W.nd.createQueryEXT();
                        if (!d) {
                            for (V(1282); c < a;) D[b + 4 * c++ >> 2] = 0;
                            break
                        }
                        var e = vc(U);
                        d.name = e;
                        U[e] = d;
                        D[b + 4 * c >> 2] = e
                    }
                },
                ac: function(a, b) {
                    Ic(a, b, "createRenderbuffer", mc)
                },
                Eb: function(a, b) {
                    Ic(a,
                        b, "createSampler", pc)
                },
                pa: function(a, b) {
                    Ic(a, b, "createTexture", nc)
                },
                pc: Jc,
                tc: Jc,
                Qb: function(a) {
                    W.generateMipmap(a)
                },
                qa: function(a, b, c) {
                    c ? D[c >> 2] = W.getBufferParameter(a, b) : V(1281)
                },
                ra: function() {
                    var a = W.getError() || uc;
                    uc = 0;
                    return a
                },
                sa: function(a, b) {
                    Lc(a, b, 2)
                },
                Rb: function(a, b, c, d) {
                    a = W.getFramebufferAttachmentParameter(a, b, c);
                    if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) a = a.name | 0;
                    D[d >> 2] = a
                },
                ta: Mc,
                ua: function(a, b, c, d) {
                    a = W.getProgramInfoLog(S[a]);
                    null === a && (a = "(unknown error)");
                    b = 0 < b &&
                        d ? Ob(a, B, d, b) : 0;
                    c && (D[c >> 2] = b)
                },
                va: function(a, b, c) {
                    if (c)
                        if (a >= jc) V(1281);
                        else if (a = S[a], 35716 == b) a = W.getProgramInfoLog(a), null === a && (a = "(unknown error)"), D[c >> 2] = a.length + 1;
                    else if (35719 == b) {
                        if (!a.Kd)
                            for (b = 0; b < W.getProgramParameter(a, 35718); ++b) a.Kd = Math.max(a.Kd, W.getActiveUniform(a, b).name.length + 1);
                        D[c >> 2] = a.Kd
                    } else if (35722 == b) {
                        if (!a.Id)
                            for (b = 0; b < W.getProgramParameter(a, 35721); ++b) a.Id = Math.max(a.Id, W.getActiveAttrib(a, b).name.length + 1);
                        D[c >> 2] = a.Id
                    } else if (35381 == b) {
                        if (!a.Jd)
                            for (b = 0; b < W.getProgramParameter(a,
                                    35382); ++b) a.Jd = Math.max(a.Jd, W.getActiveUniformBlockName(a, b).length + 1);
                        D[c >> 2] = a.Jd
                    } else D[c >> 2] = W.getProgramParameter(a, b);
                    else V(1281)
                },
                nb: Nc,
                ob: Nc,
                Ab: function(a, b, c) {
                    if (c) {
                        a = W.getQueryParameter(U[a], b);
                        var d;
                        "boolean" == typeof a ? d = a ? 1 : 0 : d = a;
                        D[c >> 2] = d
                    } else V(1281)
                },
                ub: function(a, b, c) {
                    if (c) {
                        a = W.nd.getQueryObjectEXT(U[a], b);
                        var d;
                        "boolean" == typeof a ? d = a ? 1 : 0 : d = a;
                        D[c >> 2] = d
                    } else V(1281)
                },
                Bb: function(a, b, c) {
                    c ? D[c >> 2] = W.getQuery(a, b) : V(1281)
                },
                vb: function(a, b, c) {
                    c ? D[c >> 2] = W.nd.getQueryEXT(a, b) : V(1281)
                },
                Sb: function(a, b, c) {
                    c ? D[c >> 2] = W.getRenderbufferParameter(a, b) : V(1281)
                },
                wa: function(a, b, c, d) {
                    a = W.getShaderInfoLog(T[a]);
                    null === a && (a = "(unknown error)");
                    b = 0 < b && d ? Ob(a, B, d, b) : 0;
                    c && (D[c >> 2] = b)
                },
                kb: function(a, b, c, d) {
                    a = W.getShaderPrecisionFormat(a, b);
                    D[c >> 2] = a.rangeMin;
                    D[c + 4 >> 2] = a.rangeMax;
                    D[d >> 2] = a.precision
                },
                xa: function(a, b, c) {
                    c ? 35716 == b ? (a = W.getShaderInfoLog(T[a]), null === a && (a = "(unknown error)"), D[c >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = W.getShaderSource(T[a]), D[c >> 2] = a ? a.length + 1 : 0) : D[c >> 2] = W.getShaderParameter(T[a],
                        b) : V(1281)
                },
                ya: Qc,
                qc: Rc,
                za: function(a, b) {
                    b = b ? Rb(B, b) : "";
                    if (a = S[a]) {
                        var c = a,
                            d = c.Cd,
                            e = c.ae,
                            f;
                        if (!d)
                            for (c.Cd = d = {}, c.$d = {}, f = 0; f < W.getProgramParameter(c, 35718); ++f) {
                                var h = W.getActiveUniform(c, f);
                                var k = h.name;
                                h = h.size;
                                var n = Sc(k);
                                n = 0 < n ? k.slice(0, n) : k;
                                var p = c.Rd;
                                c.Rd += h;
                                e[n] = [h, p];
                                for (k = 0; k < h; ++k) d[p] = k, c.$d[p++] = n
                            }
                        c = a.Cd;
                        d = 0;
                        e = b;
                        f = Sc(b);
                        0 < f && (d = parseInt(b.slice(f + 1)) >>> 0, e = b.slice(0, f));
                        if ((e = a.ae[e]) && d < e[0] && (d += e[1], c[d] = c[d] || W.getUniformLocation(a, b))) return d
                    } else V(1281);
                    return -1
                },
                lb: function(a,
                    b, c) {
                    for (var d = Gc[b], e = 0; e < b; e++) d[e] = D[c + 4 * e >> 2];
                    W.invalidateFramebuffer(a, d)
                },
                mb: function(a, b, c, d, e, f, h) {
                    for (var k = Gc[b], n = 0; n < b; n++) k[n] = D[c + 4 * n >> 2];
                    W.invalidateSubFramebuffer(a, k, d, e, f, h)
                },
                Jb: function(a) {
                    return W.isSync(qc[a])
                },
                Aa: function(a) {
                    return (a = nc[a]) ? W.isTexture(a) : 0
                },
                Ba: function(a) {
                    W.lineWidth(a)
                },
                Ca: function(a) {
                    a = S[a];
                    W.linkProgram(a);
                    a.Cd = 0;
                    a.ae = {}
                },
                fc: function(a, b, c, d, e, f) {
                    W.Wd.multiDrawArraysInstancedBaseInstanceWEBGL(a, D, b >> 2, D, c >> 2, D, d >> 2, E, e >> 2, f)
                },
                gc: function(a, b, c, d, e, f, h, k) {
                    W.Wd.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(a,
                        D, b >> 2, c, D, d >> 2, D, e >> 2, D, f >> 2, E, h >> 2, k)
                },
                Da: function(a, b) {
                    3317 == a && (tc = b);
                    W.pixelStorei(a, b)
                },
                pb: function(a, b) {
                    W.nd.queryCounterEXT(U[a], b)
                },
                ic: function(a) {
                    W.readBuffer(a)
                },
                Fa: function(a, b, c, d, e, f, h) {
                    if (2 <= m.version)
                        if (W.Od) W.readPixels(a, b, c, d, e, f, h);
                        else {
                            var k = Tc(f);
                            W.readPixels(a, b, c, d, e, f, k, h >> 31 - Math.clz32(k.BYTES_PER_ELEMENT))
                        }
                    else(h = Uc(f, e, c, d, h)) ? W.readPixels(a, b, c, d, e, f, h) : V(1280)
                },
                Tb: function(a, b, c, d) {
                    W.renderbufferStorage(a, b, c, d)
                },
                Pb: function(a, b, c, d, e) {
                    W.renderbufferStorageMultisample(a,
                        b, c, d, e)
                },
                Fb: function(a, b, c) {
                    W.samplerParameterf(pc[a], b, c)
                },
                Gb: function(a, b, c) {
                    W.samplerParameteri(pc[a], b, c)
                },
                Hb: function(a, b, c) {
                    W.samplerParameteri(pc[a], b, D[c >> 2])
                },
                Ga: function(a, b, c, d) {
                    W.scissor(a, b, c, d)
                },
                Ha: function(a, b, c, d) {
                    for (var e = "", f = 0; f < b; ++f) {
                        var h = d ? D[d + 4 * f >> 2] : -1,
                            k = D[c + 4 * f >> 2];
                        h = k ? Rb(B, k, 0 > h ? void 0 : h) : "";
                        e += h
                    }
                    W.shaderSource(T[a], e)
                },
                Ia: function(a, b, c) {
                    W.stencilFunc(a, b, c)
                },
                Ja: function(a, b, c, d) {
                    W.stencilFuncSeparate(a, b, c, d)
                },
                Ka: function(a) {
                    W.stencilMask(a)
                },
                La: function(a, b) {
                    W.stencilMaskSeparate(a,
                        b)
                },
                Ma: function(a, b, c) {
                    W.stencilOp(a, b, c)
                },
                Na: function(a, b, c, d) {
                    W.stencilOpSeparate(a, b, c, d)
                },
                Oa: function(a, b, c, d, e, f, h, k, n) {
                    if (2 <= m.version)
                        if (W.yd) W.texImage2D(a, b, c, d, e, f, h, k, n);
                        else if (n) {
                        var p = Tc(k);
                        W.texImage2D(a, b, c, d, e, f, h, k, p, n >> 31 - Math.clz32(p.BYTES_PER_ELEMENT))
                    } else W.texImage2D(a, b, c, d, e, f, h, k, null);
                    else W.texImage2D(a, b, c, d, e, f, h, k, n ? Uc(k, h, d, e, n) : null)
                },
                Pa: function(a, b, c) {
                    W.texParameterf(a, b, c)
                },
                Qa: function(a, b, c) {
                    W.texParameterf(a, b, F[c >> 2])
                },
                Ra: function(a, b, c) {
                    W.texParameteri(a, b,
                        c)
                },
                Sa: function(a, b, c) {
                    W.texParameteri(a, b, D[c >> 2])
                },
                cc: function(a, b, c, d, e) {
                    W.texStorage2D(a, b, c, d, e)
                },
                Ta: function(a, b, c, d, e, f, h, k, n) {
                    if (2 <= m.version)
                        if (W.yd) W.texSubImage2D(a, b, c, d, e, f, h, k, n);
                        else if (n) {
                        var p = Tc(k);
                        W.texSubImage2D(a, b, c, d, e, f, h, k, p, n >> 31 - Math.clz32(p.BYTES_PER_ELEMENT))
                    } else W.texSubImage2D(a, b, c, d, e, f, h, k, null);
                    else p = null, n && (p = Uc(k, h, e, f, n)), W.texSubImage2D(a, b, c, d, e, f, h, k, p)
                },
                Ua: function(a, b) {
                    W.uniform1f(X(a), b)
                },
                Va: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform1fv(X(a), F, c >> 2,
                        b);
                    else {
                        if (288 >= b)
                            for (var d = Y[b - 1], e = 0; e < b; ++e) d[e] = F[c + 4 * e >> 2];
                        else d = F.subarray(c >> 2, c + 4 * b >> 2);
                        W.uniform1fv(X(a), d)
                    }
                },
                B: function(a, b) {
                    W.uniform1i(X(a), b)
                },
                C: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform1iv(X(a), D, c >> 2, b);
                    else {
                        if (288 >= b)
                            for (var d = Vc[b - 1], e = 0; e < b; ++e) d[e] = D[c + 4 * e >> 2];
                        else d = D.subarray(c >> 2, c + 4 * b >> 2);
                        W.uniform1iv(X(a), d)
                    }
                },
                D: function(a, b, c) {
                    W.uniform2f(X(a), b, c)
                },
                E: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform2fv(X(a), F, c >> 2, 2 * b);
                    else {
                        if (144 >= b)
                            for (var d = Y[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] =
                                F[c + 4 * e >> 2], d[e + 1] = F[c + (4 * e + 4) >> 2];
                        else d = F.subarray(c >> 2, c + 8 * b >> 2);
                        W.uniform2fv(X(a), d)
                    }
                },
                A: function(a, b, c) {
                    W.uniform2i(X(a), b, c)
                },
                z: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform2iv(X(a), D, c >> 2, 2 * b);
                    else {
                        if (144 >= b)
                            for (var d = Vc[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] = D[c + 4 * e >> 2], d[e + 1] = D[c + (4 * e + 4) >> 2];
                        else d = D.subarray(c >> 2, c + 8 * b >> 2);
                        W.uniform2iv(X(a), d)
                    }
                },
                y: function(a, b, c, d) {
                    W.uniform3f(X(a), b, c, d)
                },
                x: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform3fv(X(a), F, c >> 2, 3 * b);
                    else {
                        if (96 >= b)
                            for (var d = Y[3 * b - 1], e = 0; e < 3 * b; e +=
                                3) d[e] = F[c + 4 * e >> 2], d[e + 1] = F[c + (4 * e + 4) >> 2], d[e + 2] = F[c + (4 * e + 8) >> 2];
                        else d = F.subarray(c >> 2, c + 12 * b >> 2);
                        W.uniform3fv(X(a), d)
                    }
                },
                w: function(a, b, c, d) {
                    W.uniform3i(X(a), b, c, d)
                },
                Jc: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform3iv(X(a), D, c >> 2, 3 * b);
                    else {
                        if (96 >= b)
                            for (var d = Vc[3 * b - 1], e = 0; e < 3 * b; e += 3) d[e] = D[c + 4 * e >> 2], d[e + 1] = D[c + (4 * e + 4) >> 2], d[e + 2] = D[c + (4 * e + 8) >> 2];
                        else d = D.subarray(c >> 2, c + 12 * b >> 2);
                        W.uniform3iv(X(a), d)
                    }
                },
                Ic: function(a, b, c, d, e) {
                    W.uniform4f(X(a), b, c, d, e)
                },
                Hc: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform4fv(X(a),
                        F, c >> 2, 4 * b);
                    else {
                        if (72 >= b) {
                            var d = Y[4 * b - 1],
                                e = F;
                            c >>= 2;
                            for (var f = 0; f < 4 * b; f += 4) {
                                var h = c + f;
                                d[f] = e[h];
                                d[f + 1] = e[h + 1];
                                d[f + 2] = e[h + 2];
                                d[f + 3] = e[h + 3]
                            }
                        } else d = F.subarray(c >> 2, c + 16 * b >> 2);
                        W.uniform4fv(X(a), d)
                    }
                },
                uc: function(a, b, c, d, e) {
                    W.uniform4i(X(a), b, c, d, e)
                },
                vc: function(a, b, c) {
                    if (2 <= m.version) b && W.uniform4iv(X(a), D, c >> 2, 4 * b);
                    else {
                        if (72 >= b)
                            for (var d = Vc[4 * b - 1], e = 0; e < 4 * b; e += 4) d[e] = D[c + 4 * e >> 2], d[e + 1] = D[c + (4 * e + 4) >> 2], d[e + 2] = D[c + (4 * e + 8) >> 2], d[e + 3] = D[c + (4 * e + 12) >> 2];
                        else d = D.subarray(c >> 2, c + 16 * b >> 2);
                        W.uniform4iv(X(a),
                            d)
                    }
                },
                wc: function(a, b, c, d) {
                    if (2 <= m.version) b && W.uniformMatrix2fv(X(a), !!c, F, d >> 2, 4 * b);
                    else {
                        if (72 >= b)
                            for (var e = Y[4 * b - 1], f = 0; f < 4 * b; f += 4) e[f] = F[d + 4 * f >> 2], e[f + 1] = F[d + (4 * f + 4) >> 2], e[f + 2] = F[d + (4 * f + 8) >> 2], e[f + 3] = F[d + (4 * f + 12) >> 2];
                        else e = F.subarray(d >> 2, d + 16 * b >> 2);
                        W.uniformMatrix2fv(X(a), !!c, e)
                    }
                },
                xc: function(a, b, c, d) {
                    if (2 <= m.version) b && W.uniformMatrix3fv(X(a), !!c, F, d >> 2, 9 * b);
                    else {
                        if (32 >= b)
                            for (var e = Y[9 * b - 1], f = 0; f < 9 * b; f += 9) e[f] = F[d + 4 * f >> 2], e[f + 1] = F[d + (4 * f + 4) >> 2], e[f + 2] = F[d + (4 * f + 8) >> 2], e[f + 3] = F[d + (4 * f + 12) >> 2],
                                e[f + 4] = F[d + (4 * f + 16) >> 2], e[f + 5] = F[d + (4 * f + 20) >> 2], e[f + 6] = F[d + (4 * f + 24) >> 2], e[f + 7] = F[d + (4 * f + 28) >> 2], e[f + 8] = F[d + (4 * f + 32) >> 2];
                        else e = F.subarray(d >> 2, d + 36 * b >> 2);
                        W.uniformMatrix3fv(X(a), !!c, e)
                    }
                },
                yc: function(a, b, c, d) {
                    if (2 <= m.version) b && W.uniformMatrix4fv(X(a), !!c, F, d >> 2, 16 * b);
                    else {
                        if (18 >= b) {
                            var e = Y[16 * b - 1],
                                f = F;
                            d >>= 2;
                            for (var h = 0; h < 16 * b; h += 16) {
                                var k = d + h;
                                e[h] = f[k];
                                e[h + 1] = f[k + 1];
                                e[h + 2] = f[k + 2];
                                e[h + 3] = f[k + 3];
                                e[h + 4] = f[k + 4];
                                e[h + 5] = f[k + 5];
                                e[h + 6] = f[k + 6];
                                e[h + 7] = f[k + 7];
                                e[h + 8] = f[k + 8];
                                e[h + 9] = f[k + 9];
                                e[h + 10] = f[k + 10];
                                e[h +
                                    11] = f[k + 11];
                                e[h + 12] = f[k + 12];
                                e[h + 13] = f[k + 13];
                                e[h + 14] = f[k + 14];
                                e[h + 15] = f[k + 15]
                            }
                        } else e = F.subarray(d >> 2, d + 64 * b >> 2);
                        W.uniformMatrix4fv(X(a), !!c, e)
                    }
                },
                Ac: function(a) {
                    a = S[a];
                    W.useProgram(a);
                    W.ge = a
                },
                Bc: function(a, b) {
                    W.vertexAttrib1f(a, b)
                },
                Cc: function(a, b) {
                    W.vertexAttrib2f(a, F[b >> 2], F[b + 4 >> 2])
                },
                Dc: function(a, b) {
                    W.vertexAttrib3f(a, F[b >> 2], F[b + 4 >> 2], F[b + 8 >> 2])
                },
                Ec: function(a, b) {
                    W.vertexAttrib4f(a, F[b >> 2], F[b + 4 >> 2], F[b + 8 >> 2], F[b + 12 >> 2])
                },
                dc: function(a, b) {
                    W.vertexAttribDivisor(a, b)
                },
                ec: function(a, b, c, d, e) {
                    W.vertexAttribIPointer(a,
                        b, c, d, e)
                },
                Fc: function(a, b, c, d, e, f) {
                    W.vertexAttribPointer(a, b, c, !!d, e, f)
                },
                Gc: function(a, b, c, d) {
                    W.viewport(a, b, c, d)
                },
                Kb: function(a, b, c, d) {
                    W.waitSync(qc[a], b, (c >>> 0) + 4294967296 * d)
                },
                fb: (a, b, c) => B.copyWithin(a, b, b + c),
                _a: a => {
                    var b = B.length;
                    a >>>= 0;
                    if (2147483648 < a) return !1;
                    for (var c = 1; 4 >= c; c *= 2) {
                        var d = b * (1 + .2 / c);
                        d = Math.min(d, a + 100663296);
                        var e = Math;
                        d = Math.max(a, d);
                        a: {
                            e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - ta.buffer.byteLength + 65535 >>> 16;
                            try {
                                ta.grow(e);
                                xa();
                                var f = 1;
                                break a
                            } catch (h) {}
                            f = void 0
                        }
                        if (f) return !0
                    }
                    return !1
                },
                bb: (a, b) => {
                    var c = 0;
                    Yc().forEach(function(d, e) {
                        var f = b + c;
                        e = E[a + 4 * e >> 2] = f;
                        for (f = 0; f < d.length; ++f) A[e++ >> 0] = d.charCodeAt(f);
                        A[e >> 0] = 0;
                        c += d.length + 1
                    });
                    return 0
                },
                cb: (a, b) => {
                    var c = Yc();
                    E[a >> 2] = c.length;
                    var d = 0;
                    c.forEach(function(e) {
                        d += e.length + 1
                    });
                    E[b >> 2] = d;
                    return 0
                },
                gb: () => 52,
                db: () => 52,
                Xa: function() {
                    return 70
                },
                p: (a, b, c, d) => {
                    for (var e = 0, f = 0; f < c; f++) {
                        var h = E[b >> 2],
                            k = E[b + 4 >> 2];
                        b += 8;
                        for (var n = 0; n < k; n++) $c(a, B[h + n]);
                        e += k
                    }
                    E[d >> 2] = e;
                    return 0
                },
                R: yc,
                zc: Ac,
                G: Dc,
                Kc: Ec,
                i: Mc,
                n: Qc,
                Wa: Rc,
                Za: (a, b, c, d) => ed(a, b, c, d)
            };
            (function() {
                function a(c) {
                    z = c = c.exports;
                    ta = z.Lc;
                    xa();
                    ya = z.Nc;
                    Aa.unshift(z.Mc);
                    Fa--;
                    g.monitorRunDependencies && g.monitorRunDependencies(Fa);
                    if (0 == Fa && (null !== Ga && (clearInterval(Ga), Ga = null), Ha)) {
                        var d = Ha;
                        Ha = null;
                        d()
                    }
                    return c
                }
                var b = {
                    a: kd
                };
                Fa++;
                g.monitorRunDependencies && g.monitorRunDependencies(Fa);
                if (g.instantiateWasm) try {
                    return g.instantiateWasm(b, a)
                } catch (c) {
                    y("Module.instantiateWasm callback failed with error: " + c), ba(c)
                }
                Oa(b, function(c) {
                    a(c.instance)
                }).catch(ba);
                return {}
            })();
            var ld = g._fflush = a => (ld = g._fflush = z.Oc)(a),
                Q = g._free = a => (Q = g._free = z.Pc)(a),
                Oc = g._malloc = a => (Oc = g._malloc = z.Qc)(a),
                md = g._main = (a, b) => (md = g._main = z.Rc)(a, b),
                Db = a => (Db = z.Sc)(a);
            g.__embind_initialize_bindings = () => (g.__embind_initialize_bindings = z.Tc)();
            var nd = () => (nd = z.Uc)();
            g.dynCall_vijiii = (a, b, c, d, e, f, h) => (g.dynCall_vijiii = z.Vc)(a, b, c, d, e, f, h);
            g.dynCall_viji = (a, b, c, d, e) => (g.dynCall_viji = z.Wc)(a, b, c, d, e);
            g.dynCall_viiiiij = (a, b, c, d, e, f, h, k) => (g.dynCall_viiiiij = z.Xc)(a, b, c, d, e, f, h, k);
            g.dynCall_jii = (a, b, c) => (g.dynCall_jii = z.Yc)(a, b, c);
            g.dynCall_vij = (a, b, c, d) => (g.dynCall_vij = z.Zc)(a, b, c, d);
            g.dynCall_jiji = (a, b, c, d, e) => (g.dynCall_jiji = z._c)(a, b, c, d, e);
            g.dynCall_viijii = (a, b, c, d, e, f, h) => (g.dynCall_viijii = z.$c)(a, b, c, d, e, f, h);
            g.dynCall_iiiiij = (a, b, c, d, e, f, h) => (g.dynCall_iiiiij = z.ad)(a, b, c, d, e, f, h);
            g.dynCall_iiiiijj = (a, b, c, d, e, f, h, k, n) => (g.dynCall_iiiiijj = z.bd)(a, b, c, d, e, f, h, k, n);
            g.dynCall_iiiiiijj = (a, b, c, d, e, f, h, k, n, p) => (g.dynCall_iiiiiijj = z.cd)(a, b, c, d, e, f, h, k, n, p);
            var od;
            Ha = function pd() {
                od || qd();
                od || (Ha = pd)
            };

            function qd() {
                function a() {
                    if (!od && (od = !0, g.calledRun = !0, !ua)) {
                        Qa(Aa);
                        Qa(Ba);
                        aa(g);
                        if (g.onRuntimeInitialized) g.onRuntimeInitialized();
                        if (rd) {
                            var b = md;
                            try {
                                var c = b(0, 0);
                                noExitRuntime || (nd(), Qa(Ca), ld(0), Zc[1].length && $c(1, 10), Zc[2].length && $c(2, 10));
                                if (!noExitRuntime) {
                                    if (g.onExit) g.onExit(c);
                                    ua = !0
                                }
                                ha(c, new Pa(c))
                            } catch (d) {
                                d instanceof Pa || "unwind" == d || ha(1, d)
                            }
                        }
                        if (g.postRun)
                            for ("function" == typeof g.postRun && (g.postRun = [g.postRun]); g.postRun.length;) b = g.postRun.shift(), Da.unshift(b);
                        Qa(Da)
                    }
                }
                if (!(0 < Fa)) {
                    if (g.preRun)
                        for ("function" ==
                            typeof g.preRun && (g.preRun = [g.preRun]); g.preRun.length;) Ea();
                    Qa(za);
                    0 < Fa || (g.setStatus ? (g.setStatus("Running..."), setTimeout(function() {
                        setTimeout(function() {
                            g.setStatus("")
                        }, 1);
                        a()
                    }, 1)) : a())
                }
            }
            if (g.preInit)
                for ("function" == typeof g.preInit && (g.preInit = [g.preInit]); 0 < g.preInit.length;) g.preInit.pop()();
            var rd = !1;
            g.noInitialRun && (rd = !1);
            qd();


            return moduleArg.ready
        }

    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = SkiaWebBindInit;
else if (typeof define === 'function' && define['amd'])
    define([], () => SkiaWebBindInit);
////////////////////////////////////////////////////////////////////////////////
// Copyright 2024 Bruno Nicoletti
//
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
////////////////////////////////////////////////////////////////////////////////
SkiaWebBind = null;

const loadSkiaWebBind = async function() {
    if (SkiaWebBind === null) {
        const swbLoader = SkiaWebBindInit({
            locateFile: (file) => file
        });
        SkiaWebBind = await swbLoader;
        SkiaWebBind.onRuntimeInitialized();
    }
    return SkiaWebBind;
}();