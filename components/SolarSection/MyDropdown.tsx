import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieDonut from "../Charts/PieDonut";
import BarChartSimple from "../Charts/BarChartSimple";

export default function MyDropdown(props) {
  return (
    <Tabs defaultValue="account" className={props.className}>
      <TabsList className=" bg-gray-500/80">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="chart-3">chart3</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <BarChartSimple />
      </TabsContent>
      <TabsContent value="password">
        <BarChartSimple />
      </TabsContent>
      <TabsContent value="chart-3">
        <PieDonut />
      </TabsContent>
    </Tabs>
  );
}
