import { useEffect, useRef } from 'react';

export function useSyncedScroll(elementRef: React.RefObject<HTMLElement>, groupId: string) {
  const isScrolling = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = (e: Event) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;

      // Find all other elements in the same scroll group
      document.querySelectorAll(`[data-scroll-group="${groupId}"]`).forEach((el) => {
        if (el !== target && el instanceof HTMLElement) {
          el.scrollTop = scrollTop;
        }
      });

      isScrolling.current = false;
    };

    element.setAttribute('data-scroll-group', groupId);
    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef, groupId]);
} 