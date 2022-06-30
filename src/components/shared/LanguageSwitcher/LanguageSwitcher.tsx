import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';

export default function ChangeLanguage() {
  const {lang} = useTranslation();
  const onChangeOption = e => {
    setLanguage(e.target.value);
  };

  return (
    <div className='mt-6 flex justify-center space-x-8 md:mt-0'>
      <select
        name='language'
        onChange={onChangeOption}
        value={lang}
        className='max-w-md w-40 block  pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
      >
        <option value='de'>Deutsch</option>
        <option value='en'>English</option>
        <option value='es'>Española</option>
        <option value='it'>Italiana</option>
        <option value='pt'>Português</option>
        <option value='ro'>Română</option>
        <option value='de'>Deutsch</option>
      </select>
    </div>
  );
}
