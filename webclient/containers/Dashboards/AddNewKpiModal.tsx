import { useMetricsAllFetch } from "@core/hooks/data/use-metrics-all-fetch";
import { useEffect, useState } from "react";
import { MetricsInModal } from "./components/MetricsInModal";
import MetricChart from "../../components/Dashboards/MetricChart";

type Props = {
  closeClick: () => void;
  isModal?: Boolean;
  workspaceid: string;
};

export const AddNewKpiModal = ({
  closeClick,
  isModal = false,
  workspaceid,
}: Props) => {
  const [metrics, setMetrics] = useState<TYPES.Metric[]>();
  const [isDragged, setIsDragged] = useState<Boolean>(false);

  const { isError, error, data, isSuccess, doFetch } = useMetricsAllFetch(
    workspaceid,
    false
  );

  useEffect(() => {
    if (isModal) {
      doFetch();
    }
  }, [doFetch, isModal]);

  useEffect(() => {
    if (!isModal) return;

    document.body.style.setProperty("overflow", "hidden");
    document.body.style.top = `-${window.scrollY}px`;
    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.top = "";
    };
  }, [isModal]);

  useEffect(() => {
    if (data) {
      const newData = data.map((metric: TYPES.Metric, i: number) => {
        return { ...metric, id: i + 1 };
      });
      setMetrics(newData);
    }
  }, [data]);

  const isDrag = (isDragging: Boolean) => {
    setIsDragged(!isDragging);
  };

  if (isError) {
    return <>error: {JSON.stringify(error)}</>;
  }

  if (!isSuccess || data === undefined) {
    return <>status: {status}...</>;
  }

  return (
    <>
      {isDragged && (
        <div
          className="absolute top-0 left-0 z-20 w-screen h-screen bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeClick}
        />
      )}
      <aside
        className={`${
          isModal ? "translate-x-0" : "translate-x-full"
        } transform absolute top-0 right-0 border max-w-md w-full h-screen bg-white shadow-xl overflow-auto ease-in-out transition-all duration-300 z-30`}
      >
        <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5
            className="text-xl font-medium leading-normal text-gray-800"
            id="exampleModalScrollableLabel"
          >
            Add KPI to Dashboard
          </h5>
          <button
            type="button"
            className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={closeClick}
          >
            X
          </button>
        </div>

        <div className="relative p-4 pb-10 h-screen overflow-x-hidden overflow-y-auto">
          <div>
            <p>← Drag any item to your dashboard</p>
          </div>

          {metrics?.map((metric, i) => {
            return (
              <MetricsInModal key={i} data={metric} isDrag={isDrag}>
                <MetricChart metric={metric} isVisibleIcons={true} />
              </MetricsInModal>
            );
          })}
        </div>
      </aside>
    </>
  );
};
