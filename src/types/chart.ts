export type ChartData = {
  month: string;
  [key: string]: number | string; // 動的キーに対応
};

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

export type ChartProps = {
  title: string;
  description: string;
  data: ChartData[];
  config: ChartConfig;
};
