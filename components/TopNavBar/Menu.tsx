import React, { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "next-transition-router";
import { usePathname } from "next/navigation";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { AlignJustify, X } from "lucide-react";
gsap.registerPlugin(useGSAP);

const Menu = () => {
  const menuContainer = React.useRef(null);
  const [mounted, setMounted] = React.useState(false);
  const tl = React.useRef(gsap.timeline({ paused: true }));

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted) return;
    const menuElement = menuContainer.current;
    if (!menuElement) return;

    tl.current.fromTo(
      menuElement,
      {
        height: "0",
        opacity: 0,
        display: "none",
      },
      {
        height: "100vh",
        opacity: 1,
        duration: 0.7,
        ease: "power2",
        display: "flex",
      },
    );

    // Add display: none when animation reverses
    tl.current.eventCallback("onReverseComplete", () => {
      if (menuElement) {
        gsap.set(menuElement, { display: "none" });
      }
    });
  }, [mounted]);

  const pathUrl = usePathname();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (pathUrl !== href) {
      tl.current.reverse();
    } else {
      e.preventDefault();
      tl.current.reverse();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => {
          tl.current.play();
        }}
        className={`${navigationMenuTriggerStyle()} cursor-pointer hover:text-accent lg:hidden`}
      >
        <AlignJustify className="h-4 w-4" />
      </div>
      <div
        className="absolute left-0 top-0 z-10 hidden h-0 w-screen flex-col items-center justify-center gap-4 bg-card font-mono text-3xl opacity-0"
        ref={menuContainer}
      >
        <X
          onClick={() => {
            tl.current.reverse();
          }}
          className="absolute top-8 right-8 scale-125 cursor-pointer h-6 w-6"
        />
        {[
          { href: "/", text: "About" },
          { href: "/now", text: "Now" },
          { href: "/2050", text: "2050" },
        ].map(({ href, text }) => (
          <Link
            key={href}
            href={href}
            onClick={(e) => handleLinkClick(e, href)}
            className={` ${
              pathUrl === href ? "text-hover" : "hover:text-hover"
            }`}
          >
            {text}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Menu;
