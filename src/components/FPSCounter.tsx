/**
 * FPS Counter Component
 * 
 * Displays real-time FPS, atom count, and renderer type
 * Updates every 500ms to avoid UI jank
 */

import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface FPSCounterProps {
    atomCount: number;
    rendererType: 'CPU' | 'WebGPU';
}

export default function FPSCounter({ atomCount, rendererType }: FPSCounterProps) {
    const [fps, setFps] = useState(60);
    const [avgFps, setAvgFps] = useState(60);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const fpsHistory = useRef<number[]>([]);

    // Calculate FPS using useFrame (runs every render frame)
    useFrame(() => {
        frameCount.current++;
        const currentTime = performance.now();
        const delta = currentTime - lastTime.current;

        // Update FPS every 500ms
        if (delta >= 500) {
            const currentFps = Math.round((frameCount.current / delta) * 1000);
            setFps(currentFps);

            // Track FPS history for average (last 10 readings)
            fpsHistory.current.push(currentFps);
            if (fpsHistory.current.length > 10) {
                fpsHistory.current.shift();
            }

            // Calculate average FPS
            const avg = Math.round(
                fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
            );
            setAvgFps(avg);

            // Reset counters
            frameCount.current = 0;
            lastTime.current = currentTime;
        }
    });

    // Determine color based on FPS
    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#4ade80'; // Green (good)
        if (fps >= 30) return '#fbbf24'; // Yellow (okay)
        return '#ef4444'; // Red (bad)
    };

    return null; // This component doesn't render in the 3D scene
}

/**
 * FPS Display Overlay
 * 
 * This is the DOM overlay that shows the FPS stats
 * Place this OUTSIDE the Canvas (sibling to Canvas)
 */
export function FPSDisplay({
    atomCount,
    rendererType
}: FPSCounterProps) {
    const [fps, setFps] = useState(60);
    const [avgFps, setAvgFps] = useState(60);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const fpsHistory = useRef<number[]>([]);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const updateFPS = () => {
            frameCount.current++;
            const currentTime = performance.now();
            const delta = currentTime - lastTime.current;

            // Update FPS every 500ms
            if (delta >= 500) {
                const currentFps = Math.round((frameCount.current / delta) * 1000);
                setFps(currentFps);

                // Track FPS history for average
                fpsHistory.current.push(currentFps);
                if (fpsHistory.current.length > 10) {
                    fpsHistory.current.shift();
                }

                // Calculate average FPS
                const avg = Math.round(
                    fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
                );
                setAvgFps(avg);

                // Reset counters
                frameCount.current = 0;
                lastTime.current = currentTime;
            }

            rafId.current = requestAnimationFrame(updateFPS);
        };

        rafId.current = requestAnimationFrame(updateFPS);

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    // Determine color based on FPS
    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#4ade80'; // Green (good)
        if (fps >= 30) return '#fbbf24'; // Yellow (okay)
        return '#ef4444'; // Red (bad)
    };

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white font-mono text-sm min-w-[200px] z-50">
            {/* FPS */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400">FPS:</span>
                <span
                    className="text-lg font-bold"
                    style={{ color: getFpsColor(fps) }}
                >
                    {fps}
                </span>
            </div>

            {/* Average FPS */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
                <span className="text-gray-400 text-xs">Avg:</span>
                <span
                    className="text-xs"
                    style={{ color: getFpsColor(avgFps) }}
                >
                    {avgFps} FPS
                </span>
            </div>

            {/* Atom Count */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-xs">Atoms:</span>
                <span className="text-cyan-300 text-xs">
                    {atomCount.toLocaleString()}
                </span>
            </div>

            {/* Renderer Type */}
            <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Renderer:</span>
                <span className={`text-xs ${rendererType.includes('GPU') ? 'text-purple-400' : 'text-blue-400'}`}>
                    {rendererType}
                </span>
            </div>
        </div>
    );
}
