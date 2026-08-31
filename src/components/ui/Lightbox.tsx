"use client";

import { useEffect } from "react";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const count = images.length;
  const src = images[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [count, index, onClose, onIndexChange]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-3xl leading-none text-white"
        aria-label="Close"
      >
        ×
      </button>

      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index - 1 + count) % count);
          }}
          className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-4xl text-white md:left-6"
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[86vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index + 1) % count);
          }}
          className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-4xl text-white md:right-6"
          aria-label="Next"
        >
          ›
        </button>
      )}

      {count > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
          {index + 1} / {count}
        </p>
      )}
    </div>
  );
}
