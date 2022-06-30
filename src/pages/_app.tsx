import {AppProps} from 'next/app';
import type {NextPage} from 'next';
import React, {PropsWithChildren, ReactElement, ReactNode, useEffect} from 'react';
import Loader from 'components/shared/Loader/Loader';
import CookiesConsent from 'components/shared/CookieConsent/Cookie';
import Script from 'next/script';

import {SessionProvider, useSession} from 'next-auth/react';
import {ApolloProvider} from '@apollo/client';
import StoreContextProviders from 'store/contexts';
import {CollapseDrawerProvider} from 'store/Sidebar/Sidebar.context';
import {TabsContextProvider} from 'store/Tabs/Tabs.context';
import {ModalProvider} from 'store/Modal/Modal.context';
import {UserContextProvider} from 'store/UserContext/User.context';
import {NotificationContextProvider} from 'store/Notification/Notification.context';
import Notification from 'components/shared/Notification/Notification';
import {useRouter} from 'next/router';
import client from '../lib/apollo-client';
import * as gtag from '../lib/gtag';

import 'styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Auth = ({children}: PropsWithChildren<unknown>) => {
  const {data: session} = useSession({
    required: true,
  });
  const isUser = !!session?.user;

  if (isUser) {
    return <>{children}</>;
  }
  return <Loader />;
};

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const getLayout = Component.getLayout ?? (page => page);
  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />

      <Script
        strategy='afterInteractive'
        id='gtag-init"'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          {Component.auth ? (
            <StoreContextProviders
              contextProvider={[
                CollapseDrawerProvider,
                ModalProvider,
                NotificationContextProvider,
                TabsContextProvider,
                UserContextProvider,
              ]}
            >
              <Auth>
                <Notification />
                {getLayout(<Component {...pageProps} />)}
              </Auth>
            </StoreContextProviders>
          ) : (
            <>
              <StoreContextProviders contextProvider={[UserContextProvider, ModalProvider]}>
                {getLayout(<Component {...pageProps} />)}
              </StoreContextProviders>
            </>
          )}
          <CookiesConsent />
        </ApolloProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
