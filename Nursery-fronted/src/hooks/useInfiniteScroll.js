import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for infinite scrolling using IntersectionObserver
 * @param {Function} onIntersect - Callback to execute when target enters viewport
 * @param {Object} options - IntersectionObserver options
 * @param {boolean} options.enabled - Whether the observer is active
 * @param {number} options.rootMargin - Root margin in pixels / percentage
 * @returns {React.RefObject} - Ref to attach to sentinel element
 */
export function useInfiniteScroll(onIntersect, { enabled = true, rootMargin = "250px" } = {}) {
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && enabled) {
        onIntersect();
      }
    },
    [onIntersect, enabled]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleObserver, enabled, rootMargin]);

  return sentinelRef;
}

export default useInfiniteScroll;

