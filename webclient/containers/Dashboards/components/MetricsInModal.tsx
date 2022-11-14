import { useDrag } from "react-dnd";
import { useEffect, useState } from "react";

const style = {
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

type CardProps = {
  children: React.ReactNode;
  data: TYPES.Metric;
  isDrag: (isDragging: Boolean) => void;
};

export const MetricsInModal = ({ children, data, isDrag }: CardProps) => {
  const [isDraged, setIsDraged] = useState<Boolean>(false);
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "card",
      item: { data },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
      isDragging: () => {
        setIsDraged(true);
        return true;
      },
      end: () => {
        setIsDraged(false);
      },
    }),
    []
  );

  useEffect(() => {
    isDrag(isDraged);
    return () => {
      setIsDraged(false);
    };
  }, [isDrag, isDraged]);

  return (
    <div ref={drag} style={{ ...style, opacity }}>
      {children}
    </div>
  );
};
