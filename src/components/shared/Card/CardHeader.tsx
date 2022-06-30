type Props = {
  text: string;
  className?: string;
};

const CardHeader = ({text, className = 'cardHeaderBase'}: Props) => (
  <h2 className={className}>{text}</h2>
);

export default CardHeader;
