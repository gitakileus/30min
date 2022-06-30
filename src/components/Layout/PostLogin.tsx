import {PropsWithChildren, useContext, useState} from 'react';
import Topbar from 'components/PostLogin/Dashboard/Topbar';
import {CollapseDrawerContext} from 'store/Sidebar/Sidebar.context';
import Head from 'next/head';
import Sidebar from '../PostLogin/Dashboard/Sidebar';

const DashBoard = ({children}: PropsWithChildren<unknown>) => {
  const [open, setOpen] = useState(false);

  const {collapseClick} = useContext(CollapseDrawerContext);
  return (
    <div>
      <Head>
        <link rel='icon' href='/assets/favicon.ico' />
      </Head>
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <div
        className={`${
          collapseClick ? 'lg:pl-32' : 'lg:pl-64'
        } flex flex-col flex-1 transition-width duration-300 ease-in-out`}
      >
        <Topbar onCloseSidebar={() => setOpen(true)} />
        <main className='flex-1'>
          <div className='py-0 sm:py-7'>
            <div
              className={`${
                collapseClick ? 'max-w-7xl ' : 'max-w-7xl '
              } mx-auto px-4 sm:px-6 md:px-8 transition-width duration-300 ease-in-out`}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoard;
