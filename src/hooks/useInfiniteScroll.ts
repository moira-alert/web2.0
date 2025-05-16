import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = <T>(items: T[], batchSize: number) => {
    const [visibleCount, setVisibleCount] = useState(batchSize);
    const observerTargetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (visibleCount >= items.length || !observerTargetRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
                }
            },
            {
                rootMargin: "200px",
            }
        );

        observer.observe(observerTargetRef.current);

        return () => {
            if (observerTargetRef.current) {
                observer.unobserve(observerTargetRef.current);
            }
        };
    }, [visibleCount, items.length, batchSize]);

    return {
        visibleItems: items.slice(0, visibleCount),
        observerTargetRef,
        visibleCount,
    };
};
