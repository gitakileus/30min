import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useEffect, useState} from 'react';
import InputDownList from 'components/shared/InputDownList/InputDownList';
import {Switch} from '@headlessui/react';
import ExtensionQuery from 'constants/GraphQL/ActiveExtension/queries';
import ProductIDs from 'constants/stripeProductIDs';
import classNames from 'classnames';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';

type IProps = {
  setFieldValue: any;
  values: any;
};

const WhiteBlacklist = (props: IProps) => {
  const {setFieldValue, values} = props;
  const {data: session} = useSession();

  const {data} = useQuery(ExtensionQuery.checkExtensionStatus, {
    variables: {
      productId: ProductIDs.EXTENSIONS.WHITE_BLACK_LIST,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
        'Content-Type': 'application/json',
      },
    },
  });

  const {push} = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const HandleGotoExtension = () => {
    push('/user/extensions');
    hideModal();
  };

  const [Emails, setEmails] = useState<Array<String>>(
    values?.emailFilter?.emails ? values?.emailFilter?.emails : []
  );
  const [Domains, setDomains] = useState<Array<String>>(
    values?.emailFilter?.domains ? values?.emailFilter?.domains : []
  );
  const [isBlacklist, setisBlacklist] = useState(
    values?.emailFilter?.type === 'BLACK_LIST' ? true : false
  );

  useEffect(() => {
    setFieldValue &&
      setFieldValue('emailFilter', {
        ...{
          isEnabled: data?.checkExtensionStatus?.isActive ? true : false,
          type: isBlacklist ? 'BLACK_LIST' : 'WHITE_LIST',
          emails: Emails,
          domains: Domains,
        },
      });
  }, [Emails, Domains, isBlacklist]);

  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            {!data?.checkExtensionStatus?.isActive ? (
              <div className='mb-4 '>
                <div className='row mt-1'>
                  <span className='text-sm font-medium text-gray-900'>
                    {t('event:white_black_list_extension_off')}{' '}
                  </span>
                </div>
                <div className='row mt-1'>
                  <button
                    type='button'
                    className='bg-mainBlue border border-transparent ml-auto rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                    onClick={HandleGotoExtension}
                  >
                    View Extensions
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className='w-1/6 my-4'>
                  <Switch.Group as='div' className='flex items-center justify-between'>
                    <span className='flex-grow flex flex-col  ml-2 mr-2'>
                      <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                        {isBlacklist ? 'Blacklist' : 'Whitelist'}
                      </Switch.Label>
                    </span>
                    <Switch
                      checked={isBlacklist}
                      onChange={() => setisBlacklist(!isBlacklist)}
                      className={classNames(
                        isBlacklist ? 'bg-mainBlue' : 'bg-gray-200',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                      )}
                    >
                      <span
                        aria-hidden='true'
                        className={classNames(
                          isBlacklist ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200'
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </div>
                <div className='grid grid-cols-6 gap-3 mt-2'>
                  <InputDownList
                    title={'Domains'}
                    type={'text'}
                    list={Domains}
                    BindListItems={setDomains}
                    t={t}
                  />
                  <InputDownList
                    title={'Emails'}
                    type={'email'}
                    list={Emails}
                    BindListItems={setEmails}
                    t={t}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhiteBlacklist;
