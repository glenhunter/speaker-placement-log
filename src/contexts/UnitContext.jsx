import { createContext, useContext, useState } from "react";

const UnitContext = createContext(undefined);

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState("imperial");

  return (
    <UnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
}
