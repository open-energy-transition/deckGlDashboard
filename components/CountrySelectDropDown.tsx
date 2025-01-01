import { useCountry } from "@/components/country-context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRY_COORDINATES } from "@/utilities/CountryConfig/Link";

const CountrySelectDropDown = () => {
  const { selectedCountry, setSelectedCountry } = useCountry();

  return (
    <Select
      value={selectedCountry}
      onValueChange={(value: keyof typeof COUNTRY_COORDINATES) =>
        setSelectedCountry(value)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
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

export default CountrySelectDropDown;
