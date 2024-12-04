import React, { useEffect, useRef } from "react";
import { randomNumberBetween } from "../ChristmasLights/ChristmasLights";

interface ISnowFlake {
    x: number;
    y: number;
    size: number;
    speed: number;
    horizontalSpeed: number;
}

export const SnowfallBackground = ({ topOffset = 0 }: { topOffset?: number }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const snowflakesRef = useRef<ISnowFlake[]>([]);
    const animationRef = useRef<number>();

    const createSnowflakes = (width: number, height: number) => {
        const snowflakes = Array.from({ length: 100 }, () => ({
            x: randomNumberBetween(0, width),
            y: randomNumberBetween(-height, height),
            size: randomNumberBetween(2, 7),
            speed: randomNumberBetween(1, 3),
            horizontalSpeed: randomNumberBetween(-1, 1),
        }));
        snowflakesRef.current = snowflakes;
    };

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        createSnowflakes(width, height);
    };

    const updateSnowfall = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        snowflakesRef.current.forEach((flake) => {
            flake.y += flake.speed;
            flake.x += flake.horizontalSpeed;

            if (flake.y > height) flake.y = -flake.size;
            if (flake.x > width) flake.x = -flake.size;
            if (flake.x < -flake.size) flake.x = width;

            const gradient = ctx.createRadialGradient(
                flake.x,
                flake.y,
                0,
                flake.x,
                flake.y,
                flake.size * 2
            );
            gradient.addColorStop(0, "rgba(222, 228, 253, 0.8)");
            gradient.addColorStop(1, "rgba(222, 228, 253, 0)");

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size / 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgb(222, 228, 253)";
            ctx.fill();
        });

        animationRef.current = requestAnimationFrame(updateSnowfall);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => resizeCanvas();

        resizeCanvas();
        updateSnowfall();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current!);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: `${topOffset}px`,
                left: 0,
                zIndex: -1,
            }}
        />
    );
};
