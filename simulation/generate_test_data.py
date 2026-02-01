#!/usr/bin/env python3
"""
Quick Test Data Generator
Creates simple molecular systems for immediate testing without OpenMM

This script generates synthetic trajectory data that looks realistic
but doesn't require running actual MD simulations.

Usage:
    python generate_test_data.py --type water
    python generate_test_data.py --type protein
"""

import json
import argparse
import numpy as np
from pathlib import Path


def generate_water_box(num_molecules=27, num_frames=50):
    """
    Generate a simple water box with thermal motion
    
    Args:
        num_molecules: Number of water molecules
        num_frames: Number of trajectory frames
    
    Returns:
        dict: Trajectory data
    """
    print(f"Generating water box with {num_molecules} molecules, {num_frames} frames...")
    
    # Water molecule geometry (Å -> nm)
    water_geometry = [
        {'element': 'O', 'name': 'O', 'offset': np.array([0.0, 0.0, 0.0])},
        {'element': 'H', 'name': 'H1', 'offset': np.array([0.096, 0.0, 0.0])},
        {'element': 'H', 'name': 'H2', 'offset': np.array([-0.024, 0.093, 0.0])},
    ]
    
    # Element colors (CPK scheme)
    colors = {
        'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},  # Red
        'H': {'r': 1.0, 'g': 1.0, 'b': 1.0},  # White
    }
    
    # Calculate grid dimensions for molecules
    grid_size = int(np.ceil(num_molecules ** (1/3)))
    spacing = 0.3  # nm between molecules
    
    frames = []
    
    for frame_idx in range(num_frames):
        atoms = []
        mol_idx = 0
        
        for i in range(grid_size):
            for j in range(grid_size):
                for k in range(grid_size):
                    if mol_idx >= num_molecules:
                        break
                    
                    # Base position
                    base_pos = np.array([
                        i * spacing,
                        j * spacing,
                        k * spacing
                    ])
                    
                    # Add thermal motion (small random displacement)
                    thermal_motion = np.random.randn(3) * 0.01
                    
                    # Add collective motion (wave-like)
                    wave_motion = np.array([
                        0.02 * np.sin(frame_idx * 0.1 + i * 0.3),
                        0.02 * np.sin(frame_idx * 0.1 + j * 0.3),
                        0.02 * np.sin(frame_idx * 0.1 + k * 0.3)
                    ])
                    
                    # Create water molecule
                    for atom_template in water_geometry:
                        pos = base_pos + atom_template['offset'] + thermal_motion + wave_motion
                        
                        atoms.append({
                            'x': float(pos[0]),
                            'y': float(pos[1]),
                            'z': float(pos[2]),
                            'element': atom_template['element'],
                            'name': atom_template['name'],
                            'residue': 'HOH',
                            'chain': 'A',
                            'color': colors[atom_template['element']]
                        })
                    
                    mol_idx += 1
        
        frames.append(atoms)
    
    return create_trajectory_dict(frames, 'water_box_test')


def generate_protein_backbone(num_residues=20, num_frames=50):
    """
    Generate a simple protein backbone (alpha helix)
    
    Args:
        num_residues: Number of amino acid residues
        num_frames: Number of trajectory frames
    
    Returns:
        dict: Trajectory data
    """
    print(f"Generating protein with {num_residues} residues, {num_frames} frames...")
    
    # Element colors
    colors = {
        'C': {'r': 0.5, 'g': 0.5, 'b': 0.5},  # Gray
        'N': {'r': 0.0, 'g': 0.0, 'b': 1.0},  # Blue
        'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},  # Red
        'H': {'r': 1.0, 'g': 1.0, 'b': 1.0},  # White
    }
    
    # Alpha helix parameters
    rise_per_residue = 0.15  # nm
    rotation_per_residue = 100 * np.pi / 180  # 100 degrees
    radius = 0.23  # nm
    
    frames = []
    
    for frame_idx in range(num_frames):
        atoms = []
        
        # Breathing motion (helix expansion/contraction)
        breathing = 1.0 + 0.1 * np.sin(frame_idx * 0.2)
        
        for res_idx in range(num_residues):
            # Position along helix
            z = res_idx * rise_per_residue
            angle = res_idx * rotation_per_residue
            
            # Add some flexibility
            flexibility = 0.02 * np.sin(frame_idx * 0.15 + res_idx * 0.5)
            
            # Backbone atoms: N, CA, C, O
            backbone_atoms = [
                {
                    'element': 'N',
                    'name': 'N',
                    'offset': np.array([
                        radius * breathing * np.cos(angle) + flexibility,
                        radius * breathing * np.sin(angle) + flexibility,
                        z
                    ])
                },
                {
                    'element': 'C',
                    'name': 'CA',
                    'offset': np.array([
                        radius * breathing * np.cos(angle + 0.3),
                        radius * breathing * np.sin(angle + 0.3),
                        z + 0.05
                    ])
                },
                {
                    'element': 'C',
                    'name': 'C',
                    'offset': np.array([
                        radius * breathing * np.cos(angle + 0.6),
                        radius * breathing * np.sin(angle + 0.6),
                        z + 0.10
                    ])
                },
                {
                    'element': 'O',
                    'name': 'O',
                    'offset': np.array([
                        radius * breathing * np.cos(angle + 0.8) + 0.05,
                        radius * breathing * np.sin(angle + 0.8) + 0.05,
                        z + 0.12
                    ])
                }
            ]
            
            for atom_template in backbone_atoms:
                atoms.append({
                    'x': float(atom_template['offset'][0]),
                    'y': float(atom_template['offset'][1]),
                    'z': float(atom_template['offset'][2]),
                    'element': atom_template['element'],
                    'name': atom_template['name'],
                    'residue': 'ALA',
                    'chain': 'A',
                    'color': colors[atom_template['element']]
                })
        
        frames.append(atoms)
    
    return create_trajectory_dict(frames, 'protein_helix_test')


def generate_nanocluster(num_atoms=100, num_frames=50):
    """
    Generate a metallic nanocluster with vibrations
    
    Args:
        num_atoms: Number of atoms in cluster
        num_frames: Number of trajectory frames
    
    Returns:
        dict: Trajectory data
    """
    print(f"Generating nanocluster with {num_atoms} atoms, {num_frames} frames...")
    
    # Gold color
    color = {'r': 1.0, 'g': 0.84, 'b': 0.0}
    
    frames = []
    
    # Generate initial FCC-like structure
    lattice_constant = 0.4  # nm
    grid_size = int(np.ceil(num_atoms ** (1/3)))
    
    base_positions = []
    atom_idx = 0
    for i in range(grid_size):
        for j in range(grid_size):
            for k in range(grid_size):
                if atom_idx >= num_atoms:
                    break
                base_positions.append(np.array([
                    i * lattice_constant,
                    j * lattice_constant,
                    k * lattice_constant
                ]))
                atom_idx += 1
    
    base_positions = np.array(base_positions)
    
    # Center the cluster
    center = base_positions.mean(axis=0)
    base_positions -= center
    
    for frame_idx in range(num_frames):
        atoms = []
        
        # Collective vibration modes
        for idx, base_pos in enumerate(base_positions):
            # Radial breathing mode
            r = np.linalg.norm(base_pos)
            if r > 0:
                radial_dir = base_pos / r
                breathing = 0.05 * np.sin(frame_idx * 0.3) * radial_dir
            else:
                breathing = np.zeros(3)
            
            # Thermal vibrations
            thermal = np.random.randn(3) * 0.01
            
            pos = base_pos + breathing + thermal
            
            atoms.append({
                'x': float(pos[0]),
                'y': float(pos[1]),
                'z': float(pos[2]),
                'element': 'Au',
                'name': 'AU',
                'residue': 'AU',
                'chain': 'A',
                'color': color
            })
        
        frames.append(atoms)
    
    return create_trajectory_dict(frames, 'nanocluster_test')


def create_trajectory_dict(frames, source):
    """Helper to create trajectory dictionary"""
    all_coords = []
    for atom in frames[0]:
        all_coords.append([atom['x'], atom['y'], atom['z']])
    all_coords = np.array(all_coords)
    
    return {
        'metadata': {
            'source': source,
            'num_frames': len(frames),
            'num_atoms': len(frames[0]),
            'bounds': {
                'min': {
                    'x': float(all_coords[:, 0].min()),
                    'y': float(all_coords[:, 1].min()),
                    'z': float(all_coords[:, 2].min())
                },
                'max': {
                    'x': float(all_coords[:, 0].max()),
                    'y': float(all_coords[:, 1].max()),
                    'z': float(all_coords[:, 2].max())
                },
                'center': {
                    'x': float(all_coords[:, 0].mean()),
                    'y': float(all_coords[:, 1].mean()),
                    'z': float(all_coords[:, 2].mean())
                }
            }
        },
        'frames': frames
    }


def main():
    parser = argparse.ArgumentParser(description='Generate test molecular data')
    parser.add_argument('--type', choices=['water', 'protein', 'nanocluster'], 
                       default='water', help='Type of system to generate')
    parser.add_argument('--frames', type=int, default=50,
                       help='Number of frames')
    parser.add_argument('--output', type=str, default='trajectory.json',
                       help='Output JSON file')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Test Data Generator")
    print("=" * 60)
    
    # Generate data
    if args.type == 'water':
        data = generate_water_box(num_molecules=27, num_frames=args.frames)
    elif args.type == 'protein':
        data = generate_protein_backbone(num_residues=20, num_frames=args.frames)
    else:  # nanocluster
        data = generate_nanocluster(num_atoms=100, num_frames=args.frames)
    
    # Save to file
    output_path = Path(args.output)
    with open(output_path, 'w') as f:
        json.dump(data, f)
    
    print(f"\n✓ Generated {args.type} system")
    print(f"✓ Frames: {data['metadata']['num_frames']}")
    print(f"✓ Atoms: {data['metadata']['num_atoms']}")
    print(f"✓ File: {args.output} ({output_path.stat().st_size / 1024:.1f} KB)")
    
    print("\n" + "=" * 60)
    print("✓ Test data ready!")
    print("=" * 60)
    print(f"\nNext steps:")
    print(f"1. Copy {args.output} to your React project's public/ folder")
    print(f"2. Update your code to load from: /trajectory.json")
    print(f"3. Run: npm run dev")


if __name__ == '__main__':
    main()
