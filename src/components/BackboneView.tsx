
import { useMemo } from "react";
import { Atom } from "../types/simulation";

import { Line } from "@react-three/drei";
import { Vector3 } from "three";


export default function BackboneView({ atoms }: { atoms: Atom[] }) {
    // 1. Group atoms by Chain
    const chains = useMemo(() => {
        if (!atoms) return {};
        const groups: { [key: string]: Atom[] } = {};
        atoms.forEach(atom => {
            // Filter for Alpha Carbons (backbone) to reduce noise
            if (atom.name === 'CA') {
                if (!groups[atom.chain]) groups[atom.chain] = [];
                groups[atom.chain].push(atom);
            }
        });
        return groups;
    }, [atoms]);

    // 2. Define Chain Colors (Hemoglobin has 4 chains typically)
    const chainColors: { [key: string]: string } = {
        'A': '#FF6B6B', // Red
        'B': '#4ECDC4', // Teal
        'C': '#FFE66D', // Yellow
        'D': '#1A535C', // Dark Blue
    };

    return (
        <group>
            {Object.entries(chains).map(([chainId, chainAtoms]) => {
                // Create points path for the line
                const points = chainAtoms.map(a => new Vector3(a.x, a.y, a.z));
                const color = chainColors[chainId] || 'white';

                return (
                    <group key={chainId}>
                        {/* The Ribbon Line */}
                        <Line
                            points={points}
                            color={color}
                            lineWidth={3}
                            dashed={false}
                        />
                        {/* Highlight Alpha Carbons */}
                        {chainAtoms.map((atom, i) => (
                            <mesh key={i} position={[atom.x, atom.y, atom.z]}>
                                <sphereGeometry args={[0.3, 8, 8]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
};