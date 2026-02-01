# Quick Reference: MD Data Generator Commands

## 🚀 Super Fast Start (30 seconds)
```bash
pip install numpy
python generate_test_data.py --type water
```

## 📋 All Commands

### Test Data Generator (No OpenMM - Instant)
```bash
# Water box (81 atoms, 50 frames)
python generate_test_data.py --type water

# Protein helix (80 atoms, 50 frames)  
python generate_test_data.py --type protein

# Nanocluster (100 atoms, 50 frames)
python generate_test_data.py --type nanocluster

# Custom frame count
python generate_test_data.py --type water --frames 100 --output my_data.json
```

### Real MD Simulation (Requires OpenMM)
```bash
# Water box simulation
python simulate.py --type water --steps 500

# Protein simulation (auto-downloads sample PDB)
python simulate.py --type protein --steps 1000

# Custom simulation
python simulate.py \
    --type protein \
    --steps 2000 \
    --interval 20 \
    --temp 310 \
    --output protein_310K.json

# Use your own PDB file
python simulate.py --type protein --pdb my_protein.pdb --steps 1000
```

### PDB to JSON Converter
```bash
# Convert existing PDB file
python pdb_to_json.py input.pdb output.json

# Generate test water (no OpenMM needed)
python pdb_to_json.py --generate-water test.json
```

## 🛠️ Installation

### Quick (test data only)
```bash
pip install numpy
```

### Full (OpenMM with conda)
```bash
conda create -n mdviz python=3.10
conda activate mdviz
conda install -c conda-forge openmm
pip install -r requirements.txt
```

### Full (OpenMM with pip)
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📦 Output Files

All commands create `trajectory.json` (or custom name) with this structure:
- `metadata`: System info, bounds, atom count
- `frames`: Array of frames, each containing atom positions

## 💡 Tips

**For web development:**
- Use test data generator (instant)
- Start with 20-50 frames
- Keep file size under 1MB

**For presentations:**
- Use real MD simulations
- 50-100 frames is enough
- Protein simulations are most impressive

**File size estimates:**
- Test data: 50-100 KB
- Small MD: 0.5-1 MB  
- Large MD: 2-10 MB

## 🎯 Recommended Workflow

1. **Day 1**: `python generate_test_data.py --type water`
   - Get data instantly
   - Build your React/Three.js visualization

2. **Day 2**: `python simulate.py --type protein --steps 1000`
   - Upgrade to real physics
   - Impressive for demos

## 🔍 Quick Checks

**See what you generated:**
```bash
# File size
ls -lh trajectory.json

# Quick peek at metadata
head -n 20 trajectory.json
```

**Test in Python:**
```python
import json
data = json.load(open('trajectory.json'))
print(f"Frames: {data['metadata']['num_frames']}")
print(f"Atoms: {data['metadata']['num_atoms']}")
```
