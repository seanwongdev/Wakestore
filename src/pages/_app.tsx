import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

import GlobalProvider from "@/GlobalProvider";
import Layout from "@/components/layout/Layout";
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
      <ChakraProvider>
        <SessionProvider session={session}>
          <GlobalProvider>
            <Layout>
              <NestedLayout>
                <Component {...pageProps} />
              </NestedLayout>
            </Layout>
          </GlobalProvider>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}

const EmptyLayout = ({ children }: { children: ReactNode }) => <>{children}</>;
