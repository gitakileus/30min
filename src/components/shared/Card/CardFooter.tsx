type Props = {
  text?: string;
  className?: string;
};

const CardFooter = ({text, className = 'cardFooterBase'}: Props) => (
  <p className={className}>{text}</p>
);

export default CardFooter;
