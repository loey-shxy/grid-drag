import { defineComponent as st, ref as G, computed as Q, resolveComponent as P, createElementBlock as S, openBlock as A, normalizeStyle as ot, normalizeClass as ht, renderSlot as J, createElementVNode as D, createVNode as q, createBlock as ct, withCtx as j, createTextVNode as ut, toDisplayString as xt, createCommentVNode as rt, Fragment as Z, renderList as tt, reactive as lt, onMounted as vt, onUnmounted as yt, watch as wt, unref as Mt, createSlots as bt, normalizeProps as Ct, guardReactiveProps as $t } from "vue";
import { Message as Rt } from "@arco-design/web-vue";
const z = 24, B = 60, N = 100;
function Wt(i, o, t, r) {
  const { width: n, height: s } = t, { gap: a, cellWidth: d } = r;
  if (ft(o, r), console.log(`📦 填充后组件: ${o.name}, 宽度: ${o.width}, 高度: ${o.height}`), o.width > n)
    return console.warn("组件宽度超过容器宽度"), null;
  const f = Math.ceil(o.width / (d + a)), x = Math.min(f, z);
  console.log(`📏 组件占用列数: ${f} -> ${x}`);
  const h = new Array(z).fill(0);
  for (const l of i) {
    const p = Math.floor(l.x / (d + a)), $ = Math.ceil(l.width / (d + a)), m = Math.min(p + $, z), e = l.y + l.height + a;
    console.log(`📍 现有组件: ${l.name}, 位置: (${l.x}, ${l.y}), 尺寸: ${l.width}x${l.height}`), console.log(`📍 占用列: ${p} -> ${m} (${$}列), 底部Y: ${e}`);
    for (let g = p; g < m; g++)
      g >= 0 && g < z && (h[g] = Math.max(h[g] || 0, e));
  }
  console.log("📊 列高度数组:", h.slice(0, 12));
  let u = 0, y = 1 / 0;
  for (let l = 0; l <= z - x; l++) {
    let p = 0;
    for (let $ = l; $ < l + x; $++)
      p = Math.max(p, h[$] || 0);
    p < y && (y = p, u = l);
  }
  const R = u * (d + a), b = y;
  if (console.log(`🎯 最佳位置: 列${u}, 高度${y} -> 坐标(${R}, ${b})`), b + o.height > s)
    return console.warn(`❌ 位置超出容器高度: ${b + o.height} > ${s}`), null;
  const w = { x: parseFloat(R.toFixed(3)), y: parseFloat(b.toFixed(3)) }, C = { width: o.width, height: o.height };
  for (const l of i)
    if (K(
      w,
      C,
      { x: l.x, y: l.y },
      { width: l.width, height: l.height }
    ))
      return console.warn("新组件位置与现有组件重叠"), null;
  return w;
}
function _t(i, o, t, r, n, s) {
  const { width: a, height: d } = n, { gap: f } = s, h = (a - (z - 1) * f) / z + f;
  let u = Math.round(i.x / h);
  const y = Math.ceil(o.width / h), R = z - y;
  u = Math.max(0, Math.min(u, R));
  const b = u * h;
  let w = i.y;
  const C = t.filter((l) => {
    if (l.id === r) return !1;
    const p = b < l.x + l.width && b + o.width > l.x, $ = l.y + l.height <= i.y;
    return p && $;
  });
  if (C.length > 0) {
    let l = null, p = 1 / 0;
    for (const $ of C) {
      const m = i.y - ($.y + $.height);
      m >= 0 && m < p && (p = m, l = $);
    }
    l && p <= f ? (w = l.y + l.height + f, console.log(`高度吸附: 距离=${p}, 吸附到Y=${w}`)) : console.log(`不进行高度吸附: 距离=${p} > gap=${f}`);
  }
  return w + o.height > d && (w = d - o.height), w = Math.max(0, w), {
    x: parseFloat(b.toFixed(3)),
    y: parseFloat(w.toFixed(3))
  };
}
function ft(i, o) {
  const { cellWidth: t, gap: r } = o, n = i.minWidth || t, s = i.minHeight || B;
  i.width = Math.max(i.width, n), i.height = Math.max(i.height, s);
  const a = Math.ceil(i.width / (t + r)), d = Math.min(a, z), f = d * t + (d - 1) * r;
  i.width = parseFloat(f.toFixed(3));
}
function gt(i, o, t) {
  const { gap: r, cellWidth: n } = t, s = i.minWidth || n, a = i.minHeight || B, d = Math.max(o.width, s), f = Math.max(o.height, a), x = Math.ceil(d / (n + r)), h = Math.min(x, z), u = h * n + (h - 1) * r, y = Math.max(u, s), R = Math.max(f, a);
  return {
    width: parseFloat(y.toFixed(3)),
    height: parseFloat(R.toFixed(3))
  };
}
function nt(i, o, t, r, n, s) {
  const a = [], { width: d, height: f } = n, { gap: x } = s, h = {
    ...o,
    x: t.x,
    y: t.y,
    width: r.width,
    height: r.height
  }, u = i.filter((l) => {
    if (l.id === o.id) return !1;
    const p = !(h.y + h.height <= l.y || l.y + l.height <= h.y), $ = l.x >= o.x + o.width - x;
    return p && $;
  });
  if (u.length === 0)
    return { affected: [], canResize: !0 };
  u.sort((l, p) => l.x - p.x);
  const y = h.x + h.width;
  let R = !1, b = 0;
  for (const l of u) {
    const p = y + x - l.x;
    if (p > 0) {
      R = !0, b = p;
      break;
    }
  }
  if (!R)
    return { affected: [], canResize: !0 };
  const w = [], C = [];
  for (const l of u) {
    const p = l.x + b;
    p + l.width > d ? C.push(l) : w.push({ ...l, x: p, y: l.y });
  }
  if (C.length > 0) {
    const l = [
      ...i.filter((p) => p.id !== o.id && !u.some(($) => $.id === p.id)),
      h,
      ...w
    ];
    C.sort((p, $) => p.x - $.x);
    for (const p of C) {
      const $ = Ft(l, p, s);
      if ($ + p.height > f) {
        const m = d - p.width, e = { ...p, x: m, y: p.y };
        return w.push(e), l.push(e), { affected: [], canResize: !1 };
      } else {
        const m = { ...p, x: p.x, y: $ };
        w.push(m), l.push(m);
      }
    }
  }
  return a.push(...w), { affected: a, canResize: !0 };
}
function it(i, o, t, r, n, s) {
  const a = [], { height: d } = n, { gap: f } = s, x = {
    ...o,
    x: t.x,
    y: t.y,
    width: r.width,
    height: r.height
  }, h = i.filter((b) => {
    if (b.id === o.id) return !1;
    const w = !(x.x + x.width <= b.x || b.x + b.width <= x.x), C = b.y >= o.y + o.height - f;
    return w && C;
  });
  if (h.length === 0)
    return { affected: [], canResize: !0 };
  h.sort((b, w) => b.y - w.y);
  const u = x.y + x.height;
  let y = !1, R = 0;
  for (const b of h) {
    const w = u + f - b.y;
    if (w > 0) {
      y = !0, R = w;
      break;
    }
  }
  if (!y)
    return { affected: [], canResize: !0 };
  for (const b of h) {
    const w = b.y + R;
    if (w + b.height > d)
      return { affected: [], canResize: !1 };
    a.push({ ...b, x: parseFloat(b.x.toFixed(3)), y: parseFloat(w.toFixed(3)) });
  }
  return { affected: a, canResize: !0 };
}
function Ft(i, o, t) {
  const { gap: r } = t;
  let n = o.y + o.height + r;
  const s = i.filter((d) => d.id === o.id ? !1 : !(o.x + o.width <= d.x || d.x + d.width <= o.x));
  s.sort((d, f) => d.y - f.y);
  let a = !1;
  for (; !a; ) {
    a = !0;
    for (const d of s)
      if (!(n + o.height <= d.y || d.y + d.height <= n)) {
        n = d.y + d.height + r, a = !1;
        break;
      }
  }
  return n;
}
function Ht(i, o, t, r, n, s) {
  const a = nt(i, o, t, r, n, s);
  if (!a.canResize)
    return a;
  const d = i.map((u) => {
    const y = a.affected.find((R) => R.id === u.id);
    return y ? { ...u, x: y.x, y: y.y } : u;
  }), f = it(d, o, t, r, n, s);
  if (!f.canResize)
    return f;
  const x = [], h = /* @__PURE__ */ new Set();
  for (const u of a.affected)
    x.push(u), h.add(u.id);
  for (const u of f.affected)
    if (!h.has(u.id))
      x.push(u);
    else {
      const y = x.find((R) => R.id === u.id);
      y && (y.y = u.y);
    }
  return { affected: x, canResize: !0 };
}
function kt(i, o, t, r, n, s, a) {
  const d = r.width > o.width, f = r.height > o.height, x = t.x !== o.x || t.y !== o.y;
  if (x) {
    const h = {
      ...o,
      x: t.x,
      y: t.y,
      width: r.width,
      height: r.height
    };
    for (const u of i)
      if (u.id !== o.id && K(
        { x: h.x, y: h.y },
        { width: h.width, height: h.height },
        { x: u.x, y: u.y },
        { width: u.width, height: u.height }
      ))
        return { affected: [], canResize: !1 };
    return { affected: [], canResize: !0 };
  }
  if (a === "bottom-right" && d && f)
    return Ht(i, o, t, r, n, s);
  if (a === "top-right" && d && x)
    return f ? nt(i, o, t, r, n, s) : { affected: [], canResize: !et(i, o, t, r) };
  if (a === "bottom-left" && f && x)
    return d ? it(i, o, t, r, n, s) : { affected: [], canResize: !et(i, o, t, r) };
  if (a === "top-left" && x)
    return { affected: [], canResize: !et(i, o, t, r) };
  if (d && (a === "right" || a?.includes("right")))
    return nt(i, o, t, r, n, s);
  if (f && (a === "bottom" || a?.includes("bottom")))
    return it(i, o, t, r, n, s);
  {
    const h = {
      ...o,
      x: t.x,
      y: t.y,
      width: r.width,
      height: r.height
    };
    for (const u of i)
      if (u.id !== o.id && K(
        { x: h.x, y: h.y },
        { width: h.width, height: h.height },
        { x: u.x, y: u.y },
        { width: u.width, height: u.height }
      ))
        return { affected: [], canResize: !1 };
    return { affected: [], canResize: !0 };
  }
}
function dt(i, o, t, r, n, s, a) {
  const { width: d, height: f } = n;
  if (t.x < 0 || t.y < 0 || t.x + r.width > d || t.y + r.height > f)
    return { valid: !1, affectedComponents: [] };
  const x = i.find((y) => y.id === o);
  if (!x)
    return { valid: !1, affectedComponents: [] };
  const { affected: h, canResize: u } = kt(
    i,
    x,
    t,
    r,
    n,
    s,
    a
  );
  return { valid: u, affectedComponents: h };
}
function K(i, o, t, r) {
  const n = i.x < t.x + r.width && i.x + o.width > t.x, s = i.y < t.y + r.height && i.y + o.height > t.y;
  return n && s;
}
function et(i, o, t, r) {
  const n = {
    ...o,
    x: t.x,
    y: t.y,
    width: r.width,
    height: r.height
  };
  for (const s of i)
    if (s.id !== o.id && K(
      { x: n.x, y: n.y },
      { width: n.width, height: n.height },
      { x: s.x, y: s.y },
      { width: s.width, height: s.height }
    ))
      return !0;
  return !1;
}
function Ot(i, o, t, r, n) {
  const { width: s, height: a } = r, d = i.find((h) => h.id === o);
  if (!d)
    return { valid: !1, affectedComponents: [], finalPosition: t };
  const f = { width: d.width, height: d.height }, x = _t(
    t,
    f,
    i,
    o,
    r,
    n
  );
  if (x.x < 0 || x.y < 0 || x.x + f.width > s || x.y + f.height > a)
    return { valid: !1, affectedComponents: [], finalPosition: x };
  for (const h of i)
    if (h.id !== o && K(
      x,
      f,
      { x: h.x, y: h.y },
      { width: h.width, height: h.height }
    ))
      return { valid: !1, affectedComponents: [], finalPosition: x };
  return { valid: !0, affectedComponents: [], finalPosition: x };
}
function Dt(i, o, t, r, n, s) {
  if (o.width === t.width)
    return i;
  const a = n / r;
  return i.map((d) => {
    let f = d.x, x = d.y, h = d.width, u = d.height;
    if (a !== 1) {
      const { gap: y } = s, R = Math.round(d.x / (r + y)), b = Math.max(1, Math.round((d.width + y) / (r + y)));
      f = R * (n + y), h = b * n + (b - 1) * y, h = Math.max(h, n);
    }
    if (f + h > t.width) {
      const y = t.width - f;
      y > 0 ? h = Math.min(h, y) : f = Math.max(0, t.width - h);
    }
    if (x + u > t.height) {
      const y = t.height - x;
      y > 0 && (u = Math.min(u, y));
    }
    return {
      ...d,
      x: parseFloat(f.toFixed(3)),
      y: parseFloat(x.toFixed(3)),
      width: parseFloat(h.toFixed(3)),
      height: parseFloat(u.toFixed(3))
    };
  });
}
const Et = { class: "resize-overlay" }, Lt = /* @__PURE__ */ st({
  __name: "GridsterItem",
  props: {
    component: {},
    gridConfig: {},
    containerInfo: {},
    allComponents: {}
  },
  emits: ["resize", "drag", "remove"],
  setup(i, { emit: o }) {
    const t = i, r = o, n = G(!1), s = G(!1), a = G(""), d = G({ x: 0, y: 0 }), f = G({ x: 0, y: 0 }), x = Q(() => ({
      position: "absolute",
      left: `${t.component.x}px`,
      top: `${t.component.y}px`,
      width: `${t.component.width}px`,
      height: `${t.component.height}px`,
      zIndex: n.value || s.value ? N : 1,
      cursor: s.value ? h(a.value) : "move"
    })), h = (m) => ({
      top: "n-resize",
      right: "e-resize",
      bottom: "s-resize",
      left: "w-resize",
      "top-left": "nw-resize",
      "top-right": "ne-resize",
      "bottom-left": "sw-resize",
      "bottom-right": "se-resize"
    })[m] || "move", u = (m, e) => {
      e.preventDefault(), e.stopPropagation(), $(m, e);
    }, y = (m, e) => {
      e.preventDefault(), e.stopPropagation(), $(m, e);
    }, R = (m) => {
      n.value = !0, m.dataTransfer?.setData("text/plain", t.component.id), m.dataTransfer.effectAllowed = "move";
      const e = m.currentTarget;
      m.dataTransfer?.setDragImage(e, 0, 0);
      const g = e.getBoundingClientRect();
      d.value = {
        x: t.component.x,
        y: t.component.y
      }, f.value = {
        x: m.clientX - g.left,
        y: m.clientY - g.top
      };
    }, b = (m) => {
      if (!n.value) return;
      const e = m.currentTarget.parentElement?.getBoundingClientRect();
      if (!e) return;
      const g = m.clientX - e.left - f.value.x, c = m.clientY - e.top - f.value.y;
      r("drag", t.component.id, { x: g, y: c });
    }, w = () => {
      n.value = !1, d.value = { x: 0, y: 0 }, f.value = { x: 0, y: 0 };
    }, C = () => t.allComponents ? t.allComponents.filter((m) => m.id !== t.component.id) : [], l = (m) => {
      const e = C(), g = t.gridConfig.gap;
      for (const c of e)
        if (!(t.component.y + t.component.height <= c.y || c.y + c.height <= t.component.y) && c.x + c.width <= t.component.x && m - (c.x + c.width) < g)
          return c.x + c.width + g;
      return m;
    }, p = (m) => {
      const e = C(), g = t.gridConfig.gap;
      for (const c of e)
        if (!(t.component.x + t.component.width <= c.x || c.x + c.width <= t.component.x) && c.y + c.height <= t.component.y && m - (c.y + c.height) < g)
          return c.y + c.height + g;
      return m;
    }, $ = (m, e) => {
      e.preventDefault(), e.stopPropagation();
      const g = e.clientX, c = e.clientY, v = t.component.width, M = t.component.height, W = t.component.x, H = t.component.y, T = t.containerInfo.width, L = t.containerInfo.height;
      a.value = m, s.value = !0;
      const U = (I) => {
        if (I.buttons === 0) {
          E();
          return;
        }
        const Y = I.clientX - g, V = I.clientY - c;
        let k = v, O = M, _ = W, F = H;
        switch (m) {
          case "right":
            k = Math.max(t.component.minWidth || N, v + Y);
            break;
          case "left":
            k = Math.max(t.component.minWidth || N, v - Y), _ = W + v - k, _ = l(_), k = W + v - _;
            break;
          case "bottom":
            O = Math.max(t.component.minHeight || B, M + V);
            break;
          case "top":
            O = Math.max(t.component.minHeight || B, M - V), F = H + M - O, F = p(F), O = H + M - F;
            break;
          case "top-right":
            k = Math.max(t.component.minWidth || N, v + Y), O = Math.max(t.component.minHeight || B, M - V), F = H + M - O, F = p(F), O = H + M - F;
            break;
          case "top-left":
            k = Math.max(t.component.minWidth || N, v - Y), O = Math.max(t.component.minHeight || B, M - V), _ = W + v - k, F = H + M - O, _ = l(_), F = p(F), k = W + v - _, O = H + M - F;
            break;
          case "bottom-left":
            k = Math.max(t.component.minWidth || N, v - Y), O = Math.max(t.component.minHeight || B, M + V), _ = W + v - k, _ = l(_), k = W + v - _;
            break;
          case "bottom-right":
            k = Math.max(t.component.minWidth || N, v + Y), O = Math.max(t.component.minHeight || B, M + V);
            break;
        }
        _ = Math.max(0, _), F = Math.max(0, F), _ + k > T && (m.includes("left") ? (_ = T - k, _ = Math.max(0, _)) : k = T - _), F + O > L && (m.includes("top") ? (F = L - O, F = Math.max(0, F)) : O = L - F), k = Math.max(t.component.minWidth || N, k), O = Math.max(t.component.minHeight || B, O);
        let X = { width: k, height: O };
        ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(m) && (X = gt(
          t.component,
          { width: k, height: O },
          t.gridConfig
        )), _ + X.width > T && (X.width = T - _), F + X.height > L && (X.height = L - F), X.width = Math.max(t.component.minWidth || N, X.width), X.height = Math.max(t.component.minHeight || B, X.height), r("resize", t.component.id, {
          width: parseFloat(X.width.toFixed(3)),
          height: parseFloat(X.height.toFixed(3)),
          x: parseFloat(_.toFixed(3)),
          y: parseFloat(F.toFixed(3)),
          resizeType: m
        });
      }, E = () => {
        document.removeEventListener("mousemove", U), document.removeEventListener("mouseup", E), document.removeEventListener("mouseleave", E), s.value = !1, a.value = "";
      };
      document.addEventListener("mousemove", U), document.addEventListener("mouseup", E), document.addEventListener("mouseleave", E), s.value = !0, a.value = "";
    };
    return (m, e) => {
      const g = P("icon-delete");
      return A(), S("div", {
        class: ht(["gridster-item", { resizing: s.value }]),
        style: ot(x.value),
        draggable: "true",
        onDragstart: R,
        onDrag: b,
        onDragend: w
      }, [
        J(m.$slots, "default", {}, void 0, !0),
        D("div", Et, [
          D("div", {
            class: "edge top",
            onMousedown: e[0] || (e[0] = (c) => u("top", c))
          }, null, 32),
          D("div", {
            class: "edge right",
            onMousedown: e[1] || (e[1] = (c) => u("right", c))
          }, null, 32),
          D("div", {
            class: "edge bottom",
            onMousedown: e[2] || (e[2] = (c) => u("bottom", c))
          }, null, 32),
          D("div", {
            class: "edge left",
            onMousedown: e[3] || (e[3] = (c) => u("left", c))
          }, null, 32),
          D("div", {
            class: "corner top-left",
            onMousedown: e[4] || (e[4] = (c) => y("top-left", c))
          }, null, 32),
          D("div", {
            class: "corner top-right",
            onMousedown: e[5] || (e[5] = (c) => y("top-right", c))
          }, null, 32),
          D("div", {
            class: "corner bottom-left",
            onMousedown: e[6] || (e[6] = (c) => y("bottom-left", c))
          }, null, 32),
          D("div", {
            class: "corner bottom-right",
            onMousedown: e[7] || (e[7] = (c) => y("bottom-right", c))
          }, null, 32)
        ]),
        q(g, {
          size: 16,
          class: "remove-btn",
          onClick: e[8] || (e[8] = (c) => m.$emit("remove", i.component.id))
        })
      ], 38);
    };
  }
}), at = (i, o) => {
  const t = i.__vccOpts || i;
  for (const [r, n] of o)
    t[r] = n;
  return t;
}, mt = /* @__PURE__ */ at(Lt, [["__scopeId", "data-v-61670cbd"]]), zt = { class: "add-container" }, Yt = { class: "component-library" }, Tt = { class: "search-section" }, It = { class: "components-grid" }, Xt = ["onClick"], At = {
  key: 0,
  class: "selection-indicator"
}, Bt = {
  key: 0,
  class: "empty-state"
}, Gt = /* @__PURE__ */ st({
  __name: "AddComponent",
  props: {
    componentLibrary: {}
  },
  emits: ["confirm", "cancel"],
  setup(i, { expose: o, emit: t }) {
    const r = i, n = G(!1), s = G([]), a = t, d = (w) => {
      const C = s.value.findIndex(
        (l) => l.id === w.id
      );
      C > -1 ? s.value.splice(C, 1) : s.value.push(w);
    }, f = G(""), x = Q(() => {
      if (!f.value)
        return r.componentLibrary;
      const w = f.value.toLowerCase();
      return r.componentLibrary.filter(
        (C) => C.name.toLowerCase().includes(w)
      );
    }), h = (w) => s.value.some(
      (C) => C.id === w.id
    ), u = (w) => {
      const C = {
        ...w,
        x: 0,
        y: 0
      };
      d(C);
    }, y = () => {
      s.value.length > 0 && (R(), a("confirm", s.value), s.value = []);
    }, R = () => {
      n.value = !1;
    };
    return o({
      open: () => {
        n.value = !0;
      },
      close: R
    }), (w, C) => {
      const l = P("a-alert"), p = P("a-input"), $ = P("a-scrollbar"), m = P("a-modal");
      return A(), ct(m, {
        visible: n.value,
        "onUpdate:visible": C[1] || (C[1] = (e) => n.value = e),
        title: "添加组件 ",
        width: "1000px",
        onOk: y,
        onCancel: R
      }, {
        default: j(() => [
          D("div", zt, [
            q(l, null, {
              default: j(() => [
                ut("已选择：" + xt(s.value.length), 1)
              ]),
              _: 1
            }),
            D("div", Yt, [
              D("div", Tt, [
                q(p, {
                  modelValue: f.value,
                  "onUpdate:modelValue": C[0] || (C[0] = (e) => f.value = e),
                  type: "text",
                  placeholder: "搜索组件...",
                  class: "search-input"
                }, null, 8, ["modelValue"])
              ]),
              q($, { style: { height: "500px", overflow: "auto" } }, {
                default: j(() => [
                  D("div", It, [
                    (A(!0), S(Z, null, tt(x.value, (e) => (A(), S("div", {
                      key: e.id,
                      class: ht(["component-card", {
                        selected: h(e)
                      }]),
                      onClick: (g) => u(e)
                    }, [
                      J(w.$slots, "component", { component: e }, void 0, !0),
                      h(e) ? (A(), S("div", At, " ✓ ")) : rt("", !0)
                    ], 10, Xt))), 128))
                  ])
                ]),
                _: 3
              }),
              x.value.length === 0 ? (A(), S("div", Bt, " 未找到匹配的组件 ")) : rt("", !0)
            ])
          ])
        ]),
        _: 3
      }, 8, ["visible"]);
    };
  }
}), pt = /* @__PURE__ */ at(Gt, [["__scopeId", "data-v-e98454be"]]), Nt = { class: "grid-header" }, St = { class: "grid-header_right" }, Vt = { class: "grid-container" }, Pt = /* @__PURE__ */ st({
  __name: "GridDrag",
  props: {
    componentLibrary: {},
    addedComponents: {}
  },
  emits: [
    "get-container-size",
    "add-component",
    "update:added-components"
  ],
  setup(i, { emit: o }) {
    const t = i, r = o, n = Q({
      get: () => t.addedComponents ? t.addedComponents : [],
      set: (e) => {
        r("update:added-components", e);
      }
    }), s = lt({
      gap: 10,
      cellWidth: 0
      // 动态计算
    }), a = lt({
      width: 0,
      height: 0,
      scrollTop: 0
    }), d = G(), f = Q(() => a.height), x = () => {
      if (!d.value) return;
      const e = d.value;
      a.width = e.clientWidth, a.height = e.clientHeight;
      const g = 23 * s.gap, c = (a.width - g) / 24;
      s.cellWidth = Math.max(parseFloat(c.toFixed(3)), 20);
    }, h = Q(() => {
      const e = s.gap;
      return {
        gridTemplateColumns: `repeat(${z}, minmax(0, 1fr))`,
        gridTemplateRows: "repeat(auto-fit, 100%)",
        gap: `${e}px`,
        width: "100%",
        minHeight: `${f.value}px`
      };
    }), u = Q(() => {
      const e = s.gap;
      return {
        gridTemplateColumns: `repeat(${z}, minmax(0, 1fr))`,
        gap: `${e}px`,
        gridTemplateRows: "repeat(auto-fit, 100%)",
        width: "100%"
      };
    }), y = () => {
      if (!d.value) return;
      const e = d.value, g = a.width, c = a.height, v = s.cellWidth, M = {
        width: g
      };
      a.width = e.clientWidth, a.height = e.clientHeight, x();
      const W = s.cellWidth;
      if (g !== a.width || c !== a.height) {
        console.log("容器尺寸变化，进行自适应调整", {
          oldSize: { width: g, height: c },
          newSize: { width: a.width, height: a.height },
          oldCellWidth: v,
          newCellWidth: W,
          cellWidthRatio: W / v
        });
        const H = n.value.map((L) => ({
          id: L.id,
          x: L.x,
          width: L.width
        }));
        n.value = Dt(
          n.value,
          M,
          a,
          v,
          W,
          s
        );
        const T = n.value.map((L) => ({
          id: L.id,
          x: L.x,
          width: L.width
        }));
        console.log("组件自适应调整结果", {
          before: H,
          after: T
        });
      }
    }, R = (e, g) => {
      const c = n.value.findIndex((E) => E.id === e);
      if (c === -1) return;
      const v = n.value[c], M = {
        width: g.width || v.width,
        height: g.height || v.height
      }, W = {
        x: g.x !== void 0 ? g.x : v.x,
        y: g.y !== void 0 ? g.y : v.y
      };
      let H = M;
      const T = g.resizeType || "";
      ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(T) && (H = gt(v, M, s));
      const U = dt(
        n.value,
        e,
        W,
        H,
        a,
        s,
        T
      );
      if (U.valid)
        v.x = W.x, v.y = W.y, v.width = H.width, v.height = H.height, U.affectedComponents.length > 0 && U.affectedComponents.forEach((E) => {
          const I = n.value.find((Y) => Y.id === E.id);
          I && (I.x = E.x, I.y = E.y);
        });
      else {
        const E = dt(
          n.value,
          e,
          { x: v.x, y: v.y },
          // 保持原位置
          H,
          // 使用填充后的尺寸
          a,
          s,
          T
        );
        E.valid && (v.width = H.width, v.height = H.height, E.affectedComponents.length > 0 && E.affectedComponents.forEach((I) => {
          const Y = n.value.find((V) => V.id === I.id);
          Y && (Y.x = I.x, Y.y = I.y);
        }));
      }
    }, b = (e, g) => {
      const c = n.value.find((M) => M.id === e);
      if (!c) return;
      const v = Ot(
        n.value,
        e,
        g,
        a,
        s
      );
      v.valid && (c.x = v.finalPosition.x, c.y = v.finalPosition.y, v.affectedComponents.length > 0 && v.affectedComponents.forEach((M) => {
        const W = n.value.find((H) => H.id === M.id);
        W && (W.x = M.x, W.y = M.y);
      }));
    }, w = (e) => {
      const g = n.value.findIndex((c) => c.id === e);
      g !== -1 && n.value.splice(g, 1);
    }, C = (e) => {
      e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
    };
    let l = null;
    vt(() => {
      d.value && (l = new ResizeObserver(() => {
        y();
      }), l.observe(d.value)), y(), window.addEventListener("resize", y);
    }), yt(() => {
      l && l.disconnect(), window.removeEventListener("resize", y);
    }), wt(
      () => a,
      () => r("get-container-size", a),
      { deep: !0 }
    );
    const p = G(), $ = () => {
      p.value.open();
    }, m = (e) => {
      let g = 0;
      const c = [];
      if (e.forEach((v) => {
        const M = Wt(n.value, v, a, s);
        if (M) {
          const W = {
            ...v,
            id: `${v.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            x: M.x,
            y: M.y
          };
          ft(W, s), n.value.push(W), g++, console.log(`✓ 成功添加: ${v.name} 位置: (${M.x}, ${M.y})`);
        } else
          console.warn(`✗ 找不到合适位置: ${v.name}`), c.push(v.name);
      }), c.length > 0) {
        Rt.warning(`以下组件无法添加（空间不足）：
${c.join(`
`)}`);
        return;
      }
      g > 0 && console.log(`成功添加 ${g} 个组件`), p.value.close();
    };
    return (e, g) => {
      const c = P("a-button"), v = P("a-space");
      return A(), S(Z, null, [
        D("header", Nt, [
          g[1] || (g[1] = D("div", { class: "grid-header_left" }, null, -1)),
          D("div", St, [
            q(v, null, {
              default: j(() => [
                q(c, {
                  type: "primary",
                  onClick: $
                }, {
                  default: j(() => [...g[0] || (g[0] = [
                    ut("添加组件", -1)
                  ])]),
                  _: 1
                }),
                J(e.$slots, "extra", {}, void 0, !0)
              ]),
              _: 3
            })
          ])
        ]),
        D("div", Vt, [
          D("div", {
            ref_key: "gridContainer",
            ref: d,
            class: "grid-content",
            style: ot(h.value),
            onDragover: C
          }, [
            D("div", {
              class: "grid-background",
              style: ot(u.value)
            }, [
              (A(!0), S(Z, null, tt(Mt(z), (M) => (A(), S("div", {
                class: "grid-cell",
                key: M
              }))), 128))
            ], 4),
            (A(!0), S(Z, null, tt(i.addedComponents, (M) => (A(), ct(mt, {
              key: M.id,
              component: M,
              "grid-config": s,
              "container-info": a,
              "all-components": i.addedComponents,
              onResize: R,
              onDrag: b,
              onRemove: w
            }, {
              default: j(() => [
                J(e.$slots, "item", { itemData: M }, void 0, !0)
              ]),
              _: 2
            }, 1032, ["component", "grid-config", "container-info", "all-components"]))), 128))
          ], 36)
        ]),
        q(pt, {
          ref_key: "addComponentRef",
          ref: p,
          onConfirm: m,
          "component-library": t.componentLibrary
        }, bt({ _: 2 }, [
          tt(Object.keys(e.$slots), (M) => ({
            name: M,
            fn: j((W) => [
              J(e.$slots, M, Ct($t(W || {})), void 0, !0)
            ])
          }))
        ]), 1032, ["component-library"])
      ], 64);
    };
  }
}), jt = /* @__PURE__ */ at(Pt, [["__scopeId", "data-v-4b3145d3"]]), qt = {
  GridDrag: jt,
  GridsterItem: mt,
  AddComponent: pt
}, Ut = (i) => {
  Object.entries(qt).forEach(([o, t]) => {
    i.component(o, t);
  });
}, Zt = { install: Ut };
export {
  Zt as default
};
