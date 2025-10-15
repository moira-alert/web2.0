import { useState, useEffect } from "react";

export function useElementSize(element: HTMLElement | null) {
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: element?.offsetWidth ?? 0,
        height: element?.offsetHeight ?? 0,
    });

    useEffect(() => {
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [element]);

    return size;
}
