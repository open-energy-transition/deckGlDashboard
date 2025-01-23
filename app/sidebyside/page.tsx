"use client";
import SideBySideNav from "./popups/SideBySideNav";
import SideBySide from "./SideBySide";
import React from "react";
import { Mode } from "./popups/Mode";

const Page = () => {
  const [mode, setMode] = React.useState<Mode>("split-screen");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100vh;
          width: 100vw;
        }
      `}</style>
      <SideBySide mode={mode} isDrawerOpen={isDrawerOpen} />
      <SideBySideNav 
        mode={mode} 
        setMode={setMode} 
        onDrawerOpenChange={setIsDrawerOpen}
      />
    </>
  );
};

export default Page;
