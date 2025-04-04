import { useEffect, useState } from "react";

export const useSizeObserver = (ref: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.target.getBoundingClientRect();
      const { width, height } = rect;

      if (width === 0 || height === 0) return;

      setSize({ width, height });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
};
