import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import update from "immutability-helper";
import Layout from "@webclient/components/Layout/Layout";
import Button from "@webclient/components/UI/Button/Button";
import Title from "@webclient/components/UI/Title/Title";
import { useDashboardFetch } from "@core/hooks/data/use-dashboard-fetch";
import Link from "next/link";
import { MetricChart } from "@webclient/components/Dashboards/MetricChart";
import { AddNewKpiMenu } from "@webclient/containers/Dashboards/AddNewKpiMenu";
import { useDrop } from "react-dnd";
import { Identifier } from "dnd-core";
import { DashboardGrid } from "@webclient/containers/Dashboards/DashboardGrid";

type Props = {
  workspaceid: string[] | string;
  dashboardid: string[] | string;
};

type DragItem = {
  index: number;
  id: number;
  type: string;
};

const DashboardInner = ({ workspaceid, dashboardid }: Props) => {
  const { isError, error, isSuccess, status, data } = useDashboardFetch(
    workspaceid as string,
    dashboardid as string
  );

  const ref = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<TYPES.Metric[]>();
  const [isModal, setModal] = useState<Boolean>(false);

  useEffect(() => {
    if (data?.metrics) {
      const newData = data.metrics.map((metric: TYPES.Metric, i: number) => {
        return { ...metric, id: i + 1 };
      });
      setMetrics(newData);
    }
  }, [data]);

  const handleDrop = useCallback(
    (item: { data: TYPES.Metric }) => {
      const newItem = { ...item.data, id: metrics.length + 1 };

      if (isModal) {
        setMetrics([...metrics, newItem]);
      }
    },
    [metrics, isModal]
  );

  const handleRemove = useCallback(
    (index: number) => {
      console.log("test");
      const array = metrics;
      if (index > -1) {
        array.splice(index, 1);
        console.log(array);
        setMetrics([...array]);
      }
    },
    [metrics]
  );

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    drop: handleDrop as any,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
  });

  const moveMetric = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!isModal) {
        setMetrics((prevCards: TYPES.Metric[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as TYPES.Metric],
            ],
          })
        );
      }
    },
    [isModal]
  );

  const sizes = ["small", "medium", "large"];

  const resizeClick = (e, metric: TYPES.Metric) => {
    e.preventDefault();
    const newMetricSizes = metrics.map((item) => {
      if (item.id === metric.id) {
        item.size = sizes[(sizes.indexOf(metric.size) + 1) % sizes.length];
      }
      return item;
    });
    setMetrics(newMetricSizes);
  };

  if (isError) {
    return <>error: {JSON.stringify(error)}</>;
  }

  if (!isSuccess || data === undefined) {
    return <>status: {status}...</>;
  }

  console.log(metrics);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title
          icon={data.icon}
          title={data.title}
          subtitle={data.description}
        />
        <div>
          <AddNewKpiButton
            title="+ Add New KPI"
            className="datapad-button"
            onClick={() => setModal(!isModal)}
          />
        </div>
      </div>

      <div
        className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
        ref={drop}
        data-handler-id={handlerId}
      >
        {metrics?.map((metric, i) => {
          return (
            <DashboardGrid
              key={i}
              moveMetric={moveMetric}
              id={metric.id}
              index={i}
              size={metric.size}
            >
              <MetricChart
                metric={metric}
                resizeClick={resizeClick}
                handleRemove={handleRemove}
                index={i}
              />
            </DashboardGrid>
          );
        })}
      </div>

      {isModal ? (
        <AddNewKpiMenu
          closeClick={() => setModal(!isModal)}
          onClick={handleDrop}
          isModal={isModal}
          workspaceid={String(workspaceid)}
        />
      ) : null}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();

  const { workspaceid, dashboardid } = router.query;

  // sorry for this next.js
  if (workspaceid === undefined || dashboardid === undefined) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Datapad - Workspace #{workspaceid} - Dashboard #${dashboardid}
        </title>
        <meta
          name="description"
          content={`Datapad - Workspace #${workspaceid} - Dashboard #${dashboardid}`}
        />
      </Head>

      <Layout title={`Workspace #${workspaceid} - Dashboard #${dashboardid}`}>
        <div className="mt-5">
          <DashboardInner workspaceid={workspaceid} dashboardid={dashboardid} />
        </div>

        <ul className="mt-5">
          <li>
            <Link href={`/${workspaceid}/dashboards/`}>
              <Button
                className="datapad-button"
                loading={false}
                title="Go Back"
              />
            </Link>
          </li>
        </ul>
      </Layout>
    </>
  );
}

const AddNewKpiButton = styled(Button)`
  color: #5b4ccc;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  &:hover {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
  }
`;
