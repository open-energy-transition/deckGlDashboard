"use client";

import React, { createContext, useContext, useState } from "react";

type VisualizationContextType = {
  selectedRenewableType: string;
  setSelectedRenewableType: (type: string) => void;
  selectedParameter: string;
  setSelectedParameter: (param: string) => void;
};

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export function VisualizationProvider({ children }: { children: React.ReactNode }) {
  const [selectedRenewableType, setSelectedRenewableType] = useState("solar");
  const [selectedParameter, setSelectedParameter] = useState("cf");

  return (
    <VisualizationContext.Provider
      value={{
        selectedRenewableType,
        setSelectedRenewableType,
        selectedParameter,
        setSelectedParameter,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (context === undefined) {
    throw new Error("useVisualization must be used within a VisualizationProvider");
  }
  return context;
} 