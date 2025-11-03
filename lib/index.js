import { getCurrentInstance as Ji, defineComponent as ze, inject as Zi, ref as k, computed as Bt, watch as G, onBeforeUnmount as oi, onMounted as ri, useSlots as Qi, resolveComponent as Xt, createElementBlock as It, openBlock as wt, normalizeStyle as we, normalizeClass as on, renderSlot as ue, createCommentVNode as rn, createVNode as Pt, provide as to, onBeforeMount as eo, nextTick as zt, createElementVNode as Ot, withDirectives as no, Fragment as hn, renderList as pn, vShow as io, createBlock as oo, withCtx as Yt, createTextVNode as sn, toDisplayString as ro, createSlots as so, normalizeProps as ao, guardReactiveProps as lo } from "vue";
function co(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(t, n) {
    var i = e.get(t);
    i ? i.push(n) : e.set(t, [n]);
  }, off: function(t, n) {
    var i = e.get(t);
    i && (n ? i.splice(i.indexOf(n) >>> 0, 1) : e.set(t, []));
  }, emit: function(t, n) {
    var i = e.get(t);
    i && i.slice().map(function(o) {
      o(n);
    }), (i = e.get("*")) && i.slice().map(function(o) {
      o(t, n);
    });
  } };
}
function uo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Be = { exports: {} }, In;
function si() {
  if (In) return Be.exports;
  In = 1;
  var e = Be.exports = {};
  return e.forEach = function(t, n) {
    for (var i = 0; i < t.length; i++) {
      var o = n(t[i]);
      if (o)
        return o;
    }
  }, Be.exports;
}
var We, _n;
function fo() {
  return _n || (_n = 1, We = function(e) {
    var t = e.stateHandler.getState;
    function n(a) {
      var s = t(a);
      return s && !!s.isDetectable;
    }
    function i(a) {
      t(a).isDetectable = !0;
    }
    function o(a) {
      return !!t(a).busy;
    }
    function r(a, s) {
      t(a).busy = !!s;
    }
    return {
      isDetectable: n,
      markAsDetectable: i,
      isBusy: o,
      markBusy: r
    };
  }), We;
}
var $e, Cn;
function ho() {
  return Cn || (Cn = 1, $e = function(e) {
    var t = {};
    function n(a) {
      var s = e.get(a);
      return s === void 0 ? [] : t[s] || [];
    }
    function i(a, s) {
      var c = e.get(a);
      t[c] || (t[c] = []), t[c].push(s);
    }
    function o(a, s) {
      for (var c = n(a), l = 0, u = c.length; l < u; ++l)
        if (c[l] === s) {
          c.splice(l, 1);
          break;
        }
    }
    function r(a) {
      var s = n(a);
      s && (s.length = 0);
    }
    return {
      get: n,
      add: i,
      removeListener: o,
      removeAllListeners: r
    };
  }), $e;
}
var Ne, Tn;
function po() {
  return Tn || (Tn = 1, Ne = function() {
    var e = 1;
    function t() {
      return e++;
    }
    return {
      generate: t
    };
  }), Ne;
}
var Fe, zn;
function go() {
  return zn || (zn = 1, Fe = function(e) {
    var t = e.idGenerator, n = e.stateHandler.getState;
    function i(r) {
      var a = n(r);
      return a && a.id !== void 0 ? a.id : null;
    }
    function o(r) {
      var a = n(r);
      if (!a)
        throw new Error("setId required the element to have a resize detection state.");
      var s = t.generate();
      return a.id = s, s;
    }
    return {
      get: i,
      set: o
    };
  }), Fe;
}
var je, Mn;
function vo() {
  return Mn || (Mn = 1, je = function(e) {
    function t() {
    }
    var n = {
      log: t,
      warn: t,
      error: t
    };
    if (!e && window.console) {
      var i = function(o, r) {
        o[r] = function() {
          var s = console[r];
          if (s.apply)
            s.apply(console, arguments);
          else
            for (var c = 0; c < arguments.length; c++)
              s(arguments[c]);
        };
      };
      i(n, "log"), i(n, "warn"), i(n, "error");
    }
    return n;
  }), je;
}
var qe = { exports: {} }, Dn;
function ai() {
  if (Dn) return qe.exports;
  Dn = 1;
  var e = qe.exports = {};
  return e.isIE = function(t) {
    function n() {
      var o = navigator.userAgent.toLowerCase();
      return o.indexOf("msie") !== -1 || o.indexOf("trident") !== -1 || o.indexOf(" edge/") !== -1;
    }
    if (!n())
      return !1;
    if (!t)
      return !0;
    var i = (function() {
      var o, r = 3, a = document.createElement("div"), s = a.getElementsByTagName("i");
      do
        a.innerHTML = "<!--[if gt IE " + ++r + "]><i></i><![endif]-->";
      while (s[0]);
      return r > 4 ? r : o;
    })();
    return t === i;
  }, e.isLegacyOpera = function() {
    return !!window.opera;
  }, qe.exports;
}
var Xe = { exports: {} }, Pn;
function mo() {
  if (Pn) return Xe.exports;
  Pn = 1;
  var e = Xe.exports = {};
  e.getOption = t;
  function t(n, i, o) {
    var r = n[i];
    return r == null && o !== void 0 ? o : r;
  }
  return Xe.exports;
}
var Ye, On;
function yo() {
  if (On) return Ye;
  On = 1;
  var e = mo();
  Ye = function(i) {
    i = i || {};
    var o = i.reporter, r = e.getOption(i, "async", !0), a = e.getOption(i, "auto", !0);
    a && !r && (o && o.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true."), r = !0);
    var s = t(), c, l = !1;
    function u(m, O) {
      !l && a && r && s.size() === 0 && g(), s.add(m, O);
    }
    function d() {
      for (l = !0; s.size(); ) {
        var m = s;
        s = t(), m.process();
      }
      l = !1;
    }
    function f(m) {
      l || (m === void 0 && (m = r), c && (E(c), c = null), m ? g() : d());
    }
    function g() {
      c = x(d);
    }
    function E(m) {
      var O = clearTimeout;
      return O(m);
    }
    function x(m) {
      var O = function(T) {
        return setTimeout(T, 0);
      };
      return O(m);
    }
    return {
      add: u,
      force: f
    };
  };
  function t() {
    var n = {}, i = 0, o = 0, r = 0;
    function a(l, u) {
      u || (u = l, l = 0), l > o ? o = l : l < r && (r = l), n[l] || (n[l] = []), n[l].push(u), i++;
    }
    function s() {
      for (var l = r; l <= o; l++)
        for (var u = n[l], d = 0; d < u.length; d++) {
          var f = u[d];
          f();
        }
    }
    function c() {
      return i;
    }
    return {
      add: a,
      process: s,
      size: c
    };
  }
  return Ye;
}
var Ge, kn;
function bo() {
  if (kn) return Ge;
  kn = 1;
  var e = "_erd";
  function t(o) {
    return o[e] = {}, n(o);
  }
  function n(o) {
    return o[e];
  }
  function i(o) {
    delete o[e];
  }
  return Ge = {
    initState: t,
    getState: n,
    cleanState: i
  }, Ge;
}
var Ue, Rn;
function xo() {
  if (Rn) return Ue;
  Rn = 1;
  var e = ai();
  return Ue = function(t) {
    t = t || {};
    var n = t.reporter, i = t.batchProcessor, o = t.stateHandler.getState;
    if (!n)
      throw new Error("Missing required dependency: reporter.");
    function r(u, d) {
      function f() {
        d(u);
      }
      if (e.isIE(8))
        o(u).object = {
          proxy: f
        }, u.attachEvent("onresize", f);
      else {
        var g = c(u);
        if (!g)
          throw new Error("Element is not detectable by this strategy.");
        g.contentDocument.defaultView.addEventListener("resize", f);
      }
    }
    function a(u) {
      var d = t.important ? " !important; " : "; ";
      return (u.join(d) + d).trim();
    }
    function s(u, d, f) {
      f || (f = d, d = u, u = null), u = u || {}, u.debug;
      function g(E, x) {
        var m = a(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]), O = !1, T = window.getComputedStyle(E), M = E.offsetWidth, z = E.offsetHeight;
        o(E).startSize = {
          width: M,
          height: z
        };
        function b() {
          function p() {
            if (T.position === "static") {
              E.style.setProperty("position", "relative", u.important ? "important" : "");
              var F = function(tt, K, at, U) {
                function ut(vt) {
                  return vt.replace(/[^-\d\.]/g, "");
                }
                var lt = at[U];
                lt !== "auto" && ut(lt) !== "0" && (tt.warn("An element that is positioned static has style." + U + "=" + lt + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + U + " will be set to 0. Element: ", K), K.style.setProperty(U, "0", u.important ? "important" : ""));
              };
              F(n, E, T, "top"), F(n, E, T, "right"), F(n, E, T, "bottom"), F(n, E, T, "left");
            }
          }
          function $() {
            O || p();
            function F(K, at) {
              if (!K.contentDocument) {
                var U = o(K);
                U.checkForObjectDocumentTimeoutId && window.clearTimeout(U.checkForObjectDocumentTimeoutId), U.checkForObjectDocumentTimeoutId = setTimeout(function() {
                  U.checkForObjectDocumentTimeoutId = 0, F(K, at);
                }, 100);
                return;
              }
              at(K.contentDocument);
            }
            var tt = this;
            F(tt, function(at) {
              x(E);
            });
          }
          T.position !== "" && (p(), O = !0);
          var _ = document.createElement("object");
          _.style.cssText = m, _.tabIndex = -1, _.type = "text/html", _.setAttribute("aria-hidden", "true"), _.onload = $, e.isIE() || (_.data = "about:blank"), o(E) && (E.appendChild(_), o(E).object = _, e.isIE() && (_.data = "about:blank"));
        }
        i ? i.add(b) : b();
      }
      e.isIE(8) ? f(d) : g(d, f);
    }
    function c(u) {
      return o(u).object;
    }
    function l(u) {
      if (o(u)) {
        var d = c(u);
        d && (e.isIE(8) ? u.detachEvent("onresize", d.proxy) : u.removeChild(d), o(u).checkForObjectDocumentTimeoutId && window.clearTimeout(o(u).checkForObjectDocumentTimeoutId), delete o(u).object);
      }
    }
    return {
      makeDetectable: s,
      addListener: r,
      uninstall: l
    };
  }, Ue;
}
var Ve, An;
function wo() {
  if (An) return Ve;
  An = 1;
  var e = si().forEach;
  return Ve = function(t) {
    t = t || {};
    var n = t.reporter, i = t.batchProcessor, o = t.stateHandler.getState;
    t.stateHandler.hasState;
    var r = t.idHandler;
    if (!i)
      throw new Error("Missing required dependency: batchProcessor");
    if (!n)
      throw new Error("Missing required dependency: reporter.");
    var a = d(), s = "erd_scroll_detection_scrollbar_style", c = "erd_scroll_detection_container";
    function l(b) {
      f(b, s, c);
    }
    l(window.document);
    function u(b) {
      var p = t.important ? " !important; " : "; ";
      return (b.join(p) + p).trim();
    }
    function d() {
      var b = 500, p = 500, $ = document.createElement("div");
      $.style.cssText = u(["position: absolute", "width: " + b * 2 + "px", "height: " + p * 2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
      var _ = document.createElement("div");
      _.style.cssText = u(["position: absolute", "width: " + b + "px", "height: " + p + "px", "overflow: scroll", "visibility: none", "top: " + -b * 3 + "px", "left: " + -p * 3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]), _.appendChild($), document.body.insertBefore(_, document.body.firstChild);
      var F = b - _.clientWidth, tt = p - _.clientHeight;
      return document.body.removeChild(_), {
        width: F,
        height: tt
      };
    }
    function f(b, p, $) {
      function _(at, U) {
        U = U || function(lt) {
          b.head.appendChild(lt);
        };
        var ut = b.createElement("style");
        return ut.innerHTML = at, ut.id = p, U(ut), ut;
      }
      if (!b.getElementById(p)) {
        var F = $ + "_animation", tt = $ + "_animation_active", K = `/* Created by the element-resize-detector library. */
`;
        K += "." + $ + " > div::-webkit-scrollbar { " + u(["display: none"]) + ` }

`, K += "." + tt + " { " + u(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + F, "animation-name: " + F]) + ` }
`, K += "@-webkit-keyframes " + F + ` { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
`, K += "@keyframes " + F + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }", _(K);
      }
    }
    function g(b) {
      b.className += " " + c + "_animation_active";
    }
    function E(b, p, $) {
      if (b.addEventListener)
        b.addEventListener(p, $);
      else if (b.attachEvent)
        b.attachEvent("on" + p, $);
      else
        return n.error("[scroll] Don't know how to add event listeners.");
    }
    function x(b, p, $) {
      if (b.removeEventListener)
        b.removeEventListener(p, $);
      else if (b.detachEvent)
        b.detachEvent("on" + p, $);
      else
        return n.error("[scroll] Don't know how to remove event listeners.");
    }
    function m(b) {
      return o(b).container.childNodes[0].childNodes[0].childNodes[0];
    }
    function O(b) {
      return o(b).container.childNodes[0].childNodes[0].childNodes[1];
    }
    function T(b, p) {
      var $ = o(b).listeners;
      if (!$.push)
        throw new Error("Cannot add listener to an element that is not detectable.");
      o(b).listeners.push(p);
    }
    function M(b, p, $) {
      $ || ($ = p, p = b, b = null), b = b || {};
      function _() {
        if (b.debug) {
          var S = Array.prototype.slice.call(arguments);
          if (S.unshift(r.get(p), "Scroll: "), n.log.apply)
            n.log.apply(null, S);
          else
            for (var L = 0; L < S.length; L++)
              n.log(S[L]);
        }
      }
      function F(S) {
        function L(j) {
          var ht = j.getRootNode && j.getRootNode().contains(j);
          return j === j.ownerDocument.body || j.ownerDocument.body.contains(j) || ht;
        }
        return !L(S) || window.getComputedStyle(S) === null;
      }
      function tt(S) {
        var L = o(S).container.childNodes[0], j = window.getComputedStyle(L);
        return !j.width || j.width.indexOf("px") === -1;
      }
      function K() {
        var S = window.getComputedStyle(p), L = {};
        return L.position = S.position, L.width = p.offsetWidth, L.height = p.offsetHeight, L.top = S.top, L.right = S.right, L.bottom = S.bottom, L.left = S.left, L.widthCSS = S.width, L.heightCSS = S.height, L;
      }
      function at() {
        var S = K();
        o(p).startSize = {
          width: S.width,
          height: S.height
        }, _("Element start size", o(p).startSize);
      }
      function U() {
        o(p).listeners = [];
      }
      function ut() {
        if (_("storeStyle invoked."), !o(p)) {
          _("Aborting because element has been uninstalled");
          return;
        }
        var S = K();
        o(p).style = S;
      }
      function lt(S, L, j) {
        o(S).lastWidth = L, o(S).lastHeight = j;
      }
      function vt(S) {
        return m(S).childNodes[0];
      }
      function J() {
        return 2 * a.width + 1;
      }
      function et() {
        return 2 * a.height + 1;
      }
      function Z(S) {
        return S + 10 + J();
      }
      function w(S) {
        return S + 10 + et();
      }
      function P(S) {
        return S * 2 + J();
      }
      function A(S) {
        return S * 2 + et();
      }
      function q(S, L, j) {
        var ht = m(S), mt = O(S), _t = Z(L), Ct = w(j), ft = P(L), Y = A(j);
        ht.scrollLeft = _t, ht.scrollTop = Ct, mt.scrollLeft = ft, mt.scrollTop = Y;
      }
      function W() {
        var S = o(p).container;
        if (!S) {
          S = document.createElement("div"), S.className = c, S.style.cssText = u(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]), o(p).container = S, g(S), p.appendChild(S);
          var L = function() {
            o(p).onRendered && o(p).onRendered();
          };
          E(S, "animationstart", L), o(p).onAnimationStart = L;
        }
        return S;
      }
      function X() {
        function S() {
          var it = o(p).style;
          if (it.position === "static") {
            p.style.setProperty("position", "relative", b.important ? "important" : "");
            var pt = function(Tt, St, Ae, Ft) {
              function ve(He) {
                return He.replace(/[^-\d\.]/g, "");
              }
              var gt = Ae[Ft];
              gt !== "auto" && ve(gt) !== "0" && (Tt.warn("An element that is positioned static has style." + Ft + "=" + gt + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + Ft + " will be set to 0. Element: ", St), St.style[Ft] = 0);
            };
            pt(n, p, it, "top"), pt(n, p, it, "right"), pt(n, p, it, "bottom"), pt(n, p, it, "left");
          }
        }
        function L(it, pt, Tt, St) {
          return it = it ? it + "px" : "0", pt = pt ? pt + "px" : "0", Tt = Tt ? Tt + "px" : "0", St = St ? St + "px" : "0", ["left: " + it, "top: " + pt, "right: " + St, "bottom: " + Tt];
        }
        if (_("Injecting elements"), !o(p)) {
          _("Aborting because element has been uninstalled");
          return;
        }
        S();
        var j = o(p).container;
        j || (j = W());
        var ht = a.width, mt = a.height, _t = u(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]), Ct = u(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(L(-(1 + ht), -(1 + mt), -mt, -ht))), ft = u(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]), Y = u(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]), ot = u(["position: absolute", "left: 0", "top: 0"]), bt = u(["position: absolute", "width: 200%", "height: 200%"]), xt = document.createElement("div"), yt = document.createElement("div"), At = document.createElement("div"), pe = document.createElement("div"), Zt = document.createElement("div"), ge = document.createElement("div");
        xt.dir = "ltr", xt.style.cssText = _t, xt.className = c, yt.className = c, yt.style.cssText = Ct, At.style.cssText = ft, pe.style.cssText = ot, Zt.style.cssText = Y, ge.style.cssText = bt, At.appendChild(pe), Zt.appendChild(ge), yt.appendChild(At), yt.appendChild(Zt), xt.appendChild(yt), j.appendChild(xt);
        function Et() {
          var it = o(p);
          it && it.onExpand ? it.onExpand() : _("Aborting expand scroll handler: element has been uninstalled");
        }
        function Qt() {
          var it = o(p);
          it && it.onShrink ? it.onShrink() : _("Aborting shrink scroll handler: element has been uninstalled");
        }
        E(At, "scroll", Et), E(Zt, "scroll", Qt), o(p).onExpandScroll = Et, o(p).onShrinkScroll = Qt;
      }
      function D() {
        function S(ft, Y, ot) {
          var bt = vt(ft), xt = Z(Y), yt = w(ot);
          bt.style.setProperty("width", xt + "px", b.important ? "important" : ""), bt.style.setProperty("height", yt + "px", b.important ? "important" : "");
        }
        function L(ft) {
          var Y = p.offsetWidth, ot = p.offsetHeight, bt = Y !== o(p).lastWidth || ot !== o(p).lastHeight;
          _("Storing current size", Y, ot), lt(p, Y, ot), i.add(0, function() {
            if (bt) {
              if (!o(p)) {
                _("Aborting because element has been uninstalled");
                return;
              }
              if (!j()) {
                _("Aborting because element container has not been initialized");
                return;
              }
              if (b.debug) {
                var yt = p.offsetWidth, At = p.offsetHeight;
                (yt !== Y || At !== ot) && n.warn(r.get(p), "Scroll: Size changed before updating detector elements.");
              }
              S(p, Y, ot);
            }
          }), i.add(1, function() {
            if (!o(p)) {
              _("Aborting because element has been uninstalled");
              return;
            }
            if (!j()) {
              _("Aborting because element container has not been initialized");
              return;
            }
            q(p, Y, ot);
          }), bt && ft && i.add(2, function() {
            if (!o(p)) {
              _("Aborting because element has been uninstalled");
              return;
            }
            if (!j()) {
              _("Aborting because element container has not been initialized");
              return;
            }
            ft();
          });
        }
        function j() {
          return !!o(p).container;
        }
        function ht() {
          function ft() {
            return o(p).lastNotifiedWidth === void 0;
          }
          _("notifyListenersIfNeeded invoked");
          var Y = o(p);
          if (ft() && Y.lastWidth === Y.startSize.width && Y.lastHeight === Y.startSize.height)
            return _("Not notifying: Size is the same as the start size, and there has been no notification yet.");
          if (Y.lastWidth === Y.lastNotifiedWidth && Y.lastHeight === Y.lastNotifiedHeight)
            return _("Not notifying: Size already notified");
          _("Current size not notified, notifying..."), Y.lastNotifiedWidth = Y.lastWidth, Y.lastNotifiedHeight = Y.lastHeight, e(o(p).listeners, function(ot) {
            ot(p);
          });
        }
        function mt() {
          if (_("startanimation triggered."), tt(p)) {
            _("Ignoring since element is still unrendered...");
            return;
          }
          _("Element rendered.");
          var ft = m(p), Y = O(p);
          (ft.scrollLeft === 0 || ft.scrollTop === 0 || Y.scrollLeft === 0 || Y.scrollTop === 0) && (_("Scrollbars out of sync. Updating detector elements..."), L(ht));
        }
        function _t() {
          if (_("Scroll detected."), tt(p)) {
            _("Scroll event fired while unrendered. Ignoring...");
            return;
          }
          L(ht);
        }
        if (_("registerListenersAndPositionElements invoked."), !o(p)) {
          _("Aborting because element has been uninstalled");
          return;
        }
        o(p).onRendered = mt, o(p).onExpand = _t, o(p).onShrink = _t;
        var Ct = o(p).style;
        S(p, Ct.width, Ct.height);
      }
      function Q() {
        if (_("finalizeDomMutation invoked."), !o(p)) {
          _("Aborting because element has been uninstalled");
          return;
        }
        var S = o(p).style;
        lt(p, S.width, S.height), q(p, S.width, S.height);
      }
      function V() {
        $(p);
      }
      function dt() {
        _("Installing..."), U(), at(), i.add(0, ut), i.add(1, X), i.add(2, D), i.add(3, Q), i.add(4, V);
      }
      _("Making detectable..."), F(p) ? (_("Element is detached"), W(), _("Waiting until element is attached..."), o(p).onRendered = function() {
        _("Element is now attached"), dt();
      }) : dt();
    }
    function z(b) {
      var p = o(b);
      p && (p.onExpandScroll && x(m(b), "scroll", p.onExpandScroll), p.onShrinkScroll && x(O(b), "scroll", p.onShrinkScroll), p.onAnimationStart && x(p.container, "animationstart", p.onAnimationStart), p.container && b.removeChild(p.container));
    }
    return {
      makeDetectable: M,
      addListener: T,
      uninstall: z,
      initDocument: l
    };
  }, Ve;
}
var Ke, Hn;
function Eo() {
  if (Hn) return Ke;
  Hn = 1;
  var e = si().forEach, t = fo(), n = ho(), i = po(), o = go(), r = vo(), a = ai(), s = yo(), c = bo(), l = xo(), u = wo();
  function d(x) {
    return Array.isArray(x) || x.length !== void 0;
  }
  function f(x) {
    if (Array.isArray(x))
      return x;
    var m = [];
    return e(x, function(O) {
      m.push(O);
    }), m;
  }
  function g(x) {
    return x && x.nodeType === 1;
  }
  Ke = function(x) {
    x = x || {};
    var m;
    if (x.idHandler)
      m = {
        get: function(J) {
          return x.idHandler.get(J, !0);
        },
        set: x.idHandler.set
      };
    else {
      var O = i(), T = o({
        idGenerator: O,
        stateHandler: c
      });
      m = T;
    }
    var M = x.reporter;
    if (!M) {
      var z = M === !1;
      M = r(z);
    }
    var b = E(x, "batchProcessor", s({ reporter: M })), p = {};
    p.callOnAdd = !!E(x, "callOnAdd", !0), p.debug = !!E(x, "debug", !1);
    var $ = n(m), _ = t({
      stateHandler: c
    }), F, tt = E(x, "strategy", "object"), K = E(x, "important", !1), at = {
      reporter: M,
      batchProcessor: b,
      stateHandler: c,
      idHandler: m,
      important: K
    };
    if (tt === "scroll" && (a.isLegacyOpera() ? (M.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy."), tt = "object") : a.isIE(9) && (M.warn("Scroll strategy is not supported on IE9. Changing to object strategy."), tt = "object")), tt === "scroll")
      F = u(at);
    else if (tt === "object")
      F = l(at);
    else
      throw new Error("Invalid strategy name: " + tt);
    var U = {};
    function ut(J, et, Z) {
      function w(D) {
        var Q = $.get(D);
        e(Q, function(dt) {
          dt(D);
        });
      }
      function P(D, Q, V) {
        $.add(Q, V), D && V(Q);
      }
      if (Z || (Z = et, et = J, J = {}), !et)
        throw new Error("At least one element required.");
      if (!Z)
        throw new Error("Listener required.");
      if (g(et))
        et = [et];
      else if (d(et))
        et = f(et);
      else
        return M.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
      var A = 0, q = E(J, "callOnAdd", p.callOnAdd), W = E(J, "onReady", function() {
      }), X = E(J, "debug", p.debug);
      e(et, function(Q) {
        c.getState(Q) || (c.initState(Q), m.set(Q));
        var V = m.get(Q);
        if (X && M.log("Attaching listener to element", V, Q), !_.isDetectable(Q)) {
          if (X && M.log(V, "Not detectable."), _.isBusy(Q)) {
            X && M.log(V, "System busy making it detectable"), P(q, Q, Z), U[V] = U[V] || [], U[V].push(function() {
              A++, A === et.length && W();
            });
            return;
          }
          return X && M.log(V, "Making detectable..."), _.markBusy(Q, !0), F.makeDetectable({ debug: X, important: K }, Q, function(S) {
            if (X && M.log(V, "onElementDetectable"), c.getState(S)) {
              _.markAsDetectable(S), _.markBusy(S, !1), F.addListener(S, w), P(q, S, Z);
              var L = c.getState(S);
              if (L && L.startSize) {
                var j = S.offsetWidth, ht = S.offsetHeight;
                (L.startSize.width !== j || L.startSize.height !== ht) && w(S);
              }
              U[V] && e(U[V], function(mt) {
                mt();
              });
            } else
              X && M.log(V, "Element uninstalled before being detectable.");
            delete U[V], A++, A === et.length && W();
          });
        }
        X && M.log(V, "Already detecable, adding listener."), P(q, Q, Z), A++;
      }), A === et.length && W();
    }
    function lt(J) {
      if (!J)
        return M.error("At least one element is required.");
      if (g(J))
        J = [J];
      else if (d(J))
        J = f(J);
      else
        return M.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
      e(J, function(et) {
        $.removeAllListeners(et), F.uninstall(et), c.cleanState(et);
      });
    }
    function vt(J) {
      F.initDocument && F.initDocument(J);
    }
    return {
      listenTo: ut,
      removeListener: $.removeListener,
      removeAllListeners: $.removeAllListeners,
      uninstall: lt,
      initDocument: vt
    };
  };
  function E(x, m, O) {
    var T = x[m];
    return T == null && O !== void 0 ? O : T;
  }
  return Ke;
}
var So = Eo();
const Io = /* @__PURE__ */ uo(So), nt = {
  init: _o,
  document: null,
  DocumentFragment: null,
  SVGElement: null,
  SVGSVGElement: null,
  SVGElementInstance: null,
  Element: null,
  HTMLElement: null,
  Event: null,
  Touch: null,
  PointerEvent: null
};
function ee() {
}
function _o(e) {
  const t = e;
  nt.document = t.document, nt.DocumentFragment = t.DocumentFragment || ee, nt.SVGElement = t.SVGElement || ee, nt.SVGSVGElement = t.SVGSVGElement || ee, nt.SVGElementInstance = t.SVGElementInstance || ee, nt.Element = t.Element || ee, nt.HTMLElement = t.HTMLElement || nt.Element, nt.Event = t.Event, nt.Touch = t.Touch || ee, nt.PointerEvent = t.PointerEvent || t.MSPointerEvent;
}
var li = (e) => !!(e && e.Window) && e instanceof e.Window;
let ci, Wt;
function ui(e) {
  ci = e;
  const t = e.document.createTextNode("");
  t.ownerDocument !== e.document && typeof e.wrap == "function" && e.wrap(t) === t && (e = e.wrap(e)), Wt = e;
}
typeof window < "u" && window && ui(window);
function Vt(e) {
  return li(e) ? e : (e.ownerDocument || e).defaultView || Wt.window;
}
const Co = (e) => e === Wt || li(e), To = (e) => Me(e) && e.nodeType === 11, Me = (e) => !!e && typeof e == "object", fi = (e) => typeof e == "function", zo = (e) => typeof e == "number", Mo = (e) => typeof e == "boolean", Do = (e) => typeof e == "string", Po = (e) => {
  if (!e || typeof e != "object")
    return !1;
  const t = Vt(e) || Wt;
  return /object|function/.test(typeof Element) ? e instanceof Element || e instanceof t.Element : e.nodeType === 1 && typeof e.nodeName == "string";
}, Oo = (e) => Me(e) && !!e.constructor && /function Object\b/.test(e.constructor.toString()), ko = (e) => Me(e) && typeof e.length < "u" && fi(e.splice);
var v = {
  window: Co,
  docFrag: To,
  object: Me,
  func: fi,
  number: zo,
  bool: Mo,
  string: Do,
  element: Po,
  plainObject: Oo,
  array: ko
};
const rt = {
  init: Ro,
  supportsTouch: null,
  supportsPointerEvent: null,
  isIOS7: null,
  isIOS: null,
  isIe9: null,
  isOperaMobile: null,
  prefixedMatchesSelector: null,
  pEventTypes: null,
  wheelEvent: null
};
function Ro(e) {
  const t = nt.Element, n = e.navigator || {};
  rt.supportsTouch = "ontouchstart" in e || v.func(e.DocumentTouch) && nt.document instanceof e.DocumentTouch, rt.supportsPointerEvent = n.pointerEnabled !== !1 && !!nt.PointerEvent, rt.isIOS = /iP(hone|od|ad)/.test(n.platform), rt.isIOS7 = /iP(hone|od|ad)/.test(n.platform) && /OS 7[^\d]/.test(n.appVersion), rt.isIe9 = /MSIE 9/.test(n.userAgent), rt.isOperaMobile = n.appName === "Opera" && rt.supportsTouch && /Presto/.test(n.userAgent), rt.prefixedMatchesSelector = "matches" in t.prototype ? "matches" : "webkitMatchesSelector" in t.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in t.prototype ? "mozMatchesSelector" : "oMatchesSelector" in t.prototype ? "oMatchesSelector" : "msMatchesSelector", rt.pEventTypes = rt.supportsPointerEvent ? nt.PointerEvent === e.MSPointerEvent ? {
    up: "MSPointerUp",
    down: "MSPointerDown",
    over: "mouseover",
    out: "mouseout",
    move: "MSPointerMove",
    cancel: "MSPointerCancel"
  } : {
    up: "pointerup",
    down: "pointerdown",
    over: "pointerover",
    out: "pointerout",
    move: "pointermove",
    cancel: "pointercancel"
  } : null, rt.wheelEvent = nt.document && "onmousewheel" in nt.document ? "mousewheel" : "wheel";
}
function Gt(e, t) {
  if (e.contains)
    return e.contains(t);
  for (; t; ) {
    if (t === e)
      return !0;
    t = t.parentNode;
  }
  return !1;
}
function di(e, t) {
  for (; v.element(e); ) {
    if (Kt(e, t))
      return e;
    e = $t(e);
  }
  return null;
}
function $t(e) {
  let t = e.parentNode;
  if (v.docFrag(t)) {
    for (; (t = t.host) && v.docFrag(t); )
      ;
    return t;
  }
  return t;
}
function Kt(e, t) {
  return Wt !== ci && (t = t.replace(/\/deep\//g, " ")), e[rt.prefixedMatchesSelector](t);
}
function an(e, t, n) {
  for (; v.element(e); ) {
    if (Kt(e, t))
      return !0;
    if (e = $t(e), e === n)
      return Kt(e, t);
  }
  return !1;
}
function Ln(e) {
  return e.correspondingUseElement || e;
}
function Ao(e) {
  return e = e || Wt, {
    x: e.scrollX || e.document.documentElement.scrollLeft,
    y: e.scrollY || e.document.documentElement.scrollTop
  };
}
function gn(e) {
  const t = e instanceof nt.SVGElement ? e.getBoundingClientRect() : e.getClientRects()[0];
  return t && {
    left: t.left,
    right: t.right,
    top: t.top,
    bottom: t.bottom,
    width: t.width || t.right - t.left,
    height: t.height || t.bottom - t.top
  };
}
function vn(e) {
  const t = gn(e);
  if (!rt.isIOS7 && t) {
    const n = Ao(Vt(e));
    t.left += n.x, t.right += n.x, t.top += n.y, t.bottom += n.y;
  }
  return t;
}
function Bn(e) {
  return v.string(e) ? (nt.document.querySelector(e), !0) : !1;
}
function R(e, t) {
  for (const i in t)
    e[i] = t[i];
  return e;
}
function fe(e, t) {
  let n = !1;
  return function() {
    return n || (Wt.console.warn(t), n = !0), e.apply(this, arguments);
  };
}
function hi(e, t) {
  return e.name = t.name, e.axis = t.axis, e.edges = t.edges, e;
}
function Ho(e) {
  const {
    Interactable: t
    // tslint:disable-line no-shadowed-variable
  } = e;
  t.prototype.getAction = function(i, o, r, a) {
    const s = Lo(this, o, r, a, e);
    return this.options.actionChecker ? this.options.actionChecker(i, o, s, this, a, r) : s;
  }, t.prototype.ignoreFrom = fe(function(n) {
    return this._backCompatOption("ignoreFrom", n);
  }, "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), t.prototype.allowFrom = fe(function(n) {
    return this._backCompatOption("allowFrom", n);
  }, "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), t.prototype.actionChecker = Wo, t.prototype.styleCursor = Bo;
}
function Lo(e, t, n, i, o) {
  const r = e.getRect(i), a = t.buttons || {
    0: 1,
    1: 4,
    3: 8,
    4: 16
  }[t.button], s = {
    action: null,
    interactable: e,
    interaction: n,
    element: i,
    rect: r,
    buttons: a
  };
  return o.fire("auto-start:check", s), s.action;
}
function Bo(e) {
  return v.bool(e) ? (this.options.styleCursor = e, this) : e === null ? (delete this.options.styleCursor, this) : this.options.styleCursor;
}
function Wo(e) {
  return v.func(e) ? (this.options.actionChecker = e, this) : e === null ? (delete this.options.actionChecker, this) : this.options.actionChecker;
}
var $o = {
  id: "auto-start/interactableMethods",
  install: Ho
};
function No(e) {
  const {
    interactStatic: t,
    defaults: n
  } = e;
  e.usePlugin($o), n.base.actionChecker = null, n.base.styleCursor = !0, R(n.perAction, {
    manualStart: !1,
    max: 1 / 0,
    maxPerElement: 1,
    allowFrom: null,
    ignoreFrom: null,
    // only allow left button by default
    // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
    mouseButtons: 1
  }), t.maxInteractions = (i) => mi(i, e), e.autoStart = {
    // Allow this many interactions to happen simultaneously
    maxInteractions: 1 / 0,
    withinInteractionLimit: De,
    cursorElement: null
  };
}
function Fo(e, t) {
  let {
    interaction: n,
    pointer: i,
    event: o,
    eventTarget: r
  } = e;
  if (n.interacting()) return;
  const a = gi(n, i, o, r, t);
  vi(n, a, t);
}
function jo(e, t) {
  let {
    interaction: n,
    pointer: i,
    event: o,
    eventTarget: r
  } = e;
  if (n.pointerType !== "mouse" || n.pointerIsDown || n.interacting()) return;
  const a = gi(n, i, o, r, t);
  vi(n, a, t);
}
function qo(e, t) {
  const {
    interaction: n
  } = e;
  if (!n.pointerIsDown || n.interacting() || !n.pointerWasMoved || !n.prepared.name)
    return;
  t.fire("autoStart:before-start", e);
  const {
    interactable: i
  } = n, o = n.prepared.name;
  o && i && (i.options[o].manualStart || !De(i, n.element, n.prepared, t) ? n.stop() : (n.start(n.prepared, i, n.element), yi(n, t)));
}
function Xo(e, t) {
  let {
    interaction: n
  } = e;
  const {
    interactable: i
  } = n;
  i && i.options.styleCursor && ln(n.element, "", t);
}
function pi(e, t, n, i, o) {
  return t.testIgnoreAllow(t.options[e.name], n, i) && t.options[e.name].enabled && De(t, n, e, o) ? e : null;
}
function Yo(e, t, n, i, o, r, a) {
  for (let s = 0, c = i.length; s < c; s++) {
    const l = i[s], u = o[s], d = l.getAction(t, n, e, u);
    if (!d)
      continue;
    const f = pi(d, l, u, r, a);
    if (f)
      return {
        action: f,
        interactable: l,
        element: u
      };
  }
  return {
    action: null,
    interactable: null,
    element: null
  };
}
function gi(e, t, n, i, o) {
  let r = [], a = [], s = i;
  function c(l) {
    r.push(l), a.push(s);
  }
  for (; v.element(s); ) {
    r = [], a = [], o.interactables.forEachMatch(s, c);
    const l = Yo(e, t, n, r, a, i, o);
    if (l.action && !l.interactable.options[l.action.name].manualStart)
      return l;
    s = $t(s);
  }
  return {
    action: null,
    interactable: null,
    element: null
  };
}
function vi(e, t, n) {
  let {
    action: i,
    interactable: o,
    element: r
  } = t;
  i = i || {
    name: null
  }, e.interactable = o, e.element = r, hi(e.prepared, i), e.rect = o && i.name ? o.getRect(r) : null, yi(e, n), n.fire("autoStart:prepared", {
    interaction: e
  });
}
function De(e, t, n, i) {
  const o = e.options, r = o[n.name].max, a = o[n.name].maxPerElement, s = i.autoStart.maxInteractions;
  let c = 0, l = 0, u = 0;
  if (!(r && a && s))
    return !1;
  for (const d of i.interactions.list) {
    const f = d.prepared.name;
    if (d.interacting()) {
      if (c++, c >= s)
        return !1;
      if (d.interactable === e && (l += f === n.name ? 1 : 0, l >= r || d.element === t && (u++, f === n.name && u >= a)))
        return !1;
    }
  }
  return s > 0;
}
function mi(e, t) {
  return v.number(e) ? (t.autoStart.maxInteractions = e, this) : t.autoStart.maxInteractions;
}
function ln(e, t, n) {
  const {
    cursorElement: i
  } = n.autoStart;
  i && i !== e && (i.style.cursor = ""), e.ownerDocument.documentElement.style.cursor = t, e.style.cursor = t, n.autoStart.cursorElement = t ? e : null;
}
function yi(e, t) {
  const {
    interactable: n,
    element: i,
    prepared: o
  } = e;
  if (!(e.pointerType === "mouse" && n && n.options.styleCursor)) {
    t.autoStart.cursorElement && ln(t.autoStart.cursorElement, "", t);
    return;
  }
  let r = "";
  if (o.name) {
    const a = n.options[o.name].cursorChecker;
    v.func(a) ? r = a(o, n, i, e._interacting) : r = t.actions.map[o.name].getCursor(o);
  }
  ln(e.element, r || "", t);
}
const mn = {
  id: "auto-start/base",
  before: ["actions"],
  install: No,
  listeners: {
    "interactions:down": Fo,
    "interactions:move": (e, t) => {
      jo(e, t), qo(e, t);
    },
    "interactions:stop": Xo
  },
  maxInteractions: mi,
  withinInteractionLimit: De,
  validateAction: pi
};
function Go(e, t) {
  let {
    interaction: n,
    eventTarget: i,
    dx: o,
    dy: r
  } = e;
  if (n.prepared.name !== "drag") return;
  const a = Math.abs(o), s = Math.abs(r), c = n.interactable.options.drag, l = c.startAxis, u = a > s ? "x" : a < s ? "y" : "xy";
  if (n.prepared.axis = c.lockAxis === "start" ? u[0] : c.lockAxis, u !== "xy" && l !== "xy" && l !== u) {
    n.prepared.name = null;
    let d = i;
    const f = function(g) {
      if (g === n.interactable) return;
      const E = n.interactable.options.drag;
      if (!E.manualStart && g.testIgnoreAllow(E, d, i)) {
        const x = g.getAction(n.downPointer, n.downEvent, n, d);
        if (x && x.name === "drag" && Uo(u, g) && mn.validateAction(x, g, d, i, t))
          return g;
      }
    };
    for (; v.element(d); ) {
      const g = t.interactables.forEachMatch(d, f);
      if (g) {
        n.prepared.name = "drag", n.interactable = g, n.element = d;
        break;
      }
      d = $t(d);
    }
  }
}
function Uo(e, t) {
  if (!t)
    return !1;
  const n = t.options.drag.startAxis;
  return e === "xy" || n === "xy" || n === e;
}
var Vo = {
  id: "auto-start/dragAxis",
  listeners: {
    "autoStart:before-start": Go
  }
};
function Ko(e) {
  const {
    defaults: t
  } = e;
  e.usePlugin(mn), t.perAction.hold = 0, t.perAction.delay = 0;
}
function Je(e) {
  const t = e.prepared && e.prepared.name;
  if (!t)
    return null;
  const n = e.interactable.options;
  return n[t].hold || n[t].delay;
}
const Jo = {
  id: "auto-start/hold",
  install: Ko,
  listeners: {
    "interactions:new": (e) => {
      let {
        interaction: t
      } = e;
      t.autoStartHoldTimer = null;
    },
    "autoStart:prepared": (e) => {
      let {
        interaction: t
      } = e;
      const n = Je(t);
      n > 0 && (t.autoStartHoldTimer = setTimeout(() => {
        t.start(t.prepared, t.interactable, t.element);
      }, n));
    },
    "interactions:move": (e) => {
      let {
        interaction: t,
        duplicate: n
      } = e;
      t.autoStartHoldTimer && t.pointerWasMoved && !n && (clearTimeout(t.autoStartHoldTimer), t.autoStartHoldTimer = null);
    },
    // prevent regular down->move autoStart
    "autoStart:before-start": (e) => {
      let {
        interaction: t
      } = e;
      Je(t) > 0 && (t.prepared.name = null);
    }
  },
  getHoldDuration: Je
};
var Zo = {
  id: "auto-start",
  install(e) {
    e.usePlugin(mn), e.usePlugin(Jo), e.usePlugin(Vo);
  }
};
const bi = (e, t) => {
  for (const n of t)
    e.push(n);
  return e;
}, xi = (e) => bi([], e), Pe = (e, t) => {
  for (let n = 0; n < e.length; n++)
    if (t(e[n], n, e))
      return n;
  return -1;
}, be = (e, t) => e[Pe(e, t)];
function ie(e) {
  const t = {};
  for (const n in e) {
    const i = e[n];
    v.plainObject(i) ? t[n] = ie(i) : v.array(i) ? t[n] = xi(i) : t[n] = i;
  }
  return t;
}
let Wn = 0, Mt, qt;
function Qo(e) {
  if (Mt = e.requestAnimationFrame, qt = e.cancelAnimationFrame, !Mt) {
    const t = ["ms", "moz", "webkit", "o"];
    for (const n of t)
      Mt = e[`${n}RequestAnimationFrame`], qt = e[`${n}CancelAnimationFrame`] || e[`${n}CancelRequestAnimationFrame`];
  }
  Mt = Mt && Mt.bind(e), qt = qt && qt.bind(e), Mt || (Mt = (t) => {
    const n = Date.now(), i = Math.max(0, 16 - (n - Wn)), o = e.setTimeout(() => {
      t(n + i);
    }, i);
    return Wn = n + i, o;
  }, qt = (t) => clearTimeout(t));
}
var ne = {
  request: (e) => Mt(e),
  cancel: (e) => qt(e),
  init: Qo
};
function Ut(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (o) => !0, i = arguments.length > 3 ? arguments[3] : void 0;
  if (i = i || {}, v.string(e) && e.search(" ") !== -1 && (e = $n(e)), v.array(e))
    return e.forEach((o) => Ut(o, t, n, i)), i;
  if (v.object(e) && (t = e, e = ""), v.func(t) && n(e))
    i[e] = i[e] || [], i[e].push(t);
  else if (v.array(t))
    for (const o of t)
      Ut(e, o, n, i);
  else if (v.object(t))
    for (const o in t) {
      const r = $n(o).map((a) => `${e}${a}`);
      Ut(r, t[o], n, i);
    }
  return i;
}
function $n(e) {
  return e.trim().split(/ +/);
}
function Nn(e, t) {
  for (const n of t) {
    if (e.immediatePropagationStopped)
      break;
    n(e);
  }
}
class wi {
  constructor(t) {
    this.options = void 0, this.types = {}, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.global = void 0, this.options = R({}, t || {});
  }
  fire(t) {
    let n;
    const i = this.global;
    (n = this.types[t.type]) && Nn(t, n), !t.propagationStopped && i && (n = i[t.type]) && Nn(t, n);
  }
  on(t, n) {
    const i = Ut(t, n);
    for (t in i)
      this.types[t] = bi(this.types[t] || [], i[t]);
  }
  off(t, n) {
    const i = Ut(t, n);
    for (t in i) {
      const o = this.types[t];
      if (!(!o || !o.length))
        for (const r of i[t]) {
          const a = o.indexOf(r);
          a !== -1 && o.splice(a, 1);
        }
    }
  }
  getRect(t) {
    return null;
  }
}
const tr = ["webkit", "moz"];
function Ei(e, t) {
  e.__set || (e.__set = {});
  for (const n in t)
    tr.some((i) => n.indexOf(i) === 0) || typeof e[n] != "function" && n !== "__set" && Object.defineProperty(e, n, {
      get() {
        return n in e.__set ? e.__set[n] : e.__set[n] = t[n];
      },
      set(i) {
        e.__set[n] = i;
      },
      configurable: !0
    });
  return e;
}
var Oe = (e, t) => Math.sqrt(e * e + t * t);
function Ze(e, t) {
  e.page = e.page || {}, e.page.x = t.page.x, e.page.y = t.page.y, e.client = e.client || {}, e.client.x = t.client.x, e.client.y = t.client.y, e.timeStamp = t.timeStamp;
}
function er(e, t, n) {
  e.page.x = n.page.x - t.page.x, e.page.y = n.page.y - t.page.y, e.client.x = n.client.x - t.client.x, e.client.y = n.client.y - t.client.y, e.timeStamp = n.timeStamp - t.timeStamp;
}
function nr(e, t) {
  const n = Math.max(t.timeStamp / 1e3, 1e-3);
  e.page.x = t.page.x / n, e.page.y = t.page.y / n, e.client.x = t.client.x / n, e.client.y = t.client.y / n, e.timeStamp = n;
}
function ir(e) {
  e.page.x = 0, e.page.y = 0, e.client.x = 0, e.client.y = 0;
}
function Si(e) {
  return e instanceof nt.Event || e instanceof nt.Touch;
}
function Ee(e, t, n) {
  return n = n || {}, e = e || "page", n.x = t[e + "X"], n.y = t[e + "Y"], n;
}
function or(e, t) {
  return t = t || {
    x: 0,
    y: 0
  }, rt.isOperaMobile && Si(e) ? (Ee("screen", e, t), t.x += window.scrollX, t.y += window.scrollY) : Ee("page", e, t), t;
}
function rr(e, t) {
  return t = t || {}, rt.isOperaMobile && Si(e) ? Ee("screen", e, t) : Ee("client", e, t), t;
}
function Se(e) {
  return v.number(e.pointerId) ? e.pointerId : e.identifier;
}
function sr(e, t, n) {
  const i = t.length > 1 ? Ii(t) : t[0];
  or(i, e.page), rr(i, e.client), e.timeStamp = n;
}
function yn(e) {
  const t = [];
  return v.array(e) ? (t[0] = e[0], t[1] = e[1]) : e.type === "touchend" ? e.touches.length === 1 ? (t[0] = e.touches[0], t[1] = e.changedTouches[0]) : e.touches.length === 0 && (t[0] = e.changedTouches[0], t[1] = e.changedTouches[1]) : (t[0] = e.touches[0], t[1] = e.touches[1]), t;
}
function Ii(e) {
  const t = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    screenX: 0,
    screenY: 0
  };
  for (const n of e)
    for (const i in t)
      t[i] += n[i];
  for (const n in t)
    t[n] /= e.length;
  return t;
}
function ar(e) {
  if (!e.length)
    return null;
  const t = yn(e), n = Math.min(t[0].pageX, t[1].pageX), i = Math.min(t[0].pageY, t[1].pageY), o = Math.max(t[0].pageX, t[1].pageX), r = Math.max(t[0].pageY, t[1].pageY);
  return {
    x: n,
    y: i,
    left: n,
    top: i,
    right: o,
    bottom: r,
    width: o - n,
    height: r - i
  };
}
function lr(e, t) {
  const n = t + "X", i = t + "Y", o = yn(e), r = o[0][n] - o[1][n], a = o[0][i] - o[1][i];
  return Oe(r, a);
}
function cr(e, t) {
  const n = t + "X", i = t + "Y", o = yn(e), r = o[1][n] - o[0][n], a = o[1][i] - o[0][i];
  return 180 * Math.atan2(a, r) / Math.PI;
}
function ur(e) {
  return v.string(e.pointerType) ? e.pointerType : v.number(e.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][e.pointerType] : (
    // if the PointerEvent API isn't available, then the "pointer" must
    // be either a MouseEvent, TouchEvent, or Touch object
    /touch/.test(e.type || "") || e instanceof nt.Touch ? "touch" : "mouse"
  );
}
function _i(e) {
  const t = v.func(e.composedPath) ? e.composedPath() : e.path;
  return [Ln(t ? t[0] : e.target), Ln(e.currentTarget)];
}
function oe() {
  return {
    page: {
      x: 0,
      y: 0
    },
    client: {
      x: 0,
      y: 0
    },
    timeStamp: 0
  };
}
function fr(e) {
  var t;
  const n = [], i = {}, o = [], r = {
    add: a,
    remove: s,
    addDelegate: c,
    removeDelegate: l,
    delegateListener: u,
    delegateUseCapture: d,
    delegatedEvents: i,
    documents: o,
    targets: n,
    supportsOptions: !1,
    supportsPassive: !1
  };
  (t = e.document) == null || t.createElement("div").addEventListener("test", null, {
    get capture() {
      return r.supportsOptions = !0;
    },
    get passive() {
      return r.supportsPassive = !0;
    }
  }), e.events = r;
  function a(f, g, E, x) {
    if (!f.addEventListener) return;
    const m = re(x);
    let O = be(n, (T) => T.eventTarget === f);
    O || (O = {
      eventTarget: f,
      events: {}
    }, n.push(O)), O.events[g] || (O.events[g] = []), be(O.events[g], (T) => T.func === E && me(T.options, m)) || (f.addEventListener(g, E, r.supportsOptions ? m : m.capture), O.events[g].push({
      func: E,
      options: m
    }));
  }
  function s(f, g, E, x) {
    if (!f.addEventListener || !f.removeEventListener) return;
    const m = Pe(n, (z) => z.eventTarget === f), O = n[m];
    if (!O || !O.events)
      return;
    if (g === "all") {
      for (g in O.events)
        O.events.hasOwnProperty(g) && s(f, g, "all");
      return;
    }
    let T = !1;
    const M = O.events[g];
    if (M)
      if (E === "all") {
        for (let z = M.length - 1; z >= 0; z--) {
          const b = M[z];
          s(f, g, b.func, b.options);
        }
        return;
      } else {
        const z = re(x);
        for (let b = 0; b < M.length; b++) {
          const p = M[b];
          if (p.func === E && me(p.options, z)) {
            f.removeEventListener(g, E, r.supportsOptions ? z : z.capture), M.splice(b, 1), M.length === 0 && (delete O.events[g], T = !0);
            break;
          }
        }
      }
    T && !Object.keys(O.events).length && n.splice(m, 1);
  }
  function c(f, g, E, x, m) {
    const O = re(m);
    if (!i[E]) {
      i[E] = [];
      for (const z of o)
        a(z, E, u), a(z, E, d, !0);
    }
    const T = i[E];
    let M = be(T, (z) => z.selector === f && z.context === g);
    M || (M = {
      selector: f,
      context: g,
      listeners: []
    }, T.push(M)), M.listeners.push({
      func: x,
      options: O
    });
  }
  function l(f, g, E, x, m) {
    const O = re(m), T = i[E];
    let M = !1, z;
    if (T)
      for (z = T.length - 1; z >= 0; z--) {
        const b = T[z];
        if (b.selector === f && b.context === g) {
          const {
            listeners: p
          } = b;
          for (let $ = p.length - 1; $ >= 0; $--) {
            const _ = p[$];
            if (_.func === x && me(_.options, O)) {
              p.splice($, 1), p.length || (T.splice(z, 1), s(g, E, u), s(g, E, d, !0)), M = !0;
              break;
            }
          }
          if (M)
            break;
        }
      }
  }
  function u(f, g) {
    const E = re(g), x = new dr(f), m = i[f.type], [O] = _i(f);
    let T = O;
    for (; v.element(T); ) {
      for (let M = 0; M < m.length; M++) {
        const z = m[M], {
          selector: b,
          context: p
        } = z;
        if (Kt(T, b) && Gt(p, O) && Gt(p, T)) {
          const {
            listeners: $
          } = z;
          x.currentTarget = T;
          for (const _ of $)
            me(_.options, E) && _.func(x);
        }
      }
      T = $t(T);
    }
  }
  function d(f) {
    return u.call(this, f, !0);
  }
  return r;
}
class dr {
  constructor(t) {
    this.currentTarget = void 0, this.originalEvent = void 0, this.type = void 0, this.originalEvent = t, Ei(this, t);
  }
  preventOriginalDefault() {
    this.originalEvent.preventDefault();
  }
  stopPropagation() {
    this.originalEvent.stopPropagation();
  }
  stopImmediatePropagation() {
    this.originalEvent.stopImmediatePropagation();
  }
}
function re(e) {
  return v.object(e) ? {
    capture: !!e.capture,
    passive: !!e.passive
  } : {
    capture: !!e,
    passive: !1
  };
}
function me(e, t) {
  return e === t ? !0 : typeof e == "boolean" ? !!t.capture === e && !t.passive : !!e.capture == !!t.capture && !!e.passive == !!t.passive;
}
var hr = {
  id: "events",
  install: fr
};
const pr = function(t) {
  return /^(always|never|auto)$/.test(t) ? (this.options.preventDefault = t, this) : v.bool(t) ? (this.options.preventDefault = t ? "always" : "never", this) : this.options.preventDefault;
};
function gr(e, t, n) {
  const i = e.options.preventDefault;
  if (i !== "never") {
    if (i === "always") {
      n.preventDefault();
      return;
    }
    if (t.events.supportsPassive && /^touch(start|move)$/.test(n.type)) {
      const o = Vt(n.target).document, r = t.getDocOptions(o);
      if (!(r && r.events) || r.events.passive !== !1)
        return;
    }
    /^(mouse|pointer|touch)*(down|start)/i.test(n.type) || v.element(n.target) && Kt(n.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || n.preventDefault();
  }
}
function vr(e) {
  let {
    interaction: t,
    event: n
  } = e;
  t.interactable && t.interactable.checkAndPreventDefault(n);
}
function mr(e) {
  const {
    Interactable: t
  } = e;
  t.prototype.preventDefault = pr, t.prototype.checkAndPreventDefault = function(n) {
    return gr(this, e, n);
  }, e.interactions.docEvents.push({
    type: "dragstart",
    listener(n) {
      for (const i of e.interactions.list)
        if (i.element && (i.element === n.target || Gt(i.element, n.target))) {
          i.interactable.checkAndPreventDefault(n);
          return;
        }
    }
  });
}
var yr = {
  id: "core/interactablePreventDefault",
  install: mr,
  listeners: ["down", "move", "up", "cancel"].reduce((e, t) => (e[`interactions:${t}`] = vr, e), {})
};
function Ci(e, t, n) {
  return e === "parent" ? $t(n) : e === "self" ? t.getRect(n) : di(n, e);
}
function de(e, t, n, i) {
  let o = e;
  return v.string(o) ? o = Ci(o, t, n) : v.func(o) && (o = o(...i)), v.element(o) && (o = vn(o)), o;
}
function ke(e) {
  return e && {
    x: "x" in e ? e.x : e.left,
    y: "y" in e ? e.y : e.top
  };
}
function br(e) {
  return e && !("left" in e && "top" in e) && (e = R({}, e), e.left = e.x || 0, e.top = e.y || 0, e.right = e.right || e.left + e.width, e.bottom = e.bottom || e.top + e.height), e;
}
function Fn(e) {
  return e && !("x" in e && "y" in e) && (e = R({}, e), e.x = e.left || 0, e.y = e.top || 0, e.width = e.width || (e.right || 0) - e.x, e.height = e.height || (e.bottom || 0) - e.y), e;
}
function bn(e, t, n) {
  e.left && (t.left += n.x), e.right && (t.right += n.x), e.top && (t.top += n.y), e.bottom && (t.bottom += n.y), t.width = t.right - t.left, t.height = t.bottom - t.top;
}
function xn(e, t, n) {
  const i = n && e.options[n], r = i && i.origin || e.options.origin, a = de(r, e, t, [e && t]);
  return ke(a) || {
    x: 0,
    y: 0
  };
}
class Ti {
  constructor(t) {
    this.immediatePropagationStopped = !1, this.propagationStopped = !1, this._interaction = t;
  }
  preventDefault() {
  }
  /**
   * Don't call any other listeners (even on the current target)
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
  /**
   * Don't call listeners on the remaining targets
   */
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = !0;
  }
}
Object.defineProperty(Ti.prototype, "interaction", {
  get() {
    return this._interaction._proxy;
  },
  set() {
  }
});
const zi = {
  base: {
    preventDefault: "auto",
    deltaSource: "page"
  },
  perAction: {
    enabled: !1,
    origin: {
      x: 0,
      y: 0
    }
  },
  actions: {}
};
class wn extends Ti {
  constructor(t, n, i, o, r, a, s) {
    super(t), this.relatedTarget = null, this.screenX = void 0, this.screenY = void 0, this.button = void 0, this.buttons = void 0, this.ctrlKey = void 0, this.shiftKey = void 0, this.altKey = void 0, this.metaKey = void 0, this.page = void 0, this.client = void 0, this.delta = void 0, this.rect = void 0, this.x0 = void 0, this.y0 = void 0, this.t0 = void 0, this.dt = void 0, this.duration = void 0, this.clientX0 = void 0, this.clientY0 = void 0, this.velocity = void 0, this.speed = void 0, this.swipe = void 0, this.axes = void 0, this.preEnd = void 0, r = r || t.element;
    const c = t.interactable, l = (c && c.options || zi).deltaSource, u = xn(c, r, i), d = o === "start", f = o === "end", g = d ? this : t.prevEvent, E = d ? t.coords.start : f ? {
      page: g.page,
      client: g.client,
      timeStamp: t.coords.cur.timeStamp
    } : t.coords.cur;
    this.page = R({}, E.page), this.client = R({}, E.client), this.rect = R({}, t.rect), this.timeStamp = E.timeStamp, f || (this.page.x -= u.x, this.page.y -= u.y, this.client.x -= u.x, this.client.y -= u.y), this.ctrlKey = n.ctrlKey, this.altKey = n.altKey, this.shiftKey = n.shiftKey, this.metaKey = n.metaKey, this.button = n.button, this.buttons = n.buttons, this.target = r, this.currentTarget = r, this.preEnd = a, this.type = s || i + (o || ""), this.interactable = c, this.t0 = d ? t.pointers[t.pointers.length - 1].downTime : g.t0, this.x0 = t.coords.start.page.x - u.x, this.y0 = t.coords.start.page.y - u.y, this.clientX0 = t.coords.start.client.x - u.x, this.clientY0 = t.coords.start.client.y - u.y, d || f ? this.delta = {
      x: 0,
      y: 0
    } : this.delta = {
      x: this[l].x - g[l].x,
      y: this[l].y - g[l].y
    }, this.dt = t.coords.delta.timeStamp, this.duration = this.timeStamp - this.t0, this.velocity = R({}, t.coords.velocity[l]), this.speed = Oe(this.velocity.x, this.velocity.y), this.swipe = f || o === "inertiastart" ? this.getSwipe() : null;
  }
  getSwipe() {
    const t = this._interaction;
    if (t.prevEvent.speed < 600 || this.timeStamp - t.prevEvent.timeStamp > 150)
      return null;
    let n = 180 * Math.atan2(t.prevEvent.velocityY, t.prevEvent.velocityX) / Math.PI;
    const i = 22.5;
    n < 0 && (n += 360);
    const o = 135 - i <= n && n < 225 + i, r = 225 - i <= n && n < 315 + i, a = !o && (315 - i <= n || n < 45 + i), s = !r && 45 - i <= n && n < 135 + i;
    return {
      up: r,
      down: s,
      left: o,
      right: a,
      angle: n,
      speed: t.prevEvent.speed,
      velocity: {
        x: t.prevEvent.velocityX,
        y: t.prevEvent.velocityY
      }
    };
  }
  preventDefault() {
  }
  /**
   * Don't call listeners on the remaining targets
   */
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = !0;
  }
  /**
   * Don't call any other listeners (even on the current target)
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
Object.defineProperties(wn.prototype, {
  pageX: {
    get() {
      return this.page.x;
    },
    set(e) {
      this.page.x = e;
    }
  },
  pageY: {
    get() {
      return this.page.y;
    },
    set(e) {
      this.page.y = e;
    }
  },
  clientX: {
    get() {
      return this.client.x;
    },
    set(e) {
      this.client.x = e;
    }
  },
  clientY: {
    get() {
      return this.client.y;
    },
    set(e) {
      this.client.y = e;
    }
  },
  dx: {
    get() {
      return this.delta.x;
    },
    set(e) {
      this.delta.x = e;
    }
  },
  dy: {
    get() {
      return this.delta.y;
    },
    set(e) {
      this.delta.y = e;
    }
  },
  velocityX: {
    get() {
      return this.velocity.x;
    },
    set(e) {
      this.velocity.x = e;
    }
  },
  velocityY: {
    get() {
      return this.velocity.y;
    },
    set(e) {
      this.velocity.y = e;
    }
  }
});
class xr {
  constructor(t, n, i, o, r) {
    this.id = void 0, this.pointer = void 0, this.event = void 0, this.downTime = void 0, this.downTarget = void 0, this.id = t, this.pointer = n, this.event = i, this.downTime = o, this.downTarget = r;
  }
}
let wr = /* @__PURE__ */ (function(e) {
  return e.interactable = "", e.element = "", e.prepared = "", e.pointerIsDown = "", e.pointerWasMoved = "", e._proxy = "", e;
})({}), Er = /* @__PURE__ */ (function(e) {
  return e.start = "", e.move = "", e.end = "", e.stop = "", e.interacting = "", e;
})({}), Sr = 0;
class Ir {
  /** @internal */
  get pointerMoveTolerance() {
    return 1;
  }
  constructor(t) {
    this.interactable = null, this.element = null, this.rect = null, this._rects = void 0, this.edges = null, this._scopeFire = void 0, this.prepared = {
      name: null,
      axis: null,
      edges: null
    }, this.pointerType = void 0, this.pointers = [], this.downEvent = null, this.downPointer = {}, this._latestPointer = {
      pointer: null,
      event: null,
      eventTarget: null
    }, this.prevEvent = null, this.pointerIsDown = !1, this.pointerWasMoved = !1, this._interacting = !1, this._ending = !1, this._stopped = !0, this._proxy = void 0, this.simulation = null, this.doMove = fe(function(r) {
      this.move(r);
    }, "The interaction.doMove() method has been renamed to interaction.move()"), this.coords = {
      // Starting InteractEvent pointer coordinates
      start: oe(),
      // Previous native pointer move event coordinates
      prev: oe(),
      // current native pointer move event coordinates
      cur: oe(),
      // Change in coordinates and time of the pointer
      delta: oe(),
      // pointer velocity
      velocity: oe()
    }, this._id = Sr++;
    let {
      pointerType: n,
      scopeFire: i
    } = t;
    this._scopeFire = i, this.pointerType = n;
    const o = this;
    this._proxy = {};
    for (const r in wr)
      Object.defineProperty(this._proxy, r, {
        get() {
          return o[r];
        }
      });
    for (const r in Er)
      Object.defineProperty(this._proxy, r, {
        value: function() {
          return o[r](...arguments);
        }
      });
    this._scopeFire("interactions:new", {
      interaction: this
    });
  }
  pointerDown(t, n, i) {
    const o = this.updatePointer(t, n, i, !0), r = this.pointers[o];
    this._scopeFire("interactions:down", {
      pointer: t,
      event: n,
      eventTarget: i,
      pointerIndex: o,
      pointerInfo: r,
      type: "down",
      interaction: this
    });
  }
  /**
   * ```js
   * interact(target)
   *   .draggable({
   *     // disable the default drag start by down->move
   *     manualStart: true
   *   })
   *   // start dragging after the user holds the pointer down
   *   .on('hold', function (event) {
   *     var interaction = event.interaction
   *
   *     if (!interaction.interacting()) {
   *       interaction.start({ name: 'drag' },
   *                         event.interactable,
   *                         event.currentTarget)
   *     }
   * })
   * ```
   *
   * Start an action with the given Interactable and Element as tartgets. The
   * action must be enabled for the target Interactable and an appropriate
   * number of pointers must be held down - 1 for drag/resize, 2 for gesture.
   *
   * Use it with `interactable.<action>able({ manualStart: false })` to always
   * [start actions manually](https://github.com/taye/interact.js/issues/114)
   *
   * @param action - The action to be performed - drag, resize, etc.
   * @param target - The Interactable to target
   * @param element - The DOM Element to target
   * @returns Whether the interaction was successfully started
   */
  start(t, n, i) {
    return this.interacting() || !this.pointerIsDown || this.pointers.length < (t.name === "gesture" ? 2 : 1) || !n.options[t.name].enabled ? !1 : (hi(this.prepared, t), this.interactable = n, this.element = i, this.rect = n.getRect(i), this.edges = this.prepared.edges ? R({}, this.prepared.edges) : {
      left: !0,
      right: !0,
      top: !0,
      bottom: !0
    }, this._stopped = !1, this._interacting = this._doPhase({
      interaction: this,
      event: this.downEvent,
      phase: "start"
    }) && !this._stopped, this._interacting);
  }
  pointerMove(t, n, i) {
    !this.simulation && !(this.modification && this.modification.endResult) && this.updatePointer(t, n, i, !1);
    const o = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
    let r, a;
    this.pointerIsDown && !this.pointerWasMoved && (r = this.coords.cur.client.x - this.coords.start.client.x, a = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = Oe(r, a) > this.pointerMoveTolerance);
    const s = this.getPointerIndex(t), c = {
      pointer: t,
      pointerIndex: s,
      pointerInfo: this.pointers[s],
      event: n,
      type: "move",
      eventTarget: i,
      dx: r,
      dy: a,
      duplicate: o,
      interaction: this
    };
    o || nr(this.coords.velocity, this.coords.delta), this._scopeFire("interactions:move", c), !o && !this.simulation && (this.interacting() && (c.type = null, this.move(c)), this.pointerWasMoved && Ze(this.coords.prev, this.coords.cur));
  }
  /**
   * ```js
   * interact(target)
   *   .draggable(true)
   *   .on('dragmove', function (event) {
   *     if (someCondition) {
   *       // change the snap settings
   *       event.interactable.draggable({ snap: { targets: [] }})
   *       // fire another move event with re-calculated snap
   *       event.interaction.move()
   *     }
   *   })
   * ```
   *
   * Force a move of the current action at the same coordinates. Useful if
   * snap/restrict has been changed and you want a movement with the new
   * settings.
   */
  move(t) {
    (!t || !t.event) && ir(this.coords.delta), t = R({
      pointer: this._latestPointer.pointer,
      event: this._latestPointer.event,
      eventTarget: this._latestPointer.eventTarget,
      interaction: this
    }, t || {}), t.phase = "move", this._doPhase(t);
  }
  /**
   * @internal
   * End interact move events and stop auto-scroll unless simulation is running
   */
  pointerUp(t, n, i, o) {
    let r = this.getPointerIndex(t);
    r === -1 && (r = this.updatePointer(t, n, i, !1));
    const a = /cancel$/i.test(n.type) ? "cancel" : "up";
    this._scopeFire(`interactions:${a}`, {
      pointer: t,
      pointerIndex: r,
      pointerInfo: this.pointers[r],
      event: n,
      eventTarget: i,
      type: a,
      curEventTarget: o,
      interaction: this
    }), this.simulation || this.end(n), this.removePointer(t, n);
  }
  /** @internal */
  documentBlur(t) {
    this.end(t), this._scopeFire("interactions:blur", {
      event: t,
      type: "blur",
      interaction: this
    });
  }
  /**
   * ```js
   * interact(target)
   *   .draggable(true)
   *   .on('move', function (event) {
   *     if (event.pageX > 1000) {
   *       // end the current action
   *       event.interaction.end()
   *       // stop all further listeners from being called
   *       event.stopImmediatePropagation()
   *     }
   *   })
   * ```
   */
  end(t) {
    this._ending = !0, t = t || this._latestPointer.event;
    let n;
    this.interacting() && (n = this._doPhase({
      event: t,
      interaction: this,
      phase: "end"
    })), this._ending = !1, n === !0 && this.stop();
  }
  currentAction() {
    return this._interacting ? this.prepared.name : null;
  }
  interacting() {
    return this._interacting;
  }
  stop() {
    this._scopeFire("interactions:stop", {
      interaction: this
    }), this.interactable = this.element = null, this._interacting = !1, this._stopped = !0, this.prepared.name = this.prevEvent = null;
  }
  /** @internal */
  getPointerIndex(t) {
    const n = Se(t);
    return this.pointerType === "mouse" || this.pointerType === "pen" ? this.pointers.length - 1 : Pe(this.pointers, (i) => i.id === n);
  }
  /** @internal */
  getPointerInfo(t) {
    return this.pointers[this.getPointerIndex(t)];
  }
  /** @internal */
  updatePointer(t, n, i, o) {
    const r = Se(t);
    let a = this.getPointerIndex(t), s = this.pointers[a];
    return o = o === !1 ? !1 : o || /(down|start)$/i.test(n.type), s ? s.pointer = t : (s = new xr(r, t, n, null, null), a = this.pointers.length, this.pointers.push(s)), sr(this.coords.cur, this.pointers.map((c) => c.pointer), this._now()), er(this.coords.delta, this.coords.prev, this.coords.cur), o && (this.pointerIsDown = !0, s.downTime = this.coords.cur.timeStamp, s.downTarget = i, Ei(this.downPointer, t), this.interacting() || (Ze(this.coords.start, this.coords.cur), Ze(this.coords.prev, this.coords.cur), this.downEvent = n, this.pointerWasMoved = !1)), this._updateLatestPointer(t, n, i), this._scopeFire("interactions:update-pointer", {
      pointer: t,
      event: n,
      eventTarget: i,
      down: o,
      pointerInfo: s,
      pointerIndex: a,
      interaction: this
    }), a;
  }
  /** @internal */
  removePointer(t, n) {
    const i = this.getPointerIndex(t);
    if (i === -1) return;
    const o = this.pointers[i];
    this._scopeFire("interactions:remove-pointer", {
      pointer: t,
      event: n,
      eventTarget: null,
      pointerIndex: i,
      pointerInfo: o,
      interaction: this
    }), this.pointers.splice(i, 1), this.pointerIsDown = !1;
  }
  /** @internal */
  _updateLatestPointer(t, n, i) {
    this._latestPointer.pointer = t, this._latestPointer.event = n, this._latestPointer.eventTarget = i;
  }
  destroy() {
    this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null;
  }
  /** @internal */
  _createPreparedEvent(t, n, i, o) {
    return new wn(this, t, this.prepared.name, n, this.element, i, o);
  }
  /** @internal */
  _fireEvent(t) {
    var n;
    (n = this.interactable) == null || n.fire(t), (!this.prevEvent || t.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = t);
  }
  /** @internal */
  _doPhase(t) {
    const {
      event: n,
      phase: i,
      preEnd: o,
      type: r
    } = t, {
      rect: a
    } = this;
    if (a && i === "move" && (bn(this.edges, a, this.coords.delta[this.interactable.options.deltaSource]), a.width = a.right - a.left, a.height = a.bottom - a.top), this._scopeFire(`interactions:before-action-${i}`, t) === !1)
      return !1;
    const c = t.iEvent = this._createPreparedEvent(n, i, o, r);
    return this._scopeFire(`interactions:action-${i}`, t), i === "start" && (this.prevEvent = c), this._fireEvent(c), this._scopeFire(`interactions:after-action-${i}`, t), !0;
  }
  /** @internal */
  _now() {
    return Date.now();
  }
}
const cn = {
  methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"],
  search(e) {
    for (const t of cn.methodOrder) {
      const n = cn[t](e);
      if (n)
        return n;
    }
    return null;
  },
  // try to resume simulation with a new pointer
  simulationResume(e) {
    let {
      pointerType: t,
      eventType: n,
      eventTarget: i,
      scope: o
    } = e;
    if (!/down|start/i.test(n))
      return null;
    for (const r of o.interactions.list) {
      let a = i;
      if (r.simulation && r.simulation.allowResume && r.pointerType === t)
        for (; a; ) {
          if (a === r.element)
            return r;
          a = $t(a);
        }
    }
    return null;
  },
  // if it's a mouse or pen interaction
  mouseOrPen(e) {
    let {
      pointerId: t,
      pointerType: n,
      eventType: i,
      scope: o
    } = e;
    if (n !== "mouse" && n !== "pen")
      return null;
    let r;
    for (const a of o.interactions.list)
      if (a.pointerType === n) {
        if (a.simulation && !jn(a, t))
          continue;
        if (a.interacting())
          return a;
        r || (r = a);
      }
    if (r)
      return r;
    for (const a of o.interactions.list)
      if (a.pointerType === n && !(/down/i.test(i) && a.simulation))
        return a;
    return null;
  },
  // get interaction that has this pointer
  hasPointer(e) {
    let {
      pointerId: t,
      scope: n
    } = e;
    for (const i of n.interactions.list)
      if (jn(i, t))
        return i;
    return null;
  },
  // get first idle interaction with a matching pointerType
  idle(e) {
    let {
      pointerType: t,
      scope: n
    } = e;
    for (const i of n.interactions.list) {
      if (i.pointers.length === 1) {
        const o = i.interactable;
        if (o && !(o.options.gesture && o.options.gesture.enabled))
          continue;
      } else if (i.pointers.length >= 2)
        continue;
      if (!i.interacting() && t === i.pointerType)
        return i;
    }
    return null;
  }
};
function jn(e, t) {
  return e.pointers.some((n) => {
    let {
      id: i
    } = n;
    return i === t;
  });
}
const Mi = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
function _r(e) {
  const t = {};
  for (const r of Mi)
    t[r] = Di(r, e);
  const n = rt.pEventTypes;
  let i;
  nt.PointerEvent ? i = [{
    type: n.down,
    listener: o
  }, {
    type: n.down,
    listener: t.pointerDown
  }, {
    type: n.move,
    listener: t.pointerMove
  }, {
    type: n.up,
    listener: t.pointerUp
  }, {
    type: n.cancel,
    listener: t.pointerUp
  }] : i = [{
    type: "mousedown",
    listener: t.pointerDown
  }, {
    type: "mousemove",
    listener: t.pointerMove
  }, {
    type: "mouseup",
    listener: t.pointerUp
  }, {
    type: "touchstart",
    listener: o
  }, {
    type: "touchstart",
    listener: t.pointerDown
  }, {
    type: "touchmove",
    listener: t.pointerMove
  }, {
    type: "touchend",
    listener: t.pointerUp
  }, {
    type: "touchcancel",
    listener: t.pointerUp
  }], i.push({
    type: "blur",
    listener(r) {
      for (const a of e.interactions.list)
        a.documentBlur(r);
    }
  }), e.prevTouchTime = 0, e.Interaction = class extends Ir {
    get pointerMoveTolerance() {
      return e.interactions.pointerMoveTolerance;
    }
    set pointerMoveTolerance(r) {
      e.interactions.pointerMoveTolerance = r;
    }
    _now() {
      return e.now();
    }
  }, e.interactions = {
    // all active and idle interactions
    list: [],
    new(r) {
      r.scopeFire = (s, c) => e.fire(s, c);
      const a = new e.Interaction(r);
      return e.interactions.list.push(a), a;
    },
    listeners: t,
    docEvents: i,
    pointerMoveTolerance: 1
  };
  function o() {
    for (const r of e.interactions.list)
      if (!(!r.pointerIsDown || r.pointerType !== "touch" || r._interacting))
        for (const a of r.pointers)
          e.documents.some((s) => {
            let {
              doc: c
            } = s;
            return Gt(c, a.downTarget);
          }) || r.removePointer(a.pointer, a.event);
  }
  e.usePlugin(yr);
}
function Di(e, t) {
  return function(n) {
    const i = t.interactions.list, o = ur(n), [r, a] = _i(n), s = [];
    if (/^touch/.test(n.type)) {
      t.prevTouchTime = t.now();
      for (const c of n.changedTouches) {
        const l = c, u = Se(l), d = {
          pointer: l,
          pointerId: u,
          pointerType: o,
          eventType: n.type,
          eventTarget: r,
          curEventTarget: a,
          scope: t
        }, f = qn(d);
        s.push([d.pointer, d.eventTarget, d.curEventTarget, f]);
      }
    } else {
      let c = !1;
      if (!rt.supportsPointerEvent && /mouse/.test(n.type)) {
        for (let l = 0; l < i.length && !c; l++)
          c = i[l].pointerType !== "mouse" && i[l].pointerIsDown;
        c = c || t.now() - t.prevTouchTime < 500 || // on iOS and Firefox Mobile, MouseEvent.timeStamp is zero if simulated
        n.timeStamp === 0;
      }
      if (!c) {
        const l = {
          pointer: n,
          pointerId: Se(n),
          pointerType: o,
          eventType: n.type,
          curEventTarget: a,
          eventTarget: r,
          scope: t
        }, u = qn(l);
        s.push([l.pointer, l.eventTarget, l.curEventTarget, u]);
      }
    }
    for (const [c, l, u, d] of s)
      d[e](c, n, l, u);
  };
}
function qn(e) {
  const {
    pointerType: t,
    scope: n
  } = e, o = {
    interaction: cn.search(e),
    searchDetails: e
  };
  return n.fire("interactions:find", o), o.interaction || n.interactions.new({
    pointerType: t
  });
}
function Qe(e, t) {
  let {
    doc: n,
    scope: i,
    options: o
  } = e;
  const {
    interactions: {
      docEvents: r
    },
    events: a
  } = i, s = a[t];
  i.browser.isIOS && !o.events && (o.events = {
    passive: !1
  });
  for (const l in a.delegatedEvents)
    s(n, l, a.delegateListener), s(n, l, a.delegateUseCapture, !0);
  const c = o && o.events;
  for (const {
    type: l,
    listener: u
  } of r)
    s(n, l, u, c);
}
const Cr = {
  id: "core/interactions",
  install: _r,
  listeners: {
    "scope:add-document": (e) => Qe(e, "add"),
    "scope:remove-document": (e) => Qe(e, "remove"),
    "interactable:unset": (e, t) => {
      let {
        interactable: n
      } = e;
      for (let i = t.interactions.list.length - 1; i >= 0; i--) {
        const o = t.interactions.list[i];
        o.interactable === n && (o.stop(), t.fire("interactions:destroy", {
          interaction: o
        }), o.destroy(), t.interactions.list.length > 2 && t.interactions.list.splice(i, 1));
      }
    }
  },
  onDocSignal: Qe,
  doOnInteractions: Di,
  methodNames: Mi
};
function he(e, t) {
  if (t.phaselessTypes[e])
    return !0;
  for (const n in t.map)
    if (e.indexOf(n) === 0 && e.substr(n.length) in t.phases)
      return !0;
  return !1;
}
var Lt = /* @__PURE__ */ (function(e) {
  return e[e.On = 0] = "On", e[e.Off = 1] = "Off", e;
})(Lt || {});
class Tr {
  /** @internal */
  get _defaults() {
    return {
      base: {},
      perAction: {},
      actions: {}
    };
  }
  constructor(t, n, i, o) {
    this.target = void 0, this.options = void 0, this._actions = void 0, this.events = new wi(), this._context = void 0, this._win = void 0, this._doc = void 0, this._scopeEvents = void 0, this._actions = n.actions, this.target = t, this._context = n.context || i, this._win = Vt(Bn(t) ? this._context : t), this._doc = this._win.document, this._scopeEvents = o, this.set(n);
  }
  setOnEvents(t, n) {
    return v.func(n.onstart) && this.on(`${t}start`, n.onstart), v.func(n.onmove) && this.on(`${t}move`, n.onmove), v.func(n.onend) && this.on(`${t}end`, n.onend), v.func(n.oninertiastart) && this.on(`${t}inertiastart`, n.oninertiastart), this;
  }
  updatePerActionListeners(t, n, i) {
    var o;
    const r = (o = this._actions.map[t]) == null ? void 0 : o.filterEventType, a = (s) => (r == null || r(s)) && he(s, this._actions);
    (v.array(n) || v.object(n)) && this._onOff(Lt.Off, t, n, void 0, a), (v.array(i) || v.object(i)) && this._onOff(Lt.On, t, i, void 0, a);
  }
  setPerAction(t, n) {
    const i = this._defaults;
    for (const o in n) {
      const r = o, a = this.options[t], s = n[r];
      r === "listeners" && this.updatePerActionListeners(t, a.listeners, s), v.array(s) ? a[r] = xi(s) : v.plainObject(s) ? (a[r] = R(a[r] || {}, ie(s)), v.object(i.perAction[r]) && "enabled" in i.perAction[r] && (a[r].enabled = s.enabled !== !1)) : v.bool(s) && v.object(i.perAction[r]) ? a[r].enabled = s : a[r] = s;
    }
  }
  /**
   * The default function to get an Interactables bounding rect. Can be
   * overridden using {@link Interactable.rectChecker}.
   *
   * @param {Element} [element] The element to measure.
   * @return {Rect} The object's bounding rectangle.
   */
  getRect(t) {
    return t = t || (v.element(this.target) ? this.target : null), v.string(this.target) && (t = t || this._context.querySelector(this.target)), vn(t);
  }
  /**
   * Returns or sets the function used to calculate the interactable's
   * element's rectangle
   *
   * @param {function} [checker] A function which returns this Interactable's
   * bounding rectangle. See {@link Interactable.getRect}
   * @return {function | object} The checker function or this Interactable
   */
  rectChecker(t) {
    return v.func(t) ? (this.getRect = (n) => {
      const i = R({}, t.apply(this, n));
      return "width" in i || (i.width = i.right - i.left, i.height = i.bottom - i.top), i;
    }, this) : t === null ? (delete this.getRect, this) : this.getRect;
  }
  /** @internal */
  _backCompatOption(t, n) {
    if (Bn(n) || v.object(n)) {
      this.options[t] = n;
      for (const i in this._actions.map)
        this.options[i][t] = n;
      return this;
    }
    return this.options[t];
  }
  /**
   * Gets or sets the origin of the Interactable's element.  The x and y
   * of the origin will be subtracted from action event coordinates.
   *
   * @param {Element | object | string} [origin] An HTML or SVG Element whose
   * rect will be used, an object eg. { x: 0, y: 0 } or string 'parent', 'self'
   * or any CSS selector
   *
   * @return {object} The current origin or this Interactable
   */
  origin(t) {
    return this._backCompatOption("origin", t);
  }
  /**
   * Returns or sets the mouse coordinate types used to calculate the
   * movement of the pointer.
   *
   * @param {string} [newValue] Use 'client' if you will be scrolling while
   * interacting; Use 'page' if you want autoScroll to work
   * @return {string | object} The current deltaSource or this Interactable
   */
  deltaSource(t) {
    return t === "page" || t === "client" ? (this.options.deltaSource = t, this) : this.options.deltaSource;
  }
  /** @internal */
  getAllElements() {
    const {
      target: t
    } = this;
    return v.string(t) ? Array.from(this._context.querySelectorAll(t)) : v.func(t) && t.getAllElements ? t.getAllElements() : v.element(t) ? [t] : [];
  }
  /**
   * Gets the selector context Node of the Interactable. The default is
   * `window.document`.
   *
   * @return {Node} The context Node of this Interactable
   */
  context() {
    return this._context;
  }
  inContext(t) {
    return this._context === t.ownerDocument || Gt(this._context, t);
  }
  /** @internal */
  testIgnoreAllow(t, n, i) {
    return !this.testIgnore(t.ignoreFrom, n, i) && this.testAllow(t.allowFrom, n, i);
  }
  /** @internal */
  testAllow(t, n, i) {
    return t ? v.element(i) ? v.string(t) ? an(i, t, n) : v.element(t) ? Gt(t, i) : !1 : !1 : !0;
  }
  /** @internal */
  testIgnore(t, n, i) {
    return !t || !v.element(i) ? !1 : v.string(t) ? an(i, t, n) : v.element(t) ? Gt(t, i) : !1;
  }
  /**
   * Calls listeners for the given InteractEvent type bound globally
   * and directly to this Interactable
   *
   * @param {InteractEvent} iEvent The InteractEvent object to be fired on this
   * Interactable
   * @return {Interactable} this Interactable
   */
  fire(t) {
    return this.events.fire(t), this;
  }
  /** @internal */
  _onOff(t, n, i, o, r) {
    v.object(n) && !v.array(n) && (o = i, i = null);
    const a = Ut(n, i, r);
    for (let s in a) {
      s === "wheel" && (s = rt.wheelEvent);
      for (const c of a[s])
        he(s, this._actions) ? this.events[t === Lt.On ? "on" : "off"](s, c) : v.string(this.target) ? this._scopeEvents[t === Lt.On ? "addDelegate" : "removeDelegate"](this.target, this._context, s, c, o) : this._scopeEvents[t === Lt.On ? "add" : "remove"](this.target, s, c, o);
    }
    return this;
  }
  /**
   * Binds a listener for an InteractEvent, pointerEvent or DOM event.
   *
   * @param {string | array | object} types The types of events to listen
   * for
   * @param {function | array | object} [listener] The event listener function(s)
   * @param {object | boolean} [options] options object or useCapture flag for
   * addEventListener
   * @return {Interactable} This Interactable
   */
  on(t, n, i) {
    return this._onOff(Lt.On, t, n, i);
  }
  /**
   * Removes an InteractEvent, pointerEvent or DOM event listener.
   *
   * @param {string | array | object} types The types of events that were
   * listened for
   * @param {function | array | object} [listener] The event listener function(s)
   * @param {object | boolean} [options] options object or useCapture flag for
   * removeEventListener
   * @return {Interactable} This Interactable
   */
  off(t, n, i) {
    return this._onOff(Lt.Off, t, n, i);
  }
  /**
   * Reset the options of this Interactable
   *
   * @param {object} options The new settings to apply
   * @return {object} This Interactable
   */
  set(t) {
    const n = this._defaults;
    v.object(t) || (t = {}), this.options = ie(n.base);
    for (const i in this._actions.methodDict) {
      const o = i, r = this._actions.methodDict[o];
      this.options[o] = {}, this.setPerAction(o, R(R({}, n.perAction), n.actions[o])), this[r](t[o]);
    }
    for (const i in t) {
      if (i === "getRect") {
        this.rectChecker(t.getRect);
        continue;
      }
      v.func(this[i]) && this[i](t[i]);
    }
    return this;
  }
  /**
   * Remove this interactable from the list of interactables and remove it's
   * action capabilities and event listeners
   */
  unset() {
    if (v.string(this.target))
      for (const t in this._scopeEvents.delegatedEvents) {
        const n = this._scopeEvents.delegatedEvents[t];
        for (let i = n.length - 1; i >= 0; i--) {
          const {
            selector: o,
            context: r,
            listeners: a
          } = n[i];
          o === this.target && r === this._context && n.splice(i, 1);
          for (let s = a.length - 1; s >= 0; s--)
            this._scopeEvents.removeDelegate(this.target, this._context, t, a[s][0], a[s][1]);
        }
      }
    else
      this._scopeEvents.remove(this.target, "all");
  }
}
class zr {
  constructor(t) {
    this.list = [], this.selectorMap = {}, this.scope = void 0, this.scope = t, t.addListeners({
      "interactable:unset": (n) => {
        let {
          interactable: i
        } = n;
        const {
          target: o
        } = i, r = v.string(o) ? this.selectorMap[o] : o[this.scope.id], a = Pe(r, (s) => s === i);
        r.splice(a, 1);
      }
    });
  }
  new(t, n) {
    n = R(n || {}, {
      actions: this.scope.actions
    });
    const i = new this.scope.Interactable(t, n, this.scope.document, this.scope.events);
    return this.scope.addDocument(i._doc), this.list.push(i), v.string(t) ? (this.selectorMap[t] || (this.selectorMap[t] = []), this.selectorMap[t].push(i)) : (i.target[this.scope.id] || Object.defineProperty(t, this.scope.id, {
      value: [],
      configurable: !0
    }), t[this.scope.id].push(i)), this.scope.fire("interactable:new", {
      target: t,
      options: n,
      interactable: i,
      win: this.scope._win
    }), i;
  }
  getExisting(t, n) {
    const i = n && n.context || this.scope.document, o = v.string(t), r = o ? this.selectorMap[t] : t[this.scope.id];
    if (r)
      return be(r, (a) => a._context === i && (o || a.inContext(t)));
  }
  forEachMatch(t, n) {
    for (const i of this.list) {
      let o;
      if ((v.string(i.target) ? (
        // target is a selector and the element matches
        v.element(t) && Kt(t, i.target)
      ) : (
        // target is the element
        t === i.target
      )) && // the element is in context
      i.inContext(t) && (o = n(i)), o !== void 0)
        return o;
    }
  }
}
function Mr(e) {
  const t = (n, i) => {
    let o = e.interactables.getExisting(n, i);
    return o || (o = e.interactables.new(n, i), o.events.global = t.globalEvents), o;
  };
  return t.getPointerAverage = Ii, t.getTouchBBox = ar, t.getTouchDistance = lr, t.getTouchAngle = cr, t.getElementRect = vn, t.getElementClientRect = gn, t.matchesSelector = Kt, t.closest = di, t.globalEvents = {}, t.version = "1.10.27", t.scope = e, t.use = function(n, i) {
    return this.scope.usePlugin(n, i), this;
  }, t.isSet = function(n, i) {
    return !!this.scope.interactables.get(n, i && i.context);
  }, t.on = fe(function(i, o, r) {
    if (v.string(i) && i.search(" ") !== -1 && (i = i.trim().split(/ +/)), v.array(i)) {
      for (const a of i)
        this.on(a, o, r);
      return this;
    }
    if (v.object(i)) {
      for (const a in i)
        this.on(a, i[a], o);
      return this;
    }
    return he(i, this.scope.actions) ? this.globalEvents[i] ? this.globalEvents[i].push(o) : this.globalEvents[i] = [o] : this.scope.events.add(this.scope.document, i, o, {
      options: r
    }), this;
  }, "The interact.on() method is being deprecated"), t.off = fe(function(i, o, r) {
    if (v.string(i) && i.search(" ") !== -1 && (i = i.trim().split(/ +/)), v.array(i)) {
      for (const a of i)
        this.off(a, o, r);
      return this;
    }
    if (v.object(i)) {
      for (const a in i)
        this.off(a, i[a], o);
      return this;
    }
    if (he(i, this.scope.actions)) {
      let a;
      i in this.globalEvents && (a = this.globalEvents[i].indexOf(o)) !== -1 && this.globalEvents[i].splice(a, 1);
    } else
      this.scope.events.remove(this.scope.document, i, o, r);
    return this;
  }, "The interact.off() method is being deprecated"), t.debug = function() {
    return this.scope;
  }, t.supportsTouch = function() {
    return rt.supportsTouch;
  }, t.supportsPointerEvent = function() {
    return rt.supportsPointerEvent;
  }, t.stop = function() {
    for (const n of this.scope.interactions.list)
      n.stop();
    return this;
  }, t.pointerMoveTolerance = function(n) {
    return v.number(n) ? (this.scope.interactions.pointerMoveTolerance = n, this) : this.scope.interactions.pointerMoveTolerance;
  }, t.addDocument = function(n, i) {
    this.scope.addDocument(n, i);
  }, t.removeDocument = function(n) {
    this.scope.removeDocument(n);
  }, t;
}
class Dr {
  constructor() {
    this.id = `__interact_scope_${Math.floor(Math.random() * 100)}`, this.isInitialized = !1, this.listenerMaps = [], this.browser = rt, this.defaults = ie(zi), this.Eventable = wi, this.actions = {
      map: {},
      phases: {
        start: !0,
        move: !0,
        end: !0
      },
      methodDict: {},
      phaselessTypes: {}
    }, this.interactStatic = Mr(this), this.InteractEvent = wn, this.Interactable = void 0, this.interactables = new zr(this), this._win = void 0, this.document = void 0, this.window = void 0, this.documents = [], this._plugins = {
      list: [],
      map: {}
    }, this.onWindowUnload = (n) => this.removeDocument(n.target);
    const t = this;
    this.Interactable = class extends Tr {
      get _defaults() {
        return t.defaults;
      }
      set(n) {
        return super.set(n), t.fire("interactable:set", {
          options: n,
          interactable: this
        }), this;
      }
      unset() {
        super.unset();
        const n = t.interactables.list.indexOf(this);
        n < 0 || (t.interactables.list.splice(n, 1), t.fire("interactable:unset", {
          interactable: this
        }));
      }
    };
  }
  addListeners(t, n) {
    this.listenerMaps.push({
      id: n,
      map: t
    });
  }
  fire(t, n) {
    for (const {
      map: {
        [t]: i
      }
    } of this.listenerMaps)
      if (i && i(n, this, t) === !1)
        return !1;
  }
  init(t) {
    return this.isInitialized ? this : Pr(this, t);
  }
  pluginIsInstalled(t) {
    const {
      id: n
    } = t;
    return n ? !!this._plugins.map[n] : this._plugins.list.indexOf(t) !== -1;
  }
  usePlugin(t, n) {
    if (!this.isInitialized)
      return this;
    if (this.pluginIsInstalled(t))
      return this;
    if (t.id && (this._plugins.map[t.id] = t), this._plugins.list.push(t), t.install && t.install(this, n), t.listeners && t.before) {
      let i = 0;
      const o = this.listenerMaps.length, r = t.before.reduce((a, s) => (a[s] = !0, a[Xn(s)] = !0, a), {});
      for (; i < o; i++) {
        const a = this.listenerMaps[i].id;
        if (a && (r[a] || r[Xn(a)]))
          break;
      }
      this.listenerMaps.splice(i, 0, {
        id: t.id,
        map: t.listeners
      });
    } else t.listeners && this.listenerMaps.push({
      id: t.id,
      map: t.listeners
    });
    return this;
  }
  addDocument(t, n) {
    if (this.getDocIndex(t) !== -1)
      return !1;
    const i = Vt(t);
    n = n ? R({}, n) : {}, this.documents.push({
      doc: t,
      options: n
    }), this.events.documents.push(t), t !== this.document && this.events.add(i, "unload", this.onWindowUnload), this.fire("scope:add-document", {
      doc: t,
      window: i,
      scope: this,
      options: n
    });
  }
  removeDocument(t) {
    const n = this.getDocIndex(t), i = Vt(t), o = this.documents[n].options;
    this.events.remove(i, "unload", this.onWindowUnload), this.documents.splice(n, 1), this.events.documents.splice(n, 1), this.fire("scope:remove-document", {
      doc: t,
      window: i,
      scope: this,
      options: o
    });
  }
  getDocIndex(t) {
    for (let n = 0; n < this.documents.length; n++)
      if (this.documents[n].doc === t)
        return n;
    return -1;
  }
  getDocOptions(t) {
    const n = this.getDocIndex(t);
    return n === -1 ? null : this.documents[n].options;
  }
  now() {
    return (this.window.Date || Date).now();
  }
}
function Pr(e, t) {
  return e.isInitialized = !0, v.window(t) && ui(t), nt.init(t), rt.init(t), ne.init(t), e.window = t, e.document = t.document, e.usePlugin(Cr), e.usePlugin(hr), e;
}
function Xn(e) {
  return e && e.replace(/\/.*$/, "");
}
const Pi = new Dr(), Rt = Pi.interactStatic, Or = typeof globalThis < "u" ? globalThis : window;
Pi.init(Or);
Rt.use(Zo);
function kr(e) {
  const {
    defaults: t,
    actions: n
  } = e;
  e.autoScroll = H, H.now = () => e.now(), n.phaselessTypes.autoscroll = !0, t.perAction.autoScroll = H.defaults;
}
const H = {
  defaults: {
    enabled: !1,
    margin: 60,
    // the item that is scrolled (Window or HTMLElement)
    container: null,
    // the scroll speed in pixels per second
    speed: 300
  },
  now: Date.now,
  interaction: null,
  i: 0,
  // the handle returned by window.setInterval
  // Direction each pulse is to scroll in
  x: 0,
  y: 0,
  isScrolling: !1,
  prevTime: 0,
  margin: 0,
  speed: 0,
  start(e) {
    H.isScrolling = !0, ne.cancel(H.i), e.autoScroll = H, H.interaction = e, H.prevTime = H.now(), H.i = ne.request(H.scroll);
  },
  stop() {
    H.isScrolling = !1, H.interaction && (H.interaction.autoScroll = null), ne.cancel(H.i);
  },
  // scroll the window by the values in scroll.x/y
  scroll() {
    const {
      interaction: e
    } = H, {
      interactable: t,
      element: n
    } = e, i = e.prepared.name, o = t.options[i].autoScroll, r = Yn(o.container, t, n), a = H.now(), s = (a - H.prevTime) / 1e3, c = o.speed * s;
    if (c >= 1) {
      const l = {
        x: H.x * c,
        y: H.y * c
      };
      if (l.x || l.y) {
        const u = Gn(r);
        v.window(r) ? r.scrollBy(l.x, l.y) : r && (r.scrollLeft += l.x, r.scrollTop += l.y);
        const d = Gn(r), f = {
          x: d.x - u.x,
          y: d.y - u.y
        };
        (f.x || f.y) && t.fire({
          type: "autoscroll",
          target: n,
          interactable: t,
          delta: f,
          interaction: e,
          container: r
        });
      }
      H.prevTime = a;
    }
    H.isScrolling && (ne.cancel(H.i), H.i = ne.request(H.scroll));
  },
  check(e, t) {
    var n;
    return (n = e.options[t].autoScroll) == null ? void 0 : n.enabled;
  },
  onInteractionMove(e) {
    let {
      interaction: t,
      pointer: n
    } = e;
    if (!(t.interacting() && H.check(t.interactable, t.prepared.name)))
      return;
    if (t.simulation) {
      H.x = H.y = 0;
      return;
    }
    let i, o, r, a;
    const {
      interactable: s,
      element: c
    } = t, l = t.prepared.name, u = s.options[l].autoScroll, d = Yn(u.container, s, c);
    if (v.window(d))
      a = n.clientX < H.margin, i = n.clientY < H.margin, o = n.clientX > d.innerWidth - H.margin, r = n.clientY > d.innerHeight - H.margin;
    else {
      const f = gn(d);
      a = n.clientX < f.left + H.margin, i = n.clientY < f.top + H.margin, o = n.clientX > f.right - H.margin, r = n.clientY > f.bottom - H.margin;
    }
    H.x = o ? 1 : a ? -1 : 0, H.y = r ? 1 : i ? -1 : 0, H.isScrolling || (H.margin = u.margin, H.speed = u.speed, H.start(t));
  }
};
function Yn(e, t, n) {
  return (v.string(e) ? Ci(e, t, n) : e) || Vt(n);
}
function Gn(e) {
  return v.window(e) && (e = window.document.body), {
    x: e.scrollLeft,
    y: e.scrollTop
  };
}
const Rr = {
  id: "auto-scroll",
  install: kr,
  listeners: {
    "interactions:new": (e) => {
      let {
        interaction: t
      } = e;
      t.autoScroll = null;
    },
    "interactions:destroy": (e) => {
      let {
        interaction: t
      } = e;
      t.autoScroll = null, H.stop(), H.interaction && (H.interaction = null);
    },
    "interactions:stop": H.stop,
    "interactions:action-move": (e) => H.onInteractionMove(e)
  }
};
Rt.use(Rr);
function Ar(e) {
  const {
    actions: t,
    Interactable: n,
    defaults: i
  } = e;
  n.prototype.draggable = xe.draggable, t.map.drag = xe, t.methodDict.drag = "draggable", i.actions.drag = xe.defaults;
}
function tn(e) {
  let {
    interaction: t
  } = e;
  if (t.prepared.name !== "drag") return;
  const n = t.prepared.axis;
  n === "x" ? (t.coords.cur.page.y = t.coords.start.page.y, t.coords.cur.client.y = t.coords.start.client.y, t.coords.velocity.client.y = 0, t.coords.velocity.page.y = 0) : n === "y" && (t.coords.cur.page.x = t.coords.start.page.x, t.coords.cur.client.x = t.coords.start.client.x, t.coords.velocity.client.x = 0, t.coords.velocity.page.x = 0);
}
function Un(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  if (n.prepared.name !== "drag") return;
  const i = n.prepared.axis;
  if (i === "x" || i === "y") {
    const o = i === "x" ? "y" : "x";
    t.page[o] = n.coords.start.page[o], t.client[o] = n.coords.start.client[o], t.delta[o] = 0;
  }
}
const Hr = function(t) {
  return v.object(t) ? (this.options.drag.enabled = t.enabled !== !1, this.setPerAction("drag", t), this.setOnEvents("drag", t), /^(xy|x|y|start)$/.test(t.lockAxis) && (this.options.drag.lockAxis = t.lockAxis), /^(xy|x|y)$/.test(t.startAxis) && (this.options.drag.startAxis = t.startAxis), this) : v.bool(t) ? (this.options.drag.enabled = t, this) : this.options.drag;
}, xe = {
  id: "actions/drag",
  install: Ar,
  listeners: {
    "interactions:before-action-move": tn,
    "interactions:action-resume": tn,
    // dragmove
    "interactions:action-move": Un,
    "auto-start:check": (e) => {
      const {
        interaction: t,
        interactable: n,
        buttons: i
      } = e, o = n.options.drag;
      if (!(!(o && o.enabled) || // check mouseButton setting if the pointer is down
      t.pointerIsDown && /mouse|pointer/.test(t.pointerType) && (i & n.options.drag.mouseButtons) === 0))
        return e.action = {
          name: "drag",
          axis: o.lockAxis === "start" ? o.startAxis : o.lockAxis
        }, !1;
    }
  },
  draggable: Hr,
  beforeMove: tn,
  move: Un,
  defaults: {
    startAxis: "xy",
    lockAxis: "xy"
  },
  getCursor() {
    return "move";
  },
  filterEventType: (e) => e.search("drag") === 0
};
Rt.use(xe);
function Lr(e) {
  const {
    actions: t,
    browser: n,
    Interactable: i,
    // tslint:disable-line no-shadowed-variable
    defaults: o
  } = e;
  kt.cursors = Nr(n), kt.defaultMargin = n.supportsTouch || n.supportsPointerEvent ? 20 : 10, i.prototype.resizable = function(r) {
    return Wr(this, r, e);
  }, t.map.resize = kt, t.methodDict.resize = "resizable", o.actions.resize = kt.defaults;
}
function Br(e) {
  const {
    interaction: t,
    interactable: n,
    element: i,
    rect: o,
    buttons: r
  } = e;
  if (!o)
    return;
  const a = R({}, t.coords.cur.page), s = n.options.resize;
  if (!(!(s && s.enabled) || // check mouseButton setting if the pointer is down
  t.pointerIsDown && /mouse|pointer/.test(t.pointerType) && (r & s.mouseButtons) === 0)) {
    if (v.object(s.edges)) {
      const c = {
        left: !1,
        right: !1,
        top: !1,
        bottom: !1
      };
      for (const l in c)
        c[l] = $r(l, s.edges[l], a, t._latestPointer.eventTarget, i, o, s.margin || kt.defaultMargin);
      c.left = c.left && !c.right, c.top = c.top && !c.bottom, (c.left || c.right || c.top || c.bottom) && (e.action = {
        name: "resize",
        edges: c
      });
    } else {
      const c = s.axis !== "y" && a.x > o.right - kt.defaultMargin, l = s.axis !== "x" && a.y > o.bottom - kt.defaultMargin;
      (c || l) && (e.action = {
        name: "resize",
        axes: (c ? "x" : "") + (l ? "y" : "")
      });
    }
    return e.action ? !1 : void 0;
  }
}
function Wr(e, t, n) {
  return v.object(t) ? (e.options.resize.enabled = t.enabled !== !1, e.setPerAction("resize", t), e.setOnEvents("resize", t), v.string(t.axis) && /^x$|^y$|^xy$/.test(t.axis) ? e.options.resize.axis = t.axis : t.axis === null && (e.options.resize.axis = n.defaults.actions.resize.axis), v.bool(t.preserveAspectRatio) ? e.options.resize.preserveAspectRatio = t.preserveAspectRatio : v.bool(t.square) && (e.options.resize.square = t.square), e) : v.bool(t) ? (e.options.resize.enabled = t, e) : e.options.resize;
}
function $r(e, t, n, i, o, r, a) {
  if (!t)
    return !1;
  if (t === !0) {
    const s = v.number(r.width) ? r.width : r.right - r.left, c = v.number(r.height) ? r.height : r.bottom - r.top;
    if (a = Math.min(a, Math.abs((e === "left" || e === "right" ? s : c) / 2)), s < 0 && (e === "left" ? e = "right" : e === "right" && (e = "left")), c < 0 && (e === "top" ? e = "bottom" : e === "bottom" && (e = "top")), e === "left") {
      const l = s >= 0 ? r.left : r.right;
      return n.x < l + a;
    }
    if (e === "top") {
      const l = c >= 0 ? r.top : r.bottom;
      return n.y < l + a;
    }
    if (e === "right")
      return n.x > (s >= 0 ? r.right : r.left) - a;
    if (e === "bottom")
      return n.y > (c >= 0 ? r.bottom : r.top) - a;
  }
  return v.element(i) ? v.element(t) ? (
    // the value is an element to use as a resize handle
    t === i
  ) : (
    // otherwise check if element matches value as selector
    an(i, t, o)
  ) : !1;
}
function Nr(e) {
  return e.isIe9 ? {
    x: "e-resize",
    y: "s-resize",
    xy: "se-resize",
    top: "n-resize",
    left: "w-resize",
    bottom: "s-resize",
    right: "e-resize",
    topleft: "se-resize",
    bottomright: "se-resize",
    topright: "ne-resize",
    bottomleft: "ne-resize"
  } : {
    x: "ew-resize",
    y: "ns-resize",
    xy: "nwse-resize",
    top: "ns-resize",
    left: "ew-resize",
    bottom: "ns-resize",
    right: "ew-resize",
    topleft: "nwse-resize",
    bottomright: "nwse-resize",
    topright: "nesw-resize",
    bottomleft: "nesw-resize"
  };
}
function Fr(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  if (n.prepared.name !== "resize" || !n.prepared.edges)
    return;
  const i = t, o = n.rect;
  n._rects = {
    start: R({}, o),
    corrected: R({}, o),
    previous: R({}, o),
    delta: {
      left: 0,
      right: 0,
      width: 0,
      top: 0,
      bottom: 0,
      height: 0
    }
  }, i.edges = n.prepared.edges, i.rect = n._rects.corrected, i.deltaRect = n._rects.delta;
}
function jr(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  if (n.prepared.name !== "resize" || !n.prepared.edges) return;
  const i = t, r = n.interactable.options.resize.invert, a = r === "reposition" || r === "negate", s = n.rect, {
    start: c,
    corrected: l,
    delta: u,
    previous: d
  } = n._rects;
  if (R(d, l), a) {
    if (R(l, s), r === "reposition") {
      if (l.top > l.bottom) {
        const f = l.top;
        l.top = l.bottom, l.bottom = f;
      }
      if (l.left > l.right) {
        const f = l.left;
        l.left = l.right, l.right = f;
      }
    }
  } else
    l.top = Math.min(s.top, c.bottom), l.bottom = Math.max(s.bottom, c.top), l.left = Math.min(s.left, c.right), l.right = Math.max(s.right, c.left);
  l.width = l.right - l.left, l.height = l.bottom - l.top;
  for (const f in l)
    u[f] = l[f] - d[f];
  i.edges = n.prepared.edges, i.rect = l, i.deltaRect = u;
}
function qr(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  if (n.prepared.name !== "resize" || !n.prepared.edges) return;
  const i = t;
  i.edges = n.prepared.edges, i.rect = n._rects.corrected, i.deltaRect = n._rects.delta;
}
function Vn(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  if (n.prepared.name !== "resize" || !n.resizeAxes) return;
  const i = n.interactable.options, o = t;
  i.resize.square ? (n.resizeAxes === "y" ? o.delta.x = o.delta.y : o.delta.y = o.delta.x, o.axes = "xy") : (o.axes = n.resizeAxes, n.resizeAxes === "x" ? o.delta.y = 0 : n.resizeAxes === "y" && (o.delta.x = 0));
}
const kt = {
  id: "actions/resize",
  before: ["actions/drag"],
  install: Lr,
  listeners: {
    "interactions:new": (e) => {
      let {
        interaction: t
      } = e;
      t.resizeAxes = "xy";
    },
    "interactions:action-start": (e) => {
      Fr(e), Vn(e);
    },
    "interactions:action-move": (e) => {
      jr(e), Vn(e);
    },
    "interactions:action-end": qr,
    "auto-start:check": Br
  },
  defaults: {
    square: !1,
    preserveAspectRatio: !1,
    axis: "xy",
    // use default margin
    margin: NaN,
    // object with props left, right, top, bottom which are
    // true/false values to resize when the pointer is over that edge,
    // CSS selectors to match the handles for each direction
    // or the Elements for each handle
    edges: null,
    // a value of 'none' will limit the resize rect to a minimum of 0x0
    // 'negate' will alow the rect to have negative width/height
    // 'reposition' will keep the width/height positive by swapping
    // the top and bottom edges and/or swapping the left and right edges
    invert: "none"
  },
  cursors: null,
  getCursor(e) {
    let {
      edges: t,
      axis: n,
      name: i
    } = e;
    const o = kt.cursors;
    let r = null;
    if (n)
      r = o[i + n];
    else if (t) {
      let a = "";
      for (const s of ["top", "bottom", "left", "right"])
        t[s] && (a += s);
      r = o[a];
    }
    return r;
  },
  filterEventType: (e) => e.search("resize") === 0,
  defaultMargin: null
};
Rt.use(kt);
var Xr = () => {
}, Yr = () => {
}, Gr = (e) => {
  const t = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter((i) => {
    let [o, r] = i;
    return o in e || r in e;
  }), n = (i, o) => {
    const {
      range: r,
      limits: a = {
        left: -1 / 0,
        right: 1 / 0,
        top: -1 / 0,
        bottom: 1 / 0
      },
      offset: s = {
        x: 0,
        y: 0
      }
    } = e, c = {
      range: r,
      grid: e,
      x: null,
      y: null
    };
    for (const [l, u] of t) {
      const d = Math.round((i - s.x) / e[l]), f = Math.round((o - s.y) / e[u]);
      c[l] = Math.max(a.left, Math.min(a.right, d * e[l] + s.x)), c[u] = Math.max(a.top, Math.min(a.bottom, f * e[u] + s.y));
    }
    return c;
  };
  return n.grid = e, n.coordFields = t, n;
}, Ur = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  edgeTarget: Xr,
  elements: Yr,
  grid: Gr
});
const Vr = {
  id: "snappers",
  install(e) {
    const {
      interactStatic: t
    } = e;
    t.snappers = R(t.snappers || {}, Ur), t.createSnapGrid = t.snappers.grid;
  }
};
class Oi {
  constructor(t) {
    this.states = [], this.startOffset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.startDelta = void 0, this.result = void 0, this.endResult = void 0, this.startEdges = void 0, this.edges = void 0, this.interaction = void 0, this.interaction = t, this.result = ye(), this.edges = {
      left: !1,
      right: !1,
      top: !1,
      bottom: !1
    };
  }
  start(t, n) {
    let {
      phase: i
    } = t;
    const {
      interaction: o
    } = this, r = Kr(o);
    this.prepareStates(r), this.startEdges = R({}, o.edges), this.edges = R({}, this.startEdges), this.startOffset = Jr(o.rect, n), this.startDelta = {
      x: 0,
      y: 0
    };
    const a = this.fillArg({
      phase: i,
      pageCoords: n,
      preEnd: !1
    });
    return this.result = ye(), this.startAll(a), this.result = this.setAll(a);
  }
  fillArg(t) {
    const {
      interaction: n
    } = this;
    return t.interaction = n, t.interactable = n.interactable, t.element = n.element, t.rect || (t.rect = n.rect), t.edges || (t.edges = this.startEdges), t.startOffset = this.startOffset, t;
  }
  startAll(t) {
    for (const n of this.states)
      n.methods.start && (t.state = n, n.methods.start(t));
  }
  setAll(t) {
    const {
      phase: n,
      preEnd: i,
      skipModifiers: o,
      rect: r,
      edges: a
    } = t;
    t.coords = R({}, t.pageCoords), t.rect = R({}, r), t.edges = R({}, a);
    const s = o ? this.states.slice(o) : this.states, c = ye(t.coords, t.rect);
    for (const f of s) {
      var l;
      const {
        options: g
      } = f, E = R({}, t.coords);
      let x = null;
      (l = f.methods) != null && l.set && this.shouldDo(g, i, n) && (t.state = f, x = f.methods.set(t), bn(t.edges, t.rect, {
        x: t.coords.x - E.x,
        y: t.coords.y - E.y
      })), c.eventProps.push(x);
    }
    R(this.edges, t.edges), c.delta.x = t.coords.x - t.pageCoords.x, c.delta.y = t.coords.y - t.pageCoords.y, c.rectDelta.left = t.rect.left - r.left, c.rectDelta.right = t.rect.right - r.right, c.rectDelta.top = t.rect.top - r.top, c.rectDelta.bottom = t.rect.bottom - r.bottom;
    const u = this.result.coords, d = this.result.rect;
    if (u && d) {
      const f = c.rect.left !== d.left || c.rect.right !== d.right || c.rect.top !== d.top || c.rect.bottom !== d.bottom;
      c.changed = f || u.x !== c.coords.x || u.y !== c.coords.y;
    }
    return c;
  }
  applyToInteraction(t) {
    const {
      interaction: n
    } = this, {
      phase: i
    } = t, o = n.coords.cur, r = n.coords.start, {
      result: a,
      startDelta: s
    } = this, c = a.delta;
    i === "start" && R(this.startDelta, a.delta);
    for (const [d, f] of [[r, s], [o, c]])
      d.page.x += f.x, d.page.y += f.y, d.client.x += f.x, d.client.y += f.y;
    const {
      rectDelta: l
    } = this.result, u = t.rect || n.rect;
    u.left += l.left, u.right += l.right, u.top += l.top, u.bottom += l.bottom, u.width = u.right - u.left, u.height = u.bottom - u.top;
  }
  setAndApply(t) {
    const {
      interaction: n
    } = this, {
      phase: i,
      preEnd: o,
      skipModifiers: r
    } = t, a = this.setAll(this.fillArg({
      preEnd: o,
      phase: i,
      pageCoords: t.modifiedCoords || n.coords.cur.page
    }));
    if (this.result = a, !a.changed && (!r || r < this.states.length) && n.interacting())
      return !1;
    if (t.modifiedCoords) {
      const {
        page: s
      } = n.coords.cur, c = {
        x: t.modifiedCoords.x - s.x,
        y: t.modifiedCoords.y - s.y
      };
      a.coords.x += c.x, a.coords.y += c.y, a.delta.x += c.x, a.delta.y += c.y;
    }
    this.applyToInteraction(t);
  }
  beforeEnd(t) {
    const {
      interaction: n,
      event: i
    } = t, o = this.states;
    if (!o || !o.length)
      return;
    let r = !1;
    for (const a of o) {
      t.state = a;
      const {
        options: s,
        methods: c
      } = a, l = c.beforeEnd && c.beforeEnd(t);
      if (l)
        return this.endResult = l, !1;
      r = r || !r && this.shouldDo(s, !0, t.phase, !0);
    }
    r && n.move({
      event: i,
      preEnd: !0
    });
  }
  stop(t) {
    const {
      interaction: n
    } = t;
    if (!this.states || !this.states.length)
      return;
    const i = R({
      states: this.states,
      interactable: n.interactable,
      element: n.element,
      rect: null
    }, t);
    this.fillArg(i);
    for (const o of this.states)
      i.state = o, o.methods.stop && o.methods.stop(i);
    this.states = null, this.endResult = null;
  }
  prepareStates(t) {
    this.states = [];
    for (let n = 0; n < t.length; n++) {
      const {
        options: i,
        methods: o,
        name: r
      } = t[n];
      this.states.push({
        options: i,
        methods: o,
        index: n,
        name: r
      });
    }
    return this.states;
  }
  restoreInteractionCoords(t) {
    let {
      interaction: {
        coords: n,
        rect: i,
        modification: o
      }
    } = t;
    if (!o.result) return;
    const {
      startDelta: r
    } = o, {
      delta: a,
      rectDelta: s
    } = o.result, c = [[n.start, r], [n.cur, a]];
    for (const [l, u] of c)
      l.page.x -= u.x, l.page.y -= u.y, l.client.x -= u.x, l.client.y -= u.y;
    i.left -= s.left, i.right -= s.right, i.top -= s.top, i.bottom -= s.bottom;
  }
  shouldDo(t, n, i, o) {
    return (
      // ignore disabled modifiers
      !(!t || t.enabled === !1 || // check if we require endOnly option to fire move before end
      o && !t.endOnly || // don't apply endOnly modifiers when not ending
      t.endOnly && !n || // check if modifier should run be applied on start
      i === "start" && !t.setStart)
    );
  }
  copyFrom(t) {
    this.startOffset = t.startOffset, this.startDelta = t.startDelta, this.startEdges = t.startEdges, this.edges = t.edges, this.states = t.states.map((n) => ie(n)), this.result = ye(R({}, t.result.coords), R({}, t.result.rect));
  }
  destroy() {
    for (const t in this)
      this[t] = null;
  }
}
function ye(e, t) {
  return {
    rect: t,
    coords: e,
    delta: {
      x: 0,
      y: 0
    },
    rectDelta: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventProps: [],
    changed: !0
  };
}
function Kr(e) {
  const t = e.interactable.options[e.prepared.name], n = t.modifiers;
  return n && n.length ? n : ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((i) => {
    const o = t[i];
    return o && o.enabled && {
      options: o,
      methods: o._methods
    };
  }).filter((i) => !!i);
}
function Jr(e, t) {
  return e ? {
    left: t.x - e.left,
    top: t.y - e.top,
    right: e.right - t.x,
    bottom: e.bottom - t.y
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
}
function Nt(e, t) {
  const {
    defaults: n
  } = e, i = {
    start: e.start,
    set: e.set,
    beforeEnd: e.beforeEnd,
    stop: e.stop
  }, o = (r) => {
    const a = r || {};
    a.enabled = a.enabled !== !1;
    for (const c in n)
      c in a || (a[c] = n[c]);
    const s = {
      options: a,
      methods: i,
      name: t,
      enable: () => (a.enabled = !0, s),
      disable: () => (a.enabled = !1, s)
    };
    return s;
  };
  return t && typeof t == "string" && (o._defaults = n, o._methods = i), o;
}
function en(e) {
  let {
    iEvent: t,
    interaction: n
  } = e;
  const i = n.modification.result;
  i && (t.modifiers = i.eventProps);
}
const Zr = {
  id: "modifiers/base",
  before: ["actions"],
  install: (e) => {
    e.defaults.perAction.modifiers = [];
  },
  listeners: {
    "interactions:new": (e) => {
      let {
        interaction: t
      } = e;
      t.modification = new Oi(t);
    },
    "interactions:before-action-start": (e) => {
      const {
        interaction: t
      } = e, n = e.interaction.modification;
      n.start(e, t.coords.start.page), t.edges = n.edges, n.applyToInteraction(e);
    },
    "interactions:before-action-move": (e) => {
      const {
        interaction: t
      } = e, {
        modification: n
      } = t, i = n.setAndApply(e);
      return t.edges = n.edges, i;
    },
    "interactions:before-action-end": (e) => {
      const {
        interaction: t
      } = e, {
        modification: n
      } = t, i = n.beforeEnd(e);
      return t.edges = n.startEdges, i;
    },
    "interactions:action-start": en,
    "interactions:action-move": en,
    "interactions:action-end": en,
    "interactions:after-action-start": (e) => e.interaction.modification.restoreInteractionCoords(e),
    "interactions:after-action-move": (e) => e.interaction.modification.restoreInteractionCoords(e),
    "interactions:stop": (e) => e.interaction.modification.stop(e)
  }
}, Qr = {
  start(e) {
    const {
      state: t,
      rect: n,
      edges: i,
      pageCoords: o
    } = e;
    let {
      ratio: r,
      enabled: a
    } = t.options;
    const {
      equalDelta: s,
      modifiers: c
    } = t.options;
    r === "preserve" && (r = n.width / n.height), t.startCoords = R({}, o), t.startRect = R({}, n), t.ratio = r, t.equalDelta = s;
    const l = t.linkedEdges = {
      top: i.top || i.left && !i.bottom,
      left: i.left || i.top && !i.right,
      bottom: i.bottom || i.right && !i.top,
      right: i.right || i.bottom && !i.left
    };
    if (t.xIsPrimaryAxis = !!(i.left || i.right), t.equalDelta) {
      const d = (l.left ? 1 : -1) * (l.top ? 1 : -1);
      t.edgeSign = {
        x: d,
        y: d
      };
    } else
      t.edgeSign = {
        x: l.left ? -1 : 1,
        y: l.top ? -1 : 1
      };
    if (a !== !1 && R(i, l), !(c != null && c.length)) return;
    const u = new Oi(e.interaction);
    u.copyFrom(e.interaction.modification), u.prepareStates(c), t.subModification = u, u.startAll({
      ...e
    });
  },
  set(e) {
    const {
      state: t,
      rect: n,
      coords: i
    } = e, {
      linkedEdges: o
    } = t, r = R({}, i), a = t.equalDelta ? ts : es;
    if (R(e.edges, o), a(t, t.xIsPrimaryAxis, i, n), !t.subModification)
      return null;
    const s = R({}, n);
    bn(o, s, {
      x: i.x - r.x,
      y: i.y - r.y
    });
    const c = t.subModification.setAll({
      ...e,
      rect: s,
      edges: o,
      pageCoords: i,
      prevCoords: i,
      prevRect: s
    }), {
      delta: l
    } = c;
    if (c.changed) {
      const u = Math.abs(l.x) > Math.abs(l.y);
      a(t, u, c.coords, c.rect), R(i, c.coords);
    }
    return c.eventProps;
  },
  defaults: {
    ratio: "preserve",
    equalDelta: !1,
    modifiers: [],
    enabled: !1
  }
};
function ts(e, t, n) {
  let {
    startCoords: i,
    edgeSign: o
  } = e;
  t ? n.y = i.y + (n.x - i.x) * o.y : n.x = i.x + (n.y - i.y) * o.x;
}
function es(e, t, n, i) {
  let {
    startRect: o,
    startCoords: r,
    ratio: a,
    edgeSign: s
  } = e;
  if (t) {
    const c = i.width / a;
    n.y = r.y + (c - o.height) * s.y;
  } else {
    const c = i.height * a;
    n.x = r.x + (c - o.width) * s.x;
  }
}
var ns = Nt(Qr, "aspectRatio");
function is(e) {
  let {
    rect: t,
    startOffset: n,
    state: i,
    interaction: o,
    pageCoords: r
  } = e;
  const {
    options: a
  } = i, {
    elementRect: s
  } = a, c = R({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }, a.offset || {});
  if (t && s) {
    const l = Jt(a.restriction, o, r);
    if (l) {
      const u = l.right - l.left - t.width, d = l.bottom - l.top - t.height;
      u < 0 && (c.left += u, c.right += u), d < 0 && (c.top += d, c.bottom += d);
    }
    c.left += n.left - t.width * s.left, c.top += n.top - t.height * s.top, c.right += n.right - t.width * (1 - s.right), c.bottom += n.bottom - t.height * (1 - s.bottom);
  }
  i.offset = c;
}
function os(e) {
  let {
    coords: t,
    interaction: n,
    state: i
  } = e;
  const {
    options: o,
    offset: r
  } = i, a = Jt(o.restriction, n, t);
  if (!a) return;
  const s = br(a);
  t.x = Math.max(Math.min(s.right - r.right, t.x), s.left + r.left), t.y = Math.max(Math.min(s.bottom - r.bottom, t.y), s.top + r.top);
}
function Jt(e, t, n) {
  return v.func(e) ? de(e, t.interactable, t.element, [n.x, n.y, t]) : de(e, t.interactable, t.element);
}
const rs = {
  restriction: null,
  elementRect: null,
  offset: null,
  endOnly: !1,
  enabled: !1
}, Ie = {
  start: is,
  set: os,
  defaults: rs
};
var ss = Nt(Ie, "restrict");
const ki = {
  top: 1 / 0,
  left: 1 / 0,
  bottom: -1 / 0,
  right: -1 / 0
}, Ri = {
  top: -1 / 0,
  left: -1 / 0,
  bottom: 1 / 0,
  right: 1 / 0
};
function as(e) {
  let {
    interaction: t,
    startOffset: n,
    state: i
  } = e;
  const {
    options: o
  } = i;
  let r;
  if (o) {
    const a = Jt(o.offset, t, t.coords.start.page);
    r = ke(a);
  }
  r = r || {
    x: 0,
    y: 0
  }, i.offset = {
    top: r.y + n.top,
    left: r.x + n.left,
    bottom: r.y - n.bottom,
    right: r.x - n.right
  };
}
function ls(e) {
  let {
    coords: t,
    edges: n,
    interaction: i,
    state: o
  } = e;
  const {
    offset: r,
    options: a
  } = o;
  if (!n)
    return;
  const s = R({}, t), c = Jt(a.inner, i, s) || {}, l = Jt(a.outer, i, s) || {};
  Kn(c, ki), Kn(l, Ri), n.top ? t.y = Math.min(Math.max(l.top + r.top, s.y), c.top + r.top) : n.bottom && (t.y = Math.max(Math.min(l.bottom + r.bottom, s.y), c.bottom + r.bottom)), n.left ? t.x = Math.min(Math.max(l.left + r.left, s.x), c.left + r.left) : n.right && (t.x = Math.max(Math.min(l.right + r.right, s.x), c.right + r.right));
}
function Kn(e, t) {
  for (const n of ["top", "left", "bottom", "right"])
    n in e || (e[n] = t[n]);
  return e;
}
const cs = {
  inner: null,
  outer: null,
  offset: null,
  endOnly: !1,
  enabled: !1
}, ae = {
  noInner: ki,
  noOuter: Ri,
  start: as,
  set: ls,
  defaults: cs
};
var us = Nt(ae, "restrictEdges");
const fs = R({
  get elementRect() {
    return {
      top: 0,
      left: 0,
      bottom: 1,
      right: 1
    };
  },
  set elementRect(e) {
  }
}, Ie.defaults), ds = {
  start: Ie.start,
  set: Ie.set,
  defaults: fs
};
var hs = Nt(ds, "restrictRect");
const ps = {
  width: -1 / 0,
  height: -1 / 0
}, gs = {
  width: 1 / 0,
  height: 1 / 0
};
function vs(e) {
  return ae.start(e);
}
function ms(e) {
  const {
    interaction: t,
    state: n,
    rect: i,
    edges: o
  } = e, {
    options: r
  } = n;
  if (!o)
    return;
  const a = Fn(Jt(r.min, t, e.coords)) || ps, s = Fn(Jt(r.max, t, e.coords)) || gs;
  n.options = {
    endOnly: r.endOnly,
    inner: R({}, ae.noInner),
    outer: R({}, ae.noOuter)
  }, o.top ? (n.options.inner.top = i.bottom - a.height, n.options.outer.top = i.bottom - s.height) : o.bottom && (n.options.inner.bottom = i.top + a.height, n.options.outer.bottom = i.top + s.height), o.left ? (n.options.inner.left = i.right - a.width, n.options.outer.left = i.right - s.width) : o.right && (n.options.inner.right = i.left + a.width, n.options.outer.right = i.left + s.width), ae.set(e), n.options = r;
}
const ys = {
  min: null,
  max: null,
  endOnly: !1,
  enabled: !1
}, bs = {
  start: vs,
  set: ms,
  defaults: ys
};
var xs = Nt(bs, "restrictSize");
function ws(e) {
  const {
    interaction: t,
    interactable: n,
    element: i,
    rect: o,
    state: r,
    startOffset: a
  } = e, {
    options: s
  } = r, c = s.offsetWithOrigin ? Ss(e) : {
    x: 0,
    y: 0
  };
  let l;
  if (s.offset === "startCoords")
    l = {
      x: t.coords.start.page.x,
      y: t.coords.start.page.y
    };
  else {
    const d = de(s.offset, n, i, [t]);
    l = ke(d) || {
      x: 0,
      y: 0
    }, l.x += c.x, l.y += c.y;
  }
  const {
    relativePoints: u
  } = s;
  r.offsets = o && u && u.length ? u.map((d, f) => ({
    index: f,
    relativePoint: d,
    x: a.left - o.width * d.x + l.x,
    y: a.top - o.height * d.y + l.y
  })) : [{
    index: 0,
    relativePoint: null,
    x: l.x,
    y: l.y
  }];
}
function Es(e) {
  const {
    interaction: t,
    coords: n,
    state: i
  } = e, {
    options: o,
    offsets: r
  } = i, a = xn(t.interactable, t.element, t.prepared.name), s = R({}, n), c = [];
  o.offsetWithOrigin || (s.x -= a.x, s.y -= a.y);
  for (const u of r) {
    const d = s.x - u.x, f = s.y - u.y;
    for (let g = 0, E = o.targets.length; g < E; g++) {
      const x = o.targets[g];
      let m;
      v.func(x) ? m = x(d, f, t._proxy, u, g) : m = x, m && c.push({
        x: (v.number(m.x) ? m.x : d) + u.x,
        y: (v.number(m.y) ? m.y : f) + u.y,
        range: v.number(m.range) ? m.range : o.range,
        source: x,
        index: g,
        offset: u
      });
    }
  }
  const l = {
    target: null,
    inRange: !1,
    distance: 0,
    range: 0,
    delta: {
      x: 0,
      y: 0
    }
  };
  for (const u of c) {
    const d = u.range, f = u.x - s.x, g = u.y - s.y, E = Oe(f, g);
    let x = E <= d;
    d === 1 / 0 && l.inRange && l.range !== 1 / 0 && (x = !1), (!l.target || (x ? (
      // is the closest target in range?
      l.inRange && d !== 1 / 0 ? (
        // the pointer is relatively deeper in this target
        E / d < l.distance / l.range
      ) : (
        // this target has Infinite range and the closest doesn't
        d === 1 / 0 && l.range !== 1 / 0 || // OR this target is closer that the previous closest
        E < l.distance
      )
    ) : (
      // The other is not in range and the pointer is closer to this target
      !l.inRange && E < l.distance
    ))) && (l.target = u, l.distance = E, l.range = d, l.inRange = x, l.delta.x = f, l.delta.y = g);
  }
  return l.inRange && (n.x = l.target.x, n.y = l.target.y), i.closest = l, l;
}
function Ss(e) {
  const {
    element: t
  } = e.interaction;
  return ke(de(e.state.options.origin, null, null, [t])) || xn(e.interactable, t, e.interaction.prepared.name);
}
const Is = {
  range: 1 / 0,
  targets: null,
  offset: null,
  offsetWithOrigin: !0,
  origin: null,
  relativePoints: null,
  endOnly: !1,
  enabled: !1
}, En = {
  start: ws,
  set: Es,
  defaults: Is
};
var _s = Nt(En, "snap");
function Cs(e) {
  const {
    state: t,
    edges: n
  } = e, {
    options: i
  } = t;
  if (!n)
    return null;
  e.state = {
    options: {
      targets: null,
      relativePoints: [{
        x: n.left ? 0 : 1,
        y: n.top ? 0 : 1
      }],
      offset: i.offset || "self",
      origin: {
        x: 0,
        y: 0
      },
      range: i.range
    }
  }, t.targetFields = t.targetFields || [["width", "height"], ["x", "y"]], En.start(e), t.offsets = e.state.offsets, e.state = t;
}
function Ts(e) {
  const {
    interaction: t,
    state: n,
    coords: i
  } = e, {
    options: o,
    offsets: r
  } = n, a = {
    x: i.x - r[0].x,
    y: i.y - r[0].y
  };
  n.options = R({}, o), n.options.targets = [];
  for (const c of o.targets || []) {
    let l;
    if (v.func(c) ? l = c(a.x, a.y, t) : l = c, !!l) {
      for (const [u, d] of n.targetFields)
        if (u in l || d in l) {
          l.x = l[u], l.y = l[d];
          break;
        }
      n.options.targets.push(l);
    }
  }
  const s = En.set(e);
  return n.options = o, s;
}
const zs = {
  range: 1 / 0,
  targets: null,
  offset: null,
  endOnly: !1,
  enabled: !1
}, _e = {
  start: Cs,
  set: Ts,
  defaults: zs
};
var Ms = Nt(_e, "snapSize");
function Ds(e) {
  const {
    edges: t
  } = e;
  return t ? (e.state.targetFields = e.state.targetFields || [[t.left ? "left" : "right", t.top ? "top" : "bottom"]], _e.start(e)) : null;
}
const Ps = {
  start: Ds,
  set: _e.set,
  defaults: R(ie(_e.defaults), {
    targets: void 0,
    range: void 0,
    offset: {
      x: 0,
      y: 0
    }
  })
};
var Os = Nt(Ps, "snapEdges");
const se = () => {
};
se._defaults = {};
var nn = {
  aspectRatio: ns,
  restrictEdges: us,
  restrict: ss,
  restrictRect: hs,
  restrictSize: xs,
  snapEdges: Os,
  snap: _s,
  snapSize: Ms,
  spring: se,
  avoid: se,
  transform: se,
  rubberband: se
};
const ks = {
  id: "modifiers",
  install(e) {
    const {
      interactStatic: t
    } = e;
    e.usePlugin(Zr), e.usePlugin(Vr), t.modifiers = nn;
    for (const n in nn) {
      const {
        _defaults: i,
        _methods: o
      } = nn[n];
      i._methods = o, e.defaults.perAction[n] = i;
    }
  }
};
Rt.use(ks);
var le = /* @__PURE__ */ (function(e) {
  return e.touchAction = "touchAction", e.boxSizing = "boxSizing", e.noListeners = "noListeners", e;
})(le || {});
const un = "[interact.js] ", fn = {
  touchAction: "https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",
  boxSizing: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
};
function Rs(e) {
  let {
    logger: t
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    Interactable: n,
    defaults: i
  } = e;
  e.logger = t || console, i.base.devTools = {
    ignore: {}
  }, n.prototype.devTools = function(r) {
    return r ? (R(this.options.devTools, r), this) : this.options.devTools;
  };
  const {
    _onOff: o
  } = n.prototype;
  n.prototype._onOff = function(r, a, s, c, l) {
    if (v.string(this.target) || this.target.addEventListener)
      return o.call(this, r, a, s, c, l);
    v.object(a) && !v.array(a) && (c = s, s = null);
    const u = Ut(a, s, l);
    for (const d in u)
      he(d, e.actions) || e.logger.warn(un + `Can't add native "${d}" event listener to target without \`addEventListener(type, listener, options)\` prop.`);
    return o.call(this, r, u, c);
  };
}
const Jn = [{
  name: le.touchAction,
  perform(e) {
    let {
      element: t
    } = e;
    return !!t && !As(t, "touchAction", /pan-|pinch|none/);
  },
  getInfo(e) {
    let {
      element: t
    } = e;
    return [t, fn.touchAction];
  },
  text: `Consider adding CSS "touch-action: none" to this element
`
}, {
  name: le.boxSizing,
  perform(e) {
    const {
      element: t
    } = e;
    return e.prepared.name === "resize" && t instanceof nt.HTMLElement && !Ai(t, "boxSizing", /border-box/);
  },
  text: 'Consider adding CSS "box-sizing: border-box" to this resizable element',
  getInfo(e) {
    let {
      element: t
    } = e;
    return [t, fn.boxSizing];
  }
}, {
  name: le.noListeners,
  perform(e) {
    var t;
    const n = e.prepared.name;
    return !(((t = e.interactable) == null ? void 0 : t.events.types[`${n}move`]) || []).length;
  },
  getInfo(e) {
    return [e.prepared.name, e.interactable];
  },
  text: "There are no listeners set for this action"
}];
function Ai(e, t, n) {
  const i = e.style[t] || Wt.getComputedStyle(e)[t];
  return n.test((i || "").toString());
}
function As(e, t, n) {
  let i = e;
  for (; v.element(i); ) {
    if (Ai(i, t, n))
      return !0;
    i = $t(i);
  }
  return !1;
}
const Hs = "dev-tools", Ls = {
  id: Hs,
  install: Rs,
  listeners: {
    "interactions:action-start": (e, t) => {
      let {
        interaction: n
      } = e;
      for (const i of Jn) {
        const o = n.interactable && n.interactable.options;
        !(o && o.devTools && o.devTools.ignore[i.name]) && i.perform(n) && t.logger.warn(un + i.text, ...i.getInfo(n));
      }
    }
  },
  checks: Jn,
  CheckName: le,
  links: fn,
  prefix: un
};
Rt.use(Ls);
let Hi = "auto";
function Li() {
  return typeof document < "u";
}
function Bi() {
  return typeof window < "u";
}
function Zn() {
  return Li() ? typeof document.dir < "u" ? document.dir : document.getElementsByTagName("html")[0].getAttribute("dir") || "auto" : Hi;
}
function Da(e) {
  return Li ? (document.getElementsByTagName("html")[0].setAttribute("dir", e), !0) : (Hi = e, !1);
}
function Bs(e, t) {
  return Bi ? (window.addEventListener(e, t), !0) : (t(), !1);
}
function Ws(e, t) {
  Bi && window.removeEventListener(e, t);
}
function Pa(e, t, n, i) {
  const o = $s(e, t, n);
  console.log(o);
  const r = Math.round((i + n) / (o + n));
  return Math.max(1, Math.min(r, t));
}
function Oa(e, t, n) {
  return Math.round((n + t) / (e + t));
}
const $s = (e, t, n) => {
  const i = (t - 1) * n;
  return (e - i - n * 2) / t;
};
function ka(e, t, n, i, o, r, a, s, c) {
  if (e < 0 || e + n > a)
    return !1;
  const l = (t + i) * (s + c) + c;
  return !(t < 0 || l > r);
}
function Qn(e) {
  return Ns(e);
}
function Ns(e) {
  const t = e.target, n = t.offsetParent || document.body, i = t.offsetParent === document.body ? { left: 0, top: 0 } : n.getBoundingClientRect(), o = e.clientX + n.scrollLeft - i.left, r = e.clientY + n.scrollTop - i.top;
  return { x: o, y: r };
}
function ti(e, t, n, i) {
  return Fs(e) ? {
    deltaX: n - e,
    deltaY: i - t,
    lastX: e,
    lastY: t,
    x: n,
    y: i
  } : {
    deltaX: 0,
    deltaY: 0,
    lastX: n,
    lastY: i,
    x: n,
    y: i
  };
}
function Fs(e) {
  return typeof e == "number" && !isNaN(e);
}
function ei(e) {
  let t = 0, n;
  for (let i = 0, o = e.length; i < o; i++)
    n = e[i].y + e[i].h, n > t && (t = n);
  return t;
}
function js(e, t) {
  const n = new Array(t).fill(0);
  for (const i of e) {
    const o = i.x, r = Math.min(i.x + i.w, t), a = i.y + i.h;
    for (let s = o; s < r; s++)
      n[s] = Math.max(n[s], a);
  }
  return n;
}
function qs(e, t, n, i) {
  const o = js(e, n), r = Math.min(t.w, n);
  let a = null, s = 1 / 0;
  for (let c = 0; c <= n - r; c++) {
    let l = 0;
    for (let f = c; f < c + r; f++)
      l = Math.max(l, o[f]);
    const u = l;
    if (u + t.h > i)
      continue;
    const d = { ...t, x: c, y: u };
    Xs(e, d) || u < s && (s = u, a = { x: c, y: u });
  }
  return a;
}
function Xs(e, t) {
  return e.some(
    (n) => n.i !== t.i && Sn(n, t)
  );
}
function Ys(e, t, n, i) {
  const o = qs(e, t, n, i);
  if (o) {
    const r = { ...t, x: o.x, y: o.y };
    return {
      layout: [...e, r],
      success: !0
    };
  }
  return {
    layout: e,
    success: !1
  };
}
function Ce(e) {
  const t = Array(e.length);
  for (let n = 0, i = e.length; n < i; n++)
    t[n] = Gs(e[n]);
  return t;
}
function Gs(e) {
  return JSON.parse(JSON.stringify(e));
}
function Sn(e, t) {
  return !(e === t || e.x + e.w <= t.x || e.x >= t.x + t.w || e.y + e.h <= t.y || e.y >= t.y + t.h);
}
function Dt(e, t, n) {
  const i = Ni(e), o = qi(e), r = Array(e.length);
  for (let a = 0, s = o.length; a < s; a++) {
    let c = o[a];
    c.static || (c = Us(i, c, t, n), i.push(c)), r[e.indexOf(c)] = c, c.moved = !1;
  }
  return r;
}
function Us(e, t, n, i) {
  if (n)
    for (; t.y > 0 && !ce(e, t); )
      t.y--;
  else if (i) {
    const r = i[t.i].y;
    for (; t.y > r && !ce(e, t); )
      t.y--;
  }
  let o;
  for (; o = ce(e, t); )
    t.y = o.y + o.h;
  return t;
}
function Wi(e, t) {
  const n = Ni(e);
  for (let i = 0, o = e.length; i < o; i++) {
    const r = e[i];
    if (r.x + r.w > t.cols && (r.x = t.cols - r.w), r.x < 0 && (r.x = 0, r.w = t.cols), !r.static) n.push(r);
    else
      for (; ce(n, r); )
        r.y++;
  }
  return e;
}
function ni(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    if (e[n].i === t) return e[n];
}
function ce(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    if (Sn(e[n], t)) return e[n];
}
function $i(e, t) {
  return e.filter((n) => Sn(n, t));
}
function Ni(e) {
  return e.filter((t) => t.static);
}
function Te(e, t, n, i, o, r) {
  if (t.static) return e;
  const a = t.x, s = t.y, c = i && t.y > i;
  typeof n == "number" && (t.x = n), typeof i == "number" && (t.y = i), t.moved = !0;
  let l = qi(e);
  c && (l = l.reverse());
  const u = $i(l, t);
  if (r && u.length)
    return t.x = a, t.y = s, t.moved = !1, e;
  for (let d = 0, f = u.length; d < f; d++) {
    const g = u[d];
    g.moved || t.y > g.y && t.y - g.y > g.h / 4 || (g.static ? e = ii(e, g, t, o) : e = ii(e, t, g, o));
  }
  return e;
}
function ii(e, t, n, i) {
  if (i) {
    const r = {
      x: n.x,
      y: n.y,
      w: n.w,
      h: n.h
    };
    if (r.y = Math.max(t.y - n.h, 0), !ce(e, r))
      return Te(e, n, void 0, r.y, !1);
  }
  return Te(e, n, void 0, n.y + 1, !1);
}
function Fi(e, t, n) {
  return !(e.x < 0 || e.x + e.w > t || e.y < 0 || n && e.y + e.h > n);
}
function Ra(e, t, n) {
  const i = { ...e };
  return i.x = Math.max(0, Math.min(i.x, t - i.w)), i.x + i.w > t && (i.w = t - i.x), i.y = Math.max(0, i.y), n && i.y + i.h > n && (i.h = n - i.y), i;
}
function ji(e, t, n, i) {
  const o = e.map(
    (a) => a.i === t.i ? { ...t } : { ...a }
  ), r = Dt(o, !0);
  for (const a of r)
    if (!Fi(a, n, i))
      return !0;
  return !1;
}
function Vs(e, t, n, i, o, r, a, s) {
  if (t.static) return e;
  const c = { ...t };
  return typeof n == "number" && (c.x = n), typeof i == "number" && (c.y = i), r && ji(e, c, o, r) ? e : Te(e, t, n, i, a, s);
}
function Ks(e, t, n, i, o, r) {
  const a = { ...t, w: n, h: i };
  return !(!Fi(a, o, r) || r && ji(e, a, o, r));
}
function Aa(e) {
  return e * 100 + "%";
}
function Js(e, t, n, i) {
  const o = "translate3d(" + t + "px," + e + "px, 0)";
  return {
    transform: o,
    WebkitTransform: o,
    MozTransform: o,
    msTransform: o,
    OTransform: o,
    width: n + "px",
    height: i + "px",
    position: "absolute"
  };
}
function Zs(e, t, n, i) {
  const o = "translate3d(" + t * -1 + "px," + e + "px, 0)";
  return {
    transform: o,
    WebkitTransform: o,
    MozTransform: o,
    msTransform: o,
    OTransform: o,
    width: n + "px",
    height: i + "px",
    position: "absolute"
  };
}
function Qs(e, t, n, i) {
  return {
    top: e + "px",
    left: t + "px",
    width: n + "px",
    height: i + "px",
    position: "absolute"
  };
}
function ta(e, t, n, i) {
  return {
    top: e + "px",
    right: t + "px",
    width: n + "px",
    height: i + "px",
    position: "absolute"
  };
}
function qi(e) {
  return [].concat(e).sort(function(n, i) {
    return n.y === i.y && n.x === i.x ? 0 : n.y > i.y || n.y === i.y && n.x > i.x ? 1 : -1;
  });
}
function ea(e, t) {
  t = t || "Layout";
  const n = ["x", "y", "w", "h"], i = [];
  if (!Array.isArray(e)) throw new Error(t + " must be an array!");
  for (let o = 0, r = e.length; o < r; o++) {
    const a = e[o];
    for (let s = 0; s < n.length; s++)
      if (typeof a[n[s]] != "number")
        throw new Error(
          "VueGridLayout: " + t + "[" + o + "]." + n[s] + " must be a number!"
        );
    if (a.i === void 0 || a.i === null)
      throw new Error("VueGridLayout: " + t + "[" + o + "].i cannot be null!");
    if (typeof a.i != "number" && typeof a.i != "string")
      throw new Error("VueGridLayout: " + t + "[" + o + "].i must be a string or number!");
    if (i.indexOf(a.i) >= 0)
      throw new Error("VueGridLayout: " + t + "[" + o + "].i must be unique!");
    if (i.push(a.i), a.static !== void 0 && typeof a.static != "boolean")
      throw new Error("VueGridLayout: " + t + "[" + o + "].static must be a boolean!");
  }
}
function Ha(e, t) {
  t.forEach((n) => e[n] = e[n].bind(e));
}
function La(e) {
  const t = Object.keys(e);
  if (!t.length) return "";
  let n;
  const i = t.length;
  let o = "";
  for (n = 0; n < i; n++) {
    const r = t[n], a = e[r];
    o += ra(r) + ":" + ia(r, a) + ";";
  }
  return o;
}
const na = {
  animationIterationCount: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridRow: !0,
  gridColumn: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  // SVG-related properties
  fillOpacity: !0,
  stopOpacity: !0,
  strokeDashoffset: !0,
  strokeOpacity: !0,
  strokeWidth: !0
};
function ia(e, t) {
  return typeof t == "number" && !na[e] ? t + "px" : t;
}
const oa = /([a-z\d])([A-Z])/g;
function ra(e) {
  return e.replace(oa, "$1-$2").toLowerCase();
}
function Ba(e, t, n) {
  for (let i = 0; i < e.length; i++) if (e[i][t] == n) return !0;
  return !1;
}
function Wa(e, t, n) {
  e.forEach(function(i, o) {
    i[t] === n && e.splice(o, 1);
  });
}
function sa(e, t) {
  const n = Xi(e);
  let i = n[0];
  for (let o = 1, r = n.length; o < r; o++) {
    const a = n[o];
    t > e[a] && (i = a);
  }
  return i;
}
function dn(e, t) {
  if (!t[e])
    throw new Error(
      "ResponsiveGridLayout: `cols` entry for breakpoint " + e + " is missing!"
    );
  return t[e];
}
function aa(e, t, n, i, o, r, a) {
  if (t[i]) return Ce(t[i]);
  let s = e;
  const c = Xi(n), l = c.slice(c.indexOf(i));
  for (let u = 0, d = l.length; u < d; u++) {
    const f = l[u];
    if (t[f]) {
      s = t[f];
      break;
    }
  }
  return s = Ce(s || []), Dt(Wi(s, { cols: r }), a);
}
function $a(e, t, n, i, o, r) {
  return e = Ce(e || []), Dt(Wi(e, { cols: o }), r);
}
function Xi(e) {
  return Object.keys(e).sort(function(n, i) {
    return e[n] - e[i];
  });
}
function la() {
  const { appContext: e, proxy: t } = Ji(), n = e.config.globalProperties;
  return {
    proxy: t,
    appContext: e,
    globalProperties: n
  };
}
const ca = /* @__PURE__ */ ze({
  __name: "GridItem",
  props: {
    isDraggable: { type: [Boolean, null], default: null },
    isResizable: { type: [Boolean, null], default: null },
    isBounded: { type: [Boolean, null], default: null },
    static: { type: Boolean, default: !1 },
    minH: { default: 1 },
    minW: { default: 1 },
    maxH: { default: 1 / 0 },
    maxW: { default: 1 / 0 },
    x: {},
    y: {},
    w: {},
    h: {},
    i: {},
    selected: { type: Boolean, default: !1 },
    selectedItems: { default: () => [] },
    dragIgnoreFrom: { default: "a, button" },
    dragAllowFrom: { default: null },
    resizeIgnoreFrom: { default: "a, button" },
    preserveAspectRatio: { type: Boolean, default: !1 },
    dragOption: { default: () => ({}) },
    resizeOption: { default: () => ({}) }
  },
  emits: ["container-resized", "resize", "resized", "move", "moved", "dragging", "dragend", "remove"],
  setup(e, { expose: t, emit: n }) {
    const { proxy: i } = la(), o = i?.$parent, r = Zi("eventBus"), a = n, s = e, c = k({}), l = k(1), u = k(100), d = k(30), f = k([10, 10]), g = k(1 / 0), E = k(null), x = k(null), m = k(1), O = k(!0), T = k(!0), M = k(!1), z = k(null), b = k(!1), p = k(null), $ = k(NaN), _ = k(NaN), F = k(NaN), tt = k(NaN), K = k({}), at = k(!1), U = k(!1), ut = k(!1), lt = k(null), vt = k(null), J = k(null), et = k(null), Z = k(s.x), w = k(s.y), P = k(s.w), A = k(s.h), q = k(null), W = k(null), X = Bt(() => x.value && !s.static), D = Bt(() => o?.isMirrored ? !at.value : at.value), Q = Bt(() => ({
      resizable: X.value,
      static: s.static,
      "grid-item-selected": s.selected,
      resizing: b.value,
      "draggable-dragging": M.value,
      cssTransforms: O.value,
      "render-rtl": D.value,
      "disable-userselect": M.value
    })), V = Bt(() => D.value ? "resizable-handle rtl-resizable-handle" : "resizable-handle");
    G(
      () => s.isDraggable,
      (h) => {
        E.value = h;
      }
    ), G(
      () => s.static,
      () => {
        ve(), gt();
      }
    ), G(E, () => {
      ve();
    }), G(
      () => s.isResizable,
      (h) => {
        x.value = h;
      }
    ), G(
      () => s.isBounded,
      (h) => {
        q.value = h;
      }
    ), G(x, () => {
      gt();
    }), G(d, () => {
      ot(), bt();
    }), G(l, () => {
      gt(), ot(), bt();
    }), G(
      () => s.x,
      (h) => {
        Z.value = h, ot();
      }
    ), G(
      () => s.y,
      (h) => {
        w.value = h, ot();
      }
    ), G(
      () => s.h,
      (h) => {
        A.value = h, ot();
      }
    ), G(
      () => s.w,
      (h) => {
        P.value = h, ot();
      }
    ), G(D, () => {
      gt(), ot();
    }), G(
      () => s.minH,
      () => {
        gt();
      }
    ), G(
      () => s.maxH,
      () => {
        gt();
      }
    ), G(
      () => s.minW,
      () => {
        gt();
      }
    ), G(
      () => s.maxW,
      () => {
        gt();
      }
    ), G(
      () => o?.margin,
      (h) => {
        !h || h[0] == f.value[0] && h[1] == f.value[1] || (f.value = h.map((I) => Number(I)), ot(), bt());
      }
    );
    const dt = (h) => {
      Ae(h);
    }, S = (h) => {
      Ft();
    }, L = (h) => {
      s.isDraggable === null && (E.value = h);
    }, j = (h) => {
      s.isResizable === null && (x.value = h);
    }, ht = (h) => {
      s.isBounded === null && (q.value = h);
    }, mt = (h) => {
      m.value = h;
    }, _t = (h) => {
      d.value = h;
    }, Ct = (h) => {
      g.value = h;
    }, ft = () => {
      at.value = Zn() === "rtl", Ft();
    }, Y = (h) => {
      const I = h.toString();
      l.value = parseInt(I);
    };
    r.on("updateWidth", dt), r.on("compact", S), r.on("setDraggable", L), r.on("setResizable", j), r.on("setBounded", ht), r.on("setTransformScale", mt), r.on("setRowHeight", _t), r.on("setMaxRows", Ct), r.on("directionchange", ft), r.on("setColNum", Y), at.value = Zn() === "rtl", oi(() => {
      r.off("updateWidth", dt), r.off("compact", S), r.off("setDraggable", L), r.off("setResizable", j), r.off("setBounded", ht), r.off("setTransformScale", mt), r.off("setRowHeight", _t), r.off("setMaxRows", Ct), r.off("directionchange", ft), r.off("setColNum", Y), W.value && W.value.unset();
    }), ri(() => {
      o?.responsive && o.lastBreakpoint ? l.value = dn(o.lastBreakpoint, o?.cols) : l.value = o?.colNum, d.value = o?.rowHeight, u.value = o?.width !== null ? o?.width : 100, f.value = o?.margin !== void 0 ? o.margin : [10, 10], g.value = o?.maxRows, s.isDraggable === null ? E.value = o?.isDraggable : E.value = s.isDraggable, s.isResizable === null ? x.value = o?.isResizable : x.value = s.isResizable, s.isBounded === null ? q.value = o?.isBounded : q.value = s.isBounded, m.value = o?.transformScale, O.value = o?.useCssTransforms, T.value = o?.useStyleCursor, ot();
    });
    const ot = () => {
      s.x + s.w > l.value ? (Z.value = 0, P.value = s.w > l.value ? l.value : s.w) : (Z.value = s.x, P.value = s.w);
      let h = Et(Z.value, w.value, P.value, A.value);
      M.value && (h.top = z.value?.top, D.value ? h.right = z.value?.left : h.left = z.value?.left), b.value && (h.width = p.value?.width, h.height = p.value?.height);
      let I;
      O.value ? D.value ? I = Zs(h.top, h.right, h.width, h.height) : I = Js(h.top, h.left, h.width, h.height) : D.value ? I = ta(h.top, h.right, h.width, h.height) : I = Qs(h.top, h.left, h.width, h.height), K.value = I;
    }, bt = () => {
      let h = {};
      for (let I of ["width", "height"]) {
        let N = K.value[I].match(/^(\d+)px$/);
        if (!N) return;
        h[I] = N[1];
      }
      a("container-resized", s.i, s.h, s.w, h.height, h.width);
    }, xt = (h) => {
      {
        if (s.static) return;
        const I = Qn(h);
        if (I == null) return;
        const { x: B, y: N } = I, y = { width: 0, height: 0 };
        let C;
        switch (h.type) {
          case "resizestart": {
            gt(), lt.value = P.value, vt.value = A.value, C = Et(Z.value, w.value, P.value, A.value), y.width = C.width, y.height = C.height, p.value = y, b.value = !0;
            break;
          }
          case "resizemove": {
            const st = ti(F.value, tt.value, B, N);
            if (D.value ? y.width = Number(p.value?.width) - st.deltaX / m.value : y.width = Number(p.value?.width) + st.deltaX / m.value, y.height = Number(p.value?.height) + st.deltaY / m.value, q.value || o?.preventOverflow) {
              const jt = h.target.offsetParent, Ht = Et(Z.value, w.value, P.value, A.value), Le = u.value - Ht.left - f.value[0];
              y.width = Math.min(y.width, Le);
              const Ki = jt.clientHeight - Ht.top - f.value[1];
              y.height = Math.min(y.height, Ki), y.width = Math.max(y.width, pt(s.minW, it(), f.value[0])), y.height = Math.max(y.height, pt(s.minH, d.value, f.value[1]));
            }
            p.value = y;
            break;
          }
          case "resizeend": {
            C = Et(Z.value, w.value, P.value, A.value), y.width = C.width, y.height = C.height, p.value = null, b.value = !1;
            break;
          }
        }
        if (C = St(y.height, y.width), C.w < s.minW && (C.w = s.minW), C.w > s.maxW && (C.w = s.maxW), C.h < s.minH && (C.h = s.minH), C.h > s.maxH && (C.h = s.maxH), C.h < 1 && (C.h = 1), C.w < 1 && (C.w = 1), (q.value || o?.preventOverflow) && (h.type === "resizemove" || h.type === "resizestart") && g.value !== 1 / 0) {
          const st = {
            ...s,
            w: C.w,
            h: C.h,
            x: Z.value,
            y: w.value
          };
          st.y + st.h > g.value && (C.h = Math.max(s.minH, g.value - w.value)), st.x + st.w > l.value && (C.w = Math.max(s.minW, l.value - Z.value));
        }
        F.value = B, tt.value = N, (P.value !== C.w || A.value !== C.h) && a("resize", s.i, C.h, C.w, y.height, y.width), h.type === "resizeend" && (lt.value !== P.value || vt.value !== A.value) && a("resized", s.i, C.h, C.w, y.height, y.width);
        const ct = {
          eventType: h.type,
          i: s.i,
          x: Z.value,
          y: w.value,
          h: C.h,
          w: C.w
        };
        r.emit("resizeEvent", ct);
      }
    }, yt = (h, I) => {
      if (!I && s.selected && s.selectedItems.length > 1 && s.selectedItems.filter((ct) => ct !== s.i).forEach((ct) => {
        r.emit("dragSelected", {
          event: h,
          i: ct
        });
      }), s.static || b.value) return;
      const B = Qn(h);
      if (B === null) return;
      const { x: N, y } = B;
      let C = {
        top: 0,
        left: 0
      };
      switch (h.type) {
        case "dragstart": {
          C = At();
          break;
        }
        case "dragend": {
          if (!M.value) return;
          C = Zt(h);
          break;
        }
        case "dragmove": {
          C = pe(h, B);
          break;
        }
      }
      ge(C, N, y, h);
    }, At = () => {
      const h = {
        top: 0,
        left: 0
      };
      J.value = Z.value, et.value = w.value;
      const I = c.value;
      let N = I.offsetParent.getBoundingClientRect(), y = I.getBoundingClientRect();
      const C = y.left / m.value, ct = N.left / m.value, st = y.right / m.value, te = N.right / m.value, jt = y.top / m.value, Ht = N.top / m.value;
      return D.value ? h.left = (st - te) * -1 : h.left = C - ct, h.top = jt - Ht, z.value = h, M.value = !0, h;
    }, pe = (h, I) => {
      const { x: B, y: N } = I, y = {
        top: 0,
        left: 0
      };
      a("dragging", h, s.i);
      const C = ti($.value, _.value, B, N);
      if (D.value ? y.left = Number(z.value?.left) - C.deltaX / m.value : y.left = Number(z.value?.left) + C.deltaX / m.value, y.top = Number(z.value?.top) + C.deltaY / m.value, q.value || o?.preventOverflow) {
        const te = h.target.offsetParent.clientHeight - pt(s.h, d.value, f.value[1]);
        y.top = Tt(y.top, 0, te);
        const jt = it(), Ht = u.value - pt(s.w, jt, f.value[0]);
        y.left = Tt(y.left, 0, Ht);
      }
      return z.value = y, y;
    }, Zt = (h) => {
      const I = {
        top: 0,
        left: 0
      };
      a("dragend", h, s.i);
      const B = c.value;
      let y = B.offsetParent.getBoundingClientRect(), C = B.getBoundingClientRect();
      const ct = C.left / m.value, st = y.left / m.value, te = C.right / m.value, jt = y.right / m.value, Ht = C.top / m.value, Le = y.top / m.value;
      return D.value ? I.left = (te - jt) * -1 : I.left = ct - st, I.top = Ht - Le, z.value = null, M.value = !1, I;
    }, ge = (h, I, B, N) => {
      let y;
      D.value, y = Qt(h.top, h.left), (q.value || o?.preventOverflow) && (g.value !== 1 / 0 && y.y + A.value > g.value && (y.y = Math.max(0, g.value - A.value)), y.x + P.value > l.value && (y.x = Math.max(0, l.value - P.value)), y.x = Math.max(0, y.x), y.y = Math.max(0, y.y)), $.value = I, _.value = B, (Z.value !== y.x || w.value !== y.y) && a("move", s.i, y.x, y.y), N.type === "dragend" && (J.value !== Z.value || et.value !== w.value) && a("moved", s.i, y.x, y.y);
      const C = {
        eventType: N.type,
        i: s.i,
        x: y.x,
        y: y.y,
        h: A.value,
        w: P.value
      };
      r.emit("dragEvent", C);
    }, Et = (h, I, B, N) => {
      const y = it();
      let C;
      return D.value ? C = {
        right: Math.round(y * h + (h + 1) * f.value[0]),
        top: Math.round(d.value * I + (I + 1) * f.value[1]),
        width: B === 1 / 0 ? B : Math.round(y * B + Math.max(0, B - 1) * f.value[0]),
        height: N === 1 / 0 ? N : Math.round(d.value * N + Math.max(0, N - 1) * f.value[1])
      } : C = {
        left: Math.round(y * h + (h + 1) * f.value[0]),
        top: Math.round(d.value * I + (I + 1) * f.value[1]),
        width: B === 1 / 0 ? B : Math.round(y * B + Math.max(0, B - 1) * f.value[0]),
        height: N === 1 / 0 ? N : Math.round(d.value * N + Math.max(0, N - 1) * f.value[1])
      }, C;
    }, Qt = (h, I) => {
      const B = it();
      let N = Math.round((I - f.value[0]) / (B + f.value[0])), y = Math.round((h - f.value[1]) / (d.value + f.value[1]));
      if (N = Math.max(Math.min(N, l.value - P.value), 0), y = Math.max(Math.min(y, g.value - A.value), 0), q.value || o?.preventOverflow) {
        const C = Ui(N, y, P.value, A.value);
        N = C.x, y = C.y;
      }
      return { x: N, y };
    }, it = () => (u.value - f.value[0] * (l.value + 1)) / l.value, pt = (h, I, B) => Number.isFinite(h) ? Math.round(I * h + Math.max(0, h - 1) * B) : h, Tt = (h, I, B) => Math.max(Math.min(h, B), I), St = (h, I, B = !1) => {
      const N = it();
      let y = Math.round((I + f.value[0]) / (N + f.value[0])), C = 0;
      return B ? C = Math.ceil((h + f.value[1]) / (d.value + f.value[1])) : C = Math.round((h + f.value[1]) / (d.value + f.value[1])), y = Math.max(Math.min(y, l.value - Z.value), 0), C = Math.max(Math.min(C, g.value - w.value), 0), { w: y, h: C };
    }, Ae = (h, I) => {
      u.value = h;
    }, Ft = (h) => {
      ot();
    }, ve = () => {
      if ((W.value === null || W.value === void 0) && (W.value = Rt(c.value), T.value || W.value.styleCursor(!1)), E.value && !s.static) {
        const h = {
          ignoreFrom: s.dragIgnoreFrom,
          allowFrom: s.dragAllowFrom,
          ...s.dragOption
        };
        W.value.draggable(h), U.value || (U.value = !0, W.value.on("dragstart dragmove dragend", (I) => {
          yt(I);
        }), r.on("dragSelected", ({ event: I, i: B }) => {
          B === s.i && yt(I, !0);
        }));
      } else
        W.value.draggable({
          enabled: !1
        });
    }, gt = () => {
      if ((W.value === null || W.value === void 0) && (W.value = Rt(c.value), T.value || W.value.styleCursor(!1)), x.value && !s.static) {
        let h = Et(0, 0, s.maxW, s.maxH), I = Et(0, 0, s.minW, s.minH);
        const B = {
          edges: {
            left: !1,
            right: "." + V.value.trim().replace(" ", "."),
            bottom: "." + V.value.trim().replace(" ", "."),
            top: !1
          },
          ignoreFrom: s.resizeIgnoreFrom,
          restrictSize: {
            min: {
              height: I.height * m.value,
              width: I.width * m.value
            },
            max: {
              height: h.height * m.value,
              width: h.width * m.value
            }
          },
          ...s.resizeOption
          // modifiers: [
          //   interact.modifiers.restrictRect({
          //     restriction: 'parent'
          //   })
          // ]
        };
        s.preserveAspectRatio && (B.modifiers = [
          // @ts-ignore
          Rt.modifiers.aspectRatio({
            ratio: "preserve"
          })
        ]), W.value.resizable(B), ut.value || (ut.value = !0, W.value.on("resizestart resizemove resizeend", (N) => {
          xt(N);
        }));
      } else
        W.value.resizable({
          enabled: !1
        });
    }, He = Qi(), Gi = () => {
      lt.value = P.value, vt.value = A.value;
      let h = He?.default[0].elm.getBoundingClientRect(), I = St(h.height, h.width, !0);
      if (I.w < s.minW && (I.w = s.minW), I.w > s.maxW && (I.w = s.maxW), I.h < s.minH && (I.h = s.minH), I.h > s.maxH && (I.h = s.maxH), I.h < 1 && (I.h = 1), I.w < 1 && (I.w = 1), (P.value !== I.w || A.value !== I.h) && a("resize", s.i, I.h, I.w, h.height, h.width), lt.value !== I.w || vt.value !== I.h) {
        a("resized", s.i, I.h, I.w, h.height, h.width);
        const B = {
          eventType: "resizeend",
          i: s.i,
          x: Z.value,
          y: w.value,
          h: I.h,
          w: I.w
        };
        r.emit("resizeEvent", B);
      }
    }, Ui = (h, I, B, N) => {
      let y = h, C = I, ct = B, st = N;
      return (q.value || o?.preventOverflow) && (y = Math.max(0, y), C = Math.max(0, C), y + ct > l.value && (y = Math.max(0, l.value - ct), y + ct > l.value && (ct = l.value - y)), g.value !== 1 / 0 && C + st > g.value && (C = Math.max(0, g.value - st), C + st > g.value && (st = g.value - C)), ct = Math.max(s.minW, ct), st = Math.max(s.minH, st)), { x: y, y: C, w: ct, h: st };
    }, Vi = () => {
      a("remove", s.i);
    };
    return t({
      autoSize: Gi,
      calcXY: Qt,
      dragging: z,
      getPixelPosition: () => {
        const h = Et(Z.value, w.value, P.value, A.value);
        return {
          x: h.left || h.right || 0,
          y: h.top,
          width: h.width,
          height: h.height
        };
      },
      ...s
    }), (h, I) => {
      const B = Xt("icon-delete");
      return wt(), It("div", {
        ref_key: "gridItemRef",
        ref: c,
        class: on(["gridster-item", Q.value]),
        style: we(K.value)
      }, [
        ue(h.$slots, "default", {
          style: we(K.value)
        }, void 0, !0),
        X.value ? (wt(), It("span", {
          key: 0,
          ref: "handle",
          class: on(V.value)
        }, null, 2)) : rn("", !0),
        Pt(B, {
          size: 16,
          class: "remove-btn",
          onClick: Vi
        })
      ], 6);
    };
  }
}), Re = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, o] of t)
    n[i] = o;
  return n;
}, Yi = /* @__PURE__ */ Re(ca, [["__scopeId", "data-v-15603476"]]), ua = { class: "grid-container" }, fa = /* @__PURE__ */ ze({
  __name: "GridLayout",
  props: {
    autoSize: { type: Boolean, default: !0 },
    colNum: { default: 12 },
    rowHeight: { default: 0 },
    maxRows: { default: 1 / 0 },
    margin: { default: () => [10, 10] },
    isDraggable: { type: Boolean, default: !0 },
    isResizable: { type: Boolean, default: !0 },
    isMirrored: { type: Boolean, default: !1 },
    isBounded: { type: Boolean, default: !1 },
    useCssTransforms: { type: Boolean, default: !0 },
    verticalCompact: { type: Boolean, default: !0 },
    restoreOnDrag: { type: Boolean, default: !1 },
    layout: {},
    responsive: { type: Boolean, default: !1 },
    keepAspectRatio: { type: Boolean, default: !1 },
    responsiveLayouts: { default: () => ({}) },
    transformScale: { default: 1 },
    breakpoints: { default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }) },
    cols: { default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }) },
    preventCollision: { type: [Boolean, Function], default: !1 },
    useStyleCursor: { type: Boolean, default: !0 },
    fixedHeight: { default: void 0 },
    preventOverflow: { type: Boolean, default: !0 }
  },
  emits: ["layout-created", "layout-before-mount", "layout-mounted", "layout-updated", "layout-ready", "update:layout", "breakpoint-changed", "reset-selected", "update-width"],
  setup(e, { expose: t, emit: n }) {
    const i = e, o = k(null), r = k(null), a = k({}), s = k(0), c = k(0), l = k(!1), u = k({ x: 0, y: 0, w: 0, h: 0, i: -1 }), d = k({}), f = k(null), g = k([]), E = k(null), x = k(), m = k({}), O = k(), T = co(), M = Bt(() => !i.rowHeight && o.value && i.keepAspectRatio ? (o.value - i.margin[0] * (i.colNum + 1)) / i.colNum : i.rowHeight || 100);
    to("eventBus", T);
    const z = n, b = Bt(() => ({
      gridTemplateColumns: `repeat(${i.colNum}, minmax(0, 1fr))`,
      gap: `${i.margin[0]}px`,
      gridTemplateRows: "repeat(auto-fit, 100%)",
      width: "100%",
      padding: `${i.margin[1]}px ${i.margin[0]}px`
    })), p = (w) => {
      if (!w)
        lt();
      else {
        const { eventType: P, i: A, x: q, y: W, h: X, w: D } = w;
        lt(P, A, q, W, X, D);
      }
    }, $ = (w) => {
      if (!w)
        U();
      else {
        const { eventType: P, i: A, x: q, y: W, h: X, w: D } = w;
        U(P, A, q, W);
      }
    };
    T.on("resizeEvent", p), T.on("dragEvent", $), z("layout-created", i.layout), oi(() => {
      T.off("resizeEvent", p), T.off("dragEvent", $), Ws("resize", tt), E.value && E.value.uninstall(m.value);
    }), eo(() => {
      z("layout-before-mount", i.layout);
    }), ri(() => {
      z("layout-mounted", i.layout), zt(function() {
        ea(i.layout), g.value = i.layout, zt(() => {
          J(), tt(), Bs("resize", tt), Dt(i.layout, i.verticalCompact), z("layout-updated", i.layout), F(), zt(() => {
            E.value = Io({
              strategy: "scroll",
              callOnAdd: !1
            }), E.value.listenTo(m.value, function() {
              tt();
            });
          });
        });
      });
    }), G(o, (w, P) => {
      zt(() => {
        T.emit("updateWidth", w), w != null && z("update-width", {
          width: w,
          marginX: i.margin[0]
        }), P === null && zt(() => {
          z("layout-ready", i.layout);
        }), F();
      });
    }), G(
      () => [i.layout, o.value],
      () => {
        _();
      }
    ), G(
      () => i.colNum,
      (w) => {
        T.emit("setColNum", w);
      }
    ), G(
      () => M.value,
      (w) => {
        T.emit("setRowHeight", w);
      }
    ), G(
      () => i.isDraggable,
      (w) => {
        T.emit("setDraggable", w);
      }
    ), G(
      () => i.isResizable,
      (w) => {
        T.emit("setResizable", w);
      }
    ), G(
      () => i.isBounded,
      (w) => {
        T.emit("setBounded", w);
      }
    ), G(
      () => i.transformScale,
      (w) => {
        T.emit("setTransformScale", w);
      }
    ), G(
      () => i.responsive,
      (w) => {
        w || (z("update:layout", g.value || []), T.emit("setColNum", i.colNum)), tt();
      }
    ), G(
      () => i.maxRows,
      (w) => {
        T.emit("setMaxRows", w);
      }
    ), G(
      () => [r.value, i.rowHeight, i.fixedHeight],
      () => {
        const w = i.fixedHeight || r.value;
        if (w && M.value) {
          const P = Math.floor((w - i.margin[1]) / (M.value + i.margin[1]));
          s.value = P, T.emit("setMaxRows", s.value);
        }
      },
      { immediate: !0 }
    ), G(
      () => i.margin,
      () => {
        F();
      }
    );
    const _ = () => {
      if (i.layout !== void 0 && g.value !== null) {
        if (i.layout.length !== g.value.length) {
          let w = et(i.layout, g.value);
          w.length > 0 && (i.layout.length > g.value.length ? g.value = g.value.concat(w) : g.value = g.value.filter((P) => !w.some((A) => P.i === A.i))), c.value = i.layout.length, J();
        }
        Dt(i.layout, i.verticalCompact), T.emit("updateWidth", o.value), F(), z("layout-updated", i.layout);
      }
    }, F = () => {
      a.value = {
        height: K()
      };
    }, tt = () => {
      m.value !== null && m.value !== void 0 && (o.value = m.value.offsetWidth, r.value = m.value.offsetHeight), T.emit("resizeEvent");
    }, K = () => i.autoSize ? i.fixedHeight ? i.fixedHeight + "px" : r.value && i.maxRows !== 1 / 0 ? r.value + "px" : ei(i.layout) * (M.value + i.margin[1]) + i.margin[1] + "px" : "", at = Bt(() => ei(i.layout)), U = (w, P, A, q, W, X) => {
      let D = ni(i.layout, P);
      D?.selected || z("reset-selected"), D == null && (D = { x: 0, y: 0 }), w === "dragstart" && !i.verticalCompact && (x.value = i.layout.reduce(
        (dt, { i: S, x: L, y: j }) => ({
          ...dt,
          [S]: { x: L, y: j }
        }),
        {}
      )), w === "dragmove" || w === "dragstart" ? (zt(function() {
        l.value = !0;
      }), T.emit("updateWidth", o.value)) : zt(function() {
        l.value = !1;
      });
      const Q = ut(D);
      let V;
      i.preventOverflow && s.value !== 1 / 0 ? V = Vs(i.layout, D, A, q, i.colNum, s.value, !0, Q) : V = Te(i.layout, D, A, q, !0, Q), z("update:layout", V), i.restoreOnDrag ? (D.static = !0, Dt(i.layout, i.verticalCompact, x.value), D.static = !1) : Dt(i.layout, i.verticalCompact), T.emit("compact"), F(), w === "dragend" && (x.value = void 0, z("layout-updated", V));
    }, ut = (w) => typeof i.preventCollision == "function" ? i.preventCollision({
      layout: i.layout,
      layoutItem: w
    }) : i.preventCollision, lt = (w, P, A, q, W, X) => {
      let D = ni(i.layout, P);
      D == null && (D = { h: 0, w: 0 }), X = Number(X), W = Number(W);
      let Q;
      if (ut(D)) {
        const dt = $i(i.layout, { ...D, w: X, h: W }).filter(
          (S) => S.i !== D?.i
        );
        if (Q = dt.length > 0, Q) {
          let S = 1 / 0, L = 1 / 0;
          dt.forEach((j) => {
            j.x > Number(D?.x) && (S = Math.min(S, j.x)), j.y > Number(D?.y) && (L = Math.min(L, j.y));
          }), Number.isFinite(S) && (D.w = S - D.x), Number.isFinite(L) && (D.h = L - D.y);
        }
      }
      Q || (i.preventOverflow && s.value !== 1 / 0 ? Ks(i.layout, D, X, W, i.colNum, s.value) && (D.w = X, D.h = W) : (D.w = X, D.h = W)), w === "resizestart" || w === "resizemove" ? (u.value.i = P, u.value.x = A, u.value.y = q, u.value.w = D.w, u.value.h = D.h, zt(function() {
        l.value = !0;
      }), T.emit("updateWidth", o.value)) : zt(function() {
        l.value = !1;
      }), i.responsive && vt(), Dt(i.layout, i.verticalCompact), T.emit("compact"), F(), w === "resizeend" && z("layout-updated", i.layout);
    }, vt = () => {
      let w = sa(i.breakpoints, o.value), P = dn(w, i.cols);
      f.value != null && !d.value[f.value] && (d.value[f.value] = Ce(i.layout));
      let A = aa(
        g.value,
        d.value,
        i.breakpoints,
        w,
        f.value,
        P,
        i.verticalCompact
      );
      d.value[w] = A, f.value !== w && z("breakpoint-changed", w, A), z("update:layout", A), f.value = w, T.emit("setColNum", dn(w, i.cols));
    }, J = () => {
      d.value = Object.assign({}, i.responsiveLayouts);
    }, et = (w, P) => {
      let A = w.filter(function(W) {
        return !P.some(function(X) {
          return W.i === X.i;
        });
      }), q = P.filter(function(W) {
        return !w.some(function(X) {
          return W.i === X.i;
        });
      });
      return A.concat(q);
    };
    return t({
      ...i,
      width: o,
      height: r,
      mergeStyle: a,
      lastLayoutLength: c,
      isDragging: l,
      placeholder: u,
      layouts: d,
      lastBreakpoint: f,
      originalLayout: g,
      erd: E,
      defaultGridItem: O,
      dragEvent: U,
      rowHeightComputed: M,
      layoutBottom: at,
      addItemsIntelligently: (w) => {
        let P = [...i.layout];
        const A = [], q = [];
        for (const W of w) {
          const X = Ys(P, W, i.colNum, s.value);
          X.success ? (P = X.layout, A.push(P[P.length - 1])) : q.push(W);
        }
        return A.length > 0 && (z("update:layout", P), Dt(P, i.verticalCompact), F(), z("layout-updated", P)), {
          addedItems: A,
          failedItems: q,
          success: A.length > 0
        };
      },
      colNum: i.colNum,
      maxRows: s
    }), (w, P) => (wt(), It("div", ua, [
      Ot("div", {
        ref_key: "layoutRef",
        ref: m,
        class: "grid-content",
        style: we({
          padding: `${i.margin[1]}px ${i.margin[0]}px`
        })
      }, [
        Ot("div", {
          class: "grid-background",
          style: we(b.value)
        }, [
          (wt(!0), It(hn, null, pn(i.colNum, (A) => (wt(), It("div", {
            class: "grid-cell",
            key: A
          }))), 128))
        ], 4),
        ue(w.$slots, "default", {}, void 0, !0),
        no(Pt(Yi, {
          class: "grid-placeholder",
          x: u.value.x,
          y: u.value.y,
          w: u.value.w,
          h: u.value.h,
          i: u.value.i
        }, null, 8, ["x", "y", "w", "h", "i"]), [
          [io, l.value]
        ])
      ], 4)
    ]));
  }
}), da = /* @__PURE__ */ Re(fa, [["__scopeId", "data-v-5ac99b4e"]]), ha = { class: "add-container" }, pa = { class: "component-library" }, ga = { class: "search-section" }, va = { class: "components-grid" }, ma = ["onClick"], ya = {
  key: 0,
  class: "selection-indicator"
}, ba = {
  key: 0,
  class: "empty-state"
}, xa = /* @__PURE__ */ ze({
  __name: "AddComponent",
  props: {
    componentLibrary: {}
  },
  emits: ["confirm", "cancel"],
  setup(e, { expose: t, emit: n }) {
    const i = e, o = k(!1), r = k([]), a = n, s = (x) => {
      const m = r.value.findIndex(
        (O) => O.i === x.i
      );
      m > -1 ? r.value.splice(m, 1) : r.value.push(x);
    }, c = k(""), l = Bt(() => {
      if (!c.value)
        return i.componentLibrary;
      const x = c.value.toLowerCase();
      return i.componentLibrary.filter(
        (m) => m.name.toLowerCase().includes(x)
      );
    }), u = (x) => r.value.some(
      (m) => m.i === x.i
    ), d = (x) => {
      const m = {
        ...x,
        x: 0,
        y: 0
      };
      s(m);
    }, f = () => {
      r.value.length > 0 && (g(), a("confirm", r.value), r.value = []);
    }, g = () => {
      o.value = !1;
    };
    return t({
      open: () => {
        o.value = !0;
      },
      close: g
    }), (x, m) => {
      const O = Xt("a-alert"), T = Xt("a-input"), M = Xt("a-scrollbar"), z = Xt("a-modal");
      return wt(), oo(z, {
        visible: o.value,
        "onUpdate:visible": m[1] || (m[1] = (b) => o.value = b),
        title: "添加组件 ",
        width: "1000px",
        onOk: f,
        onCancel: g
      }, {
        default: Yt(() => [
          Ot("div", ha, [
            Pt(O, null, {
              default: Yt(() => [
                sn("已选择：" + ro(r.value.length), 1)
              ]),
              _: 1
            }),
            Ot("div", pa, [
              Ot("div", ga, [
                Pt(T, {
                  modelValue: c.value,
                  "onUpdate:modelValue": m[0] || (m[0] = (b) => c.value = b),
                  type: "text",
                  placeholder: "搜索组件...",
                  class: "search-input"
                }, null, 8, ["modelValue"])
              ]),
              Pt(M, { style: { height: "500px", overflow: "auto" } }, {
                default: Yt(() => [
                  Ot("div", va, [
                    (wt(!0), It(hn, null, pn(l.value, (b) => (wt(), It("div", {
                      key: b.i,
                      class: on(["component-card", {
                        selected: u(b)
                      }]),
                      onClick: (p) => d(b)
                    }, [
                      ue(x.$slots, "component", { component: b }, void 0, !0),
                      u(b) ? (wt(), It("div", ya, " ✓ ")) : rn("", !0)
                    ], 10, ma))), 128))
                  ])
                ]),
                _: 3
              }),
              l.value.length === 0 ? (wt(), It("div", ba, " 未找到匹配的组件 ")) : rn("", !0)
            ])
          ])
        ]),
        _: 3
      }, 8, ["visible"]);
    };
  }
}), wa = /* @__PURE__ */ Re(xa, [["__scopeId", "data-v-afc902bc"]]), Ea = { class: "grid-header" }, Sa = { class: "grid-header_right" }, Ia = /* @__PURE__ */ ze({
  __name: "GridHeader",
  props: {
    componentLibrary: { default: () => [] }
  },
  emits: ["confirm-add", "save"],
  setup(e, { emit: t }) {
    const n = k(), i = e, o = t, r = (c) => {
      o("confirm-add", c);
    }, a = () => {
      n.value.open();
    }, s = () => {
      o("save");
    };
    return (c, l) => {
      const u = Xt("a-button"), d = Xt("a-space");
      return wt(), It(hn, null, [
        Ot("header", Ea, [
          l[2] || (l[2] = Ot("div", { class: "grid-header_left" }, null, -1)),
          Ot("div", Sa, [
            Pt(d, null, {
              default: Yt(() => [
                Pt(u, {
                  type: "primary",
                  onClick: a
                }, {
                  default: Yt(() => [...l[0] || (l[0] = [
                    sn("添加组件", -1)
                  ])]),
                  _: 1
                }),
                Pt(u, {
                  type: "primary",
                  onClick: s
                }, {
                  default: Yt(() => [...l[1] || (l[1] = [
                    sn("保存布局", -1)
                  ])]),
                  _: 1
                }),
                ue(c.$slots, "extra", {}, void 0, !0)
              ]),
              _: 3
            })
          ])
        ]),
        Pt(wa, {
          ref_key: "addComponentRef",
          ref: n,
          onConfirm: r,
          "component-library": i.componentLibrary
        }, so({ _: 2 }, [
          pn(Object.keys(c.$slots), (f) => ({
            name: f,
            fn: Yt((g) => [
              ue(c.$slots, f, ao(lo(g || {})), void 0, !0)
            ])
          }))
        ]), 1032, ["component-library"])
      ], 64);
    };
  }
}), _a = /* @__PURE__ */ Re(Ia, [["__scopeId", "data-v-e33ece3e"]]), Ca = {
  GridLayout: da,
  GridItem: Yi,
  GridHeader: _a
}, Ta = (e) => {
  Object.entries(Ca).forEach(([t, n]) => {
    e.component(t, n);
  });
}, Na = { install: Ta };
export {
  na as IS_UNITLESS,
  ia as addPx,
  Bs as addWindowEventListener,
  Ha as autoBindHandlers,
  ei as bottom,
  $s as calcColWidth,
  Ra as clampToBounds,
  Ce as cloneLayout,
  Gs as cloneLayoutItem,
  Sn as collides,
  Dt as compact,
  Us as compactItem,
  Wi as correctBounds,
  ti as createCoreData,
  La as createMarkup,
  Na as default,
  Wa as findAndRemove,
  qs as findBestPosition,
  Ba as findItemInArray,
  aa as findOrGenerateResponsiveLayout,
  $a as generateResponsiveLayout,
  $i as getAllCollisions,
  sa as getBreakpointFromWidth,
  dn as getColsFromBreakpoint,
  js as getColumnHeights,
  Qn as getControlPosition,
  Zn as getDocumentDir,
  ce as getFirstCollision,
  ni as getLayoutItem,
  Ni as getStatics,
  Oa as gridItemHeightToRowNum,
  Pa as gridItemWidthToColNum,
  Xs as hasCollisionInLayout,
  ra as hyphenate,
  oa as hyphenateRE,
  ka as isPositionWithinBounds,
  Fi as isWithinBounds,
  Te as moveElement,
  ii as moveElementAwayFromCollision,
  Ns as offsetXYFromParentOf,
  Aa as perc,
  Ws as removeWindowEventListener,
  Vs as safelyMoveElement,
  Ks as safelyResizeElement,
  Da as setDocumentDir,
  Qs as setTopLeft,
  ta as setTopRight,
  Js as setTransform,
  Zs as setTransformRtl,
  Ys as smartAddItem,
  Xi as sortBreakpoints,
  qi as sortLayoutItemsByRowCol,
  ea as validateLayout,
  ji as wouldCauseOverflow
};
