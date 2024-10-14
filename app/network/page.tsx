import React from "react";
import MainMap from "./MainMap";

const page = () => {
  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap />
      </div>
    </div>
  );
};

export default page;
