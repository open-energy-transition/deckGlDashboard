"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl mt-28 sm:mt-16 md:mt-0 gap-8 mx-auto py-32 md:py-80">
        <div className="text-center space-y-16">
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="mx-auto text-center text-4xl md:text-6xl lg:text-8xl font-bold">
              <h1>
                Welcome! to
                <span className="text-transparent px-2 bg-gradient-to-r from-[#E31937] to-primary bg-clip-text">
                  PyPSA
                </span>
                Earth Explorer
              </h1>
            </div>
            <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
              Have you ever wondered what exactly could look like the energy transition for your country? 
              With the modern open source energy planning tools, you can design it yourself.
            </p>
          </div>

          {/* Capabilities Section */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
              Capabilities
            </h2>
            <p className="max-w-screen-sm mx-auto text-lg text-muted-foreground">
              The project provides insights into application of state-of-the-art power system modeling 
              for a few countries distributed across the globe. The Dashboard provides tools to examine 
              the inputs and investigate the results.
            </p>
          </div>

          {/* Glossary Section */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
              Glossary
            </h2>
            <p className="max-w-screen-sm mx-auto text-lg text-muted-foreground">
              Power system models aim for emulating operation of the real power systems to explore 
              implications of different versions of the future. That implies a detailed representation 
              of the constraints substantial for operation of a real power system which are partially 
              quite technical. To give you some guidance in this journey, we have explained the major 
              terms in the glossary.
            </p>
          </div>

          {/* Sources Section */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
              Sources
            </h2>
            <div className="max-w-screen-sm mx-auto text-lg text-muted-foreground space-y-2">
              <p>PyPSA-Earth is the model used to obtain the results presented in the Dashboard.</p>
              <p>PyPSA-Earth-Status is the project consolidating efforts to increase accuracy of the data 
                provided by PyPSA-Earth modeling workflow for all countries of the world.</p>
              {/* <p className="text-[#E31937]">PyPSA-Earth Regional Studies [TODO The input from the coordinators is needed]</p> */}
            </div>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4 pt-8">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              Get Started
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link
                href="https://github.com/open-energy-transition"
                target="_blank"
              >
                Github repository
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
