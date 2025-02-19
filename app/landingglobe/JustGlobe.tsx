"use client";

import React, { forwardRef, useEffect, useRef, MutableRefObject } from "react";
import R3fGlobe, { GlobeMethods, GlobeProps } from "r3f-globe";

const GlobeOnly = forwardRef<GlobeMethods, GlobeProps>((props, ref) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (globeRef.current) {

      if (typeof ref === 'function') {
        ref(globeRef.current);
      } else if (ref) {
        ref.current = globeRef.current;
      }
    }
  }, [ref]);

  return (
    <R3fGlobe {...props} ref={globeRef as MutableRefObject<GlobeMethods | undefined>} />
  );
});

GlobeOnly.displayName = "GlobeOnly";

export default GlobeOnly;
