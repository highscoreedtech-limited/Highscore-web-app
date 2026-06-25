"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

// Renders a Lottie animation from /public (fetched at runtime so the JS bundle
// stays small). Shows `fallback` until the animation loads.
export default function LottieIcon({
  src,
  className,
  loop = true,
  fallback = null,
}: {
  src: string;
  className?: string;
  loop?: boolean;
  fallback?: React.ReactNode;
}) {
  const [data, setData] = useState<unknown>(null);
  const cache = useRef<Record<string, unknown>>({});

  useEffect(() => {
    let active = true;
    if (cache.current[src]) {
      setData(cache.current[src]);
      return;
    }
    fetch(src)
      .then((r) => r.json())
      .then((d) => {
        cache.current[src] = d;
        if (active) setData(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [src]);

  if (!data) return <>{fallback}</>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Lottie animationData={data as any} loop={loop} className={className} />;
}
