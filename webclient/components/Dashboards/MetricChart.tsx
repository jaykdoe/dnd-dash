import { useRef, useState } from "react";
import Link from "next/link";
import {
  useDrag,
  DndProvider,
  useDrop,
  XYCoord,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import { classNames } from "@core/react/class-names";
import { Conditional } from "@core/react/conditional";
import { dateFormatter } from "@core/standards/date-formatter";
import { MetricPieChart } from "./MetricPieChart";
import { MetricLineChart } from "./MetricLineChart";
import { MetricBarChart } from "./MetricBarChart";
import { MetricTableChart } from "./MetricTableChart";
import { MetricSingleValueChart } from "./MetricSingleValueChart";
import { CHART_TYPE } from "@webclient/constants/enums";
import { Identifier } from "dnd-core";

const GetParametersByChartType = (chartType: TYPES.ChartType) => {
  if (chartType === CHART_TYPE.PIE_CHART) {
    return {
      component: MetricPieChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === CHART_TYPE.BAR_CHART) {
    return {
      component: MetricBarChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === CHART_TYPE.LINE_CHART) {
    return {
      component: MetricLineChart,
      showGoal: true,
      showDate: false,
    };
  }

  if (chartType === CHART_TYPE.TABLE_CHART) {
    return {
      component: MetricTableChart,
      showGoal: false,
      showDate: false,
    };
  }

  if (chartType === undefined) {
    return {
      component: MetricSingleValueChart,
      showGoal: true,
      showDate: true,
    };
  }

  throw new Error(`invalid chart type: {chartType}`);
};

type Props = {
  metric: TYPES.Metric;
  isVisibleIcons?: boolean;
  className?: string;
};

const MetricChart = ({ metric, isVisibleIcons = false, className }: Props) => {
  const params = GetParametersByChartType(metric.chart_type);

  const sizes = ["small", "medium", "large"];
  const [size, setSize] = useState(metric.size);

  const resizeClick = (e) => {
    e.preventDefault();
    setSize(sizes[(sizes.indexOf(size) + 1) % sizes.length]);
  };

  return (
    <div
      className={classNames([
        "flex flex-col h-full shadow-sm dark:bg-slate-800 bg-white rounded-lg p-4 group resize rounded-md",
        className,
        size === "medium" && "col-span-2 row-span-1",
        size === "large" && "col-span-3 row-span-2",
      ])}
    >
      <div className="flex justify-between">
        <div>
          <Conditional if={params.showGoal}>
            <h3 className="text-lg">{metric.goal}</h3>
          </Conditional>
          <h3
            className={classNames([
              "mt-2 grow-0 text-base",
              `text-{color.hardClass}`,
            ])}
          >
            {metric.icon} {metric.title}
          </h3>
          <Conditional if={params.showDate}>
            <h3 className="mt-2 text-base text-gray-400">
              {dateFormatter(metric.sys?.updated_at ?? metric.sys?.created_at)}
            </h3>
          </Conditional>
        </div>
      </div>

      <div className="grow flex flex-col justify-center">
        <div>
          <params.component metric={metric} size={size} />
        </div>
      </div>
      {!isVisibleIcons && (
        <div className="flex justify-end">
          <div className="h-4 w-4 text-slate-400 ">
            <a
              className="hidden group-hover:block"
              onClick={(e) => resizeClick(e)}
            >
              <ArrowsExpandIcon />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export { MetricChart, MetricChart as default };
