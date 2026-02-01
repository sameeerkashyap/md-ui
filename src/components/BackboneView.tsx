
import { useMemo } from "react";
import { Atom } from "../types/simulation";

import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { generateChainColor } from "../utils/generate.color";


// Update the props interface
interface BackboneViewProps {
    atoms: Atom[];
    selectedChain: string | null;
    onSelect: (chainId: string) => void;
    onDeselect: () => void;
}

export default function BackboneView({ atoms, selectedChain, onSelect, onDeselect }: BackboneViewProps) {
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

    // With:


    return (
        <group>
            {Object.entries(chains).map(([chainId, chainAtoms]) => {
                // Create points path for the line
                const points = chainAtoms.map(a => new Vector3(a.x, a.y, a.z));
                // const color = chainColors[chainId] || 'white';
                const color = generateChainColor(chainId);

                const isSelected = selectedChain === chainId;
                const isDimmed = selectedChain !== null && selectedChain !== chainId;

                return (
                    <group key={chainId}
                        onClick={() => onSelect(chainId)}
                    >
                        {/* The Ribbon Line */}
                        <Line
                            points={points}
                            color={color}
                            lineWidth={isSelected ? 5 : 1}
                            opacity={isDimmed ? 0.05 : 1}
                            dashed={false}
                        />
                        {/* Highlight Alpha Carbons */}
                        {chainAtoms.map((atom, i) => (
                            <mesh key={i} position={[atom.x, atom.y, atom.z]}>
                                <sphereGeometry args={[0.3, 8, 8]} />
                                <meshStandardMaterial color={color}
                                    opacity={isDimmed ? 0.1 : 1.0}
                                    transparent={true}
                                    emissive={isSelected ? color : '#7b7979ff'}  // Glow effect when hovered
                                    emissiveIntensity={isSelected ? 0.1 : 0}
                                />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
};