type Props = {
  children: React.ReactNode;
  className: string;
};

const CenteredContainer = ({children, className}: Props) => (
  <div className={className}>{children}</div>
);

export default CenteredContainer;
