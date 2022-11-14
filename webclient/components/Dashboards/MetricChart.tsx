import { useState } from "react";
import {
  ArrowsExpandIcon,
  DotsHorizontalIcon,
  XIcon,
} from "@heroicons/react/solid";
import { classNames } from "@core/react/class-names";
import { Conditional } from "@core/react/conditional";
import { dateFormatter } from "@core/standards/date-formatter";
import { MetricPieChart } from "./MetricPieChart";
import { MetricLineChart } from "./MetricLineChart";
import { MetricBarChart } from "./MetricBarChart";
import { MetricTableChart } from "./MetricTableChart";
import { MetricSingleValueChart } from "./MetricSingleValueChart";
import { CHART_TYPE } from "@webclient/constants/enums";

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
  size?: string;
  resizeClick?: (e: any, item: TYPES.Metric) => void;
  handleRemove?: (i?: number) => void;
  index?: number;
};

const MetricChart = ({
  metric,
  isVisibleIcons = false,
  className,
  size,
  resizeClick,
  handleRemove,
  index,
}: Props) => {
  const params = GetParametersByChartType(metric.chart_type);
  const [isOpenMenu, setIsOpenMenu] = useState<Boolean>(false);

  return (
    <>
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
                {dateFormatter(
                  metric.sys?.updated_at ?? metric.sys?.created_at
                )}
              </h3>
            </Conditional>
          </div>
          {!isVisibleIcons && (
            <div className="flex justify-end">
              <div className="h-4 w-4 text-slate-400 " role="button">
                <a className="block" onClick={() => setIsOpenMenu(!isOpenMenu)}>
                  <DotsHorizontalIcon />
                </a>
              </div>
              {isOpenMenu && (
                <div
                  role="button"
                  className="absolute top-50 mt-3 right-50 bg-white shadow-md rounded-md p-3 flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsOpenMenu(!isOpenMenu);
                    handleRemove(index);
                  }}
                >
                  <XIcon className="h-4 w-4 text-red-600" />
                  <span>Remove</span>
                </div>
              )}
            </div>
          )}
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
                onClick={(e) => resizeClick(e, metric)}
              >
                <ArrowsExpandIcon />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { MetricChart, MetricChart as default };
