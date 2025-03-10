import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import Image from "next/image";

// import icchartImage from "../";

interface DataProps {
  icon: string;
  title: string;
  description: string;
}

const DataList: DataProps[] = [
  {
    icon: "Zap",
    title: "Compare Installed Capacity",
    description:
      "Current vs. Future Energy Infrastructure",
  },
  {
    icon: "HandCoins",
    title: "Investment Requirements",
    description:
      "The cost of getting to Net-Zero, with investment needs per resource type",
  },
  {
    icon: "ChartPie",
    title: "Energy Generation Mix",
    description:
      "Discover which resources will supply your electricity in 2050",
  },
  {
    icon: "Network",
    title: "Network Statistics & Model Comparisons",
    description:
      "Validate PyPSA-generated energy data with external datasets (EMBER, EIA)",
  },
  {
    icon: "Leaf",
    title: "CO₂ Emissions to Zero",
    description:
      "Our scenarios constrain CO₂ emissions to zero, ensuring power will come from renewables",
  },
  {
    icon: "CircleDollarSign",
    title: "Total System Costs",
    description:
      "The cost to run the grid in 2050",
  },
];

export const DataSection = () => {
  return (
    <section
      id="datasection"
      className="container w-full py-16 sm:py-20 lg:py-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows gap-4"
    >
      <h3 className=" mb-0 col-span-1 md:col-span-2 lg:col-span-4 row-span-1 dark:text-secondary text-destructive">
        insights
      </h3>
      <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-16 text-card-foreground col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
        Featured Data
      </h2>

      {DataList.map(({ icon, title, description }) => (
        <div key={title} className="col-span-1">
          <Card className="h-full bg-background border shadow-none">
            <CardHeader className="flex justify-start ">
              <div className="bg-none p-2 rounded-full  mb-4">
                <Icon
                  name={icon as keyof typeof icons}
                  size={48}
                  //   color="hsl(var(--secondary))"
                  className="dark:text-secondary text-destructive"
                />
              </div>

              <CardTitle className="lg:text-xl font-sans">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground text-start">
              {description}
            </CardContent>
          </Card>
        </div>
      ))}
    </section>
  );
};
