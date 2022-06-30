type Props = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({children, className = 'cardContainerBase'}: Props) => (
  <div className={className}>{children}</div>
);

export default Card;
