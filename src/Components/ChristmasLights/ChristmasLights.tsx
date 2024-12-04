import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChristmasLights.less";

const cn = classNames.bind(styles);

export function ChristmasLights() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const count = Math.floor(width / 40);
    const ids = [...Array(count).keys()];

    return (
        <div className={cn("ChristmasLightsWrapper")}>
            {ids.map((id) => (
                <ChristmasBulb index={id} key={id} />
            ))}
        </div>
    );
}

export const randomNumberBetween = (min: number, max: number): number => {
    if (min > max) {
        throw new Error("Minimum value should be smaller than maximum value.");
    }
    const range = max - min;
    return parseFloat((min + range * Math.random()).toFixed(2));
};

const ChristmasBulb: React.FC<{ index: number }> = ({ index }) => {
    const [duration] = useState(randomNumberBetween(3, 6));

    let bulbClassName;
    if (index % 4 === 0) {
        bulbClassName = cn("Bulb", "RedBulb");
    } else if (index % 4 === 1) {
        bulbClassName = cn("Bulb", "GreenBulb");
    } else if (index % 4 === 2) {
        bulbClassName = cn("Bulb", "BlueBulb");
    } else {
        bulbClassName = cn("Bulb", "YellowBulb");
    }

    return <div className={bulbClassName} style={{ animationDuration: `${duration}s` }} />;
};
