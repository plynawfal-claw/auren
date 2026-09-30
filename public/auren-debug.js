/* TEMPORARY iOS diagnostics panel (branch debug/ios-diagnostics). Remove before merge.
 * Loaded only by the inline gate when the page is opened with ?debug=1.
 * ES5 on purpose so it runs on old iOS too. */
(function () {
  "use strict";
  var D = window.__AUREN_DBG;
  if (!D || D.ready) return;
  D.ready = true;

  var now = function () { return Date.now() - D.t0; };
  var docEl = document.documentElement;

  /* ---------------- helpers ---------------- */
  function desc(el) {
    if (!el || el.nodeType !== 1) return String(el);
    var s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    var cls = typeof el.className === "string" ? el.className : (el.getAttribute && el.getAttribute("class")) || "";
    cls = cls.trim().split(/\s+/).filter(Boolean).slice(0, 4);
    if (cls.length) s += "." + cls.join(".");
    var label = el.getAttribute("aria-label") || (el.textContent || "").replace(/\s+/g, " ").trim();
    if (label) s += ' "' + label.slice(0, 28) + '"';
    return s;
  }
  function interactive(el) {
    while (el && el.nodeType === 1) {
      var t = el.tagName;
      if (t === "A" || t === "BUTTON" || t === "INPUT" || t === "SELECT" || t === "TEXTAREA" || t === "LABEL" || t === "SUMMARY" || el.getAttribute("role") === "button") return el;
      el = el.parentElement;
    }
    return null;
  }
  function mq(q) { try { return window.matchMedia(q).matches; } catch (_) { return "err"; } }
  function sup(p) { try { return CSS.supports(p); } catch (_) { return false; } }
  function rectOf(el) {
    var r = el.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height) };
  }
  function visibleFrac(el) {
    var r = el.getBoundingClientRect(), h = window.innerHeight;
    if (!r.height) return 0;
    var v = Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0));
    return Math.round((v / r.height) * 100) / 100;
  }
  
  /* ---------------- env ---------------- */
  var QUERIES = [
    "(prefers-reduced-motion: reduce)",
    "(hover: hover) and (pointer: fine)",
    "(hover: hover)", "(hover: none)", "(pointer: fine)", "(pointer: coarse)",
    "(any-hover: hover)", "(any-pointer: fine)",
    "(min-width: 768px)", "(max-width: 767px)", "(max-width: 1023px)",
    "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    "(prefers-color-scheme: dark)", "(orientation: portrait)"
  ];
  function webgl() {
    try {
      var c = document.createElement("canvas");
      var gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return "none";
      var v = gl instanceof (window.WebGL2RenderingContext || function () {}) ? "webgl2" : "webgl1";
      var lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      return v;
    } catch (_) { return "error: " + e.message; }
  }
  var webglResult = null;
  function env() {
    var ua = navigator.userAgent, ios = /OS (\d+)_(\d+)(?:_(\d+))?/.exec(ua);
    var vv = window.visualViewport;
    var m = {};
    QUERIES.forEach(function (q) { m[q] = mq(q); });
    if (webglResult === null) webglResult = webgl();
    var reduced = m[QUERIES[0]], fine = m[QUERIES[1]], wide = m["(min-width: 768px)"];
    return {
      url: location.href,
      ua: ua,
      iosVersion: ios ? ios[1] + "." + ios[2] + (ios[3] ? "." + ios[3] : "") : null,
      standalone: !!navigator.standalone,
      navType: (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || {}).type || null,
      dpr: window.devicePixelRatio,
      inner: [window.innerWidth, window.innerHeight],
      screen: [screen.width, screen.height],
      visualViewport: vv ? { w: Math.round(vv.width), h: Math.round(vv.height), scale: vv.scale, offsetTop: Math.round(vv.offsetTop) } : null,
      clientWidth: docEl.clientWidth,
      scrollWidth: docEl.scrollWidth,
      bodyScrollWidth: document.body ? document.body.scrollWidth : null,
      horizontalOverflow: docEl.scrollWidth > docEl.clientWidth,
      media: m,
      touch: { maxTouchPoints: navigator.maxTouchPoints, ontouchstart: "ontouchstart" in window, PointerEvent: !!window.PointerEvent },
      features: {
        IntersectionObserver: !!window.IntersectionObserver,
        ResizeObserver: !!window.ResizeObserver,
        nativeTimelinesAtBoot: D.native,
        nativeTimelinesAfterFlag: D.nativeAfterFlag || null,
        inert: "inert" in HTMLElement.prototype,
        webgl: webglResult,
        colorMix: sup("color: color-mix(in srgb, red 50%, blue)"),
        containerType: sup("container-type: inline-size"),
        svh: sup("height: 100svh"),
        individualTranslate: sup("translate: 0 10%"),
        backdropFilter: sup("backdrop-filter: blur(4px)") || sup("-webkit-backdrop-filter: blur(4px)"),
        has: sup("selector(:has(a))"),
        animationTimeline: sup("animation-timeline: view()")
      },
      gating: {
        "Surface + Signature WebGL (needs !reduced && >=768px && webgl)": !reduced && wide && webglResult !== "none",
        "HeroDepth pointer tilt (fine) else scroll tilt": fine ? "pointer" : "scroll",
        "HeroParallax card motion (needs >=768px)": !reduced && wide,
        "SpatialStage tilt (needs fine)": !reduced && fine,
        "MagneticButtons (needs fine)": !reduced && fine,
        "FocusCards hover (needs >=768 && fine)": !reduced && m["(min-width: 768px) and (hover: hover) and (pointer: fine)"],
        ".btn hover fill (hover:hover)": m["(hover: hover)"],
        "WhatWeBuild: IO drives stage (<1024) else hover": m["(max-width: 1023px)"] ? "scroll-IO" : "hover",
        "IntelligentSystems: viewport-enter (<768) else hover": m["(max-width: 767px)"] ? "viewport-enter" : "hover",
        "WhyAuren pinned scroll scene": !reduced
      },
      flags: D.flags
    };
  }
  function overflowOffenders() {
    var cw = docEl.clientWidth, out = [];
    var all = document.body ? document.body.getElementsByTagName("*") : [];
    for (var i = 0; i < all.length && out.length < 12; i++) {
      var el = all[i];
      if (host && (el === host)) continue;
      var r = el.getBoundingClientRect();
      if (r.width && (r.right > cw + 1 || r.left < -1)) {
        var cs = getComputedStyle(el);
        if (cs.position === "fixed") continue;
        out.push({ el: desc(el), left: Math.round(r.left), right: Math.round(r.right) });
      }
    }
    return out;
  }

  /* ---------------- live counters ---------------- */
  var C = { scroll: 0, resize: 0, vvResize: 0, vvScroll: 0, orientation: 0, maxScrollX: 0, pagehide: 0 };
  addEventListener("scroll", function () { C.scroll++; if (window.scrollX > C.maxScrollX) C.maxScrollX = window.scrollX; onScrollSample(); }, { passive: true });
  addEventListener("resize", function () { C.resize++; D.push({ type: "info", msg: "resize " + window.innerWidth + "x" + window.innerHeight }); }, { passive: true });
  addEventListener("orientationchange", function () { C.orientation++; });
  if (window.visualViewport) {
    visualViewport.addEventListener("resize", function () { C.vvResize++; });
    visualViewport.addEventListener("scroll", function () { C.vvScroll++; });
  }
  var fps = 0, frames = 0, maxGap = 0, lastF = performance.now(), fpsT = lastF;
  (function loop(t) {
    frames++;
    var gap = t - lastF; lastF = t;
    if (gap > maxGap) maxGap = gap;
    if (t - fpsT >= 1000) { fps = frames; frames = 0; fpsT = t; }
    requestAnimationFrame(loop);
  })(performance.now());
  var longTasks = 0;
  try { new PerformanceObserver((function (l) { longTasks += l.getEntries().length; return null; })).observe({ entryTypes: ["longtask"] }); } catch (_) { longTasks = "unsupported"; }

  function live() {
    var hs = getComputedStyle(docEl), bs = document.body ? getComputedStyle(document.body) : {};
    var menu = document.querySelector('[aria-controls="mobile-menu"]');
    var vv = window.visualViewport;
    return {
      t: now(),
      scrollY: Math.round(window.scrollY), scrollX: Math.round(window.scrollX),
      docHeight: docEl.scrollHeight, innerH: window.innerHeight,
      vv: vv ? [Math.round(vv.width), Math.round(vv.height), Math.round(vv.offsetTop), vv.scale] : null,
      htmlClass: docEl.className.split(/\s+/).filter(function (c) { return !/^__variable|^[a-z]+_[a-f0-9]+/.test(c); }).join(" "),
      htmlOverflow: hs.overflow, bodyOverflow: bs.overflow, bodyInlineOverflow: document.body ? document.body.style.overflow : "",
      menuExpanded: menu ? menu.getAttribute("aria-expanded") : null,
      fps: fps, maxFrameGapMs: Math.round(maxGap), longTasks: longTasks,
      counters: C
    };
  }

  /* ---------------- animation probes ---------------- */
  var PROBES = [
    ["hero-headline(entrance)", ".hero-headline__line > *", ["transform", "opacity"]],
    ["hero-sculpture(scroll)", ".hero-signature", ["transform"]],
    ["hero-depth(scroll tilt)", "PARENT:[data-hero-out]", ["transform"]],
    ["hero-out(scroll fade)", "[data-hero-out]", ["translate", "opacity"]],
    ["hero-webgl-canvas", ".hero-scene canvas", ["opacity"]],
    ["parallax-card", ".au-parallax-card", ["transform"]],
    ["why-piece", "section[aria-labelledby=why-heading] .will-change-transform", ["transform", "opacity"]],
    ["data-depth", "[data-depth]", ["translate"]],
    ["reveal-3d", "[data-reveal-3d]", ["opacity", "transform"]],
    ["reveal-mask", "[data-reveal-mask]", ["clip-path"]],
    ["systems-path", "ATTR:.systems-section path", []],
    ["capability-cell", ".capability-cell", ["left", "width"]]
  ];
  var probeState = {};
  function findProbe(sel) {
    if (sel.indexOf("PARENT:") === 0) { var c = document.querySelector(sel.slice(7)); return c && c.parentElement; }
    if (sel.indexOf("ATTR:") === 0) return document.querySelector(sel.slice(5));
    return document.querySelector(sel);
  }
  function probeValue(p, el) {
    if (p[1].indexOf("ATTR:") === 0) return (el.getAttribute("stroke-dasharray") || "") + "|" + (el.getAttribute("stroke-dashoffset") || "") + "|" + (el.style.strokeDashoffset || "") + "|" + (el.getAttribute("pathLength") || "");
    var cs = getComputedStyle(el);
    return p[2].map(function (k) { return cs.getPropertyValue(k); }).join(" | ");
  }
  function sampleProbes() {
    PROBES.forEach(function (p) {
      var st = probeState[p[0]] || (probeState[p[0]] = { found: false, changes: 0, first: null, last: null, firstChangeAtY: null, lastChangeAtY: null });
      var el = findProbe(p[1]);
      st.found = !!el;
      if (!el) return;
      var v = probeValue(p, el);
      if (st.first === null) st.first = v;
      else if (v !== st.last) {
        st.changes++;
        if (st.firstChangeAtY === null) st.firstChangeAtY = Math.round(window.scrollY);
        st.lastChangeAtY = Math.round(window.scrollY);
      }
      st.last = v;
      st.onScreen = visibleFrac(el);
    });
  }
  var sampleQueued = false;
  function onScrollSample() {
    if (sampleQueued) return;
    sampleQueued = true;
    requestAnimationFrame(function () { sampleQueued = false; sampleProbes(); });
  }
  setInterval(sampleProbes, 250);

  function animations() {
    if (!document.getAnimations) return { supported: false };
    var list = document.getAnimations(), byTimeline = {}, scrollDriven = [];
    list.forEach(function (a) {
      var tl = a.timeline, name = tl ? (tl.constructor && tl.constructor.name) || "?" : "null";
      byTimeline[name] = (byTimeline[name] || 0) + 1;
      if (name !== "DocumentTimeline" && scrollDriven.length < 15) {
        var ct = a.currentTime;
        scrollDriven.push({ timeline: name, state: a.playState, currentTime: ct === null ? null : String(ct), target: a.effect && a.effect.target ? desc(a.effect.target) : null });
      }
    });
    return { total: list.length, byTimeline: byTimeline, scrollDriven: scrollDriven };
  }

  /* ---------------- DOM observers: reveals, aria-pressed, aria-expanded ---------------- */
  var reveals = { shown: 0, shownOffscreen: 0, events: [] };
  var pressed = [];
  var lastTapAt = -1e9;
  function revealCounts() {
    return {
      reveal: document.querySelectorAll(".reveal").length,
      revealVisible: document.querySelectorAll(".reveal.is-visible").length,
      textReveal: document.querySelectorAll(".tr").length,
      textRevealVisible: document.querySelectorAll(".tr.is-visible").length,
      shownWhileOffscreen: reveals.shownOffscreen,
      events: reveals.events.slice(-25)
    };
  }
  function stageFor(btn) {
    var s = btn.closest("section");
    if (!s) return null;
    return s.querySelector(".capability-stage") || s.querySelector(".systems-image");
  }
  try {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        var el = m.target;
        if (el === docEl) {
          D.mark("html.class", docEl.className.split(/\s+/).filter(function (c) { return /^(js|depth-on|lenis.*|dbg-.*)$/.test(c); }).join(" "));
        } else if (m.attributeName === "class") {
          var was = (m.oldValue || "").indexOf("is-visible") !== -1;
          var cls = typeof el.className === "string" ? el.className : "";
          if (!was && cls.indexOf("is-visible") !== -1 && (/\breveal\b/.test(cls) || /\btr\b/.test(cls))) {
            var r = el.getBoundingClientRect(), off = r.top > window.innerHeight || r.bottom < 0;
            reveals.shown++;
            if (off) reveals.shownOffscreen++;
            reveals.events.push({ t: now(), el: desc(el).slice(0, 60), top: Math.round(r.top), offscreen: off });
            if (reveals.events.length > 80) reveals.events.shift();
          }
        } else if (m.attributeName === "aria-pressed" && el.getAttribute("aria-pressed") === "true") {
          var stage = stageFor(el);
          pressed.push({
            t: now(), button: desc(el).slice(0, 60),
            cause: now() - lastTapAt < 800 ? "tap" : "scroll/other",
            stage: stage ? { rect: rectOf(stage), visible: visibleFrac(stage) } : null
          });
          if (pressed.length > 40) pressed.shift();
        } else if (m.attributeName === "aria-expanded") {
          D.push({ type: "info", msg: "aria-expanded " + desc(el).slice(0, 40) + " -> " + el.getAttribute("aria-expanded") + " (body overflow=" + document.body.style.overflow + ")" });
        }
      });
    }).observe(docEl, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "aria-pressed", "aria-expanded"] });
  } catch (_) { D.push({ type: "info", msg: "MutationObserver failed " + e.message }); }

  /* ---------------- tap probe ---------------- */
  var taps = [], inspects = [], inspectArmed = false, cur = null;
  function inPanel(e) { return host && e.composedPath && e.composedPath().indexOf(host) !== -1; }
  function startTap(e, x, y, kind) {
    if (inPanel(e)) return;
    lastTapAt = now();
    var target = e.target, fp = document.elementFromPoint(x, y), ia = interactive(target);
    cur = { t: now(), kind: kind, x: Math.round(x), y: Math.round(y), target: desc(target), fromPoint: desc(fp), samePoint: fp === target, interactive: ia ? desc(ia) : null, moved: false, cancel: false, up: false, click: null, touchendPrevented: false, clickPrevented: false };
    cur._x = x; cur._y = y;
    var rec = cur;
    taps.push(rec);
    if (taps.length > 40) taps.shift();
    setTimeout(function () {
      if (rec.interactive && !rec.moved && !rec.cancel && !rec.click) rec.verdict = "NO CLICK (swallowed)";
      else if (rec.click) rec.verdict = "click ok" + (rec.clickPrevented ? " (defaultPrevented)" : "");
      else if (rec.moved || rec.cancel) rec.verdict = "scroll gesture";
      else rec.verdict = "no interactive target";
      if (panelOpen && tab === "taps") render();
    }, 800);
  }
  document.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") startTap(e, e.clientX, e.clientY, "pointer:" + e.pointerType); else startTap(e, e.clientX, e.clientY, "mouse"); }, { capture: true, passive: true });
  if (!window.PointerEvent) document.addEventListener("touchstart", function (e) { var t = e.touches[0]; if (t) startTap(e, t.clientX, t.clientY, "touch"); }, { capture: true, passive: true });
  document.addEventListener("pointermove", function (e) { if (cur && !cur.up && (Math.abs(e.clientX - cur._x) > 10 || Math.abs(e.clientY - cur._y) > 10)) cur.moved = true; }, { capture: true, passive: true });
  document.addEventListener("touchmove", function (e) { var t = e.touches[0]; if (cur && t && (Math.abs(t.clientX - cur._x) > 10 || Math.abs(t.clientY - cur._y) > 10)) cur.moved = true; }, { capture: true, passive: true });
  document.addEventListener("pointercancel", function () { if (cur) cur.cancel = true; }, { capture: true, passive: true });
  document.addEventListener("pointerup", function () { if (cur) cur.up = true; }, { capture: true, passive: true });
  window.addEventListener("touchend", function (e) { if (cur && e.defaultPrevented) cur.touchendPrevented = true; }, false);
  document.addEventListener("click", function (e) {
    if (inPanel(e)) return;
    if (inspectArmed) {
      e.preventDefault(); e.stopImmediatePropagation();
      inspectArmed = false;
      doInspect(e.clientX, e.clientY);
      return;
    }
    if (cur && now() - cur.t < 1500 && !cur.click) { cur.click = desc(e.target); cur.clickDelayMs = now() - cur.t; }
  }, true);
  window.addEventListener("click", function (e) { if (cur && cur.click && e.defaultPrevented) cur.clickPrevented = true; }, false);

  function doInspect(x, y) {
    var els = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
    var rows = [];
    for (var i = 0; i < els.length && rows.length < 10; i++) {
      var el = els[i];
      if (el === host) continue;
      var cs = getComputedStyle(el);
      rows.push({
        el: desc(el).slice(0, 70), position: cs.position, zIndex: cs.zIndex, pointerEvents: cs.pointerEvents,
        opacity: cs.opacity, transform: cs.transform === "none" ? "none" : cs.transform.slice(0, 50),
        transformStyle: cs.transformStyle, perspective: cs.perspective, inert: !!el.closest("[inert]"), touchAction: cs.touchAction
      });
    }
    inspects.push({ t: now(), x: Math.round(x), y: Math.round(y), stack: rows });
    if (inspects.length > 10) inspects.shift();
    tab = "taps"; openPanel(); render();
  }

  /* ---------------- previous page (survives full reloads / crashes) ---------------- */
  var PREV = "auren-debug-prev", previous = null;
  try { previous = JSON.parse(sessionStorage.getItem(PREV) || "null"); } catch (_) {}
  addEventListener("pagehide", function () {
    C.pagehide++;
    try { sessionStorage.setItem(PREV, JSON.stringify({ url: location.href, t: now(), log: D.log.slice(-40), taps: taps.slice(-15), marks: D.marks.slice(-30) })); } catch (_) {}
  });

  /* ---------------- report ---------------- */
  function resources() {
    try {
      var list = performance.getEntriesByType("resource"), bad = [];
      list.forEach(function (r) { if ((r.responseStatus && r.responseStatus >= 400)) bad.push({ url: r.name, status: r.responseStatus }); });
      return { count: list.length, failed: bad };
    } catch (_) { return { error: e.message }; }
  }
  function report() {
    sampleProbes();
    return {
      generated: new Date().toISOString(), sinceBootMs: now(),
      env: env(), live: live(), overflowOffenders: overflowOffenders(),
      log: D.log, marks: D.marks, probes: probeState, animations: animations(),
      reveals: revealCounts(), pressed: pressed, taps: taps.map(function (t) { var c = {}; for (var k in t) if (k.charAt(0) !== "_") c[k] = t[k]; return c; }),
      inspects: inspects, resources: resources(), previousPage: previous
    };
  }

  /* ---------------- panel UI (shadow DOM) ---------------- */
  var host = null, root = null, panelOpen = false, tab = "errors";
  var CSS_TEXT =
    ":host{all:initial}" +
    "*{box-sizing:border-box;font:11px/1.35 ui-monospace,Menlo,monospace;color:#e8ecf2}" +
    ".pill{position:fixed;top:calc(env(safe-area-inset-top) + 70px);right:6px;z-index:2147483647;background:#b00020;border:0;border-radius:14px;padding:6px 10px;color:#fff;font-weight:700;touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
    ".pill.ok{background:#1f6f43}" +
    ".sheet{position:fixed;left:0;right:0;bottom:0;height:58vh;z-index:2147483647;background:rgba(8,10,14,.97);border-top:2px solid #b00020;display:flex;flex-direction:column;touch-action:manipulation}" +
    ".bar{display:flex;gap:4px;flex-wrap:wrap;padding:6px;border-bottom:1px solid #333}" +
    "button{background:#222a36;border:1px solid #3a4658;border-radius:6px;padding:6px 8px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
    "button.on{background:#3b6fd8;border-color:#3b6fd8}button.warn{background:#8a5a00}" +
    ".body{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:6px 8px 40px}" +
    "pre{white-space:pre-wrap;word-break:break-word;margin:0 0 6px}" +
    ".e{color:#ff8a8a}.w{color:#ffd27a}.i{color:#9fb3c8}.g{color:#8fe3a8}" +
    "textarea{width:100%;height:40vh;background:#000;border:1px solid #444}";
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

  function mount() {
    if (host || !document.body) return;
    host = document.createElement("div");
    host.id = "auren-debug-host";
    host.setAttribute("data-lenis-prevent", "");
    host.setAttribute("style", "position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647");
    root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    var st = el("style"); st.textContent = CSS_TEXT; root.appendChild(st);
    var pill = el("button", "pill", "DBG"); pill.id = "pill";
    pill.addEventListener("click", function () { panelOpen ? closePanel() : openPanel(); });
    root.appendChild(pill);
    document.body.appendChild(host);
    updatePill();
    D.push({ type: "info", msg: "panel mounted (html.js=" + docEl.classList.contains("js") + ", depth-on=" + docEl.classList.contains("depth-on") + ")" });
  }
  function errCount() { return D.log.filter(function (e) { return e.type !== "info"; }).length; }
  function updatePill() {
    if (!root) return;
    var p = root.getElementById ? root.getElementById("pill") : root.querySelector("#pill");
    if (!p) return;
    var n = errCount(), swallowed = taps.filter(function (t) { return t.verdict && t.verdict.indexOf("NO CLICK") === 0; }).length;
    p.textContent = "DBG " + n + "e" + (swallowed ? " " + swallowed + "x" : "") + (inspectArmed ? " INSPECT" : "");
    p.className = "pill" + (n || swallowed ? "" : " ok");
  }
  D.onpush = function () { updatePill(); if (panelOpen && tab === "errors") render(); };
  D.onmark = function () { if (panelOpen && tab === "anim") render(); };

  var sheet = null, bodyEl = null;
  function openPanel() {
    if (!root) mount();
    panelOpen = true;
    if (!sheet) {
      sheet = el("div", "sheet");
      var bar = el("div", "bar");
      ["errors", "env", "live", "anim", "taps"].forEach(function (name) {
        var b = el("button", "", name); b.setAttribute("data-tab", name);
        b.addEventListener("click", function () { tab = name; render(); });
        bar.appendChild(b);
      });
      var ins = el("button", "warn", "Inspect");
      ins.addEventListener("click", function () { inspectArmed = true; closePanel(); updatePill(); });
      var copy = el("button", "", "Copy report");
      copy.addEventListener("click", copyReport);
      var share = el("button", "", "Share");
      share.addEventListener("click", shareReport);
      var clr = el("button", "", "Clear");
      clr.addEventListener("click", function () { D.log.length = 0; taps.length = 0; pressed.length = 0; inspects.length = 0; render(); updatePill(); });
      var x = el("button", "", "×");
      x.addEventListener("click", closePanel);
      [ins, copy, share, clr, x].forEach(function (b) { bar.appendChild(b); });
      bodyEl = el("div", "body");
      sheet.appendChild(bar); sheet.appendChild(bodyEl);
      root.appendChild(sheet);
    }
    sheet.style.display = "flex";
    render();
  }
  function closePanel() { panelOpen = false; if (sheet) sheet.style.display = "none"; }

  function pre(text, cls) { var p = el("pre", cls || "", text); bodyEl.appendChild(p); }
  function render() {
    if (!sheet || !panelOpen) return;
    var btns = sheet.querySelectorAll("[data-tab]");
    for (var i = 0; i < btns.length; i++) btns[i].className = btns[i].getAttribute("data-tab") === tab ? "on" : "";
    bodyEl.innerHTML = "";
    if (tab === "errors") {
      pre("flags: " + JSON.stringify(D.flags) + "  (reload with ?debug=1&dbg-no3d=1 / dbg-nonative=1 / dbg-noresize=1 / dbg-nolenis=1; ?debug=0 to turn off)", "i");
      if (previous) pre("previous page: " + previous.url + " (" + (previous.log || []).length + " log entries) — included in report", "i");
      if (!D.log.length) pre("No errors captured.", "g");
      D.log.slice().reverse().forEach(function (e) {
        var cls = e.type === "info" ? "i" : e.type.indexOf("warn") !== -1 ? "w" : "e";
        pre("[" + e.t + "ms] " + e.type + ": " + e.msg + (e.src ? "\n  @ " + e.src + (e.line ? ":" + e.line + ":" + e.col : "") : "") + (e.stack ? "\n  " + e.stack : ""), cls);
      });
    } else if (tab === "env") {
      var en = env();
      pre(JSON.stringify(en, null, 1));
      pre("overflow offenders:\n" + JSON.stringify(overflowOffenders(), null, 1), en.horizontalOverflow ? "e" : "i");
    } else if (tab === "live") {
      pre(JSON.stringify(live(), null, 1));
    } else if (tab === "anim") {
      sampleProbes();
      pre("PROBES (changes counted while you scroll; 0 changes after scrolling past = not animating):", "i");
      Object.keys(probeState).forEach(function (k) {
        var s = probeState[k];
        pre(k + ": " + (s.found ? "changes=" + s.changes + " onScreen=" + s.onScreen + " firstChangeY=" + s.firstChangeAtY + "\n  last=" + String(s.last).slice(0, 110) : "NOT FOUND on this page"), s.found ? (s.changes ? "g" : "w") : "i");
      });
      pre("ANIMATIONS: " + JSON.stringify(animations(), null, 1));
      pre("REVEALS: " + JSON.stringify(revealCounts(), null, 1));
      pre("MARKS:\n" + D.marks.slice(-60).map(function (m) { return "[" + m.t + "] " + m.n + " " + (m.d === undefined ? "" : JSON.stringify(m.d)); }).join("\n"));
    } else if (tab === "taps") {
      pre("Tap anything on the page, then come back here. 'NO CLICK' = tap was swallowed. Inspect = next tap is blocked and the layer stack is listed.", "i");
      inspects.slice().reverse().forEach(function (s) { pre("INSPECT @" + s.x + "," + s.y + "\n" + JSON.stringify(s.stack, null, 1), "w"); });
      pressed.slice().reverse().forEach(function (p) { pre("aria-pressed [" + p.t + "] " + p.button + " cause=" + p.cause + " stage=" + JSON.stringify(p.stage), p.stage && p.stage.visible < 0.3 ? "e" : "g"); });
      taps.slice().reverse().forEach(function (t) {
        pre("[" + t.t + "] " + (t.verdict || "…") + " " + t.kind + " @" + t.x + "," + t.y + "\n  target=" + t.target + "\n  fromPoint=" + t.fromPoint + (t.samePoint ? "" : "  (DIFFERENT)") + "\n  interactive=" + t.interactive + "\n  click=" + t.click + (t.clickDelayMs !== undefined ? " +" + t.clickDelayMs + "ms" : "") + (t.touchendPrevented ? " touchend.preventDefault!" : ""), t.verdict && t.verdict.indexOf("NO CLICK") === 0 ? "e" : "");
      });
    }
  }

  function reportText() { return JSON.stringify(report(), null, 1); }

  /* ---------------- send to the Mac (dev server only) ----------------
     Posts the full report to /api/debug-report every few seconds and when
     the page is hidden, so a physical iPhone can be read without a cable.
     The route answers 404 outside `next dev`, and sending stops at once. */
  var SESSION = (function () {
    var fresh = (/iPhone|iPad/.test(navigator.userAgent) ? "ios-" : "dev-") + Date.now().toString(36);
    try {
      var s = sessionStorage.getItem("auren-debug-session");
      if (!s) { s = fresh; sessionStorage.setItem("auren-debug-session", s); }
      return s;
    } catch (_) { return fresh; }
  })();
  var sinkDead = false, sent = 0;
  function payload() { var r = report(); r.session = SESSION; r.sent = ++sent; return JSON.stringify(r); }
  function sendReport() {
    if (sinkDead) return;
    try {
      var x = new XMLHttpRequest();
      x.open("POST", "/api/debug-report", true);
      x.setRequestHeader("Content-Type", "application/json");
      x.onload = function () { if (x.status === 404) sinkDead = true; };
      x.send(payload());
    } catch (_) {}
  }
  setTimeout(sendReport, 3000);
  setInterval(sendReport, 5000);
  addEventListener("pagehide", function () {
    if (sinkDead || !navigator.sendBeacon) return;
    try { navigator.sendBeacon("/api/debug-report", new Blob([payload()], { type: "application/json" })); } catch (_) {}
  });
  function showText(text) {
    tab = "report"; bodyEl.innerHTML = "";
    pre("Clipboard unavailable — select all and copy:", "w");
    var ta = el("textarea"); ta.value = text; bodyEl.appendChild(ta);
    ta.focus(); ta.select();
  }
  function copyReport() {
    var text = reportText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { D.push({ type: "info", msg: "report copied (" + text.length + " chars)" }); tab = "errors"; render(); }, function () { showText(text); });
    } else showText(text);
  }
  function shareReport() {
    var text = reportText();
    if (navigator.share) navigator.share({ title: "AUREN debug report", text: text }).catch(function () {});
    else showText(text);
  }

  /* ---------------- dbg-no3d isolation CSS (only when flag set) ---------------- */
  if (D.flags.no3d) {
    var s3 = document.createElement("style");
    s3.textContent =
      "html.dbg-no3d main{perspective:none!important}" +
      "html.dbg-no3d *{transform-style:flat!important}" +
      "html.dbg-no3d :has(> [data-hero-out]){transform:none!important}" +
      "html.dbg-no3d .magnetic-btn{transform:none!important;translate:none!important}" +
      "html.dbg-no3d .spatial-object{transform:none!important;backface-visibility:visible!important}";
    (document.head || docEl).appendChild(s3);
  }

  /* ---------------- boot ---------------- */
  D.mark("panel-script-loaded", { readyState: document.readyState, htmlClass: docEl.className.indexOf(" js") !== -1 || docEl.classList.contains("js") });
  function tryMount() {
    // Wait for hydration (html.js) so the host is not seen by React's hydration; mount anyway after 4s.
    if (docEl.classList.contains("js") || now() > 4000) mount();
    else setTimeout(tryMount, 200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tryMount);
  else tryMount();
  addEventListener("load", function () { D.mark("window-load", { htmlJs: docEl.classList.contains("js"), depthOn: docEl.classList.contains("depth-on") }); });
  setTimeout(function () {
    var r = revealCounts();
    D.mark("t+5s", { htmlJs: docEl.classList.contains("js"), depthOn: docEl.classList.contains("depth-on"), lenis: docEl.classList.contains("lenis"), reveal: r.revealVisible + "/" + r.reveal, textReveal: r.textRevealVisible + "/" + r.textReveal, overflow: docEl.scrollWidth > docEl.clientWidth });
  }, 5000);
})();
