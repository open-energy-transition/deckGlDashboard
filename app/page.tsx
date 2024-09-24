import MainMap from "@/components/BaseMap/MainMap";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div>
      <div className="relative z-10">
        <Nav />
      </div>
      <div className="absolute w-full h-full z-0 top-0 overflow-hidden ">
        <MainMap />
      </div>
    </div>
  );
}
