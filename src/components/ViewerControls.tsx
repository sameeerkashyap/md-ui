import React from 'react';
import { ViewConfiguration, ColorScheme, RepresentationStyle } from '../types/viewState';

/**
 * Props for the ViewerControls component
 */
interface ViewerControlsProps {
    config: ViewConfiguration;
    onConfigChange: (newConfig: Partial<ViewConfiguration>) => void;
    totalAtoms: number;
    selectedCount: number;
}

/**
 * ViewerControls
 * 
 * Floating panel or Sidebar that controls the Visualization State.
 * 
 * REQUIRED IMPLEMENTATION:
 * 1. Render Toggles for showWater/showLigands
 * 2. Render Dropdown for ColorScheme
 * 3. Render Dropdown for RepresentationStyle
 * 4. Display selection stats (e.g. "10 atoms selected")
 */
export default function ViewerControls({
    config,
    onConfigChange,
    totalAtoms,
    selectedCount
}: ViewerControlsProps) {

    // TODO: Implement the UI Controls here
    // Use standard HTML <select>, <input type="checkbox">, or UI library components

    return (
        <div className="absolute top-4 right-4 bg-gray-900/80 p-4 rounded-lg backdrop-blur-md border border-white/10 text-white w-64">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-cyan-400">View Options</h3>

            {/* Placeholder for Structure Style Selector */}
            {/* Placeholder for Color Scheme Selector */}
            {/* Placeholder for Toggles (Water, Ligands) */}

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                Selection: {selectedCount} / {totalAtoms} atoms
            </div>
        </div>
    );
}
