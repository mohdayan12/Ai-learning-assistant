import React, { useMemo } from 'react';

const StarBackground = () => {
    const stars = useMemo(() => {
        return Array.from({ length: 1000 }).map((_, i) => ({
            id: i,
            // Random starting positions spread across the page
            left: `${Math.random() * 200}%`,
            top: `${Math.random() * 200}%`,
            // Different varying sizes - Increased to 2px to 4px
            size: `${Math.random() * 10 + 1.5}px`,
            // Different animation durations to make it chaotic
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `-${Math.random() * 40}s`,
            // Random translation distance x and y
            tx: `${(Math.random() - 0.5) * 600}px`,
            ty: `${(Math.random() - 0.5) * 600}px`,
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-transparent">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full opacity-0 bg-slate-400 shadow-[0_0_6px_1px_rgba(148,163,184,0.4)] dark:bg-white dark:shadow-[0_0_6px_1px_rgba(255,255,255,0.4)]"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: star.size,
                        height: star.size,
                        "--tx": star.tx,
                        "--ty": star.ty,
                        animation: `floating-stars ${star.animationDuration} ease-in-out infinite alternate`,
                        animationDelay: star.animationDelay,
                    }}
                />
            ))}
        </div>
    );
};

export default StarBackground;
