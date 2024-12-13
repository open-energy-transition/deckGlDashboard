"use client";

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex">
      {/* Fixed space for NavBar */}
      <div className="fixed left-0 top-0 w-96 h-screen z-50" />
      
      <main className="ml-96 w-[calc(100%-384px)] h-screen">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 