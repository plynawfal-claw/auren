/**
 * A spring you can interrupt.
 *
 * Built to the rules in the apple-design skill:
 *
 *  - Motion is a *behaviour*, not a scripted duration. Re-targeting mid-flight
 *    keeps the current position AND the current velocity, so a gesture that
 *    reverses never hits a "brick wall" of discontinuous velocity.
 *  - Parameters are Apple's two designer-facing ones — `damping` (1.0 =
 *    critically damped, no overshoot) and `response` (seconds to reach target)
 *    — not the physics triplet of mass/stiffness/damping.
 *  - It always animates from the *presentation* value. There is no concept of
 *    "start value" to jump back to.
 */

export type SpringOptions = {
  /** 1.0 = critically damped (no overshoot). Below 1 overshoots. */
  damping?: number;
  /** Seconds to approach the target. Lower is snappier. Not a duration. */
  response?: number;
};

export type Spring = {
  get: () => number;
  getVelocity: () => number;
  /** Re-target. Velocity is preserved, which is what makes reversal smooth. */
  set: (target: number) => void;
  /** Teleport — no animation. For resets and non-visual corrections. */
  jump: (value: number) => void;
  /** Inject velocity, e.g. handing off a gesture's release velocity. */
  addVelocity: (v: number) => void;
  /** Advance by `dt` seconds. Returns true while still moving. */
  step: (dt: number) => boolean;
  target: () => number;
};

export function createSpring(initial: number, opts: SpringOptions = {}): Spring {
  const damping = opts.damping ?? 1;
  const response = opts.response ?? 0.4;

  // Apple's two parameters converted to the underlying constants.
  // ω = 2π / response is the undamped angular frequency; ζ is the damping ratio.
  const omega = (2 * Math.PI) / response;
  const zeta = damping;

  let value = initial;
  let target = initial;
  let velocity = 0;

  return {
    get: () => value,
    getVelocity: () => velocity,
    target: () => target,
    set: (t) => {
      target = t;
    },
    jump: (v) => {
      value = v;
      target = v;
      velocity = 0;
    },
    addVelocity: (v) => {
      velocity += v;
    },
    step: (dt) => {
      // Clamp dt so a backgrounded tab returning after 4 seconds does not
      // integrate one enormous step and fling the value across the screen.
      const h = Math.min(dt, 1 / 30);

      // Semi-implicit Euler: velocity first, then position. Stable at the step
      // sizes a display refresh produces, and cheap.
      const accel = -omega * omega * (value - target) - 2 * zeta * omega * velocity;
      velocity += accel * h;
      value += velocity * h;

      const settled = Math.abs(value - target) < 0.0001 && Math.abs(velocity) < 0.0001;
      if (settled) {
        value = target;
        velocity = 0;
      }
      return !settled;
    },
  };
}

/**
 * Where a flick is *going*, not where it was released.
 *
 * The exponential-decay form Apple ships in the Designing Fluid Interfaces
 * sample code — deliberately not the textbook v²/(2·a), which decelerates
 * differently and feels wrong next to native scrolling.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary.
 *
 * A hard stop reads as "frozen". Resistance that grows with overshoot reads as
 * "responsive, but there is nothing more here."
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (
    (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
  );
}

/**
 * Pointer velocity from a short position history.
 *
 * A single frame's delta is far too noisy to hand to a spring — one stuttered
 * frame at release would throw the element across the screen. Sampling over a
 * ~90ms window smooths that out while still feeling immediate.
 */
export class VelocityTracker {
  private samples: { v: number; t: number }[] = [];
  private window: number;

  constructor(windowMs = 90) {
    this.window = windowMs;
  }

  add(value: number, time = performance.now()) {
    this.samples.push({ v: value, t: time });
    const cutoff = time - this.window;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) {
      this.samples.shift();
    }
  }

  /** Units per second. */
  velocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return 0;
    return (last.v - first.v) / dt;
  }

  reset() {
    this.samples = [];
  }
}

/**
 * One shared rAF loop for every spring on the page.
 *
 * Each component running its own requestAnimationFrame is how a page ends up
 * with a dozen competing loops that drift out of phase with each other.
 */
type Ticker = (dt: number) => boolean;
const tickers = new Set<Ticker>();
let rafId = 0;
let lastTime = 0;

function tick(now: number) {
  const dt = lastTime ? (now - lastTime) / 1000 : 1 / 60;
  lastTime = now;

  tickers.forEach((fn) => {
    if (!fn(dt)) tickers.delete(fn);
  });

  rafId = tickers.size ? requestAnimationFrame(tick) : 0;
  if (!rafId) lastTime = 0;
}

/** Runs `fn` every frame until it returns false. Returns a stop function. */
export function addTicker(fn: Ticker): () => void {
  tickers.add(fn);
  if (!rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }
  return () => tickers.delete(fn);
}
