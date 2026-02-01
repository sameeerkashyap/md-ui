#!/usr/bin/env python3
"""
PDB to JSON Converter for Molecular Dynamics Visualization
Converts PDB trajectory files to web-friendly JSON format

Usage:
    python pdb_to_json.py input.pdb output.json
    
Requirements:
    pip install biopython numpy
"""

import json
import sys
from pathlib import Path

try:
    from Bio.PDB import PDBParser
    import numpy as np
except ImportError:
    print("Error: Missing dependencies. Install with:")
    print("pip install biopython numpy")
    sys.exit(1)


def parse_pdb_to_json(pdb_file, output_file=None, max_frames=100):
    """
    Convert PDB file to JSON format for web visualization
    
    Args:
        pdb_file: Path to PDB file
        output_file: Path to output JSON file (optional)
        max_frames: Maximum number of frames to extract (for multi-model PDB)
    
    Returns:
        Dictionary with trajectory data
    """
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure('protein', pdb_file)
    
    # Element color mapping (CPK coloring scheme)
    element_colors = {
        'C': {'r': 0.5, 'g': 0.5, 'b': 0.5},   # Carbon: gray
        'N': {'r': 0.0, 'g': 0.0, 'b': 1.0},   # Nitrogen: blue
        'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},   # Oxygen: red
        'S': {'r': 1.0, 'g': 1.0, 'b': 0.0},   # Sulfur: yellow
        'P': {'r': 1.0, 'g': 0.5, 'b': 0.0},   # Phosphorus: orange
        'H': {'r': 1.0, 'g': 1.0, 'b': 1.0},   # Hydrogen: white
    }
    
    trajectory_data = {
        'metadata': {
            'source': str(pdb_file),
            'num_frames': 0,
            'num_atoms': 0,
        },
        'frames': []
    }
    
    frame_count = 0
    
    # Iterate through models (frames)
    for model in structure:
        if frame_count >= max_frames:
            break
            
        atoms = []
        
        for chain in model:
            for residue in chain:
                for atom in residue:
                    coord = atom.get_coord()
                    element = atom.element.strip() if hasattr(atom, 'element') else 'C'
                    
                    # Get color for element
                    color = element_colors.get(element, {'r': 0.5, 'g': 0.5, 'b': 0.5})
                    
                    atom_data = {
                        'x': float(coord[0]),
                        'y': float(coord[1]),
                        'z': float(coord[2]),
                        'element': element,
                        'name': atom.get_name(),
                        'residue': residue.get_resname(),
                        'chain': chain.get_id(),
                        'color': color
                    }
                    atoms.append(atom_data)
        
        trajectory_data['frames'].append(atoms)
        frame_count += 1
    
    # Update metadata
    trajectory_data['metadata']['num_frames'] = len(trajectory_data['frames'])
    if trajectory_data['frames']:
        trajectory_data['metadata']['num_atoms'] = len(trajectory_data['frames'][0])
    
    # Calculate bounding box for camera positioning
    if trajectory_data['frames']:
        all_coords = []
        for atom in trajectory_data['frames'][0]:
            all_coords.append([atom['x'], atom['y'], atom['z']])
        
        all_coords = np.array(all_coords)
        trajectory_data['metadata']['bounds'] = {
            'min': {'x': float(all_coords[:, 0].min()), 
                   'y': float(all_coords[:, 1].min()), 
                   'z': float(all_coords[:, 2].min())},
            'max': {'x': float(all_coords[:, 0].max()), 
                   'y': float(all_coords[:, 1].max()), 
                   'z': float(all_coords[:, 2].max())},
            'center': {'x': float(all_coords[:, 0].mean()), 
                      'y': float(all_coords[:, 1].mean()), 
                      'z': float(all_coords[:, 2].mean())}
        }
    
    # Write to file if specified
    if output_file:
        with open(output_file, 'w') as f:
            json.dump(trajectory_data, f, indent=2)
        print(f"✅ Converted {pdb_file} to {output_file}")
        print(f"   Frames: {trajectory_data['metadata']['num_frames']}")
        print(f"   Atoms per frame: {trajectory_data['metadata']['num_atoms']}")
    
    return trajectory_data


def create_simple_water_box():
    """
    Generate a simple water box for testing (without requiring OpenMM)
    Creates a 3x3x3 grid of water molecules
    """
    trajectory_data = {
        'metadata': {
            'source': 'generated_water_box',
            'num_frames': 10,
            'num_atoms': 0,
        },
        'frames': []
    }
    
    # Water molecule geometry (Å)
    water_template = [
        {'element': 'O', 'offset': [0.0, 0.0, 0.0]},
        {'element': 'H', 'offset': [0.96, 0.0, 0.0]},
        {'element': 'H', 'offset': [-0.24, 0.93, 0.0]},
    ]
    
    # Generate 10 frames with slight motion
    for frame in range(10):
        atoms = []
        
        # Create 3x3x3 grid of water molecules
        for i in range(3):
            for j in range(3):
                for k in range(3):
                    base_x = i * 3.0
                    base_y = j * 3.0
                    base_z = k * 3.0
                    
                    # Add thermal motion
                    motion_x = np.sin(frame * 0.3 + i) * 0.1
                    motion_y = np.sin(frame * 0.3 + j) * 0.1
                    motion_z = np.sin(frame * 0.3 + k) * 0.1
                    
                    # Add each atom in water molecule
                    for atom_template in water_template:
                        element = atom_template['element']
                        color = {
                            'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},
                            'H': {'r': 1.0, 'g': 1.0, 'b': 1.0}
                        }[element]
                        
                        atoms.append({
                            'x': base_x + atom_template['offset'][0] + motion_x,
                            'y': base_y + atom_template['offset'][1] + motion_y,
                            'z': base_z + atom_template['offset'][2] + motion_z,
                            'element': element,
                            'name': element,
                            'residue': 'WAT',
                            'chain': 'A',
                            'color': color
                        })
        
        trajectory_data['frames'].append(atoms)
    
    trajectory_data['metadata']['num_atoms'] = len(trajectory_data['frames'][0])
    
    return trajectory_data


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python pdb_to_json.py input.pdb [output.json]")
        print("\nOr generate test water box:")
        print("  python pdb_to_json.py --generate-water output.json")
        sys.exit(1)
    
    if sys.argv[1] == '--generate-water':
        output_file = sys.argv[2] if len(sys.argv) > 2 else 'water_box.json'
        print("Generating test water box...")
        data = create_simple_water_box()
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Generated {output_file}")
        print(f"   Frames: {data['metadata']['num_frames']}")
        print(f"   Atoms per frame: {data['metadata']['num_atoms']}")
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else Path(input_file).stem + '.json'
        
        if not Path(input_file).exists():
            print(f"Error: File not found: {input_file}")
            sys.exit(1)
        
        parse_pdb_to_json(input_file, output_file)
