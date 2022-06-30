import {TranslateIcon} from '@heroicons/react/solid';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';

const ChangeLanguage = () => {
  const {lang} = useTranslation();
  const onChangeOption = e => {
    setLanguage(e.target.value);
  };

  return (
    <>
      <span
        className={
          'text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
        }
      >
        <TranslateIcon
          className={
            'text-gray-400 group-hover:text-gray-500  flex flex-shrink-0 items-start justify-center'
          }
          style={{
            height: '22px',
            width: '22px',
          }}
          aria-hidden='true'
        />
        <select
          name='language'
          onChange={onChangeOption}
          value={lang}
          className='border-none flex-1 min-w-0 my-0 whitespace-nowrap flex items-center py-2 pr-3 pl-4 text-sm font-medium rounded-lg cursor-pointer text-left hover:border-none'
        >
          <option value='de'>Deutsch</option>
          <option value='en'>English</option>
          <option value='es'>Española</option>
          <option value='it'>Italiana</option>
          <option value='pt'>Português</option>
          <option value='ro'>Română</option>
          <option value='de'>Deutsch</option>
        </select>
      </span>
    </>
  );
};
export default ChangeLanguage;
