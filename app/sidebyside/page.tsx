"use client";
import SideBySideNav from "./popups/SideBySideNav";
import SideBySide from "./SideBySide";
import React from "react";
import { Mode } from "./popups/Mode";

const Page = () => {
  const [mode, setMode] = React.useState<Mode>("split-screen");
  return (
    <>
      <SideBySide mode={mode} />
      <SideBySideNav mode={mode} setMode={setMode} />
    </>
  );
};

export default Page;
