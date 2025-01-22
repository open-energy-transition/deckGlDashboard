"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        console.log({ from, to });

        const tl = gsap
          .timeline({
            onComplete: next,
          })
          .fromTo(
            firstLayer.current,
            { y: "100%" },
            {
              y: 0,
              duration: 0.5,
              ease: "circ.inOut",
            }
          )
          .fromTo(
            secondLayer.current,
            {
              y: "100%",
            },
            {
              y: 0,
              duration: 0.5,
              ease: "circ.inOut",
            },
            "<50%"
          );

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        const tl = gsap
          .timeline()
          .fromTo(
            secondLayer.current,
            { y: 0 },
            {
              y: "-100%",
              duration: 0.5,
              ease: "circ.inOut",
            }
          )
          .fromTo(
            firstLayer.current,
            { y: 0 },
            {
              y: "-100%",
              duration: 0.5,
              ease: "circ.inOut",
            },
            "<50%"
          )
          .call(next, undefined, "<50%");

        return () => {
          tl.kill();
        };
      }}
    >
      <main>{children}</main>

      <div
        ref={firstLayer}
        className="absolute inset-0 z-[1000] translate-y-full bg-background"
      />
      <div
        ref={secondLayer}
        className="absolute inset-0 z-[1000] translate-y-full bg-background"
      />
    </TransitionRouter>
  );
}
