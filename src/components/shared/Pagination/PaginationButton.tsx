export default function PaginationButton({title, onClick, active, disabled}) {
  return (
    <button onClick={disabled ? null : onClick}>
      <span
        className={`flex  ${
          active ? 'bg-mainBlue text-white' : 'text-mainBlue hover:bg-blue-700 hover:text-white'
        }
        ${disabled ? 'opacity-60 text-gray-900' : ''}
      text-base leading-tight font-bold cursor-pointer shadow transition duration-150 
      ease-in-out mx-2 sm:mx-4 rounded px-3 py-2 focus:outline-none`}
      >
        {title}
      </span>
    </button>
  );
}
