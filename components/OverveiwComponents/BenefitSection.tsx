import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "Capabilities",
    description:
      "The project provides insights into application of state-of-the-art power system modeling for a few countries distributed across the globe. The Dashboard provides tools to examine the inputs and investigate the results",
  },
  {
    icon: "LineChart",
    title: "Glossary",
    description:
      "Power system models aim for emulating operation of the real power systems to explore implications of different versions of the future. That implies a detailed representation of the constraints substantial for operation of a real power system which are partially quite technical. To give you some guidance in this journey, we have explained the major terms in the glossary",
  },
  {
    icon: "Wallet",
    title: "Source",
    description:
      "PyPSA-Earth is the model used to obtain the results presented in the Dashboard.PyPSA-Earth-Status is the project consolidating efforts to increase accuracy of the data provided by PyPSA-Earth modeling workflow for all countries of the world. PyPSA-Earth Regional Studies [TODO The input from the coordinators is needed]",
  },
  {
    icon: "Sparkle",
    title: "Data",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. A odio velit cum aliquam. Natus consectetur dolores.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What the data represents
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non
            ducimus reprehenderit architecto rerum similique facere odit
            deleniti necessitatibus quo quae.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/90 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <span className="text-5xl text-destructive/60 font-medium transition-all delay-75 group-hover/number:text-destructive">
                    {/* 0{index + 1} */}
                    {title}
                  </span>
                </div>

                {/* <CardTitle>{title}</CardTitle> */}
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
