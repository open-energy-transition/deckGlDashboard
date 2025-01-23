"use client";
import React, { useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";
import useSWR from "swr";
import { CarrierCostGeneral } from "@/components/Charts/CarrierCostPie";

type Props = {
  selectedCountry: string;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SystemCostDrawer = ({ selectedCountry, setParentIsOpen }: Props) => {
  const { data: totalCostsData2021 } = useSWR(
    `/api/total_costs_by_techs/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: investmentCostsData2021 } = useSWR(
    `/api/investment_costs_by_techs/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: totalCostsData2050 } = useSWR(
    `/api/total_costs_by_techs/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: investmentCostsData2050 } = useSWR(
    `/api/investment_costs_by_techs/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const [totalCostsState2021, setTotalCostsState2021] =
    React.useState<typeof totalCostsData2021>(null);

  const [investmentCostsState2021, setInvestmentCostsState2021] =
    React.useState<typeof investmentCostsData2021>(null);

  const [totalCostsState2050, setTotalCostsState2050] =
    React.useState<typeof totalCostsData2050>(null);

  const [investmentCostsState2050, setInvestmentCostsState2050] =
    React.useState<typeof investmentCostsData2050>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (totalCostsData2021?.data) {
      setTotalCostsState2021(totalCostsData2021.data);
    }
  }, [totalCostsData2021]);

  useEffect(() => {
    if (investmentCostsData2021?.data) {
      setInvestmentCostsState2021(investmentCostsData2021.data);
    }
  }, [investmentCostsData2021]);

  useEffect(() => {
    if (totalCostsData2050?.data) {
      setTotalCostsState2050(totalCostsData2050.data);
    }
  }, [totalCostsData2050]);

  useEffect(() => {
    if (investmentCostsData2050?.data) {
      setInvestmentCostsState2050(investmentCostsData2050.data);
    }
  }, [investmentCostsData2050]);

  useEffect(() => {
    if (open) {
      setParentIsOpen(false);
    } else {
      setParentIsOpen(true);
    }
  }, [open]);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(!open)}>
          compare system cost for {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">
              2021 System Cost analysis for {selectedCountry}
            </DrawerTitle>
            <DrawerDescription className="">
              Compare total costs and investment costs by technologies
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-wrap gap-2 justify-center align-middle w-[100%] lg:w-[50%] py-6 border-t-2 mt-4 border-r-2">
            <h2 className="w-full text-5xl font-semibold text-card-foreground text-center my-5">
              System Costs 2021
            </h2>
            <CarrierCostGeneral
              data={totalCostsState2021}
              costField="total_costs"
            />
            <CarrierCostGeneral
              data={investmentCostsState2021}
              costField="investment_cost"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center align-middle w-[100%] lg:w-[50%] py-6 border-t-2 mt-4">
            <h2 className="w-full text-5xl font-semibold text-card-foreground text-center my-5">
              Investment Cost 2050
            </h2>
            <CarrierCostGeneral
              data={totalCostsState2050}
              costField="total_costs"
            />
            <CarrierCostGeneral
              data={investmentCostsState2050}
              costField="investment_cost"
            />
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[80%]">CLOSE</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default SystemCostDrawer;
