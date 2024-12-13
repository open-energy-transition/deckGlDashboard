import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type MainControlsProps = {
  buttonPosition: string;
  close: () => void;
  onRenewableTypeChange: (type: string) => void;
  onParameterChange: (param: string) => void;
  year?: string;
};

// Backup of original scales for reference
const originalScales = {
  cf: [
    { color: "rgb(65, 182, 196)", label: "0%" },
    { color: "rgb(160, 170, 120)", label: "25%" },
    { color: "rgb(254, 153, 41)", label: "50%" },
    { color: "rgb(245, 110, 40)", label: "75%" },
    { color: "rgb(239, 59, 44)", label: "100%" }
  ],
  crt: [
    { color: "rgb(65, 171, 93)", label: "0%" },
    { color: "rgb(160, 170, 90)", label: "25%" },
    { color: "rgb(254, 153, 41)", label: "50%" },
    { color: "rgb(245, 110, 40)", label: "75%" },
    { color: "rgb(239, 59, 44)", label: "100%" }
  ],
  usdpt: [
    { color: "rgb(65, 182, 196)", label: "0%" },
    { color: "rgb(65, 175, 150)", label: "25%" },
    { color: "rgb(65, 171, 93)", label: "50%" },
    { color: "rgb(50, 150, 80)", label: "75%" },
    { color: "rgb(35, 139, 69)", label: "100%" }
  ]
};

const getParameterInfo = (parameter: string) => {
  const info = {
    cf: {
      title: "Capacity Factor (CF)",
      tooltip: "Percentage of time that the resource is available at full capacity"
    },
    crt: {
      title: "Curtailment",
      tooltip: "Percentage of energy that must be discarded due to overproduction"
    },
    usdpt: {
      title: "Used %",
      tooltip: "Percentage of installed capacity that is being used"
    }
  };
  return info[parameter as keyof typeof info] || info.cf;
};

const getColorScale = (parameter: string) => {
  const scales = {
    cf: [
      { color: "rgb(65, 182, 196)", label: "0-10%", value: 10 },
      { color: "rgb(160, 170, 120)", label: "10-25%", value: 25 },
      { color: "rgb(254, 153, 41)", label: "25-40%", value: 40 },
      { color: "rgb(245, 110, 40)", label: "40-60%", value: 60 },
      { color: "rgb(239, 59, 44)", label: ">60%", value: 100 }
    ],
    crt: [
      { color: "rgb(65, 171, 93)", label: "0-5%", value: 5 },
      { color: "rgb(160, 170, 90)", label: "5-15%", value: 15 },
      { color: "rgb(254, 153, 41)", label: "15-30%", value: 30 },
      { color: "rgb(245, 110, 40)", label: "30-50%", value: 50 },
      { color: "rgb(239, 59, 44)", label: ">50%", value: 100 }
    ],
    usdpt: [
      { color: "rgb(239, 59, 44)", label: "0-20%", value: 20 },
      { color: "rgb(254, 153, 41)", label: "20-40%", value: 40 },
      { color: "rgb(160, 170, 90)", label: "40-60%", value: 60 },
      { color: "rgb(65, 171, 93)", label: "60-80%", value: 80 },
      { color: "rgb(65, 182, 196)", label: ">80%", value: 100 }
    ]
  };
  return scales[parameter as keyof typeof scales] || scales.cf;
};

export function MainControls({
  buttonPosition,
  close,
  onRenewableTypeChange,
  onParameterChange,
}: MainControlsProps) {
  const [selectedParameter, setSelectedParameter] = React.useState("cf");
  const parameterInfo = getParameterInfo(selectedParameter);

  const handleParameterChange = (value: string) => {
    setSelectedParameter(value);
    onParameterChange(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold">Visualization Controls</div>
      <Select onValueChange={onRenewableTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Renewable type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Renewable type</SelectLabel>
            <SelectItem value="solar">Solar</SelectItem>
            <SelectItem value="onwind">Onshore Wind</SelectItem>
            <SelectItem value="offwind">Offshore Wind</SelectItem>
            <SelectItem value="ror">Run of River</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={handleParameterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Parameters" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Parameters</SelectLabel>
            <SelectItem value="cf">{parameterInfo.title}</SelectItem>
            <SelectItem value="crt">Curtailment</SelectItem>
            <SelectItem value="usdpt">Used %</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">
        {parameterInfo.tooltip}
      </div>
      <div className="flex flex-wrap gap-2">
        {getColorScale(selectedParameter).map((scale, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar className="h-6 w-6">
              <div className="w-full h-full" style={{ backgroundColor: scale.color }}></div>
            </Avatar>
            <div className="text-xs mt-1">{scale.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
