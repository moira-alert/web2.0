import { FC, useState } from "react";
import styles from "./Slider.module.less";
import { Tooltip } from "@skbkontur/react-ui";
import { IconInfoSquareLight16 } from "@skbkontur/icons/IconInfoSquareLight16";

interface SliderProps {
    min: number;
    max: number;
    initialValue: number;
    onChange: (value: number) => void;
    label?: string;
    tooltipText?: string;
}

export const Slider: FC<SliderProps> = ({
    min,
    max,
    initialValue,
    onChange,
    label,
    tooltipText,
}) => {
    const inputId = "slider";

    const [draftValue, setDraftValue] = useState<number>(initialValue);

    const handleCommit = () => {
        onChange(draftValue);
    };

    const fillPercent = ((draftValue - min) / (max - min)) * 100;

    return (
        <div className={styles["slider-container"]}>
            {label && (
                <label htmlFor={inputId}>
                    <strong>{label}</strong>: {draftValue}{" "}
                    {tooltipText && (
                        <Tooltip render={() => tooltipText} pos="top left">
                            <IconInfoSquareLight16 />
                        </Tooltip>
                    )}
                </label>
            )}

            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={1}
                value={draftValue}
                onChange={(e) => setDraftValue(Number(e.target.value))}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                style={{ "--fill-percent": `${fillPercent}%` } as React.CSSProperties}
            />
            <div className={styles["slider-labels"]}>
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};
