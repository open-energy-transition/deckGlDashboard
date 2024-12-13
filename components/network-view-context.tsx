"use client";

import React, { createContext, useContext, useState } from "react";

type NetworkViewContextType = {
  networkView: boolean;
  setNetworkView: (view: boolean) => void;
};

const NetworkViewContext = createContext<NetworkViewContextType | undefined>(undefined);

export function NetworkViewProvider({ children }: { children: React.ReactNode }) {
  const [networkView, setNetworkView] = useState(false);

  return (
    <NetworkViewContext.Provider
      value={{
        networkView,
        setNetworkView,
      }}
    >
      {children}
    </NetworkViewContext.Provider>
  );
}

export function useNetworkView() {
  const context = useContext(NetworkViewContext);
  if (context === undefined) {
    throw new Error("useNetworkView must be used within a NetworkViewProvider");
  }
  return context;
} 