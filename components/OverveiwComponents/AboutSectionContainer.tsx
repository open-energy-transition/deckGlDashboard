"use client";
import React from "react";
import { AboutNav } from "./aboutNav";
import { Methods } from "./methods";
import { Vision } from "./vison";
import { NextSteps } from "./next-steps";
import { Limitations } from "./limitations";

export type AboutSectionType =
  | "vision"
  | "limitations"
  | "next-step"
  | "methods";

const AboutSectionContainer = () => {
  const [currentSection, setCurrentSection] =
    React.useState<AboutSectionType>("vision");

  const renderSection = () => {
    switch (currentSection) {
      case "vision":
        return <Vision />;
      case "limitations":
        return <Limitations />;
      case "next-step":
        return <NextSteps />;
      case "methods":
        return <Methods />;
      default:
        return <Vision />; // Default fallback
    }
  };

  return (
    <div className="container flex flex-wrap items-start py-24 justify-between gap-24 lg:gap-8  box-border min-w-[20rem]">
      <AboutNav
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <div>{renderSection()}</div>
    </div>
  );
};

export default AboutSectionContainer;
