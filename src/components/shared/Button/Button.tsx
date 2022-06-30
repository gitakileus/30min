type Props = {
  text: string;
  hasIcon?: boolean;
  icon?: string;
  type: 'button' | 'submit' | 'reset';
  className?: string;
  classNameLink?: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
};

const Button = ({
  text,
  hasIcon,
  type,
  icon,
  disabled,
  className = 'buttonBase',
  classNameLink,
  onClick,
  href = '#',
}: Props) => (
  <a href={href} className={className}>
    <button onClick={onClick} disabled={disabled} className={classNameLink} type={type}>
      {hasIcon ? icon : null} {text}
    </button>
  </a>
);

export default Button;
