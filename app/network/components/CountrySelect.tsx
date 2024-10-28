"use client";
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
import { Button } from "../../../components/ui/button";

import { COUNTRY_COORDINATES } from "./Links";

type CountryCode = keyof typeof COUNTRY_COORDINATES;

interface CountrySelectProps {
  selectedCountry: string;
  onSelectCountry: (country: CountryCode) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  return (
    <Select
      value={selectedCountry}
      onValueChange={(value) => onSelectCountry(value as CountryCode)}
    >
      <Button variant={"outline"} asChild>
        <SelectTrigger className="w-[280px] absolute z-50 top-2 left-3">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
      </Button>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="US">United States</SelectItem>
          <SelectItem value="MX">Mexico</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="BR">Brazil</SelectItem>
          <SelectItem value="CO">Colombia</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="DE">Germany</SelectItem>
          <SelectItem value="IT">Italy</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="IN">India</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Africa</SelectLabel>
          <SelectItem value="NG">Nigeria</SelectItem>
          <SelectItem value="ZA">South Africa</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Oceania</SelectLabel>
          <SelectItem value="AU">Australia</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;