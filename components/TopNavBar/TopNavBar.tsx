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

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useTheme } from "next-themes";
import Image from "next/image";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Power Grid",
    href: "/docs/primitives/alert-dialog",
    description:
      "Insights into the topology and transmission capacity of the power grid model.",
  },
  {
    title: "Installed Capacity",
    href: "/docs/primitives/hover-card",
    description:
      "Spatial distribution of the electricity generation capacity",
  },
  {
    title: "Generaiton Mix",
    href: "/docs/primitives/progress",
    description:
      "An electricity generaiton mix modeled for the present state of the national power system.",
  },
  {
    title: "Data Cross-Check",
    href: "/docs/primitives/scroll-area",
    description: "Comparison against independent third-parties data for the major inputs of the model.",
  },
  {
    title: "Model validation",
    href: "/docs/primitives/tabs",
    description:
      "Validation of the simulated generation mix against the available statistics.",
  },
  {
    title: "Spatial Navigation",
    href: "/docs/primitives/tooltip",
    description:
      "GIS-navigation across the whole spatial network structure.",
  },
];

export function NavigationMenuDemo() {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="fixed top-0 left-0 z-50 w-full bg-transparent max-w-[100vw]">
      <NavigationMenuList className="max-w-[100vw] w-full p-4 flex justify-center gap-2 flex-wrap">
        <NavigationMenuItem>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              </li>
              <div className="block p-1">
                <div className="text-lg font-semibold text-[#E31937]">
                  Open Energy Transition
                </div>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA-Earth</div>
                <p className="text-sm text-muted-foreground">
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA</div>
                <p className="text-sm text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate.
                </p>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/network">Network</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <div key={component.title} className="block p-3">
                  <div className="text-sm font-medium">{component.title}</div>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/landingglobe">Globe</NavigationMenuLink>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              </li>
              <div className="block p-1">
                <div className="text-lg font-semibold text-[#E31937]">
                  Open Energy Transition
                </div>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA-Earth</div>
                <p className="text-sm text-muted-foreground">
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
              </div>
              <div className="block p-3">
                <div className="text-md font-medium">PyPSA</div>
                <p className="text-sm text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate.
                </p>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <NavigationMenuLink href="/sidebyside">Polygon</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <div key={component.title} className="block p-3">
                  <div className="text-sm font-medium">{component.title}</div>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
