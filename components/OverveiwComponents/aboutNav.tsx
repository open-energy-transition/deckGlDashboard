import Link from "next/link";
import React from "react";
import { AboutSectionType } from "./AboutSectionContainer";



type AboutNavProps = {
  currentSection: AboutSectionType;
  setCurrentSection: (section: AboutSectionType) => void;
};

export const AboutNav: React.FC<AboutNavProps> = ({ currentSection, setCurrentSection }) => {
  return (
    <div>
      <div className="cursor-pointer" onClick={() => setCurrentSection('vision')}>vision</div>
      <div className="cursor-pointer" onClick={() => setCurrentSection('next-step')}>next-steps</div>
      <div className="cursor-pointer" onClick={() => setCurrentSection('methods')}>methods</div>
      <div className="cursor-pointer" onClick={() => setCurrentSection('limitations')}>limitations</div>
    </div>
  );
};
