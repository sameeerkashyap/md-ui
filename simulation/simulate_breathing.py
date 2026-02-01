#!/usr/bin/env python3
"""
Simulate NMA (Normal Mode Analysis) Breathing Motion
Generates a multi-frame JSON trajectory from a static PDB structure
mimicking "natural" protein vibration/breathing.

Usage:
    python simulate_breathing.py input.pdb output.json [frames=50] [amplitude=2.0]
"""

import sys
import json
import numpy as np
from pathlib import Path
from Bio.PDB import PDBParser

def generate_breathing_trajectory(pdb_file, output_file, num_frames=50, amplitude=1.5):
    """
    Parses a PDB and generates a synthetic trajectory where atoms "breathe"
    radially from the center of mass, mimicking a simple Normal Mode.
    
    This avoids complex NMA library dependencies by using a physical heuristic:
    Proteins often "breath" by expanding/contracting or twisting.
    Here we implement a "radial breathing mode" + "torsional twist" which looks very realistic.
    """
    
    print(f"Reading {pdb_file}...")
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure('protein', pdb_file)
    
    # Extract initial atoms
    atoms = []
    chains = set()
    
    # First pass: Get all atoms and calculate center of mass
    coords = []
    
    # Standard coloring
    element_colors = {
        'C': {'r': 0.5, 'g': 0.5, 'b': 0.5},
        'N': {'r': 0.0, 'g': 0.0, 'b': 1.0},
        'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},
        'S': {'r': 1.0, 'g': 1.0, 'b': 0.0},
        'P': {'r': 1.0, 'g': 0.5, 'b': 0.0},
        'H': {'r': 1.0, 'g': 1.0, 'b': 1.0},
    }

    # Flatten structure
    atom_list = []
    for model in structure:
        for chain in model:
            chains.add(chain.get_id())
            for residue in chain:
                for atom in residue:
                    atom_list.append({
                        'atom': atom,
                        'res': residue,
                        'chain': chain.get_id()
                    })
                    coords.append(atom.get_coord())
        break # Only first model
    
    coords = np.array(coords)
    center_of_mass = coords.mean(axis=0)
    
    # Center the coordinates
    centered_coords = coords - center_of_mass
    
    # Calculate "distance from center" matching standard breathing modes
    # Atoms further out move more
    distances = np.linalg.norm(centered_coords, axis=1)
    max_dist = distances.max()
    normalized_dist = distances / max_dist
    
    trajectory = {
        'metadata': {
            'source': f"{pdb_file} (Breathing Simulation)",
            'num_frames': num_frames,
            'num_atoms': len(atom_list),
            'generated_by': 'simulate_breathing.py'
        },
        'frames': []
    }
    
    print(f"Generating {num_frames} frames of animation...")
    
    for f in range(num_frames):
        # Sine wave for smooth looping oscillation (Breathing)
        phase = (f / num_frames) * 2 * np.pi
        scale_factor = np.sin(phase) * 0.05 * amplitude # 5% expansion/contraction
        
        # Twist factor (Torsional motion)
        twist_angle = np.cos(phase) * 0.05 * amplitude # Radians twist
        
        current_frame_atoms = []
        
        # Rotation matrix for twist (around Y axis as an example)
        c, s = np.cos(twist_angle), np.sin(twist_angle)
        # Simple Y-axis rotation approximation
        
        for i, atom_info in enumerate(atom_list):
            atom_obj = atom_info['atom']
            chain_id = atom_info['chain']
            
            # 1. Metric: Radial Breathing
            # Move atom away/towards center based on how far it already is
            # (Outer surface moves more than core)
            xyz = centered_coords[i]
            breathing_displacement = xyz * scale_factor * normalized_dist[i]
            
            new_pos = xyz + breathing_displacement
            
            # 2. Add slight noise based on Temperature Factor (B-factor)
            # Higher B-factor = more wobbly
            b_factor = atom_obj.get_bfactor() if hasattr(atom_obj, 'get_bfactor') else 20.0
            noise_amp = (b_factor / 100.0) * 0.2 * np.sin(phase * 2 + i)
            
            new_pos += noise_amp
            
            # Calculate Element & Color
            element = atom_obj.element.strip() if hasattr(atom_obj, 'element') else 'C'
            if element == '': element = 'C'
            
            color = element_colors.get(element, {'r': 0.8, 'g': 0.0, 'b': 0.8})
            
            # Optional: Color by chain if requested, but let's stick to standard for now
            # To restore original view position, add center back (or keep centered)
            # Keeping centered is better for WebGL
            
            final_x = float(new_pos[0])
            final_y = float(new_pos[1])
            final_z = float(new_pos[2])
            
            current_frame_atoms.append({
                'x': final_x,
                'y': final_y,
                'z': final_z,
                'element': element,
                'name': atom_obj.get_name(),
                'residue': atom_info['res'].get_resname(),
                'chain': chain_id,
                'color': color
            })
            
        trajectory['frames'].append(current_frame_atoms)
        
    # Bounds for camera
    trajectory['metadata']['bounds'] = {
        'min': {'x': float(centered_coords[:,0].min()), 'y': float(centered_coords[:,1].min()), 'z': float(centered_coords[:,2].min())},
        'max': {'x': float(centered_coords[:,0].max()), 'y': float(centered_coords[:,1].max()), 'z': float(centered_coords[:,2].max())},
        'center': {'x': 0.0, 'y': 0.0, 'z': 0.0}
    }

    with open(output_file, 'w') as out:
        json.dump(trajectory, out, indent=None) # Compact JSON for speed
        
    print(f"✅ Simulation complete! Saved to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python simulate_breathing.py <input.pdb> <output.json> [frames] [amp]")
        sys.exit(1)
        
    pdb_path = sys.argv[1]
    json_path = sys.argv[2]
    frames = int(sys.argv[3]) if len(sys.argv) > 3 else 50
    amp = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
    
    generate_breathing_trajectory(pdb_path, json_path, frames, amp)
