"use client";

import * as React from "react";
import Link from "next/link";
import OET_LOGO_TEXT from "../../public/OET_LOGO_1.svg";
import OET_LOGO from "../../public/OET_LOGO_NO_TEXT.svg";
import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { Moon, Sun } from "lucide-react";

import Menu from "./Menu";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Network View",
    href: "/network",
    description:
      "Interactive visualization of country's power grid showing transmission lines and bus connections across different regions.",
  },
  {
    title: "Country Statistics",
    href: "/network",
    description:
      "Select a country to view comprehensive statistics and charts about its power system infrastructure and performance.",
  },
  {
    title: "Bus Analysis",
    href: "/network",
    description:
      "Detailed statistics for each bus node, showing generation capacity distribution across different energy sources.",
  },
  {
    title: "Transmission Lines",
    href: "/network",
    description:
      "View and analyze power transmission lines with different capacity ranges shown through an interactive network visualization.",
  },
  {
    title: "Generation Capacity",
    href: "/network",
    description:
      "Compare nominal and optimal generation capacities across different energy carriers in the selected region.",
  },
  {
    title: "Network Legend",
    href: "/network",
    description:
      "Guide to interpret the network visualization, including transmission line categories and bus representations.",
  },
];

const globeComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Scenario Comparison",
      href: "/landingglobe",
      description:
        "Side-by-side visualization of energy scenarios: light map shows 2021 baseline, dark map displays 2050 sustainable transition targets.",
    },
    {
      title: "System Costs",
      href: "/landingglobe",
      description:
        "Analyze total system costs and investment costs by carrier type, tracking financial aspects of energy transition.",
    },
    {
      title: "Emissions Analysis",
      href: "/landingglobe",
      description:
        "Monitor CO2 emissions by carrier and track progress towards emission reduction goals, including investment per CO2 reduced.",
    },
    {
      title: "Electricity Prices",
      href: "/landingglobe",
      description:
        "Track electricity price changes between scenarios, understanding the economic implications of energy transition.",
    },
    {
      title: "Generation Capacity",
      href: "/landingglobe",
      description:
        "Compare installed capacities and capacity expansion by carrier type between current and future scenarios.",
    },
    {
      title: "Generation Mix",
      href: "/landingglobe",
      description:
        "Visualize the evolution of power generation mix, showing the transition from conventional to renewable energy sources.",
    },
  ];

const polygonComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Side by Side Comparison",
    href: "/sidebyside",
    description:
      "Compare and analyze different renewable energy sources side by side, with detailed visualization controls.",
  },
  {
    title: "Renewable Sources",
    href: "/sidebyside",
    description:
      "Explore various renewable energy types including Solar, Onshore Wind, Offshore Wind, and Run of River.",
  },
  {
    title: "Parameter Analysis",
    href: "/sidebyside",
    description:
      "Analyze key parameters like Capacity Factor (CF), Curtailment, and Usage percentage for each renewable source.",
  },
  {
    title: "Geographic Distribution",
    href: "/sidebyside",
    description:
      "Visualize the geographical distribution and potential of different renewable energy sources across regions.",
  },
  {
    title: "Resource Availability",
    href: "/sidebyside",
    description:
      "View the percentage of time that each renewable resource is available at full capacity, from 0-10% to >60%.",
  },
  {
    title: "Comparative Tools",
    href: "/sidebyside",
    description:
      "Interactive tools for comparing and contrasting different renewable energy parameters and performance metrics.",
  },
];

export function NavigationMenuDemo() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <NavigationMenu className="fixed top-0 left-0 z-50 w-full bg-transparent max-w-[100vw] font-mono">
      <Menu />
      <NavigationMenuList className="max-w-[100vw] w-full p-4 flex justify-center gap-2 flex-wrap">
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/">Overveiw</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6">
                  <div className="relative h-full w-full">
                    <Image src={OET_LOGO} alt="OET Logo" priority fill />
                  </div>
                  <div className="mb-2 mt-4 text-lg font-medium">
                    Project Summary
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Explore power system scenarios and energy transitions across
                    different countries using PyPSA-Earth's advanced modeling
                    capabilities.
                  </p>
                </div>
              </li>
              <div className="block p-1">
                <div className="text-lg font-semibold text-[#E31937]">
                  Open Energy Transition
                </div>
                <p className="text-sm text-muted-foreground">
                  A collaborative initiative to accelerate the global transition
                  to sustainable energy through open-source tools and data.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA-Earth</div>
                <p className="text-sm text-muted-foreground">
                  A global-scale energy system model that helps analyze and
                  optimize power systems for a sustainable future.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA</div>
                <p className="text-sm text-muted-foreground">
                  Python for Power System Analysis - An open-source toolbox for
                  simulating and optimizing modern power systems.
                </p>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/network">Network</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <div key={component.title} className="block p-3">
                  <div className="text-sm font-medium">{component.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/landingglobe">Globe</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {globeComponents.map((component) => (
                <div key={component.title} className="block p-3">
                  <div className="text-sm font-medium">{component.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/sidebyside">Polygon</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {polygonComponents.map((component) => (
                <div key={component.title} className="block p-3">
                  <div className="text-sm font-medium">{component.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <div
            className={`${navigationMenuTriggerStyle()} flex items-center gap-1`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Switch
              id="theme"
              checked={theme === "light"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
            <Label htmlFor="theme">
              {theme === "light" ? <Moon /> : <Sun />}
            </Label>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport className="right-0 left-auto" />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
