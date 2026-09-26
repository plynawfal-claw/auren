/**
 * The AUREN signature object.
 *
 * One abstract sculpture, raymarched in a single fragment shader: six thin
 * architectural blades bent along their length, crossed by three shorter ones,
 * with seven points of light drifting between them. It is the studio's motif
 * made physical — separate elements converging on one axis — rather than a
 * planet with rings.
 *
 * Raw WebGL, one fullscreen triangle over a bounded region. Three.js would add
 * ~150KB and a scene graph to draw a dozen rounded boxes.
 *
 * The three things that are load-bearing here, and easy to undo by accident:
 *
 *   1. `u_unfold` is the scroll. It drives blade separation AND camera
 *      distance AND the light, so the object transforms rather than merely
 *      moving. Scroll is a material property of the sculpture.
 *   2. The output is written PREMULTIPLIED — `vec4(col * alpha, alpha)` — and
 *      the context is created with `premultipliedAlpha: true` so the canvas
 *      composites over the hero's light field instead of punching a black
 *      rectangle through it.
 *   3. Cleanup never calls WEBGL_lose_context. React Strict Mode remounts in
 *      development, and `getContext` on a canvas whose context was lost returns
 *      the dead one — the sculpture then silently never appears.
 *
 * Shading is deliberately cheap: a bounding-sphere early-out, a 72-step march
 * with a 0.92 relaxation factor, a four-tap tetrahedral normal and a four-tap
 * AO. No shadow ray — the fresnel rim and the backlight term carry the
 * material well enough at this scale, and a shadow march would double the cost
 * of the most expensive thing on the page.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_parallax;   // -1..1, spring-smoothed on the CPU
uniform float u_unfold;     // 0 at rest, 1 when the hero has been scrolled
uniform float u_alpha;      // global presence, for the exit
uniform vec3  u_ink;
uniform vec3  u_lume;

const float PI     = 3.14159265;
const int   BLADES = 6;
const int   CROSS  = 3;
const int   GLINTS = 7;
const int   STEPS  = 72;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

// x = distance, y = material (0 metal, 1 light)
vec2 map(vec3 p) {
  float d = 1e9;
  float mat = 0.0;

  // The six blades. Each is a rounded box, bent along its own length so the
  // form reads as drawn architecture rather than as a bar chart.
  for (int i = 0; i < BLADES; i++) {
    float fi = float(i);
    float a = fi * (2.0 * PI / float(BLADES)) + u_time * 0.075;
    vec3 q = p;
    q.xz = rot(-a) * q.xz;

    float spread = mix(0.075, 0.40, u_unfold);
    q.x -= spread;
    q.x += 0.26 * q.y * q.y;
    q.yz = rot(0.26 * sin(u_time * 0.16 + fi * 1.7)) * q.yz;
    q.y -= 0.05 * sin(u_time * 0.21 + fi * 2.1);

    float blade = sdRoundBox(q, vec3(0.010, 0.44 - fi * 0.018, 0.115), 0.012);
    d = min(d, blade);
  }

  // Three shorter blades crossing them, held higher.
  for (int i = 0; i < CROSS; i++) {
    float fi = float(i);
    float a = fi * (2.0 * PI / float(CROSS)) + 1.05 - u_time * 0.05;
    vec3 q = p;
    q.xz = rot(-a) * q.xz;
    q.x -= mix(0.05, 0.20, u_unfold);
    q.y += 0.14;
    q.xy = rot(0.42) * q.xy;

    float blade = sdRoundBox(q, vec3(0.008, 0.21, 0.052), 0.010);
    d = min(d, blade);
  }

  // The light that moves inside the form.
  for (int i = 0; i < GLINTS; i++) {
    float fi = float(i);
    float a = fi * 2.399 + u_time * 0.05;
    float r = 0.30 + 0.16 * sin(u_time * 0.19 + fi);
    vec3 gp = vec3(cos(a) * r, 0.30 * sin(u_time * 0.27 + fi * 1.3), sin(a) * r);
    float g = length(p - gp) - 0.0075;
    if (g < d) { d = g; mat = 1.0; }
  }

  return vec2(d, mat);
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.0016, 0.0);
  return normalize(vec3(
    map(p + e.xyy).x - map(p - e.xyy).x,
    map(p + e.yxy).x - map(p - e.yxy).x,
    map(p + e.yyx).x - map(p - e.yyx).x
  ));
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 4; i++) {
    float hh = 0.012 + 0.055 * float(i);
    float dd = map(p + n * hh).x;
    occ += (hh - dd) * sca;
    sca *= 0.75;
  }
  return clamp(1.0 - 1.6 * occ, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float zoom = mix(1.06, 1.34, u_unfold);

  // The camera closes in as you scroll — the second half of the transformation.
  float dist  = mix(2.15, 1.62, u_unfold);
  float yaw   = 0.62 + u_parallax.x * 0.40 + u_unfold * 0.62 + u_time * 0.02;
  float pitch = 0.16 - u_parallax.y * 0.20;

  vec3 ro = vec3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch)) * dist;
  vec3 f  = normalize(-ro);
  vec3 rr = normalize(cross(vec3(0.0, 1.0, 0.0), f));
  vec3 up = cross(f, rr);
  vec3 rd = normalize(f * zoom + rr * uv.x + up * uv.y);

  // The light is carried by the pointer, which is the only reason this object
  // responds to a mouse at all.
  vec3 L = normalize(vec3(u_parallax.x * 1.15, 0.62 + u_parallax.y * 0.5, 0.72));

  // The object hands over rather than being cut off: as the transformation
  // finishes, it is already leaving.
  float presence = u_alpha * (1.0 - smoothstep(0.80, 1.0, u_unfold));

  vec3  col   = vec3(0.0);
  float alpha = 0.0;

  // Bounding sphere first: most fragments never enter the march at all.
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.28 * 1.28;
  float h = b * b - c;

  if (h > 0.0) {
    float t = max(-b - sqrt(h), 0.0);
    float mat = 0.0;
    bool hit = false;

    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * t;
      vec2 r = map(p);
      if (r.x < 0.0013) { hit = true; mat = r.y; break; }
      t += r.x * 0.92;
      if (t > 4.2) break;
    }

    if (hit) {
      vec3 p = ro + rd * t;
      vec3 n = calcNormal(p);
      float ao   = calcAO(p, n);
      float dif  = clamp(dot(n, L), 0.0, 1.0);
      float back = clamp(dot(n, -L), 0.0, 1.0);
      float fre  = pow(clamp(1.0 - dot(n, -rd), 0.0, 1.0), 3.2);
      vec3  hv   = normalize(L - rd);
      float spe  = pow(clamp(dot(n, hv), 0.0, 1.0), 46.0);

      if (mat > 0.5) {
        col = u_lume * 1.35;
      } else {
        vec3 metal = mix(u_ink * 2.0, u_lume, 0.16);
        vec3 lit   = metal * (0.10 + 0.72 * dif * ao);
        lit += u_lume * back * 0.24 * ao;   // light through the material
        lit += u_lume * fre * 0.85;         // rim
        lit += u_lume * spe * 0.90;         // highlight
        col = lit * exp(-t * 0.16);         // depth falloff
      }
      alpha = presence;
    }
  }

  // The light the object sits in, whether or not a ray ever hit it. This is
  // what stops the canvas reading as a cut-out floating over the hero.
  float gd   = length(uv - vec2(0.0, 0.02));
  float glow = exp(-gd * gd * 3.4);
  col   += u_lume * glow * 0.045 * (1.0 - alpha);
  alpha += glow * 0.10 * presence;

  // Without this the gradient behind the blades bands badly on 8-bit panels.
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.006;

  alpha = clamp(alpha, 0.0, 1.0);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export type SignatureHandle = {
  setPointer: (x: number, y: number) => void;
  setUnfold: (v: number) => void;
  setColors: (ink: string, lume: string) => void;
  destroy: () => void;
};

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((ch) => ch + ch).join("") : h;
  const n = Number.parseInt(full || "0a0b0d", 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function createSignature(canvas: HTMLCanvasElement): SignatureHandle | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0, 0, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  const u = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    parallax: gl.getUniformLocation(prog, "u_parallax"),
    unfold: gl.getUniformLocation(prog, "u_unfold"),
    alpha: gl.getUniformLocation(prog, "u_alpha"),
  };
  const inkLoc = gl.getUniformLocation(prog, "u_ink");
  const lumeLoc = gl.getUniformLocation(prog, "u_lume");
  const setColors = (ink: string, lume: string) => {
    gl.uniform3fv(inkLoc, new Float32Array(rgb(ink)));
    gl.uniform3fv(lumeLoc, new Float32Array(rgb(lume)));
  };
  const styles = getComputedStyle(canvas);
  setColors(
    styles.getPropertyValue("--color-ink").trim() || "#0a0b0d",
    styles.getPropertyValue("--color-lume").trim() || "#dce6f5",
  );

  let px = 0;
  let py = 0;
  let unfold = 0;
  const alpha = 1;
  let raf = 0;
  let running = false;
  let disposed = false;
  const t0 = performance.now();

  // The sculpture is a bounded region, and the shader does real work per
  // fragment. One device pixel per CSS pixel is the right trade here; 1.25 on
  // a 780px stage is 25% more march for no visible gain.
  const DPR_CAP = 1.0;

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
    gl.uniform2f(u.parallax, px, py);
    gl.uniform1f(u.unfold, unfold);
    gl.uniform1f(u.alpha, alpha);
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
    setUnfold: (v) => {
      unfold = v;
    },
    setColors,
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
