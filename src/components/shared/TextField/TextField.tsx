import {FormikErrors, FormikTouched} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ChangeEvent, FocusEvent, Fragment} from 'react';

interface ITextField {
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
  touched: any;
  errors: any;
}

export default function TextField({
  label,
  onBlur,
  value,
  onChange,
  name,
  touched,
  errors,
}: ITextField) {
  const {t} = useTranslation();
  const touchedInput = touched[name];
  const error = errors[name];
  return (
    <Fragment>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
        {t(label)}
      </label>
      <input
        type='text'
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
        id={name}
        className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
      />

      {touchedInput && error ? (
        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
      ) : null}
    </Fragment>
  );
}

interface ITextArea {
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
  numRows: number;
}

export function TextArea({
  label,
  numRows,
  onBlur,
  value,
  onChange,
  name,
  touched,
  errors,
}: ITextArea) {
  const {t} = useTranslation();
  const touchedInput = touched[name];
  const error = errors[name];
  return (
    <Fragment>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
        {t(label)}
      </label>
      <textarea
        id={name}
        name={name}
        rows={numRows}
        className='mt-1 py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md'
        onBlur={onBlur}
        value={value}
        onChange={onChange}
      />

      {touchedInput && error ? (
        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
      ) : null}
    </Fragment>
  );
}

interface IUrlInput {
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
}

export function UrlInput({onBlur, value, onChange, name, touched, errors}: IUrlInput) {
  const touchedInput = touched[name];
  const error = errors[name];

  return (
    <Fragment>
      <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
        Website
      </label>
      <div className='mt-1 flex rounded-md shadow-sm'>
        <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
          http://
        </span>
        <input
          type='text'
          name={name}
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
          placeholder='www.example.com'
        />
      </div>
      {touchedInput && error ? (
        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
      ) : null}
    </Fragment>
  );
}
