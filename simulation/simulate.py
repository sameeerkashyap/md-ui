#!/usr/bin/env python3
"""
Simple Molecular Dynamics Simulation using OpenMM
Generates trajectory data for web visualization

This script simulates a small protein in water and outputs trajectory frames
that can be visualized in the web application.

Usage:
    python simulate.py --type protein --steps 1000
    python simulate.py --type water --steps 500
"""

import argparse
import json
from pathlib import Path
import sys

try:
    from openmm.app import *
    from openmm import *
    from openmm.unit import *
    import numpy as np
except ImportError:
    print("Error: OpenMM not installed. Install with:")
    print("conda install -c conda-forge openmm")
    print("or")
    print("pip install openmm")
    sys.exit(1)


def download_sample_pdb():
    """Download a sample PDB file if none exists"""
    import urllib.request
    
    pdb_file = Path('villin.pdb')
    if pdb_file.exists():
        print(f"✓ Using existing {pdb_file}")
        return str(pdb_file)
    
    print("Downloading sample protein (villin headpiece)...")
    url = "https://files.rcsb.org/download/2F4K.pdb"
    
    try:
        urllib.request.urlretrieve(url, pdb_file)
        print(f"✓ Downloaded {pdb_file}")
        return str(pdb_file)
    except Exception as e:
        print(f"Error downloading PDB: {e}")
        print("You can manually download any PDB file from https://www.rcsb.org/")
        sys.exit(1)


def create_water_box_system(box_size=3.0):
    """
    Create a simple water box for simulation
    
    Args:
        box_size: Size of the cubic water box in nanometers
    
    Returns:
        tuple: (topology, system, positions)
    """
    print(f"\n=== Creating {box_size}nm water box ===")
    
    # Create a Modeller object with empty topology
    modeller = Modeller(Topology(), [])
    
    # Add water box
    print("Adding water molecules...")
    modeller.addSolvent(
        forcefield=ForceField('amber14-all.xml', 'amber14/tip3p.xml'),
        model='tip3p',
        boxSize=Vec3(box_size, box_size, box_size)*nanometers,
        neutralize=False
    )
    
    print(f"✓ Created box with {modeller.topology.getNumAtoms()} atoms")
    print(f"✓ Number of residues: {modeller.topology.getNumResidues()}")
    
    return modeller.topology, modeller.positions


def create_protein_system(pdb_file):
    """
    Create a protein system in water
    
    Args:
        pdb_file: Path to PDB file
    
    Returns:
        tuple: (topology, system, positions)
    """
    print(f"\n=== Loading protein from {pdb_file} ===")
    
    # Load PDB file
    pdb = PDBFile(pdb_file)
    
    # Create a Modeller object
    modeller = Modeller(pdb.topology, pdb.positions)
    
    print(f"✓ Loaded protein with {pdb.topology.getNumAtoms()} atoms")
    
    # Add hydrogens
    print("Adding hydrogens...")
    modeller.addHydrogens(forcefield=ForceField('amber14-all.xml'))
    
    # Add solvent
    print("Adding water box...")
    modeller.addSolvent(
        forcefield=ForceField('amber14-all.xml', 'amber14/tip3p.xml'),
        model='tip3p',
        padding=1.0*nanometers,
        neutralize=True
    )
    
    print(f"✓ Final system has {modeller.topology.getNumAtoms()} atoms")
    print(f"✓ Number of residues: {modeller.topology.getNumResidues()}")
    
    return modeller.topology, modeller.positions


def run_simulation(topology, positions, num_steps=1000, output_interval=10, temperature=300):
    """
    Run molecular dynamics simulation
    
    Args:
        topology: OpenMM Topology object
        positions: Initial positions
        num_steps: Number of simulation steps
        output_interval: Save frame every N steps
        temperature: Temperature in Kelvin
    
    Returns:
        list: Trajectory frames
    """
    print(f"\n=== Running MD Simulation ===")
    print(f"Steps: {num_steps}")
    print(f"Output interval: {output_interval}")
    print(f"Temperature: {temperature}K")
    
    # Create force field
    forcefield = ForceField('amber14-all.xml', 'amber14/tip3p.xml')
    
    # Create system
    print("Creating system...")
    system = forcefield.createSystem(
        topology,
        nonbondedMethod=PME,
        nonbondedCutoff=1.0*nanometers,
        constraints=HBonds
    )
    
    # Create integrator
    integrator = LangevinMiddleIntegrator(
        temperature*kelvin,
        1.0/picosecond,
        0.002*picoseconds
    )
    
    # Create simulation
    simulation = Simulation(topology, system, integrator)
    simulation.context.setPositions(positions)
    
    # Minimize energy
    print("Minimizing energy...")
    simulation.minimizeEnergy(maxIterations=100)
    
    # Equilibrate
    print("Equilibrating...")
    simulation.step(100)
    
    # Run simulation and collect frames
    print(f"Running production MD...")
    frames = []
    
    from tqdm import tqdm
    for step in tqdm(range(0, num_steps, output_interval)):
        simulation.step(output_interval)
        
        # Get current state
        state = simulation.context.getState(getPositions=True)
        # Convert positions to nanometers strips units and returns list of Vec3 floats
        positions = state.getPositions().value_in_unit(nanometers)
        
        # Convert to list format
        frame_atoms = []
        for atom, pos in zip(topology.atoms(), positions):
            frame_atoms.append({
                'x': float(pos.x),
                'y': float(pos.y),
                'z': float(pos.z),
                'element': atom.element.symbol if atom.element else 'C',
                'name': atom.name,
                'residue': atom.residue.name,
                'chain': atom.residue.chain.id
            })
        
        frames.append(frame_atoms)
    
    print(f"✓ Simulation complete! Generated {len(frames)} frames")
    
    return frames


def save_trajectory(frames, output_file='trajectory.json'):
    """
    Save trajectory to JSON file
    
    Args:
        frames: List of frames
        output_file: Output JSON file path
    """
    print(f"\n=== Saving trajectory to {output_file} ===")
    
    # Element color mapping (CPK coloring)
    element_colors = {
        'C': {'r': 0.5, 'g': 0.5, 'b': 0.5},
        'N': {'r': 0.0, 'g': 0.0, 'b': 1.0},
        'O': {'r': 1.0, 'g': 0.0, 'b': 0.0},
        'S': {'r': 1.0, 'g': 1.0, 'b': 0.0},
        'P': {'r': 1.0, 'g': 0.5, 'b': 0.0},
        'H': {'r': 1.0, 'g': 1.0, 'b': 1.0},
    }
    
    # Add colors to atoms
    for frame in frames:
        for atom in frame:
            element = atom['element']
            atom['color'] = element_colors.get(element, {'r': 0.5, 'g': 0.5, 'b': 0.5})
    
    # Calculate bounds
    all_coords = []
    for atom in frames[0]:
        all_coords.append([atom['x'], atom['y'], atom['z']])
    all_coords = np.array(all_coords)
    
    trajectory_data = {
        'metadata': {
            'source': 'openmm_simulation',
            'num_frames': len(frames),
            'num_atoms': len(frames[0]) if frames else 0,
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
    
    with open(output_file, 'w') as f:
        json.dump(trajectory_data, f)
    
    print(f"✓ Saved {len(frames)} frames")
    print(f"✓ Atoms per frame: {len(frames[0])}")
    print(f"✓ File size: {Path(output_file).stat().st_size / 1024 / 1024:.2f} MB")


def main():
    parser = argparse.ArgumentParser(description='Run molecular dynamics simulation')
    parser.add_argument('--type', choices=['water', 'protein'], default='water',
                       help='Type of system to simulate')
    parser.add_argument('--steps', type=int, default=500,
                       help='Number of simulation steps')
    parser.add_argument('--interval', type=int, default=10,
                       help='Save frame every N steps')
    parser.add_argument('--output', type=str, default='trajectory.json',
                       help='Output JSON file')
    parser.add_argument('--pdb', type=str, default=None,
                       help='PDB file for protein simulation (auto-downloads if not specified)')
    parser.add_argument('--box-size', type=float, default=3.0,
                       help='Water box size in nm (for water simulation)')
    parser.add_argument('--temp', type=int, default=300,
                       help='Temperature in Kelvin')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Molecular Dynamics Simulation")
    print("=" * 60)
    
    # Create system
    if args.type == 'water':
        topology, positions = create_water_box_system(args.box_size)
    else:  # protein
        pdb_file = args.pdb or download_sample_pdb()
        topology, positions = create_protein_system(pdb_file)
    
    # Run simulation
    frames = run_simulation(
        topology, 
        positions, 
        num_steps=args.steps,
        output_interval=args.interval,
        temperature=args.temp
    )
    
    # Save trajectory
    save_trajectory(frames, args.output)
    
    print("\n" + "=" * 60)
    print("✓ Simulation complete!")
    print(f"✓ Output: {args.output}")
    print("=" * 60)
    print("\nNext steps:")
    print(f"1. Copy {args.output} to your web project's src/data/ folder")
    print("2. Run the React app: npm run dev")
    print("3. View the 3D visualization in your browser!")


if __name__ == '__main__':
    main()
