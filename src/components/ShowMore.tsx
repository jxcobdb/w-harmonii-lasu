import React, { useEffect, useState } from "react";
import useScreenWidth from "../hooks/useScreenWidth";

interface ShowMoreProps {
    children: React.ReactNode;
    maxHeight?: number;
    maxExpandedHeight?: number;
    className?: string;
    breakpoint?: '2xl' | 'xl' | 'lg' | 'md' | 'sm';
}
export default function ShowMore({
    children,
    maxHeight = 0,
    maxExpandedHeight = 700,
    className = "",
    breakpoint = "lg",
}: ShowMoreProps) {
    const [expanded, setExpanded] = useState(false);
    const width = useScreenWidth();

    const handleResize = () => {
        const breakpoints: { [key: string]: number } = {
            '2xl': 1536,
            'xl': 1280,
            'lg': 1024,
            'md': 768,
            'sm': 640,
        };
        if (width >= breakpoints[breakpoint]) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    };

    useEffect(() => {
        handleResize();
    }, [width]);


    return (
        <>
            <div className="relative">
                <div
                    style={{
                        maxHeight: expanded ? `${maxExpandedHeight}px` : `${maxHeight}px`,
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}
                >
                    {children}
                </div>
                <div className={`${className}`}>
                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="mt-3 font-brand-sans text-brand-green-100 underline decoration-transparent hover:decoration-brand-green-100 transition"
                    >
                        {expanded ? "Mniej" : "Więcej"}
                    </button>
                </div>
            </div>
        </>
    );
}


