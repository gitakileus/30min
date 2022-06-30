import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import React from 'react';

type Props = {
  openedTab: string;
  tabsNames: string[];
  onChange: (tabName: string) => void;
  className?: string;
};

const Tabs = ({openedTab, onChange, tabsNames}: Props) => {
  const router = useRouter();
  const onClickHandler = (tabName: string) => {
    onChange(tabName);
    router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        tab: tabName,
      },
    });
  };

  const {t} = useTranslation();
  const toTitleCase = (string: string) =>
    string.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
  const button = (name: string) => (
    <li className='mt-3 mr-0 sm:mr-6 md:mt-0 text-center py-2 sm:py-0' key={name}>
      <a
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm cursor-pointer transition duration-150 ease-in-out ${
          name === openedTab
            ? `border-mainBlue text-mainBlue`
            : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
        }`}
        onClick={() => onClickHandler(name)}
        data-toggle='tab'
      >
        {t(`common:${toTitleCase(name)}`)}
      </a>
    </li>
  );

  const buttonsGroup = tabsNames.map(button);

  return (
    <div className='flex flex-wrap'>
      <div className='w-full'>
        <ul
          className='flex flex-row mb-0 list-none flex-wrap pt-3 pb-4 gap-2 sm:gap-0 justify-between'
          role='tablist'
        >
          {buttonsGroup}
        </ul>
      </div>
    </div>
  );
};

export default Tabs;
