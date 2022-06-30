type Props = {
  text: string;
  className?: string;
};

const CardBody = ({text, className = 'cardBodyBase'}: Props) => <p className={className}>{text}</p>;

export default CardBody;
