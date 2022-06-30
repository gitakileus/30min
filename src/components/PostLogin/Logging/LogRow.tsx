import cuid from 'cuid';
import React, {useState} from 'react';

const LogRow = ({rowData, keyIndex}) => {
  const [showingDetails, setShowingDetails] = useState(false);
  const details = rowData.original;

  return (
    <React.Fragment key={keyIndex}>
      <tr
        className='hover:bg-gray-100 hover:cursor-pointer w-24'
        onClick={() => {
          setShowingDetails(!showingDetails);
        }}
      >
        {rowData.cells.map(cell => (
          <td key={cuid.slug()} className='px-6 py-4 whitespace-nowrap' role='cell'>
            {cell.column.Cell.name === 'defaultRenderer' ? (
              <div className='text-sm text-gray-500'>{cell.render('Cell')}</div>
            ) : (
              cell.render('Cell')
            )}
          </td>
        ))}
      </tr>
      {showingDetails ? (
        <tr className='shadow-sm'>
          <td colSpan={6}>
            <div className='flex flex-col p-4'>
              <span>Start Log ID: {details?.startLogId ? details?.startLogId : 'NONE'}</span>
              <span>
                Additional Message:{' '}
                {details?.additionalMessage ? details?.additionalMessage : 'NONE'}
              </span>
              {details.functionParams.map((param, index) => (
                <div key={cuid.slug()} className='flex flex-col'>
                  <span className='font-bold'>Param Index: {index}</span>
                  <span>Name: {param.paramName}</span>
                  <span>
                    Value: <code>{param.paramValue}</code>
                  </span>
                  <span>Type: {param.paramType}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      ) : null}
    </React.Fragment>
  );
};

export default LogRow;
