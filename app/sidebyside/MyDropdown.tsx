import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieDonut from "../../components/Charts/PieDonut";
import { Card } from "../../components/ui/card";
import { MainControls } from "./MainControls";

interface MyDropdownProps {
  className?: string;
  year: number;
  closeControls: () => void;
  buttonPosition: string;
  onRenewableTypeChange: (type: string) => void;
  onParameterChange: (param: string) => void;
}

export default function MyDropdown(props: MyDropdownProps) {
  return (
    <Tabs defaultValue="control" className={props.className}>
      <TabsList>
        <TabsTrigger value="control">CONTROLS</TabsTrigger>
        <TabsTrigger value="chart1">chart1</TabsTrigger>
      </TabsList>
      <TabsContent value="control">
        <MainControls
          year={props.year.toString()}
          close={props.closeControls}
          buttonPosition={props.buttonPosition}
          onRenewableTypeChange={props.onRenewableTypeChange}
          onParameterChange={props.onParameterChange}
        />
      </TabsContent>
      <TabsContent value="chart1">
        <Card>
          <PieDonut />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
