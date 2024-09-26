import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChartRadial } from "../Charts/ChartRadial";
import PieDonut from "../Charts/PieDonut";
import BarChartSimple from "../Charts/BarChartSimple";
import { SimpleBar } from "../Charts/SimpleBar";

export default function MySideDrawer({ open, setOpen, side }) {
  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetContent side={side} className="overflow-y-scroll no-scrollbar w-96">
        <SheetHeader>
          <SheetTitle>Bus Graphs</SheetTitle>
          <SheetDescription>See statics related to bus here</SheetDescription>
        </SheetHeader>
        <div className="pb-4 pt-4">
          <ChartRadial />
        </div>
        <div className="pb-4 pt-4">
          {/* <BarChartSimple />
           */}
          <SimpleBar />
        </div>
        <div className="pb-4 pt-4">
          <PieDonut />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>CLOSE</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
