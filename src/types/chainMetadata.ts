/**
 * Chain Metadata Types
 * 
 * This defines the metadata we can display about a chain when hovering
 */

export interface ChainInfo {
    chainId: string;
    atomCount: number;
    residueCount: number;
    residueRange: {
        start: number;
        end: number;
    };
    // Common residue types in this chain (e.g., ["ALA", "GLY", "VAL"])
    commonResidues: string[];
}

/**
 * Utility function to calculate chain metadata from atoms
 * 
 * TODO: Implement this function
 * 
 * @param atoms - Array of atoms belonging to a single chain
 * @param chainId - The chain identifier
 * @returns ChainInfo object with calculated metadata
 */
export function calculateChainInfo(atoms: any[], chainId: string): ChainInfo {
    // TODO: Count total atoms in this chain
    const atomCount = atoms.length;

    // TODO: Count unique residues
    // Hint: Use Set to track unique residue_index values
    const uniqueResidues = new Set<number>();
    atoms.forEach(atom => {
        if (atom.residue_index !== undefined) {
            uniqueResidues.add(atom.residue_index);
        }
    });
    const residueCount = uniqueResidues.size;

    // TODO: Find min/max residue_index for range
    let minResidue = Infinity;
    let maxResidue = -Infinity;
    atoms.forEach(atom => {
        if (atom.residue_index !== undefined) {
            minResidue = Math.min(minResidue, atom.residue_index);
            maxResidue = Math.max(maxResidue, atom.residue_index);
        }
    });

    // TODO: Find most common residue types
    // Hint: Create a frequency map of residue names
    const residueFrequency: { [key: string]: number } = {};
    atoms.forEach(atom => {
        const resName = atom.residue;
        residueFrequency[resName] = (residueFrequency[resName] || 0) + 1;
    });

    // Sort by frequency and take top 5
    const commonResidues = Object.entries(residueFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name]) => name);

    return {
        chainId,
        atomCount,
        residueCount,
        residueRange: {
            start: minResidue === Infinity ? 0 : minResidue,
            end: maxResidue === -Infinity ? 0 : maxResidue
        },
        commonResidues
    };
}
