import {PlusIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/solid';
import {Field} from 'formik';
import React from 'react';

type IProps = {
  title?: String;
  type: 'text' | 'email';
  BindListItems?: (value) => void;
  t: any;
  list: Array<String>;
};

type IState = {
  value: string;
};

class InputDownList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleAddClick = () => {
    this.handleKeyEnterDown({which: 13});
  };

  handleKeyEnterDown = e => {
    try {
      if (e.which === 13 && this.state.value !== '') {
        if (this.props.type === 'email') {
          // eslint-disable-next-line
          if (/^([a-zA-Z0-9_\\.\\-])+\@([a-zA-Z0-9\\.])/.exec(this.state.value)) {
            this.props.BindListItems &&
              this.props.BindListItems([...this.props.list, this.state.value]);
            this.setState({value: ''});
            e.preventDefault();
          } else {
            // e.preventDefault();
          }
        } else {
          this.props.BindListItems &&
            this.props.BindListItems([...this.props.list, this.state.value]);
          this.setState({value: ''});
          e.preventDefault();
        }
      }
    } catch (err) {} /* eslint-disable-line */
  };

  HandleDeleteItem = index => {
    try {
      const newlist = [...this.props.list];
      newlist.splice(index, 1);
      this.props.BindListItems && this.props.BindListItems(newlist);
      this.forceUpdate();
    } catch (err) {} /* eslint-disable-line */
  };

  render(): React.ReactNode {
    return (
      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
          {this.props.title ? this.props.t(`common:${this.props.title}`) : 'title'}
        </label>
        <div className='grid grid-cols-9 gap-1'>
          <Field
            className='border col-span-8 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
            value={this.state.value}
            type={this.props.type}
            id={this.props.title ? this.props.title : 'title'}
            name={this.props.title ? this.props.title : 'title'}
            onChange={e => this.setState({value: e.target.value})}
            onKeyDown={e => this.handleKeyEnterDown(e)}
          />
          <div
            className='col-start-9 flex justify-end border left-auto rounded-md shadow-sm cursor-pointer text-gray-700 active:bg-mainBlue active:text-white'
            onClick={() => this.handleAddClick()}
          >
            <PlusIcon className='block m-1' />
          </div>
        </div>
        <ul className='w-full mt-2 pr-2 overflow-y-scroll shadow-sm h-44 max-h-44 border border-gray-200 rounded-sm'>
          {this.props.list &&
            this.props.list.map((value, index) => (
              <li
                key={index}
                className='my-1 mx-1 py-1 flex w-full px-2 border border-gray-300 rounded-md'
              >
                <span className='text-sm font-medium text-gray-900'>{value}</span>
                <XIcon
                  className='ml-auto cursor-pointer text-gray-600 hover:text-red-600'
                  onClick={() => this.HandleDeleteItem(index)}
                  width={24}
                  height={24}
                />
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default InputDownList;
