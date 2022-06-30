import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon, ChevronDownIcon} from '@heroicons/react/outline';
import {useEffect, useState} from 'react';
import {Disclosure, Transition} from '@headlessui/react';
import classNames from 'classnames';
import Link from 'next/link';

const FAQPAGE = () => {
  const {t} = useTranslation();
  const [tag, setTag] = useState('');

  useEffect(() => {
    setTag(window.location.href.split('#')[1]);
  }, []);

  const faqs = [
    {
      id: 'how_it_works',
      question: t('common:faq_q_how_it_works'),
      answer: t('common:faq_a_how_it_works'),
    },
    {
      id: 'cost',
      question: t('common:faq_q_cost'),
      answer: t('common:faq_a_cost'),
    },
    {
      id: 'free_paid',
      question: t('common:faq_q_free_paid'),
      answer: t('common:faq_a_free_paid'),
    },
    {
      id: 'how_much_charge',
      question: t('common:faq_q_how_much_money'),
      answer: t('common:faq_a_how_much_money'),
    },
    {
      id: 'which_calendar',
      question: t('common:faq_q_which_calendar'),
      answer: t('common:faq_a_which_calendar'),
    },
    {
      id: 'when_get_paid',
      question: t('common:faq_q_when_do_i_get_paid'),
      answer: t('common:faq_a_when_do_i_get_paid'),
    },
    {
      id: 'how_get_paid',
      question: t('common:faq_q_how_much_I_get_paid'),
      answer: t('common:faq_a_how_much_I_get_paid'),
    },
    {
      id: 'service',
      question: t('common:faq_q_create_service'),
      answer: t('common:faq_a_create_service'),
    },
    {
      id: 'workingHours',
      question: t('common:faq_q_working_hours'),
      answer: t('common:faq_a_working_hours'),
    },
    {
      id: 'editProfile',
      question: t('common:faq_q_edit_profile'),
      answer: t('common:faq_a_edit_profile'),
    },
    {
      id: 'calendars',
      question: t('common:faq_q_multiple_calendars'),
      answer: t('common:faq_a_multiple_calendars'),
    },
    {
      id: 'charity',
      question: t('common:faq_q_donate_charity'),
      answer: t('common:faq_a_donate_charity'),
    },
    {
      id: 'escrow',
      question: t('common:faq_q_direct_escrow'),
      answer: t('common:faq_a_direct_escrow'),
    },
    {
      id: 'charge_per_call',
      question: t('common:faq_q_charge_per_call'),
      answer: t('common:faq_a_charge_per_call'),
    },
    {
      id: 'visibility',
      question: t('common:faq_q_visibility'),
      answer: t('common:faq_a_visibility'),
    },
  ];
  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('page:FAQ')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
            {t('page:FAQ')}
          </h2>
        </div>
      </div>
      <div className='py-4'>
        <div className='bg-white shadow-md rounded-lg'>
          <div className='max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8'>
            <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
              <div>
                <h2 className='text-3xl font-extrabold text-gray-900'>
                  {t('common:frequently_asked_questions')}
                </h2>
                <p className='mt-4 text-lg text-gray-500'>
                  {t('common:faq_contact_1')}{' '}
                  <a
                    href='/contact-us'
                    target='_blank'
                    rel='noreferrer'
                    className='font-medium text-mainBlue hover:text-mainBlue'
                  >
                    {t('common:faq_contact_2')}
                  </a>{' '}
                </p>
              </div>
              <div className='lg:col-span-2'>
                <div className='max-w-3xl mx-auto divide-y-2 divide-gray-200'>
                  <dl className='space-y-6 divide-y divide-gray-200'>
                    {faqs.map(faq => (
                      <Disclosure as='div' id={faq.id} key={faq.question} className='pt-6'>
                        {({open}) => (
                          <>
                            <dt className='text-lg'>
                              <Disclosure.Button className='text-left w-full flex justify-between items-start text-gray-400'>
                                <span
                                  className={`${
                                    tag === faq.id ? 'text-mainBlue' : 'text-gray-900'
                                  } font-medium `}
                                >
                                  {faq.question}
                                </span>
                                <span className='ml-6 h-7 flex items-center'>
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? '-rotate-180' : 'rotate-0',
                                      'h-6 w-6 transform'
                                    )}
                                    aria-hidden='true'
                                  />
                                </span>
                              </Disclosure.Button>
                            </dt>
                            <Transition
                              show={open}
                              enter='transition duration-100 ease-out'
                              enterFrom='transform scale-95 opacity-0'
                              enterTo='transform scale-100 opacity-100'
                              leave='transition duration-75 ease-out'
                              leaveFrom='transform scale-100 opacity-100'
                              leaveTo='transform scale-95 opacity-0'
                            >
                              <Disclosure.Panel static as='dd' className='mt-2 pr-12'>
                                <p className='text-base text-gray-500'>{faq.answer}</p>
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FAQPAGE;
