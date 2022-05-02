import { createContext, ReactNode, useContext, useState } from "react";

interface ModalPropsProvider {
  children: ReactNode;
}

interface ModalState {
  isOpen: boolean;
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEFAULT_VALUE = {
  isOpen: false,
  setIsopen: () => {},
};

const ModalContext = createContext<ModalState>(DEFAULT_VALUE);

export function ModalButtonProvider({ children }: ModalPropsProvider) {
  const [isOpen, setIsopen] = useState(DEFAULT_VALUE.isOpen);

  return (
    <ModalContext.Provider value={{ isOpen, setIsopen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContex() {
  return useContext(ModalContext);
}
