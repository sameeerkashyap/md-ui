import { TrajectoryData, Atom, RGBColor } from "../types/simulation";

/**
 * Standard CPK coloring for common elements
 */
const CPK_COLORS: { [key: string]: RGBColor } = {
    'C': { r: 0.5, g: 0.5, b: 0.5 },   // Gray
    'N': { r: 0.0, g: 0.0, b: 1.0 },   // Blue
    'O': { r: 1.0, g: 0.0, b: 0.0 },   // Red
    'S': { r: 1.0, g: 1.0, b: 0.0 },   // Yellow
    'P': { r: 1.0, g: 0.5, b: 0.0 },   // Orange
    'H': { r: 1.0, g: 1.0, b: 1.0 },   // White
};

/**
 * Simple PDB Parser for Web
 * Parses standard ATOM/HETATM records from PDB format
 */
export function parsePDB(content: string, fileName: string): TrajectoryData {
    const lines = content.split('\n');
    const atoms: Atom[] = [];
    
    // Limits
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    // Track stats
    let sumX = 0, sumY = 0, sumZ = 0;

    for (const line of lines) {
        // Standard PDB format is fixed-width
        // ATOM/HETATM is chars 0-6
        if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
            const element = line.substring(76, 78).trim() || line.substring(12, 14).trim().replace(/\d/, ''); // Fallback to atom name if element empty
            const x = parseFloat(line.substring(30, 38));
            const y = parseFloat(line.substring(38, 46));
            const z = parseFloat(line.substring(46, 54));
            
            const atomName = line.substring(12, 16).trim();
            const residue = line.substring(17, 20).trim();
            const chain = line.substring(21, 22).trim();
            
            // CPK Color lookup
            const color = CPK_COLORS[element.toUpperCase()] || CPK_COLORS['C']; // Default to C/Gray

            const atom: Atom = {
                x, y, z,
                element,
                name: atomName,
                residue,
                chain,
                color
            };
            
            atoms.push(atom);
            
            // Stats
            minX = Math.min(minX, x); minY = Math.min(minY, y); minZ = Math.min(minZ, z);
            maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); maxZ = Math.max(maxZ, z);
            sumX += x; sumY += y; sumZ += z;
        }
    }

    const numAtoms = atoms.length;
    const center = numAtoms > 0 ? {
        x: sumX / numAtoms,
        y: sumY / numAtoms,
        z: sumZ / numAtoms
    } : { x: 0, y: 0, z: 0 };

    return {
        metadata: {
            source: fileName,
            num_frames: 1, // Basic PDB usually has 1 model or we treat as static
            num_atoms: numAtoms,
            bounds: {
                min: { x: minX, y: minY, z: minZ },
                max: { x: maxX, y: maxY, z: maxZ },
                center
            }
        },
        frames: [atoms]
    };
}
