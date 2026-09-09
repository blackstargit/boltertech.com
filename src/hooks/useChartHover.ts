"use client";

import { useState, useCallback } from "react";

export function useChartHover() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const onHover = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const onLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return {
    hoveredIndex,
    onHover,
    onLeave,
  };
}
