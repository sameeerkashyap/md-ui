import React from 'react';
import { ChainInfo } from '../types/chainMetadata';

interface ChainInfoPanelProps {
    chainInfo: ChainInfo | null;
    totalChains: number;
}

/**
 * ChainInfoPanel
 * 
 * Displays metadata about the currently hovered chain in the top-right corner.
 * 
 * TODO: Style this panel to:
 * 1. Float in top-right corner (absolute positioning)
 * 2. Use glassmorphism effect (backdrop-blur, semi-transparent background)
 * 3. Animate in/out when chainInfo changes
 * 4. Match your app's color scheme
 */
export default function ChainInfoPanel({ chainInfo, totalChains }: ChainInfoPanelProps) {
    // If no chain is hovered, return null (don't render anything)
    if (!chainInfo) return null;

    return (
        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-cyan-500/30 text-white w-72 shadow-2xl">
            {/* Header */}
            <div className="border-b border-white/10 pb-2 mb-3">
                <h3 className="text-lg font-bold text-cyan-400">
                    Chain {chainInfo.chainId}
                </h3>
                <p className="text-xs text-gray-400">
                    {totalChains} total chains
                </p>
            </div>

            {/* Statistics */}
            <div className="space-y-2 text-sm">
                {/* Atom Count */}
                <div className="flex justify-between">
                    <span className="text-gray-300">Atoms:</span>
                    <span className="font-mono text-cyan-300">{chainInfo.atomCount.toLocaleString()}</span>
                </div>

                {/* Residue Count */}
                <div className="flex justify-between">
                    <span className="text-gray-300">Residues:</span>
                    <span className="font-mono text-cyan-300">{chainInfo.residueCount}</span>
                </div>

                {/* Residue Range */}
                <div className="flex justify-between">
                    <span className="text-gray-300">Range:</span>
                    <span className="font-mono text-cyan-300">
                        {chainInfo.residueRange.start}–{chainInfo.residueRange.end}
                    </span>
                </div>

                {/* Common Residues */}
                {chainInfo.commonResidues.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                        <p className="text-gray-400 text-xs mb-2">Most Common:</p>
                        <div className="flex flex-wrap gap-1">
                            {chainInfo.commonResidues.map((residue, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs font-mono"
                                >
                                    {residue}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Optional: Add animation hint */}
            {/* 
                TODO: Add smooth fade-in animation
                You can use CSS transitions or framer-motion:
                
                import { motion } from 'framer-motion';
                
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    ... content ...
                </motion.div>
            */}
        </div>
    );
}
