"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  return (
    <div className="absolute z-20 left-0 bottom-0 bg-red-200">
      <div className="flex flex-col flex-wrap justify-end">
        <Button variant="outline" onClick={() => router.push("/")}>
          Home
        </Button>
        <Button variant="outline" onClick={() => router.push("/network")}>
          Network
        </Button>
        <Button variant="outline" onClick={() => router.push("/polygon")}>
          Polygon
        </Button>
        <Button variant="outline" onClick={() => router.push("/sidebyside")}>
          Polygon version 2
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
