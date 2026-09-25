/**
 * The hero surface.
 *
 * One dimensional field — soft metal under moving light — that responds to the
 * pointer. Deliberately not four of anything, and deliberately colourless: the
 * only hue is `--lume`, the single accent, and even that is nearly white.
 *
 * Raw WebGL, one fullscreen triangle. Three.js would add ~150KB to draw a quad.
 *
 * Two things here are load-bearing and easy to undo by accident:
 *   1. Cleanup never calls WEBGL_lose_context. React Strict Mode remounts in
 *      development, and getContext on a canvas whose context was lost returns
 *      the dead one — the surface then silently never appears.
 *   2. The canvas must never be display:none while initialising. A hidden
 *      element measures 0x0, so the drawing buffer is sized to 1x1 and the
 *      IntersectionObserver never reports it visible.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;    // 0..1, already spring-smoothed on the CPU
uniform float u_intensity;
uniform vec3  u_base;
uniform vec3  u_lume;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Four octaves. Five looks marginally better and costs noticeably more on a
// fullscreen fragment shader; the difference is invisible under the vignette.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;

  vec2 p = uv;
  p.x *= aspect;

  // Domain warp. This is what makes the field read as a material being bent
  // rather than as a noise texture scrolling past.
  float t = u_time * 0.045;
  vec2 q = vec2(
    fbm(p * 1.5 + t),
    fbm(p * 1.5 + vec2(3.2, 1.7) - t)
  );
  float field = fbm(p * 2.0 + q * 0.85);

  // The light the pointer carries.
  vec2 lp = u_pointer;
  lp.x *= aspect;
  float d = distance(p, lp);
  float light = exp(-d * d * 2.0);

  // Specular response of the warped surface.
  float sheen = pow(clamp(field * 1.35, 0.0, 1.0), 3.6);

  // Weighted toward the moving light rather than the ambient field. The flat
  // ambient term is kept small on purpose: raised, it lifts the whole frame to
  // an even grey and the surface stops reading as lit at all.
  float v = sheen * 0.26 + light * 0.42 + field * 0.026;
  vec3 col = u_base + u_lume * v * u_intensity;

  // Vignette, so it reads as an object in space rather than as wallpaper.
  // The floor is deep — the corners should fall to near-black so the centre
  // has something to be bright against.
  float vig = smoothstep(1.3, 0.2, length(uv - 0.5));
  col *= mix(0.28, 1.0, vig);

  // Dither — without it, this much flat gradient bands badly on 8-bit panels.
  float g = fract(sin(dot(gl_FragCoord.xy + u_time * 31.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.013;

  gl_FragColor = vec4(col, 1.0);
}
`;

export type SurfaceHandle = {
  setPointer: (x: number, y: number) => void;
  setIntensity: (v: number) => void;
  destroy: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[surface] shader compile failed:", gl.getShaderInfoLog(sh));
    }
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

/** Keep in sync with --color-ink and --color-lume. */
const BASE = rgb("0a0b0d");
const LUME = rgb("dce6f5");

export function createSurface(canvas: HTMLCanvasElement): SurfaceHandle | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
  }) as WebGLRenderingContext | null;
  if (!gl || gl.isContextLost()) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[surface] link failed:", gl.getProgramInfoLog(prog));
    }
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    pointer: gl.getUniformLocation(prog, "u_pointer"),
    intensity: gl.getUniformLocation(prog, "u_intensity"),
  };
  gl.uniform3fv(gl.getUniformLocation(prog, "u_base"), new Float32Array(BASE));
  gl.uniform3fv(gl.getUniformLocation(prog, "u_lume"), new Float32Array(LUME));

  let px = 0.5;
  let py = 0.55;
  let intensity = 1;
  let raf = 0;
  let running = false;
  let disposed = false;
  const t0 = performance.now();

  // Four octaves of fbm over every pixel is the most expensive thing on the
  // page. 1.25 keeps it smooth on a retina laptop; 2.0 does not.
  const DPR_CAP = 1.25;

  function resize() {
    if (disposed || !gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(u.res, canvas.width, canvas.height);
  }

  function draw(now: number) {
    if (disposed || !gl) return;
    resize();
    gl.uniform1f(u.time, (now - t0) / 1000);
    gl.uniform2f(u.pointer, px, py);
    gl.uniform1f(u.intensity, intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running || disposed) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
    threshold: 0,
  });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  const ro = new ResizeObserver(() => draw(performance.now()));
  ro.observe(canvas);

  draw(performance.now());
  start();

  return {
    setPointer: (x, y) => {
      px = x;
      py = y;
    },
    setIntensity: (v) => {
      intensity = v;
    },
    destroy: () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // Intentionally no WEBGL_lose_context — see the note at the top.
    },
  };
}
