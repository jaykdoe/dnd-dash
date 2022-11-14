import React from "react";
import Header from "@webclient/components/Header/Header";

export type LayoutProps = {
  title: string;
  children?: React.ReactNode;
};

const LayoutComponent: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Header title={title} />

      <div className="relative h-screen">
        <div className="container mx-auto p-4">{children}</div>
      </div>
    </>
  );
};

export default LayoutComponent;
