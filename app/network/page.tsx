import React from "react";
import MainMap from "@/components/BaseMap/MainMap";
import CountrySelect from "@/components/BaseMap/CountrySelect";

const page = () => {
  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap />
        {/* <CountrySelect /> */}
      </div>
    </div>
  );
};

export default page;
