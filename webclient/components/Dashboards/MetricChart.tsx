import { useRef, useState } from "react";
import Link from "next/link";
import { useDrag, DndProvider, useDrop, XYCoord } from "react-dnd";
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
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  id: number;
  index: number;
};

type DragItem = {
  index: number;
  id: number;
  type: string;
};

const MetricChart = ({ metric, moveCard, id, index }: Props) => {
  const params = GetParametersByChartType(metric.chart_type);

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const sizes = ["small", "medium", "large"];
  const [size, setSize] = useState(metric.size);

  const resizeClick = (e) => {
    setSize(sizes[(sizes.indexOf(size) + 1) % sizes.length]);

    e.preventDefault();
  };

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <div
        className={classNames([
          "flex flex-col h-full shadow-sm dark:bg-slate-800 bg-white rounded-lg p-4 group",
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
          <div className="h-4 w-4 text-slate-400">
            <Link href=".">
              <a
                onClick={(e) => resizeClick(e)}
                className="hidden group-hover:block"
              >
                <ArrowsExpandIcon />
              </a>
            </Link>
          </div>
        </div>

        <div className="grow flex flex-col justify-center">
          <div>
            <params.component metric={metric} size={size} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { MetricChart, MetricChart as default };
