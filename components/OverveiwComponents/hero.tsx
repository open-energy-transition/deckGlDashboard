"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl mt-24 sm:mt-14 md:mt-0 gap-8 mx-auto py-32 md:py-80">
        <div className="text-center space-y-16">
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="mx-auto text-center text-5xl md:text-6xl lg:text-8xl font-bold">
              <h1>
                Welcome! to
                <span className="text-transparent px-2 bg-gradient-to-r from-[#E31937] to-primary bg-clip-text">
                  PyPSA
                </span>
                Earth Explorer
              </h1>
            </div>
            <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
              Have you ever wondered what exactly could look like the energy
              transition for your country? With the modern open source energy
              planning tools, you can design it yourself.
            </p>
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
