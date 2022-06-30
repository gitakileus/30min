/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck
import React, {useState, useEffect, createContext, useContext, PropsWithChildren} from 'react';
import DEFAULT_STATE from 'constants/context/initialState';
import {MODAL_COMPONENTS} from 'constants/context/modals';

const ModalContext = createContext(DEFAULT_STATE.modal);

export const ModalContextProvider = () => useContext(ModalContext);

export const ModalProvider = ({children}: PropsWithChildren<unknown>) => {
  const [store, setStore] = useState();

  const {modalType, modalProps} = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  useEffect(() => {
    document.body.style.overflow = modalType ? 'hidden' : 'auto';

    const onKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalType) {
        hideModal();
        document.removeEventListener('keydown', onKeyDownHandler);
      }
    };
    document.addEventListener('keydown', onKeyDownHandler);
    return () => document.removeEventListener('keydown', onKeyDownHandler);
  }, [modalType]);

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent {...modalProps} />;
  };

  return (
    <ModalContext.Provider value={{store, showModal, hideModal}}>
      {renderComponent()}
      {children}
    </ModalContext.Provider>
  );
};
