import { Button } from "@/components/ui/button";

import Link from "next/link";

const NavBar = () => {
  return (
    <div className="absolute z-20 left-0 bottom-0 bg-red-200">
      <div className="flex flex-col flex-wrap justify-end">
        <Button variant="outline">
          <Link href="/">Home</Link>
        </Button>
        <Button variant="outline">
          <Link href="/network">Network</Link>
        </Button>
        <Button variant="outline">
          <Link href="/polygon">Polygon</Link>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
