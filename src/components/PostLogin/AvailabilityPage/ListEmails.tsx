import {TrashIcon} from '@heroicons/react/solid';

const ListEmails = ({emails, setFieldValue}) => {
  const EmailItem = ({email, index}) => {
    const handleDeleteItem = Index => {
      const newList = emails;
      newList?.splice(Index, 1);
      setFieldValue('emails', newList);
    };
    return (
      <li className='block '>
        <div className='grid grid-cols-10 col-span-1 gap-1 grid-flow-col border-b my-2 pb-2 px-2'>
          <span className='col-span-9 my-auto text-sm font-bold pl-1 truncate'>{email}</span>
          {
            <TrashIcon
              onClick={() => handleDeleteItem(index)}
              width={22}
              height={22}
              className='text-red-500 cursor-pointer mr-1 m-auto'
            />
          }
        </div>
      </li>
    );
  };
  return (
    <ul className='h-48 border px-2 rounded-sm mt-2 overflow-y-auto'>
      {emails?.map(({email}, index) => (
        <EmailItem key={index} email={email} index={index} />
      ))}
    </ul>
  );
};

export default ListEmails;
