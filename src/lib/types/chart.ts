export type SeriesChartProps = {
  series?: number[];
  label?: string;
  caption?: string;
  height?: string;
  /** Captions shown when there is no series yet. Omit to render nothing. */
  placeholder?: { notice: string; label: string };
};

export type ChartPoint = {
  index: number;
  value: number;
  isAccent: boolean;
  phaseLabel: string;
};
