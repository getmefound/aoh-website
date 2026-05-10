"use client";

import { useEffect, useState } from "react";

export type TypewriterSegment = {
  text: string;
  className?: string;
};

export function Typewriter({
  segments,
  speed = 45,
  startDelay = 250,
  cursor = true,
}: {
  segments: TypewriterSegment[];
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
}) {
  const total = segments.reduce((s, seg) => s + seg.text.length, 0);
  const [position, setPosition] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1;
        setPosition(i);
        if (i >= total) {
          clearInterval(id);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
  }, [total, speed, startDelay]);

  let consumed = 0;
  return (
    <span aria-label={segments.map((s) => s.text).join("")}>
      {segments.map((seg, i) => {
        const remaining = position - consumed;
        const shown = Math.min(seg.text.length, Math.max(0, remaining));
        consumed += seg.text.length;
        return (
          <span key={i} className={seg.className} aria-hidden>
            {seg.text.slice(0, shown)}
          </span>
        );
      })}
      {cursor && (
        <span
          aria-hidden
          className={`typewriter-cursor inline-block w-[0.06em] -mb-[0.05em] ml-[0.05em] h-[0.9em] align-baseline bg-current ${
            done ? "animate-typewriter-blink" : ""
          }`}
        />
      )}
    </span>
  );
}
