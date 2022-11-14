declare module TYPES {
  export type ChartType =
    | "BAR_CHART"
    | "SINGLE_VALUE_CHART"
    | "PIE_CHART"
    | "LINE_CHART"
    | "TABLE_CHART"
    | undefined;

  export type Metric = {
    id?: number;
    title: string;
    size: string;
    icon: string;
    data: MetricData[];
    chart_type: ChartType;
    color: string;
    goal: number;
    value: number;
    source: null | string;
    is_drag?: boolean;
    header?: {
      title: string;
      dimension: string;
      value: string;
    };
    sys: {
      created_at: Date;
      updated_at?: Date;
      created_by: { full_name: string };
    };
  };

  export type MetricData = {
    name: string;
    time: Date;
    value: number;
  };
}
