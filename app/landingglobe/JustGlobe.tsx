"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import R3fGlobe, { GlobeMethods, GlobeProps } from "r3f-globe";

const GlobeOnly = forwardRef<GlobeMethods, GlobeProps>((props, ref) => {
  const globeRef = useRef<GlobeMethods>(null);

  useEffect(() => {
    if (globeRef.current) {
      // Asegurarse de que el Globe está inicializado antes de pasar la referencia
      if (typeof ref === 'function') {
        ref(globeRef.current);
      } else if (ref) {
        ref.current = globeRef.current;
      }
    }
  }, [ref]);

  return (
    <R3fGlobe {...props} ref={globeRef} />
  );
});

GlobeOnly.displayName = "GlobeOnly";

export default GlobeOnly;
