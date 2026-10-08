import { useEffect, useState } from "react";

// Tracks the viewport size so layouts can switch between mobile and desktop.
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return size;
}
