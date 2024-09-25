import React from "react";
import Nav from "@/components/Nav";
import MainMap from "@/components/BaseMap/MainMap";

const page = () => {
  return (
    <div>
      <div className="relative z-10">
        <Nav />
      </div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap />
      </div>
    </div>
  );
};

export default page;
