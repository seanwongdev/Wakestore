import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import GlobalProvider from "@/GlobalProvider";

import Layout from "@/components/layout/layout";
import "@/styles/globals.css";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
};

type Category = {
  name: string;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: ComponentWithPageLayout) {
  const NestedLayout = Component.PageLayout || EmptyLayout;
  return (
    <>
      <GlobalProvider>
        <SessionProvider session={session}>
          <Layout>
            <NestedLayout>
              <Component {...pageProps} />
            </NestedLayout>
          </Layout>
        </SessionProvider>
      </GlobalProvider>
    </>
  );
}

const EmptyLayout = ({ children }: { children: ReactNode }) => <>{children}</>;
