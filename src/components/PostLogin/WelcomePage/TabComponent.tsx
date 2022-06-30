import {CheckIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import React, {ReactElement} from 'react';

type TabType = {
  title: string;
  content?: ReactElement;
  accountType?: string;
  status?: 'complete' | 'current' | 'upcoming';
};

type Props = {
  tabs: TabType[];
  activeIndex: number;
  isWelcomeComplete: Boolean;
};

const Tabs = ({tabs = [], activeIndex = 0, isWelcomeComplete}: Props) => {
  const {content} = tabs?.[activeIndex] || {};

  tabs.forEach((tab, index) => {
    if (index === activeIndex) {
      tab.status = 'current';
    } else if (index < activeIndex) {
      tab.status = 'complete';
    } else {
      tab.status = 'upcoming';
    }
  });

  return (
    <>
      {!isWelcomeComplete && (
        <nav aria-label='Progress'>
          <ol role='list' className='flex items-center justify-center'>
            {tabs.map((step, index) => (
              <li
                key={step.title}
                className={classNames(index !== tabs.length - 1 ? 'pr-3 sm:pr-10' : '', 'relative')}
              >
                {step.status === 'complete' ? (
                  <>
                    <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                      <div
                        className={`h-0.5 w-full bg-mainBlue transition-width duration-500 ease-in-out`}
                      />
                    </div>
                    <a
                      href='#'
                      className='relative w-10 h-10 flex items-center justify-center bg-mainBlue rounded-full hover:bg-blue-900'
                    >
                      <CheckIcon className='w-5 h-5 text-white' aria-hidden='true' />
                      <span className='sr-only'>{step.title}</span>
                    </a>
                  </>
                ) : step.status === 'current' ? (
                  <>
                    <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                      <div className='h-0.5 w-full bg-gray-200' />
                    </div>
                    <a
                      href='#'
                      className='relative w-10 h-10 flex items-center justify-center bg-white border-2 border-mainBlue rounded-full'
                      aria-current='step'
                    >
                      <span className='h-2.5 w-2.5 bg-mainBlue rounded-full' aria-hidden='true' />
                      <span className='sr-only'>{step.title}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                      <div className='h-0.5 w-full bg-gray-200' />
                    </div>
                    <a
                      href='#'
                      className='group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400'
                    >
                      <span
                        className='h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300'
                        aria-hidden='true'
                      />
                      <span className='sr-only'>{step.title}</span>
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {content}
    </>
  );
};

export default Tabs;
