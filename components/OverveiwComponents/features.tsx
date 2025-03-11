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
    icon: "BadgeCheck",
    title: "Reliable Insights",
    description:
      "Results you can reproduce and validate. You can drill down to the details on our assumptions and how we model the grid.",
  },
  {
    icon: "Goal",
    title: "Targeted Scenarios",
    description:
      "Support informed decision-making on established goals such as Net-Zero by 2050.",
  },
  {
    icon: "PictureInPicture",
    title: "Interactive Visuals",
    description:
      "Explore our data with enticing visualizations to gain a better understanding of the complex data of energy flows and infrastructure.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-16 sm:py-20 lg:py-32">
      <h2 className="text-5xl md:text-6xl lg:text-6xl text-center font-sans font-bold mb-16 text-card-foreground">
        Vision for this project
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-start">
                <div className="bg-none p-0 rounded-full ring-ring/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={48}
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
      </div>
    </section>
  );
};
