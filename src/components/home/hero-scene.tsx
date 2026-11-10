"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSceneHandle } from "./hero-scene.webgl";

/**
 * The home page hero's 3D scene, the caption that names what it is showing,
 * and the dots that pick a shape. This file is the cheap shell: a canvas, a
 * CSS glow that stands in for the scene, and an effect that fetches the
 * WebGL module once the browser is idle. Readers without WebGL, and everyone
 * until the chunk arrives, see the glow and the first caption — the page
 * never waits on the scene.
 *
 * `captions` are in the order the scene cycles its shapes (see SHAPES in
 * hero-scene.webgl.ts). `children` is rendered inside the caption pill,
 * ahead of the text.
 *
 * The canvas is decorative and hidden from assistive tech. The caption is
 * not announced as it changes by itself; the first one is the reader's
 * answer to "who is this" and the rest restate the paragraph below.
 */
export function HeroScene({
  captions,
  children,
}: {
  captions: string[];
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroSceneHandle>(null);
  const [shape, setShape] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const start = async () => {
      try {
        const { mountHeroScene } = await import("./hero-scene.webgl");
        if (cancelled) return;
        sceneRef.current = mountHeroScene(canvas, setShape);
      } catch {
        // No WebGL, or the chunk failed to load: the glow stays.
      }
    };

    // Safari has no requestIdleCallback.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        data-ready={shape !== null}
        className="hero-scene pointer-events-none absolute -top-12 left-1/2 h-88 w-[min(100vw,60rem)] -translate-x-1/2 sm:h-112"
      >
        <div className="hero-glow" />
        <canvas ref={canvasRef} className="size-full" />
        {/* Only the middle of the canvas takes clicks: the particles thin
            out toward the edges, and a pointer cursor over empty page
            would be a lie. */}
        <div
          onClick={() => sceneRef.current?.next()}
          className="pointer-events-auto absolute top-1/2 left-1/2 size-72 -translate-1/2 cursor-pointer rounded-full"
        />
      </div>
      {/* One dot per shape. Without the scene there is nothing to pick, so
          they stay invisible — but keep their room, so nothing jumps when
          it arrives. */}
      <ul
        className={
          "relative -mb-3 flex transition-opacity duration-500 " +
          (shape === null ? "invisible opacity-0" : "opacity-100")
        }
      >
        {captions.map((caption, index) => (
          <li key={caption}>
            <button
              type="button"
              aria-label={caption}
              aria-current={index === shape}
              onClick={() => sceneRef.current?.show(index)}
              className="group flex size-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2"
            >
              <span className="size-1.5 rounded-full bg-muted-foreground/40 transition-all duration-300 group-hover:bg-muted-foreground group-aria-current:w-4 group-aria-current:bg-brand" />
            </button>
          </li>
        ))}
      </ul>
      <p className="reveal relative flex items-center gap-2 rounded-full border border-border bg-background/60 py-1 pr-3 pl-1 font-mono text-xs text-muted-foreground backdrop-blur-sm">
        {children}
        {/* Keyed so each caption replays the entrance animation. */}
        <span key={shape ?? 0} className="reveal inline-block">
          {captions[(shape ?? 0) % captions.length]}
        </span>
      </p>
    </>
  );
}
