import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import update from "immutability-helper";
import Layout from "@webclient/components/Layout/Layout";
import Button from "@webclient/components/UI/Button/Button";
import Title from "@webclient/components/UI/Title/Title";
import { useDashboardFetch } from "@core/hooks/data/use-dashboard-fetch";
import Link from "next/link";
import { MetricChart } from "@webclient/components/Dashboards/MetricChart";

type Props = {
  workspaceid: string[] | string;
  dashboardid: string[] | string;
};

const DashboardInner = ({ workspaceid, dashboardid }: Props) => {
  const { isError, error, isSuccess, status, data } = useDashboardFetch(
    workspaceid as string,
    dashboardid as string
  );

  const [card, setCards] = useState<TYPES.Metric[]>();

  useEffect(() => {
    if (data?.metrics) {
      const newData = data.metrics.map((item: TYPES.Metric, i: number) => {
        return { id: i + 1, ...item };
      });
      setCards(newData);
    }
  }, [data]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: TYPES.Metric[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as TYPES.Metric],
        ],
      })
    );
  }, []);

  if (isError) {
    return <>error: {JSON.stringify(error)}</>;
  }

  if (!isSuccess || data === undefined) {
    return <>status: {status}...</>;
  }

  console.log(card);

  return (
    <>
      <Title icon={data.icon} title={data.title} subtitle={data.description} />

      <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {card?.map((item, i) => {
          return (
            <MetricChart
              key={item.id}
              metric={item}
              moveCard={moveCard}
              id={item.id}
              index={i}
            />
          );
        })}
      </div>
    </>
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
