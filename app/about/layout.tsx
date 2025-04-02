import { AboutNav } from "@/components/OverveiwComponents/aboutNav";
import React from "react";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
          <div className="mt-20"></div>
          <div className="w-screen min-h-screen overflow-y-scroll overflow-x-hidden bg-background flex flex-col items-center justify-center gap-4 p-4 lg:gap-8 lg:p-0 box-border max-w-screen">
                {children}
      <AboutNav />

           </div>
    
    </>
  );
}
