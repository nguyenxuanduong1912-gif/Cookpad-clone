import { createContext, useState } from "react";

export const HistoryContext = createContext();
function HistoryProvider({ children }) {
  const [openHistory, setOpenHistory] = useState(false);
  return (
    <HistoryContext.Provider value={{ openHistory, setOpenHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export default HistoryProvider;
