import { Button } from "@/components/ui/button";
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
import { ChartRadial } from "@/components/Charts/ChartRadial";
import PieDonut from "@/components/Charts/PieDonut";
import BarChartSimple from "@/components/Charts/BarChartSimple";

export default function MySideDrawer({ open, setOpen, side, data }) {
  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetContent side={side} className="overflow-y-scroll no-scrollbar w-96">
        <SheetHeader>
          <SheetTitle>{data} Graphs</SheetTitle>
          <SheetDescription>See statics related to bus here</SheetDescription>
        </SheetHeader>
        <div className="pb-4 pt-4">
          <ChartRadial />
        </div>
        <div className="pb-4 pt-4">
          <BarChartSimple />
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
