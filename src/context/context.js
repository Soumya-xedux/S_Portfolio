import { createContext, useState } from "react";

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [selectedButton, setSelectedButton] = useState('about');

  return (
    <PortfolioContext.Provider value={[selectedButton, setSelectedButton]}>
      {children}
    </PortfolioContext.Provider>
  );
};