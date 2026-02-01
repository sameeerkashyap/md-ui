import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Center } from "@react-three/drei";
import BackboneView from "./BackboneView";
import { Atom, TrajectoryData } from "../types/simulation";
import { ViewConfiguration } from "../types/viewState";
import { useMemo, useState } from "react";

import ChainInfoPanel from './ChainInfoPanel';
import { calculateChainInfo, ChainInfo } from "../types/chainMetadata";

export default function MolecularView({ trajectory, currentFrame }: { trajectory: TrajectoryData, currentFrame: number }) {
    // --------------------------------------------------------
    // STATE MANAGEMENT PLACEHOLDERS
    // --------------------------------------------------------

    // TODO: Initialize View Configuration State
    const [viewConfig, setViewConfig] = useState<ViewConfiguration>({
        style: 'cartoon',
        colorScheme: 'chain',
        showWater: false,
        showIons: true,
        showLigands: true,
        unselectedOpacity: 0.5
    });

    // TODO: Initialize Selection State
    const [selectedChain, setSelectedChain] = useState<string | null>(null);

    // Hover event handlers
    const handleChainSelect = (chainId: string) => {
        setSelectedChain(chainId);
    };
    const handleChainDeselect = () => {
        setSelectedChain(null);
    };

    const atoms = trajectory?.frames?.[currentFrame];
    const title = trajectory?.metadata?.title;

    const chainMetadataMap = useMemo(() => {
        if (!atoms) return {};

        // Group atoms by chain ID
        const chainGroups: { [chainId: string]: Atom[] } = {};
        atoms.forEach(atom => {
            if (!chainGroups[atom.chain]) chainGroups[atom.chain] = [];
            chainGroups[atom.chain].push(atom);
        });

        // Calculate metadata for each chain
        const metadataMap: { [chainId: string]: ChainInfo } = {};
        Object.entries(chainGroups).forEach(([chainId, chainAtoms]) => {
            metadataMap[chainId] = calculateChainInfo(chainAtoms, chainId);
        });

        return metadataMap;
    }, [atoms]);

    // --------------------------------------------------------
    // DATA PREP
    // --------------------------------------------------------

    const onSelectInfo = selectedChain ? chainMetadataMap[selectedChain] : null;
    const totalChains = Object.keys(chainMetadataMap).length;

    if (!atoms) return <div className="absolute inset-0 flex items-center justify-center text-white/50">No Data</div>;

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <h1 className="text-xl font-bold text-black">{title}</h1>
            </div>
            <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
                <color attach="background" args={['#FFFF']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Center>
                    <BackboneView atoms={atoms}
                        selectedChain={selectedChain}
                        onSelect={handleChainSelect}
                        onDeselect={handleChainDeselect}
                    />
                    {/* 
                      TODO: CONDITIONAL RENDERING BASED ON VIEW CONFIG
                      
                      1. Pass 'viewConfig' and 'selection' to BackboneView
                         - If viewConfig.style === 'cartoon', render BackboneView
                         
                      2. Render Ligands
                         - Filter atoms where residue is NOT standard amino acid
                         - <LigandView atoms={ligandAtoms} />
                         
                      3. Render Water
                         - if (viewConfig.showWater) <WaterView atoms={waterAtoms} />
                    */}
                    {/* Optional: Keep partial ghost cloud if requested, but for now we replace it for clarity */}
                    {/* <AtomInstances atoms={atoms} /> */}
                </Center>
                <OrbitControls makeDefault />

                {/* TODO: Add <SelectionControls /> or similar to handle click events if not on atoms directly */}
            </Canvas>

            <ChainInfoPanel
                chainInfo={onSelectInfo}
                totalChains={totalChains}
            />
        </div>
    )
}
