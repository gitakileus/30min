type Props = {
  children: React.ReactNode;
  className: string;
};

const GridContainer = ({children, className}: Props) => <div className={className}>{children}</div>;

export default GridContainer;
