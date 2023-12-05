import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
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

const EmptyLayout = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
