import React from "react";
import Head from "next/head";

export type HeadProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const HeadComponent: React.FC<HeadProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Head>
      <title key="title">{title}</title>
      <meta name="description" key="description" content={description} />
      <meta itemProp="name" key="name" content={title} />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </Head>
  );
};

export default HeadComponent;
