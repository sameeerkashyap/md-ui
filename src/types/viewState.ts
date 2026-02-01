/**
 * View State Types
 * 
 * This file defines the state shape for the Visualization UI.
 * It serves as the contract between the UI controls and the 3D Renderer.
 */


export type ColorScheme = 'element' | 'chain' | 'residue-index' | 'hydrophobicity';

export type RepresentationStyle = 'cartoon' | 'ball-and-stick' | 'space-fill' | 'surface';

export interface SelectionState {
    /**
     * Set of selected atom indices (referencing the current frame's atom array)
     */
    selectedAtomIndices: Set<number>;

    /**
     * Set of selected residue IDs (e.g., "A-10", "B-25")
     * Helper for synchronized 2D plots
     */
    selectedResidues: Set<string>;

    /**
     * Current hover target (for tooltips)
     */
    hoveredAtomIndex: number | null;
}

export interface ViewConfiguration {
    /**
     * What style to render the protein backbone in?
     */
    style: RepresentationStyle;

    /**
     * How to color the molecules?
     */
    colorScheme: ColorScheme;

    /**
     * Visibility Toggles
     */
    showWater: boolean;
    showIons: boolean;
    showLigands: boolean;

    /**
     * Opacity for non-selected items (Context focus mode)
     */
    unselectedOpacity: number;
}
