import DEFAULT_STATE from 'constants/context/initialState';
import {createContext, useState, PropsWithChildren} from 'react';

const CollapseDrawerContext = createContext(DEFAULT_STATE.sidebar);

function CollapseDrawerProvider({children}: PropsWithChildren<unknown>) {
  const [collapse, setCollapse] = useState({
    click: false,
    hover: false,
  });

  const handleToggleCollapse = () => {
    setCollapse({...collapse, click: !collapse.click});
  };

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({...collapse, hover: true});
    }
  };

  const handleHoverLeave = () => {
    setCollapse({...collapse, hover: false});
  };

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: collapse.click && !collapse.hover,
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave,
      }}
    >
      {children}
    </CollapseDrawerContext.Provider>
  );
}

export {CollapseDrawerProvider, CollapseDrawerContext};
