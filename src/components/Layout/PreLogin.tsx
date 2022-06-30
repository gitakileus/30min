import Footer from 'components/PreLogin/Footer';
import Head from 'next/head';
import {PropsWithChildren} from 'react';
import Header from '../PreLogin/Header';

const PreLoginLayout = ({children}: PropsWithChildren<unknown>) => (
  <div className='bg-white flex flex-col justify-between h-screen'>
    <Head>
      <link rel='icon' href='/assets/favicon.ico' />
    </Head>
    <Header />
    <main className='mt-20'>{children}</main>
    <Footer />
  </div>
);

PreLoginLayout.auth = true;

export default PreLoginLayout;
