"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEOS = [
  "/images/hero/hero-video-1.mp4",
  "/images/hero/hero-video-3.mp4",
];

export function VideoLogoSection() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % VIDEOS.length);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = VIDEOS[current];
    video.load();
    video.play().catch(() => {
      const id = window.setTimeout(next, 8000);
      return () => window.clearTimeout(id);
    });

    const onEnded = () => next();
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [current, next]);

  return (
    <section
      id="video-logo"
      className="relative w-full max-h-[90vh] overflow-hidden"
      style={{ aspectRatio: "2 / 1" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
      />
      <div
        className="absolute inset-0 z-[1] bg-center bg-cover"
        style={{
          backgroundImage: "url(/images/logos/video-logo-overlay.png)",
        }}
        aria-hidden
      />
    </section>
  );
}
