import { defineComponent as at, ref as G, computed as Q, resolveComponent as P, createElementBlock as N, openBlock as X, normalizeStyle as ot, normalizeClass as ft, renderSlot as J, createElementVNode as O, createVNode as U, createBlock as gt, withCtx as q, createTextVNode as mt, toDisplayString as vt, createCommentVNode as dt, Fragment as Z, renderList as tt, reactive as ct, onMounted as yt, onUnmounted as wt, watch as Mt, unref as bt, createSlots as Ct, normalizeProps as $t, guardReactiveProps as Rt } from "vue";
import { Message as Wt } from "@arco-design/web-vue";
const E = 24, B = 60, S = 100;
function _t(i, n, t, d) {
  const { width: a, height: s } = t, { gap: r, cellWidth: h } = d;
  if (st(n, d), console.log(`📦 填充后组件: ${n.name}, 宽度: ${n.width}, 高度: ${n.height}`), n.width > a)
    return console.warn("组件宽度超过容器宽度"), null;
  const f = Math.ceil(n.width / (h + r)), p = Math.min(f, E);
  console.log(`📏 组件占用列数: ${f} -> ${p}`);
  const o = new Array(E).fill(0);
  for (const l of i) {
    const g = Math.floor(l.x / (h + r)), R = Math.ceil(l.width / (h + r)), v = Math.min(g + R, E), e = l.y + l.height + r;
    console.log(`📍 现有组件: ${l.name}, 位置: (${l.x}, ${l.y}), 尺寸: ${l.width}x${l.height}`), console.log(`📍 占用列: ${g} -> ${v} (${R}列), 底部Y: ${e}`);
    for (let m = g; m < v; m++)
      m >= 0 && m < E && (o[m] = Math.max(o[m] || 0, e));
  }
  console.log("📊 列高度数组:", o.slice(0, 12));
  let u = 0, x = 1 / 0;
  for (let l = 0; l <= E - p; l++) {
    let g = 0;
    for (let R = l; R < l + p; R++)
      g = Math.max(g, o[R] || 0);
    g < x && (x = g, u = l);
  }
  const $ = u * (h + r), C = x;
  if (console.log(`🎯 最佳位置: 列${u}, 高度${x} -> 坐标(${$}, ${C})`), C + n.height > s)
    return console.warn(`❌ 位置超出容器高度: ${C + n.height} > ${s}`), null;
  const w = { x: parseFloat($.toFixed(3)), y: parseFloat(C.toFixed(3)) }, b = { width: n.width, height: n.height };
  for (const l of i)
    if (K(
      w,
      b,
      { x: l.x, y: l.y },
      { width: l.width, height: l.height }
    ))
      return console.warn("新组件位置与现有组件重叠"), null;
  return w;
}
function Ft(i, n, t, d, a, s) {
  const { width: r, height: h } = a, { gap: f } = s, o = (r - (E - 1) * f) / E + f;
  let u = Math.round(i.x / o);
  const x = Math.ceil(n.width / o), $ = E - x;
  u = Math.max(0, Math.min(u, $));
  const C = u * o;
  let w = i.y;
  const b = t.filter((l) => {
    if (l.id === d) return !1;
    const g = C < l.x + l.width && C + n.width > l.x, R = l.y + l.height <= i.y;
    return g && R;
  });
  if (b.length > 0) {
    let l = null, g = 1 / 0;
    for (const R of b) {
      const v = i.y - (R.y + R.height);
      v >= 0 && v < g && (g = v, l = R);
    }
    l && g <= f ? (w = l.y + l.height + f, console.log(`高度吸附: 距离=${g}, 吸附到Y=${w}`)) : console.log(`不进行高度吸附: 距离=${g} > gap=${f}`);
  }
  return w + n.height > h && (w = h - n.height), w = Math.max(0, w), {
    x: parseFloat(C.toFixed(3)),
    y: parseFloat(w.toFixed(3))
  };
}
function Kt(i, n, t, d = !1, a = !1) {
  if (i.length === 0) return !0;
  const { gap: s } = t, r = n.width, h = n.height, f = (r - (E - 1) * s) / E;
  if (a) {
    for (const o of i)
      (o.x + o.width > r || o.y + o.height > h) && (o.x = Math.min(o.x, r - o.width), o.y = Math.min(o.y, h - o.height), o.x = Math.max(0, o.x), o.y = Math.max(0, o.y));
    return !0;
  }
  const p = new Array(E).fill(0);
  for (const o of i) {
    d || st(o, t);
    const u = Math.ceil(o.width / (f + s)), x = Math.min(u, E);
    let $ = 0, C = 1 / 0;
    for (let b = 0; b <= E - x; b++) {
      let l = 0;
      for (let g = b; g < b + x; g++)
        l = Math.max(l, p[g] || 0);
      l < C && (C = l, $ = b);
    }
    if (o.x = parseFloat(($ * (f + s)).toFixed(3)), o.y = parseFloat(C.toFixed(3)), o.y + o.height > h)
      return console.warn("组件超出容器高度，无法完成布局"), !1;
    const w = o.y + o.height + s;
    for (let b = $; b < $ + x; b++)
      p[b] = w;
  }
  return !0;
}
function st(i, n) {
  const { cellWidth: t, gap: d } = n, a = i.minWidth || t, s = i.minHeight || B;
  i.width = Math.max(i.width, a), i.height = Math.max(i.height, s);
  const r = Math.ceil(i.width / (t + d)), h = Math.min(r, E), f = h * t + (h - 1) * d;
  i.width = parseFloat(f.toFixed(3));
}
function pt(i, n, t) {
  const { gap: d, cellWidth: a } = t, s = i.minWidth || a, r = i.minHeight || B, h = Math.max(n.width, s), f = Math.max(n.height, r), p = Math.ceil(h / (a + d)), o = Math.min(p, E), u = o * a + (o - 1) * d, x = Math.max(u, s), $ = Math.max(f, r);
  return {
    width: parseFloat(x.toFixed(3)),
    height: parseFloat($.toFixed(3))
  };
}
function nt(i, n, t, d, a, s) {
  const r = [], { width: h, height: f } = a, { gap: p } = s, o = {
    ...n,
    x: t.x,
    y: t.y,
    width: d.width,
    height: d.height
  }, u = i.filter((l) => {
    if (l.id === n.id) return !1;
    const g = !(o.y + o.height <= l.y || l.y + l.height <= o.y), R = l.x >= n.x + n.width - p;
    return g && R;
  });
  if (u.length === 0)
    return { affected: [], canResize: !0 };
  u.sort((l, g) => l.x - g.x);
  const x = o.x + o.width;
  let $ = !1, C = 0;
  for (const l of u) {
    const g = x + p - l.x;
    if (g > 0) {
      $ = !0, C = g;
      break;
    }
  }
  if (!$)
    return { affected: [], canResize: !0 };
  const w = [], b = [];
  for (const l of u) {
    const g = l.x + C;
    g + l.width > h ? b.push(l) : w.push({ ...l, x: g, y: l.y });
  }
  if (b.length > 0) {
    const l = [
      ...i.filter((g) => g.id !== n.id && !u.some((R) => R.id === g.id)),
      o,
      ...w
    ];
    b.sort((g, R) => g.x - R.x);
    for (const g of b) {
      const R = Ht(l, g, s);
      if (R + g.height > f) {
        const v = h - g.width, e = { ...g, x: v, y: g.y };
        return w.push(e), l.push(e), { affected: [], canResize: !1 };
      } else {
        const v = { ...g, x: g.x, y: R };
        w.push(v), l.push(v);
      }
    }
  }
  return r.push(...w), { affected: r, canResize: !0 };
}
function it(i, n, t, d, a, s) {
  const r = [], { height: h } = a, { gap: f } = s, p = {
    ...n,
    x: t.x,
    y: t.y,
    width: d.width,
    height: d.height
  }, o = i.filter((C) => {
    if (C.id === n.id) return !1;
    const w = !(p.x + p.width <= C.x || C.x + C.width <= p.x), b = C.y >= n.y + n.height - f;
    return w && b;
  });
  if (o.length === 0)
    return { affected: [], canResize: !0 };
  o.sort((C, w) => C.y - w.y);
  const u = p.y + p.height;
  let x = !1, $ = 0;
  for (const C of o) {
    const w = u + f - C.y;
    if (w > 0) {
      x = !0, $ = w;
      break;
    }
  }
  if (!x)
    return { affected: [], canResize: !0 };
  for (const C of o) {
    const w = C.y + $;
    if (w + C.height > h)
      return { affected: [], canResize: !1 };
    r.push({ ...C, x: parseFloat(C.x.toFixed(3)), y: parseFloat(w.toFixed(3)) });
  }
  return { affected: r, canResize: !0 };
}
function Ht(i, n, t) {
  const { gap: d } = t;
  let a = n.y + n.height + d;
  const s = i.filter((h) => h.id === n.id ? !1 : !(n.x + n.width <= h.x || h.x + h.width <= n.x));
  s.sort((h, f) => h.y - f.y);
  let r = !1;
  for (; !r; ) {
    r = !0;
    for (const h of s)
      if (!(a + n.height <= h.y || h.y + h.height <= a)) {
        a = h.y + h.height + d, r = !1;
        break;
      }
  }
  return a;
}
function kt(i, n, t, d, a, s) {
  const r = nt(i, n, t, d, a, s);
  if (!r.canResize)
    return r;
  const h = i.map((u) => {
    const x = r.affected.find(($) => $.id === u.id);
    return x ? { ...u, x: x.x, y: x.y } : u;
  }), f = it(h, n, t, d, a, s);
  if (!f.canResize)
    return f;
  const p = [], o = /* @__PURE__ */ new Set();
  for (const u of r.affected)
    p.push(u), o.add(u.id);
  for (const u of f.affected)
    if (!o.has(u.id))
      p.push(u);
    else {
      const x = p.find(($) => $.id === u.id);
      x && (x.y = u.y);
    }
  return { affected: p, canResize: !0 };
}
function Dt(i, n, t, d, a, s, r) {
  const h = d.width > n.width, f = d.height > n.height, p = t.x !== n.x || t.y !== n.y;
  if (p) {
    const o = {
      ...n,
      x: t.x,
      y: t.y,
      width: d.width,
      height: d.height
    };
    for (const u of i)
      if (u.id !== n.id && K(
        { x: o.x, y: o.y },
        { width: o.width, height: o.height },
        { x: u.x, y: u.y },
        { width: u.width, height: u.height }
      ))
        return { affected: [], canResize: !1 };
    return { affected: [], canResize: !0 };
  }
  if (r === "bottom-right" && h && f)
    return kt(i, n, t, d, a, s);
  if (r === "top-right" && h && p)
    return f ? nt(i, n, t, d, a, s) : { affected: [], canResize: !et(i, n, t, d) };
  if (r === "bottom-left" && f && p)
    return h ? it(i, n, t, d, a, s) : { affected: [], canResize: !et(i, n, t, d) };
  if (r === "top-left" && p)
    return { affected: [], canResize: !et(i, n, t, d) };
  if (h && (r === "right" || r?.includes("right")))
    return nt(i, n, t, d, a, s);
  if (f && (r === "bottom" || r?.includes("bottom")))
    return it(i, n, t, d, a, s);
  {
    const o = {
      ...n,
      x: t.x,
      y: t.y,
      width: d.width,
      height: d.height
    };
    for (const u of i)
      if (u.id !== n.id && K(
        { x: o.x, y: o.y },
        { width: o.width, height: o.height },
        { x: u.x, y: u.y },
        { width: u.width, height: u.height }
      ))
        return { affected: [], canResize: !1 };
    return { affected: [], canResize: !0 };
  }
}
function ut(i, n, t, d, a, s, r) {
  const { width: h, height: f } = a;
  if (t.x < 0 || t.y < 0 || t.x + d.width > h || t.y + d.height > f)
    return { valid: !1, affectedComponents: [] };
  const p = i.find((x) => x.id === n);
  if (!p)
    return { valid: !1, affectedComponents: [] };
  const { affected: o, canResize: u } = Dt(
    i,
    p,
    t,
    d,
    a,
    s,
    r
  );
  return { valid: u, affectedComponents: o };
}
function K(i, n, t, d) {
  const a = i.x < t.x + d.width && i.x + n.width > t.x, s = i.y < t.y + d.height && i.y + n.height > t.y;
  return a && s;
}
function et(i, n, t, d) {
  const a = {
    ...n,
    x: t.x,
    y: t.y,
    width: d.width,
    height: d.height
  };
  for (const s of i)
    if (s.id !== n.id && K(
      { x: a.x, y: a.y },
      { width: a.width, height: a.height },
      { x: s.x, y: s.y },
      { width: s.width, height: s.height }
    ))
      return !0;
  return !1;
}
function Ot(i, n, t, d, a) {
  const { width: s, height: r } = d, h = i.find((o) => o.id === n);
  if (!h)
    return { valid: !1, affectedComponents: [], finalPosition: t };
  const f = { width: h.width, height: h.height }, p = Ft(
    t,
    f,
    i,
    n,
    d,
    a
  );
  if (p.x < 0 || p.y < 0 || p.x + f.width > s || p.y + f.height > r)
    return { valid: !1, affectedComponents: [], finalPosition: p };
  for (const o of i)
    if (o.id !== n && K(
      p,
      f,
      { x: o.x, y: o.y },
      { width: o.width, height: o.height }
    ))
      return { valid: !1, affectedComponents: [], finalPosition: p };
  return { valid: !0, affectedComponents: [], finalPosition: p };
}
function Et(i, n, t, d, a, s) {
  if (n.width === t.width)
    return i;
  const r = a / d;
  return i.map((h) => {
    let f = h.x, p = h.y, o = h.width, u = h.height;
    if (r !== 1) {
      const { gap: x } = s, $ = Math.round(h.x / (d + x)), C = Math.max(1, Math.round((h.width + x) / (d + x)));
      f = $ * (a + x), o = C * a + (C - 1) * x, o = Math.max(o, a);
    }
    if (f + o > t.width) {
      const x = t.width - f;
      x > 0 ? o = Math.min(o, x) : f = Math.max(0, t.width - o);
    }
    if (p + u > t.height) {
      const x = t.height - p;
      x > 0 && (u = Math.min(u, x));
    }
    return {
      ...h,
      x: parseFloat(f.toFixed(3)),
      y: parseFloat(p.toFixed(3)),
      width: parseFloat(o.toFixed(3)),
      height: parseFloat(u.toFixed(3))
    };
  });
}
const Lt = { class: "resize-overlay" }, zt = /* @__PURE__ */ at({
  __name: "GridsterItem",
  props: {
    component: {},
    gridConfig: {},
    containerInfo: {},
    allComponents: {}
  },
  emits: ["resize", "drag", "remove"],
  setup(i, { emit: n }) {
    const t = i, d = n, a = G(!1), s = G(!1), r = G(""), h = G({ x: 0, y: 0 }), f = G({ x: 0, y: 0 }), p = Q(() => ({
      position: "absolute",
      left: `${t.component.x}px`,
      top: `${t.component.y}px`,
      width: `${t.component.width}px`,
      height: `${t.component.height}px`,
      zIndex: a.value || s.value ? S : 1,
      cursor: s.value ? o(r.value) : "move"
    })), o = (v) => ({
      top: "n-resize",
      right: "e-resize",
      bottom: "s-resize",
      left: "w-resize",
      "top-left": "nw-resize",
      "top-right": "ne-resize",
      "bottom-left": "sw-resize",
      "bottom-right": "se-resize"
    })[v] || "move", u = (v, e) => {
      e.preventDefault(), e.stopPropagation(), R(v, e);
    }, x = (v, e) => {
      e.preventDefault(), e.stopPropagation(), R(v, e);
    }, $ = (v) => {
      a.value = !0, v.dataTransfer?.setData("text/plain", t.component.id), v.dataTransfer.effectAllowed = "move";
      const e = v.currentTarget;
      v.dataTransfer?.setDragImage(e, 0, 0);
      const m = e.getBoundingClientRect();
      h.value = {
        x: t.component.x,
        y: t.component.y
      }, f.value = {
        x: v.clientX - m.left,
        y: v.clientY - m.top
      };
    }, C = (v) => {
      if (!a.value) return;
      const e = v.currentTarget.parentElement?.getBoundingClientRect();
      if (!e) return;
      const m = v.clientX - e.left - f.value.x, c = v.clientY - e.top - f.value.y;
      d("drag", t.component.id, { x: m, y: c });
    }, w = () => {
      a.value = !1, h.value = { x: 0, y: 0 }, f.value = { x: 0, y: 0 };
    }, b = () => t.allComponents ? t.allComponents.filter((v) => v.id !== t.component.id) : [], l = (v) => {
      const e = b(), m = t.gridConfig.gap;
      for (const c of e)
        if (!(t.component.y + t.component.height <= c.y || c.y + c.height <= t.component.y) && c.x + c.width <= t.component.x && v - (c.x + c.width) < m)
          return c.x + c.width + m;
      return v;
    }, g = (v) => {
      const e = b(), m = t.gridConfig.gap;
      for (const c of e)
        if (!(t.component.x + t.component.width <= c.x || c.x + c.width <= t.component.x) && c.y + c.height <= t.component.y && v - (c.y + c.height) < m)
          return c.y + c.height + m;
      return v;
    }, R = (v, e) => {
      e.preventDefault(), e.stopPropagation();
      const m = e.clientX, c = e.clientY, y = t.component.width, M = t.component.height, W = t.component.x, H = t.component.y, T = t.containerInfo.width, z = t.containerInfo.height;
      r.value = v, s.value = !0;
      const j = (I) => {
        if (I.buttons === 0) {
          L();
          return;
        }
        const Y = I.clientX - m, V = I.clientY - c;
        let k = y, D = M, _ = W, F = H;
        switch (v) {
          case "right":
            k = Math.max(t.component.minWidth || S, y + Y);
            break;
          case "left":
            k = Math.max(t.component.minWidth || S, y - Y), _ = W + y - k, _ = l(_), k = W + y - _;
            break;
          case "bottom":
            D = Math.max(t.component.minHeight || B, M + V);
            break;
          case "top":
            D = Math.max(t.component.minHeight || B, M - V), F = H + M - D, F = g(F), D = H + M - F;
            break;
          case "top-right":
            k = Math.max(t.component.minWidth || S, y + Y), D = Math.max(t.component.minHeight || B, M - V), F = H + M - D, F = g(F), D = H + M - F;
            break;
          case "top-left":
            k = Math.max(t.component.minWidth || S, y - Y), D = Math.max(t.component.minHeight || B, M - V), _ = W + y - k, F = H + M - D, _ = l(_), F = g(F), k = W + y - _, D = H + M - F;
            break;
          case "bottom-left":
            k = Math.max(t.component.minWidth || S, y - Y), D = Math.max(t.component.minHeight || B, M + V), _ = W + y - k, _ = l(_), k = W + y - _;
            break;
          case "bottom-right":
            k = Math.max(t.component.minWidth || S, y + Y), D = Math.max(t.component.minHeight || B, M + V);
            break;
        }
        _ = Math.max(0, _), F = Math.max(0, F), _ + k > T && (v.includes("left") ? (_ = T - k, _ = Math.max(0, _)) : k = T - _), F + D > z && (v.includes("top") ? (F = z - D, F = Math.max(0, F)) : D = z - F), k = Math.max(t.component.minWidth || S, k), D = Math.max(t.component.minHeight || B, D);
        let A = { width: k, height: D };
        ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(v) && (A = pt(
          t.component,
          { width: k, height: D },
          t.gridConfig
        )), _ + A.width > T && (A.width = T - _), F + A.height > z && (A.height = z - F), A.width = Math.max(t.component.minWidth || S, A.width), A.height = Math.max(t.component.minHeight || B, A.height), d("resize", t.component.id, {
          width: parseFloat(A.width.toFixed(3)),
          height: parseFloat(A.height.toFixed(3)),
          x: parseFloat(_.toFixed(3)),
          y: parseFloat(F.toFixed(3)),
          resizeType: v
        });
      }, L = () => {
        document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", L), document.removeEventListener("mouseleave", L), s.value = !1, r.value = "";
      };
      document.addEventListener("mousemove", j), document.addEventListener("mouseup", L), document.addEventListener("mouseleave", L), s.value = !0, r.value = "";
    };
    return (v, e) => {
      const m = P("icon-delete");
      return X(), N("div", {
        class: ft(["gridster-item", { resizing: s.value }]),
        style: ot(p.value),
        draggable: "true",
        onDragstart: $,
        onDrag: C,
        onDragend: w
      }, [
        J(v.$slots, "default", {}, void 0, !0),
        O("div", Lt, [
          O("div", {
            class: "edge top",
            onMousedown: e[0] || (e[0] = (c) => u("top", c))
          }, null, 32),
          O("div", {
            class: "edge right",
            onMousedown: e[1] || (e[1] = (c) => u("right", c))
          }, null, 32),
          O("div", {
            class: "edge bottom",
            onMousedown: e[2] || (e[2] = (c) => u("bottom", c))
          }, null, 32),
          O("div", {
            class: "edge left",
            onMousedown: e[3] || (e[3] = (c) => u("left", c))
          }, null, 32),
          O("div", {
            class: "corner top-left",
            onMousedown: e[4] || (e[4] = (c) => x("top-left", c))
          }, null, 32),
          O("div", {
            class: "corner top-right",
            onMousedown: e[5] || (e[5] = (c) => x("top-right", c))
          }, null, 32),
          O("div", {
            class: "corner bottom-left",
            onMousedown: e[6] || (e[6] = (c) => x("bottom-left", c))
          }, null, 32),
          O("div", {
            class: "corner bottom-right",
            onMousedown: e[7] || (e[7] = (c) => x("bottom-right", c))
          }, null, 32)
        ]),
        U(m, {
          size: 16,
          class: "remove-btn",
          onClick: e[8] || (e[8] = (c) => v.$emit("remove", i.component.id))
        })
      ], 38);
    };
  }
}), rt = (i, n) => {
  const t = i.__vccOpts || i;
  for (const [d, a] of n)
    t[d] = a;
  return t;
}, lt = /* @__PURE__ */ rt(zt, [["__scopeId", "data-v-61670cbd"]]), Yt = { class: "add-container" }, Tt = { class: "component-library" }, It = { class: "search-section" }, At = { class: "components-grid" }, Xt = ["onClick"], Bt = {
  key: 0,
  class: "selection-indicator"
}, Gt = {
  key: 0,
  class: "empty-state"
}, St = /* @__PURE__ */ at({
  __name: "AddComponent",
  props: {
    componentLibrary: {}
  },
  emits: ["confirm", "cancel"],
  setup(i, { expose: n, emit: t }) {
    const d = i, a = G(!1), s = G([]), r = t, h = (w) => {
      const b = s.value.findIndex(
        (l) => l.id === w.id
      );
      b > -1 ? s.value.splice(b, 1) : s.value.push(w);
    }, f = G(""), p = Q(() => {
      if (!f.value)
        return d.componentLibrary;
      const w = f.value.toLowerCase();
      return d.componentLibrary.filter(
        (b) => b.name.toLowerCase().includes(w)
      );
    }), o = (w) => s.value.some(
      (b) => b.id === w.id
    ), u = (w) => {
      const b = {
        ...w,
        x: 0,
        y: 0
      };
      h(b);
    }, x = () => {
      s.value.length > 0 && ($(), r("confirm", s.value), s.value = []);
    }, $ = () => {
      a.value = !1;
    };
    return n({
      open: () => {
        a.value = !0;
      },
      close: $
    }), (w, b) => {
      const l = P("a-alert"), g = P("a-input"), R = P("a-scrollbar"), v = P("a-modal");
      return X(), gt(v, {
        visible: a.value,
        "onUpdate:visible": b[1] || (b[1] = (e) => a.value = e),
        title: "添加组件 ",
        width: "1000px",
        onOk: x,
        onCancel: $
      }, {
        default: q(() => [
          O("div", Yt, [
            U(l, null, {
              default: q(() => [
                mt("已选择：" + vt(s.value.length), 1)
              ]),
              _: 1
            }),
            O("div", Tt, [
              O("div", It, [
                U(g, {
                  modelValue: f.value,
                  "onUpdate:modelValue": b[0] || (b[0] = (e) => f.value = e),
                  type: "text",
                  placeholder: "搜索组件...",
                  class: "search-input"
                }, null, 8, ["modelValue"])
              ]),
              U(R, { style: { height: "500px", overflow: "auto" } }, {
                default: q(() => [
                  O("div", At, [
                    (X(!0), N(Z, null, tt(p.value, (e) => (X(), N("div", {
                      key: e.id,
                      class: ft(["component-card", {
                        selected: o(e)
                      }]),
                      onClick: (m) => u(e)
                    }, [
                      J(w.$slots, "component", { component: e }, void 0, !0),
                      o(e) ? (X(), N("div", Bt, " ✓ ")) : dt("", !0)
                    ], 10, Xt))), 128))
                  ])
                ]),
                _: 3
              }),
              p.value.length === 0 ? (X(), N("div", Gt, " 未找到匹配的组件 ")) : dt("", !0)
            ])
          ])
        ]),
        _: 3
      }, 8, ["visible"]);
    };
  }
}), ht = /* @__PURE__ */ rt(St, [["__scopeId", "data-v-e98454be"]]), Nt = { class: "grid-header" }, Vt = { class: "grid-header_right" }, Pt = { class: "grid-container" }, qt = /* @__PURE__ */ at({
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
  setup(i, { emit: n }) {
    const t = i, d = n, a = Q({
      get: () => t.addedComponents ? t.addedComponents : [],
      set: (e) => {
        d("update:added-components", e);
      }
    }), s = ct({
      gap: 10,
      cellWidth: 0
      // 动态计算
    }), r = ct({
      width: 0,
      height: 0,
      scrollTop: 0
    }), h = G(), f = Q(() => r.height), p = () => {
      if (!h.value) return;
      const e = h.value;
      r.width = e.clientWidth, r.height = e.clientHeight;
      const m = 23 * s.gap, c = (r.width - m) / 24;
      s.cellWidth = Math.max(parseFloat(c.toFixed(3)), 20);
    }, o = Q(() => {
      const e = s.gap;
      return {
        gridTemplateColumns: `repeat(${E}, minmax(0, 1fr))`,
        gridTemplateRows: "repeat(auto-fit, 100%)",
        gap: `${e}px`,
        width: "100%",
        minHeight: `${f.value}px`
      };
    }), u = Q(() => {
      const e = s.gap;
      return {
        gridTemplateColumns: `repeat(${E}, minmax(0, 1fr))`,
        gap: `${e}px`,
        gridTemplateRows: "repeat(auto-fit, 100%)",
        width: "100%"
      };
    }), x = () => {
      if (!h.value) return;
      const e = h.value, m = r.width, c = r.height, y = s.cellWidth, M = {
        width: m
      };
      r.width = e.clientWidth, r.height = e.clientHeight, p();
      const W = s.cellWidth;
      if (m !== r.width || c !== r.height) {
        console.log("容器尺寸变化，进行自适应调整", {
          oldSize: { width: m, height: c },
          newSize: { width: r.width, height: r.height },
          oldCellWidth: y,
          newCellWidth: W,
          cellWidthRatio: W / y
        });
        const H = a.value.map((z) => ({
          id: z.id,
          x: z.x,
          width: z.width
        }));
        a.value = Et(
          a.value,
          M,
          r,
          y,
          W,
          s
        );
        const T = a.value.map((z) => ({
          id: z.id,
          x: z.x,
          width: z.width
        }));
        console.log("组件自适应调整结果", {
          before: H,
          after: T
        });
      }
    }, $ = (e, m) => {
      const c = a.value.findIndex((L) => L.id === e);
      if (c === -1) return;
      const y = a.value[c], M = {
        width: m.width || y.width,
        height: m.height || y.height
      }, W = {
        x: m.x !== void 0 ? m.x : y.x,
        y: m.y !== void 0 ? m.y : y.y
      };
      let H = M;
      const T = m.resizeType || "";
      ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(T) && (H = pt(y, M, s));
      const j = ut(
        a.value,
        e,
        W,
        H,
        r,
        s,
        T
      );
      if (j.valid)
        y.x = W.x, y.y = W.y, y.width = H.width, y.height = H.height, j.affectedComponents.length > 0 && j.affectedComponents.forEach((L) => {
          const I = a.value.find((Y) => Y.id === L.id);
          I && (I.x = L.x, I.y = L.y);
        });
      else {
        const L = ut(
          a.value,
          e,
          { x: y.x, y: y.y },
          // 保持原位置
          H,
          // 使用填充后的尺寸
          r,
          s,
          T
        );
        L.valid && (y.width = H.width, y.height = H.height, L.affectedComponents.length > 0 && L.affectedComponents.forEach((I) => {
          const Y = a.value.find((V) => V.id === I.id);
          Y && (Y.x = I.x, Y.y = I.y);
        }));
      }
    }, C = (e, m) => {
      const c = a.value.find((M) => M.id === e);
      if (!c) return;
      const y = Ot(
        a.value,
        e,
        m,
        r,
        s
      );
      y.valid && (c.x = y.finalPosition.x, c.y = y.finalPosition.y, y.affectedComponents.length > 0 && y.affectedComponents.forEach((M) => {
        const W = a.value.find((H) => H.id === M.id);
        W && (W.x = M.x, W.y = M.y);
      }));
    }, w = (e) => {
      const m = a.value.findIndex((c) => c.id === e);
      m !== -1 && a.value.splice(m, 1);
    }, b = (e) => {
      e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
    };
    let l = null;
    yt(() => {
      h.value && (l = new ResizeObserver(() => {
        x();
      }), l.observe(h.value)), x(), window.addEventListener("resize", x);
    }), wt(() => {
      l && l.disconnect(), window.removeEventListener("resize", x);
    }), Mt(
      () => r,
      () => d("get-container-size", r),
      { deep: !0 }
    );
    const g = G(), R = () => {
      g.value.open();
    }, v = (e) => {
      let m = 0;
      const c = [];
      if (e.forEach((y) => {
        const M = _t(a.value, y, r, s);
        if (M) {
          const W = {
            ...y,
            id: `${y.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            x: M.x,
            y: M.y
          };
          st(W, s), a.value.push(W), m++, console.log(`✓ 成功添加: ${y.name} 位置: (${M.x}, ${M.y})`);
        } else
          console.warn(`✗ 找不到合适位置: ${y.name}`), c.push(y.name);
      }), c.length > 0) {
        Wt.warning(`以下组件无法添加（空间不足）：
${c.join(`
`)}`);
        return;
      }
      m > 0 && console.log(`成功添加 ${m} 个组件`), g.value.close();
    };
    return (e, m) => {
      const c = P("a-button"), y = P("a-space");
      return X(), N(Z, null, [
        O("header", Nt, [
          m[1] || (m[1] = O("div", { class: "grid-header_left" }, null, -1)),
          O("div", Vt, [
            U(y, null, {
              default: q(() => [
                U(c, {
                  type: "primary",
                  onClick: R
                }, {
                  default: q(() => [...m[0] || (m[0] = [
                    mt("添加组件", -1)
                  ])]),
                  _: 1
                }),
                J(e.$slots, "extra", {}, void 0, !0)
              ]),
              _: 3
            })
          ])
        ]),
        O("div", Pt, [
          O("div", {
            ref_key: "gridContainer",
            ref: h,
            class: "grid-content",
            style: ot(o.value),
            onDragover: b
          }, [
            O("div", {
              class: "grid-background",
              style: ot(u.value)
            }, [
              (X(!0), N(Z, null, tt(bt(E), (M) => (X(), N("div", {
                class: "grid-cell",
                key: M
              }))), 128))
            ], 4),
            (X(!0), N(Z, null, tt(i.addedComponents, (M) => (X(), gt(lt, {
              key: M.id,
              component: M,
              "grid-config": s,
              "container-info": r,
              "all-components": i.addedComponents,
              onResize: $,
              onDrag: C,
              onRemove: w
            }, {
              default: q(() => [
                J(e.$slots, "item", { itemData: M }, void 0, !0)
              ]),
              _: 2
            }, 1032, ["component", "grid-config", "container-info", "all-components"]))), 128))
          ], 36)
        ]),
        U(ht, {
          ref_key: "addComponentRef",
          ref: g,
          onConfirm: v,
          "component-library": t.componentLibrary
        }, Ct({ _: 2 }, [
          tt(Object.keys(e.$slots), (M) => ({
            name: M,
            fn: q((W) => [
              J(e.$slots, M, $t(Rt(W || {})), void 0, !0)
            ])
          }))
        ]), 1032, ["component-library"])
      ], 64);
    };
  }
}), xt = /* @__PURE__ */ rt(qt, [["__scopeId", "data-v-4b3145d3"]]);
function Ut(i) {
  i.component("GridDrag", xt), i.component("GridsterItem", lt), i.component("AddComponent", ht);
}
const Zt = {
  install: Ut,
  GridDrag: xt,
  GridsterItem: lt,
  AddComponent: ht
};
export {
  ht as AddComponent,
  E as COLUMNS,
  xt as GridDrag,
  lt as GridsterItem,
  st as autoFillComponentToGrid,
  Zt as default,
  _t as findAvailablePosition,
  Dt as getAffectedComponents,
  Ut as install,
  Kt as reorganizeLayout,
  pt as resizeComponentWithAutoFill,
  Ft as snapToColumnGridWithSmartHeight,
  Ot as validateDragPosition,
  ut as validatePositionWithLayout
};
