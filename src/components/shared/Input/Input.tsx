type Props = {
  placeholder: string;
  classNames: string;
};
const Input = ({placeholder, classNames}: Props) => (
  <input id={placeholder} className={classNames} placeholder={placeholder} />
);
export default Input;
