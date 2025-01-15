import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Overview",
    description:
      "Analyze transformation of generation mix and investments needed across countries to achieve net-zero emissions in the power sector by 2050.",
    pro: 0,
  },
  {
    title: "Network Analysis",
    description:
      "Examine transmission and distribution power grids that accommodate intermittent renewable electricity production, addressing bottlenecks and investment needs.",
    pro: 0,
  },
  {
    title: "PyPSA-Earth Integration",
    description:
      "Extract and process grid data from open resources with high spatial resolution, using efficient clustering for computational feasibility.",
    pro: 0,
  },
  {
    title: "Renewable Sources",
    description:
      "Comprehensive analysis of renewable energy sources and their integration into existing power infrastructure.",
    pro: 0,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-16 sm:py-24">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What different pages are about
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        From marketing and sales to operations and strategy, we have the
        expertise to help you achieve your goals.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
