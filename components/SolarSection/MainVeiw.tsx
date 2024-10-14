import React from "react";
import SolarPolygon from "./SolarPolygon";
import MyDropdown from "../../app/sidebyside/MyDropdown";

const MainVeiw = () => {
  return (
    <>
      <div>
        <div className="absolute top-0 right-1/2 h-screen w-2 bg-slate-300 z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-screen z-0 overflow-hidden">
          <SolarPolygon />
        </div>
        <div className="absolute top-0 left-0 w-1/2 h-screen z-0 overflow-hidden">
          <SolarPolygon />
        </div>
        {/* <div className="absolute bg-orange-300 "> */}
        <MyDropdown className="absolute top-0 left-0 w-3/10 z-0 overflow-hidden" />
        <MyDropdown className="absolute top-0 right-0 w-3/10 z-0 overflow-hidden" />
        {/* </div> */}
      </div>
    </>
  );
};

export default MainVeiw;
