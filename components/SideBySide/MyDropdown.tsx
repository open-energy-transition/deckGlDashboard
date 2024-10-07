import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieDonut from "../Charts/PieDonut";
import BarChartSimple from "../Charts/BarChartSimple";
import { ChartRadial } from "../Charts/ChartRadial";
import { MainControls } from "./MainControls";
import { Card } from "../ui/card";

export default function MyDropdown(props) {
  return (
    <Tabs defaultValue="control" className={props.className}>
      <TabsList>
        <TabsTrigger value="control">CONTROLS</TabsTrigger>
        <TabsTrigger value="chart1">chart1</TabsTrigger>
        <TabsTrigger value="chart2">chart2</TabsTrigger>
        <TabsTrigger value="chart3">chart3</TabsTrigger>
      </TabsList>
      <TabsContent value="control">
        <MainControls year={props.year} />
      </TabsContent>
      <TabsContent value="chart1">
        <Card>
          <PieDonut />
        </Card>
      </TabsContent>
      <TabsContent value="chart2">
        <Card>
          <ChartRadial />
        </Card>
      </TabsContent>
      <TabsContent value="chart3">
        <Card>
          <PieDonut />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
