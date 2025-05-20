"use client";
import React from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "./ui/button";

const WarningToast = () => {
  const toastRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!toastRef.current || !isVisible) return;

    gsap.to(toastRef.current, {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: "power2.out",
    });
  }, [isVisible]);

  const handleClose = () => {
    if (!toastRef.current) return;

    gsap.to(toastRef.current, {
      duration: 0.3,
      opacity: 0,
      y: -20,
      ease: "power2.in",
      onComplete: () => setIsVisible(false),
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toastRef}
      className="fixed top-24 right-4 z-[1000] p-4 bg-card/95 backdrop-blur-md rounded-lg shadow-xl border border-amber-200/20 opacity-0 translate-y-[-20px] max-w-xs"
    >
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 mt-0.5 flex-shrink-0"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
        <div className="flex-1">
          <h4 className="font-medium text-amber-500">Demo Application</h4>
          <p className="text-sm text-muted-foreground my-1">
            This is a demo app with limitations. Currently displaying
            hypothetical data only.
          </p>
          <div className="flex items-center justify-between mt-3">
            <Link
              href="/about#limitations"
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 py-1 px-3 rounded-md transition-colors"
            >
              Read limitations
            </Link>
            <Button
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors h-12 my-0 py-0"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningToast;
