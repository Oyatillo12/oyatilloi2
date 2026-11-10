/**
 * The WebGL half of the home page hero: one cloud of particles that keeps
 * rearranging itself into the things the site is about — a code glyph, the
 * React atom, a globe with Tashkent marked on it, a written page. It moves
 * on by itself, or when asked; the cloud parts around the pointer.
 *
 * This module is the only place three.js is imported, and it is only ever
 * reached through `import()` from hero-scene.tsx — so the library is a lazy
 * chunk and never part of the page's initial JavaScript. See docs/adr/0005.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uScale;
uniform float uAspect;
uniform float uPull;
uniform vec2 uPointer;
// xyz is the position, w marks a highlighted particle (0 or 1).
attribute vec4 aFrom;
attribute vec4 aTo;
attribute float aSeed;
varying float vAccent;
varying float vHue;

void main() {
  // Each particle leaves on its own schedule, so a shape dissolves and
  // reassembles as a wave instead of sliding across as one rigid piece.
  float t = clamp(uProgress * 1.35 - aSeed * 0.35, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(aFrom.xyz, aTo.xyz, t);
  vAccent = mix(aFrom.w, aTo.w, t);

  // Mid-flight the particle swings wide of the straight line.
  vec3 swirl = vec3(
    sin(aSeed * 91.7 + uTime),
    cos(aSeed * 57.3 + uTime * 1.3),
    sin(aSeed * 33.1 - uTime * 0.7)
  );
  p += swirl * sin(t * 3.14159) * 0.55;
  // At rest it still drifts a hair, so a finished shape is never frozen.
  p += 0.012 * vec3(
    sin(uTime * 1.3 + aSeed * 40.0),
    cos(uTime * 1.1 + aSeed * 60.0),
    sin(uTime * 0.9 + aSeed * 80.0)
  );

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // Push away from the pointer, measured on screen.
  vec4 clip = projectionMatrix * mv;
  vec2 away = (clip.xy / clip.w - uPointer) * vec2(uAspect, 1.0);
  float near = smoothstep(0.38, 0.0, length(away));
  mv.xy += normalize(away + 1e-5) * near * uPull * 0.3;

  vHue = p.x * 0.16 + p.y * 0.2 + aSeed * 0.12 + uTime * 0.02;
  float pulse = 1.0 + vAccent * (0.4 + 0.3 * sin(uTime * 3.0 + aSeed * 20.0));
  gl_PointSize = (1.3 + 1.7 * fract(aSeed * 7.3)) * pulse * uScale / -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform float uTheme; // 0 = light page, 1 = dark page
varying float vAccent;
varying float vHue;

void main() {
  float disc = smoothstep(0.5, 0.2, length(gl_PointCoord - 0.5));

  // One cosine palette walking pink → violet → blue → cyan.
  vec3 hue = vec3(0.5, 0.45, 0.85)
    + vec3(0.4, 0.35, 0.15) * cos(6.28318 * (vHue + 0.35 + vec3(-0.1, 0.2, 0.55)));

  // Dark page: the palette as light. Light page: the same hues pulled toward
  // ink, because pale dots vanish on white.
  vec3 dark = mix(hue, vec3(1.0, 0.8, 0.92), vAccent);
  vec3 light = mix(hue * 0.6 + vec3(0.02, 0.04, 0.22), vec3(0.86, 0.1, 0.5), vAccent);

  gl_FragColor = vec4(mix(light, dark, uTheme), disc * mix(0.9, 0.8, uTheme));
}
`;

const rand = Math.random;
const TAU = Math.PI * 2;
const RADIUS = 1.25;
/** Share of the cloud that never joins a shape and stays as drifting dust. */
const DUST_SHARE = 0.08;

/** A shape fills `out` (x, y, z, accent per particle) for the first `count`. */
type Shape = (out: Float32Array, count: number) => void;

const put = (
  out: Float32Array,
  i: number,
  x: number,
  y: number,
  z: number,
  accent = 0,
) => {
  out[i * 4] = x;
  out[i * 4 + 1] = y;
  out[i * 4 + 2] = z;
  out[i * 4 + 3] = accent;
};

/** Scattered through a ball: where the cloud starts, and the fallback. */
const scatter: Shape = (out, count) => {
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const phi = rand() * TAU;
    const r = RADIUS * 1.6 * Math.cbrt(rand());
    const s = Math.sqrt(1 - u * u);
    put(out, i, r * s * Math.cos(phi), r * u, r * s * Math.sin(phi));
  }
};

/**
 * Turns a 2D drawing into a shape: draw it on a small offscreen canvas, then
 * drop particles on the painted pixels and give the result some thickness.
 */
const drawn =
  (draw: (ctx: CanvasRenderingContext2D) => void): Shape =>
  (out, count) => {
    const size = 240;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return scatter(out, count);

    ctx.lineCap = ctx.lineJoin = "round";
    draw(ctx);
    const { data } = ctx.getImageData(0, 0, size, size);
    const painted: number[] = [];
    for (let p = 0; p < size * size; p++) {
      if (data[p * 4 + 3] > 128) painted.push(p);
    }
    if (!painted.length) return scatter(out, count);

    for (let i = 0; i < count; i++) {
      const p = painted[Math.floor(rand() * painted.length)];
      const x = (((p % size) + rand()) / size) * 2 - 1;
      const y = 1 - ((Math.floor(p / size) + rand()) / size) * 2;
      put(out, i, x * RADIUS * 1.1, y * RADIUS * 1.1, (rand() - 0.5) * 0.22);
    }
  };

const line = (
  ctx: CanvasRenderingContext2D,
  width: number,
  points: number[],
) => {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2)
    ctx.lineTo(points[i], points[i + 1]);
  ctx.stroke();
};

/** `</>` */
const code = drawn((ctx) => {
  line(ctx, 20, [86, 68, 30, 120, 86, 172]);
  line(ctx, 20, [142, 48, 98, 192]);
  line(ctx, 20, [154, 68, 210, 120, 154, 172]);
});

/** A page: outline, a heavier title line, and lines of text. */
const page = drawn((ctx) => {
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(48, 22, 144, 196, 16);
  ctx.stroke();
  line(ctx, 15, [74, 62, 138, 62]);
  line(ctx, 8, [74, 100, 166, 100]);
  line(ctx, 8, [74, 126, 166, 126]);
  line(ctx, 8, [74, 152, 166, 152]);
  line(ctx, 8, [74, 178, 126, 178]);
});

/**
 * The React atom, built in depth: three circles each tipped away from the
 * viewer, so head-on they flatten into the logo's three ellipses and from
 * any other angle they are visibly rings in space.
 */
const atom: Shape = (out, count) => {
  const squash = 0.38;
  const depth = Math.sqrt(1 - squash * squash);

  for (let i = 0; i < count; i++) {
    if (i < count * 0.04) {
      // Nucleus.
      const r = 0.16 * Math.cbrt(rand());
      const u = rand() * 2 - 1;
      const phi = rand() * TAU;
      const s = Math.sqrt(1 - u * u);
      put(out, i, r * s * Math.cos(phi), r * u, r * s * Math.sin(phi), 1);
      continue;
    }
    const ring = i % 3;
    const tilt = (ring * Math.PI) / 3;
    // One electron per ring: a tight bright knot at a fixed angle.
    const electron = rand() < 0.035;
    const a = electron ? ring * 2.3 + 0.6 + (rand() - 0.5) * 0.1 : rand() * TAU;
    const r = RADIUS * (1 + (rand() - 0.5) * 0.035);
    const along = Math.cos(a) * r;
    const across = Math.sin(a) * r;
    put(
      out,
      i,
      Math.cos(tilt) * along - Math.sin(tilt) * squash * across,
      Math.sin(tilt) * along + Math.cos(tilt) * squash * across,
      depth * across,
      electron ? 1 : 0,
    );
  }
};

/**
 * A wire globe — meridians, parallels and a little surface haze — turned so
 * Tashkent faces the viewer, with the city as a bright point inside two rings.
 */
const globe: Shape = (out, count) => {
  const deg = Math.PI / 180;
  const cityLat = 41.3 * deg;
  // Longitude is measured from the city, which sits just right of centre.
  const cityLon = 10 * deg;
  const at = (
    lat: number,
    lon: number,
    r = RADIUS,
  ): [number, number, number] => [
    r * Math.cos(lat) * Math.sin(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.cos(lon),
  ];
  const city = at(cityLat, cityLon, RADIUS * 1.01);
  // Unit vectors along the surface at the city: east and north.
  const east = [Math.cos(cityLon), 0, -Math.sin(cityLon)];
  const north = [
    -Math.sin(cityLat) * Math.sin(cityLon),
    Math.cos(cityLat),
    -Math.sin(cityLat) * Math.cos(cityLon),
  ];

  for (let i = 0; i < count; i++) {
    const pick = rand();
    if (pick < 0.05) {
      // The city: a point, then two rings around it.
      const which = rand();
      const r =
        which < 0.3 ? 0.035 * Math.sqrt(rand()) : which < 0.6 ? 0.1 : 0.19;
      const a = rand() * TAU;
      const e = Math.cos(a) * r;
      const n = Math.sin(a) * r;
      put(
        out,
        i,
        city[0] + east[0] * e + north[0] * n,
        city[1] + east[1] * e + north[1] * n,
        city[2] + east[2] * e + north[2] * n,
        1,
      );
    } else if (pick < 0.5) {
      // Meridians every 15°.
      const lon = Math.floor(rand() * 24) * 15 * deg;
      put(out, i, ...at((rand() - 0.5) * Math.PI, lon));
    } else if (pick < 0.82) {
      // Parallels every 20°. Rejection keeps the dots evenly spaced along
      // each line: short circles near the poles get fewer of them.
      let lat = 0;
      do {
        lat = (Math.floor(rand() * 7) - 3) * 20 * deg;
      } while (rand() > Math.cos(lat));
      put(out, i, ...at(lat, rand() * TAU));
    } else {
      put(out, i, ...at(Math.asin(rand() * 2 - 1), rand() * TAU));
    }
  }
};

/** The order the cloud cycles through. hero-scene.tsx captions follow it. */
const SHAPES: Shape[] = [code, atom, globe, page];

const TRANSITION_SECONDS = 1.5;
/** How long a finished shape stays before the cloud moves on by itself. */
const HOLD_SECONDS = 4.5;
/** Camera distance that frames a shape in a landscape canvas. */
const CAMERA_DISTANCE = 5.8;

const isDark = () => document.documentElement.classList.contains("dark");

export type HeroSceneHandle = {
  /** Asks the cloud to take the shape at `index`. */
  show(index: number): void;
  /** Asks the cloud to move on to the shape after the current one. */
  next(): void;
  /** Stops the scene and frees its GPU resources. */
  dispose(): void;
};

/**
 * Starts the scene on `canvas`. Throws if a WebGL context cannot be created;
 * the caller keeps its static fallback in that case. `onShape` fires with
 * the index of each shape as the cloud starts toward it, the first included.
 */
export function mountHeroScene(
  canvas: HTMLCanvasElement,
  onShape: (index: number) => void,
): HeroSceneHandle {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 20);
  let cameraRest = CAMERA_DISTANCE;

  // Phones get half the particles; the shapes read the same at their size.
  const count = finePointer ? 11000 : 5500;
  const shaped = Math.floor(count * (1 - DUST_SHARE));

  const from = new Float32Array(count * 4);
  const to = new Float32Array(count * 4);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = rand();

  scatter(from, shaped);
  // The dust: a wide, shallow shell that is the same in every shape, so
  // these particles never travel.
  for (let i = shaped; i < count; i++) {
    const u = rand() * 2 - 1;
    const phi = rand() * TAU;
    const r = 1.9 + rand() * 1.5;
    const s = Math.sqrt(1 - u * u);
    put(
      from,
      i,
      r * s * Math.cos(phi) * 1.7,
      r * u * 0.75,
      r * s * Math.sin(phi) * 0.8,
    );
  }
  to.set(from);

  const geometry = new BufferGeometry();
  const fromAttribute = new BufferAttribute(from, 4);
  const toAttribute = new BufferAttribute(to, 4);
  geometry.setAttribute("aFrom", fromAttribute);
  geometry.setAttribute("aTo", toAttribute);
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  // three.js wants a `position` to size the draw call; the shader ignores it.
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(count * 3), 3),
  );

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 1 },
    uScale: { value: 1 },
    uAspect: { value: 1 },
    uPull: { value: 0 },
    uTheme: { value: isDark() ? 1 : 0 },
    uPointer: { value: new Vector2(0, 0) },
  };
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const cloud = new Points(geometry, material);
  // The real positions live in the shader, so the bounding sphere three.js
  // would compute from `position` is meaningless.
  cloud.frustumCulled = false;
  scene.add(cloud);

  // Light adds up on a dark page and would wash out to nothing on a white
  // one, so the blend mode follows the theme.
  let dark: boolean | undefined;
  const syncBlending = () => {
    if (dark === isDark()) return;
    dark = isDark();
    material.blending = dark ? AdditiveBlending : NormalBlending;
  };
  syncBlending();

  // The shape the cloud is in or travelling to, and the one asked for.
  // They differ while a flight is in progress: the origin buffer is in use
  // until the cloud lands, so a new request waits for that.
  let shape = -1;
  let wanted = 0;
  let held = 0;

  const morph = () => {
    shape = wanted;
    // What was the destination becomes the origin.
    from.set(to);
    SHAPES[shape](to, shaped);
    fromAttribute.needsUpdate = true;
    toAttribute.needsUpdate = true;
    uniforms.uProgress.value = reducedMotion ? 1 : 0;
    held = 0;
    onShape(shape);
  };

  const pointer = { x: 0, y: 0, tiltX: 0, tiltY: 0, present: false };

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    pointer.present = true;
  };

  const draw = () => renderer.render(scene, camera);

  let frame = 0;
  let last = 0;
  let visible = true;

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    // Clamped so a background tab does not come back with one huge step.
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const ease = 1 - Math.exp(-dt * 4);

    uniforms.uTime.value += dt;
    syncBlending();
    uniforms.uTheme.value += ((dark ? 1 : 0) - uniforms.uTheme.value) * ease;

    if (uniforms.uProgress.value < 1) {
      uniforms.uProgress.value = Math.min(
        1,
        uniforms.uProgress.value + dt / TRANSITION_SECONDS,
      );
    } else if (wanted !== shape) {
      morph();
    } else if ((held += dt) > HOLD_SECONDS) {
      wanted = (shape + 1) % SHAPES.length;
    }
    // The camera pulls back while the cloud is in pieces and closes in
    // again as the next shape forms.
    camera.position.z =
      cameraRest + Math.sin(uniforms.uProgress.value * Math.PI) * 0.9;

    uniforms.uPull.value +=
      ((pointer.present ? 1 : 0) - uniforms.uPull.value) * ease;
    (uniforms.uPointer.value as Vector2).set(pointer.x, pointer.y);

    // A slow sway shows the depth of each shape without ever turning the
    // flat ones edge-on; the pointer leans it a little further.
    pointer.tiltX += (pointer.x - pointer.tiltX) * ease * 0.5;
    pointer.tiltY += (pointer.y - pointer.tiltY) * ease * 0.5;
    const time = uniforms.uTime.value;
    cloud.rotation.y = Math.sin(time * 0.35) * 0.38 + pointer.tiltX * 0.2;
    cloud.rotation.x = Math.sin(time * 0.27) * 0.08 - pointer.tiltY * 0.12;

    draw();
  };

  const setRunning = (running: boolean) => {
    if (reducedMotion) return;
    if (running && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (!running && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const sync = () => setRunning(visible && !document.hidden);

  const resizeObserver = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // In a portrait canvas the width is what runs out, so stand further
    // back until the shape fits across it.
    cameraRest = Math.max(CAMERA_DISTANCE, 5.4 / camera.aspect);
    camera.position.z = cameraRest;
    uniforms.uAspect.value = camera.aspect;
    uniforms.uScale.value = height * pixelRatio * 0.011;
    // Resizing clears the drawing buffer; without this a stopped scene
    // (reduced motion, off-screen) would go blank.
    draw();
  });
  resizeObserver.observe(canvas);

  // Nothing is drawn while the hero is scrolled away or the tab is hidden.
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", sync);

  // With reduced motion there is no loop, so a theme switch has to ask for
  // its own frame.
  const themeObserver = new MutationObserver(() => {
    if (!reducedMotion) return;
    syncBlending();
    uniforms.uTheme.value = dark ? 1 : 0;
    draw();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  morph();

  const show = (index: number) => {
    if (!SHAPES[index]) return;
    wanted = index;
    // With reduced motion there is no loop to pick the request up, and no
    // flight to wait for: the new shape simply appears.
    if (reducedMotion && wanted !== shape) {
      morph();
      draw();
    }
  };

  return {
    show,
    next: () => show((shape + 1) % SHAPES.length),
    dispose() {
      setRunning(false);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
