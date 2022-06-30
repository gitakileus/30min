import {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  contextProvider: (({children}: PropsWithChildren<unknown>) => JSX.Element)[];
}>;

const StoreContextProvider = ({children, contextProvider}: Props) =>
  contextProvider.reduce(
    (Components, CurrentComponent) => <CurrentComponent>{Components}</CurrentComponent>,
    <>{children}</>
  );

export default StoreContextProvider;
