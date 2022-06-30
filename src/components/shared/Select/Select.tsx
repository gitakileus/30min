/* eslint-disable @typescript-eslint/no-shadow */
import {FormikErrors, FormikTouched} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ChangeEvent, FocusEvent, Fragment} from 'react';

interface ISelect {
  label: string;
  onBlur: {
    (e: FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  value: string;
  onChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  name: string;
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  options: {
    key: string;
    value: any;
  }[];
}

export default function Select({label, name, value, options, onChange, onBlur}: ISelect) {
  const {t} = useTranslation();

  return (
    <Fragment>
      <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
        {t(label)}
      </label>
      <div className='mt-1 rounded-md shadow-sm flex'>
        <select
          onChange={onChange}
          value={value}
          id={name}
          onBlur={onBlur}
          name={name}
          className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    </Fragment>
  );
}
