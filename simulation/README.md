# Molecular Dynamics Data Generator

Complete setup for generating MD simulation data for web visualization.

## 📦 Quick Start (No OpenMM Required)

**Fastest way to get data in 30 seconds:**

```bash
# Install only numpy (lightweight)
pip install numpy

# Generate test data immediately
python generate_test_data.py --type water --frames 50
```

This creates `trajectory.json` ready for your web app!

---

## 🔬 Full Setup (With OpenMM Simulations)

### Option 1: Using Conda (Recommended)

```bash
# Create new environment
conda create -n mdviz python=3.10
conda activate mdviz

# Install OpenMM
conda install -c conda-forge openmm

# Install other dependencies
pip install -r requirements.txt
```

### Option 2: Using Pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🚀 Usage

### Quick Test Data (No Simulation - Instant)

```bash
# Water box (81 atoms, 50 frames) - ~50KB
python generate_test_data.py --type water --frames 50

# Protein helix (80 atoms, 50 frames) - ~60KB
python generate_test_data.py --type protein --frames 50

# Gold nanocluster (100 atoms, 50 frames) - ~75KB
python generate_test_data.py --type nanocluster --frames 50
```

### Real MD Simulation (Requires OpenMM)

```bash
# Small water box simulation (~800 atoms, 50 frames)
python simulate.py --type water --steps 500 --interval 10

# Protein in water (~2000-5000 atoms, 100 frames)
python simulate.py --type protein --steps 1000 --interval 10

# Custom parameters
python simulate.py \
    --type protein \
    --steps 2000 \
    --interval 20 \
    --temp 310 \
    --output my_simulation.json
```

---

## 📊 Output Format

All scripts generate the same JSON format:

```json
{
  "metadata": {
    "source": "simulation_type",
    "num_frames": 50,
    "num_atoms": 81,
    "bounds": {
      "min": {"x": 0.0, "y": 0.0, "z": 0.0},
      "max": {"x": 1.0, "y": 1.0, "z": 1.0},
      "center": {"x": 0.5, "y": 0.5, "z": 0.5}
    }
  },
  "frames": [
    [
      {
        "x": 0.123,
        "y": 0.456,
        "z": 0.789,
        "element": "O",
        "name": "O",
        "residue": "HOH",
        "chain": "A",
        "color": {"r": 1.0, "g": 0.0, "b": 0.0}
      },
      ...
    ],
    ...
  ]
}
```

---

## 🎯 Recommended Workflow for Your Project

### Day 1: Start Simple
```bash
# Get test data in 30 seconds
pip install numpy
python generate_test_data.py --type water
```
→ Focus on building the React/Three.js visualization

### Day 2: Add Real Physics
```bash
# Setup OpenMM
conda install -c conda-forge openmm
pip install -r requirements.txt

# Run real simulation
python simulate.py --type protein --steps 1000
```
→ Upgrade to real MD data

---

## 📁 File Sizes

| System | Atoms | Frames | File Size | Generation Time |
|--------|-------|--------|-----------|----------------|
| Test water | 81 | 50 | ~50 KB | <1 second |
| Test protein | 80 | 50 | ~60 KB | <1 second |
| MD water box | 800 | 50 | ~500 KB | 2-3 minutes |
| MD protein | 2000 | 100 | ~2 MB | 5-10 minutes |
| MD large protein | 10000 | 100 | ~10 MB | 30-60 minutes |

---

## 🔧 Troubleshooting

### "ModuleNotFoundError: No module named 'openmm'"
```bash
# Use conda (easier for OpenMM)
conda install -c conda-forge openmm
```

### "Simulation is too slow"
```bash
# Reduce number of steps or atoms
python simulate.py --type water --steps 100 --box-size 2.0
```

### "JSON file too large"
```bash
# Reduce frames or atoms
python simulate.py --steps 500 --interval 20  # Fewer frames
python generate_test_data.py --frames 20      # For test data
```

### "Want even faster test data"
Just use numpy:
```bash
pip install numpy
python generate_test_data.py --type water
```

---

## 🎨 Converting PDB Files

If you have existing PDB files:

```bash
# Install biopython
pip install biopython numpy

# Convert any PDB to JSON
python pdb_to_json.py your_protein.pdb output.json

# Or generate simple water for testing
python pdb_to_json.py --generate-water test.json
```

---

## 📝 Example Commands

### For web development (fast iteration)
```bash
# Super quick test data
python generate_test_data.py --type water --frames 20

# Medium complexity
python generate_test_data.py --type protein --frames 50
```

### For impressive demos
```bash
# Real water simulation
python simulate.py --type water --steps 1000 --interval 10

# Real protein dynamics
python simulate.py --type protein --steps 2000 --interval 20
```

---

## 🌟 Pro Tips

1. **Start with test data** - No OpenMM installation needed
2. **Small files first** - Easier to debug your web app
3. **Increase complexity gradually** - Add more atoms/frames later
4. **Use --interval wisely** - Interval of 10-20 gives smooth playback
5. **Check file size** - Keep under 5MB for web loading speed

---

## 📚 Next Steps

After generating `trajectory.json`:

1. Copy to your React project: `cp trajectory.json /path/to/react-app/public/`
2. Load in React: `fetch('/trajectory.json')`
3. Render with Three.js (see blueprint)

---

## 🤝 Dependencies Explained

**Minimal (for test data)**
- `numpy` - Array operations

**Full simulation**
- `openmm` - MD simulation engine
- `biopython` - PDB file parsing
- `mdtraj` - Advanced trajectory analysis (optional)
- `tqdm` - Progress bars

---

## ⚡ Performance Notes

**Test Data Generation:**
- Water: <1 second
- Protein: <1 second
- No GPU required

**OpenMM Simulation:**
- Water (500 steps): ~2 minutes (CPU) / 30 seconds (GPU)
- Protein (1000 steps): ~5 minutes (CPU) / 1 minute (GPU)
- GPU highly recommended for large systems

---

## 🐛 Common Issues

**"Simulation crashes"**
- Reduce box size: `--box-size 2.0`
- Reduce steps: `--steps 100`
- Use test data instead

**"JSON is too big"**
- Reduce frames: `--interval 50`
- Reduce atoms: `--box-size 2.0`
- Use test data generator

**"Need data NOW"**
```bash
python generate_test_data.py --type water
```
Done in 1 second!

