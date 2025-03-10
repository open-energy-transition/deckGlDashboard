import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TabletSmartphone",
    title: "Accessible Anywhere",
    description:
      "Our platform is designed to be mobile-friendly, allowing you to explore energy models and scenarios on any device, anytime.",
  },
  {
    icon: "BadgeCheck",
    title: "Reliable Insights",
    description:
      "Built on validated data and reproducible results, ensuring accuracy and trust in energy planning and analysis.",
  },
  {
    icon: "Goal",
    title: "Targeted Scenarios",
    description:
      "Dive into tailored energy scenarios, from today’s grid operations to net-zero 2050 projections, for informed decision-making.",
  },
  {
    icon: "PictureInPicture",
    title: "Interactive Visuals",
    description:
      "Gain clarity with strong visualizations of power systems, including energy flows and infrastructure, to better understand complex data.",
  },
  {
    icon: "MousePointerClick",
    title: "Actionable Guidance",
    description:
      "Explore clear pathways and next steps for energy planning, with tools and insights to guide decision-making.",
  },
  {
    icon: "Newspaper",
    title: "Comprehensive Details",
    description:
      "Access detailed scenario definitions, assumptions, and technical documentation to fully understand power system dynamics.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-16 sm:py-20 lg:py-32">
      <h3 className="md:w-1/2 mx-auto text-center pb-2  mb-0 text-secondary">
        accessible data
      </h3>
      <h2 className="text-5xl md:text-6xl lg:text-6xl text-center font-sans font-bold mb-16 text-card-foreground">
        Why Data Visualization matters
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-start">
                <div className="bg-none p-0 rounded-full ring-8 ring-ring/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={48}
                    color="hsl(var(--secondary))"
                    className="text-secondary"
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
      </div>
    </section>
  );
};
