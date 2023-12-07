import Layout from "@/components/layout";
import pool from "@/database/db";
import "@/styles/globals.css";
import { GetStaticProps } from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
};

type Category = {
  name: string;
};

export default function App({ Component, pageProps }: ComponentWithPageLayout) {
  const NestedLayout = Component.PageLayout || EmptyLayout;
  return (
    <>
      <Layout>
        <NestedLayout>
          <Component {...pageProps} />
        </NestedLayout>
      </Layout>
    </>
  );
}

const EmptyLayout = ({ children }: { children: ReactNode }) => <>{children}</>;
