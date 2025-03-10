import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface DataProps {
  icon: string;
  title: string;
  description: string;
}

const DataList: DataProps[] = [
  {
    icon: "BatteryMedium",
    title: "Installed Capacity Comparison",
    description:
      "Current vs. Future Energy Infrastructure, highlighting the expansion needed for renewables and grid scaling.",
  },
  {
    icon: "HandCoins",
    title: "Investment Requirements",
    description:
      "Capital needed to achieve net-zero, including financial estimates for infrastructure expansion and clean energy deployment.",
  },
  {
    icon: "Factory",
    title: "Energy Generation Mix",
    description:
      "How energy is produced today vs. the future, highlighting financial implications for policymakers and investors.",
  },
  {
    icon: "Network",
    title: "Network Statistics & Model Comparisons",
    description:
      "Compares PyPSA-generated energy data with external datasets (EMBER, EIA) to validate energy modeling approaches.",
  },
  {
    icon: "MousePointerClick",
    title: "CO₂ Emissions",
    description:
      "Compares current emissions (2021) with net-zero targets for 2050, showcasing the impact of different energy policies.",
  },
  {
    icon: "Newspaper",
    title: "Total System Costs",
    description:
      "The cost of transitioning to net-zero, including a breakdown of investment in power generation, storage, and grid expansion.",
  },
];

export const DataSection = () => {
  return (
    <section
      id="datasection"
      className="container w-full py-16 sm:py-20 lg:py-48"
    >
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-8 ">
        <div className="w-1/2">hjsdgkjgsfdhsjfsljkfhklsf</div>
        <div className="w-full sm:w-1/2">
          <h3 className="pb-2 mb-0 text-secondary">insights</h3>
          <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-16 text-card-foreground">
            Featured Data
          </h2>

          {DataList.map(({ icon, title, description }) => (
            <div key={title}>
              <Card className="h-full bg-background border-0 shadow-none">
                <CardHeader className="flex justify-start ">
                  <div className="bg-none p-2 rounded-full ring-8 ring-ring/10 mb-4">
                    <Icon
                      name={icon as keyof typeof icons}
                      size={48}
                      color="hsl(var(--secondary))"
                      className="text-secondary"
                    />
                  </div>

                  <CardTitle className="lg:text-xl font-sans">
                    {title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-muted-foreground text-start">
                  {description}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
