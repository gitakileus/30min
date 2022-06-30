type Props = {
  title: string;
  svg: React.ReactNode;
  onClick: () => void;
};

const emptyService = ({title, svg, onClick}: Props) => (
  <button
    onClick={onClick}
    type='button'
    className='relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  >
    {svg}
    <span className='mt-2 block text-sm font-medium text-gray-900'>{title}</span>
  </button>
);

export default emptyService;
