#!/bin/bash
# Quick setup script for MD visualization project

set -e

echo "======================================"
echo "MD Visualization Data Generator Setup"
echo "======================================"
echo ""

# Check Python version
python_version=$(python3 --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
echo "✓ Python version: $python_version"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if conda is available
if command_exists conda; then
    echo "✓ Conda detected"
    CONDA_AVAILABLE=1
else
    echo "✗ Conda not found (optional)"
    CONDA_AVAILABLE=0
fi

echo ""
echo "Choose setup option:"
echo "1) Quick test data only (numpy only, <1 min)"
echo "2) Full OpenMM simulation (conda, ~5 min)"
echo "3) Full OpenMM simulation (pip, ~10 min)"
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "Installing minimal dependencies..."
        pip install numpy tqdm
        echo ""
        echo "✓ Setup complete!"
        echo ""
        echo "Generate test data with:"
        echo "  python generate_test_data.py --type water"
        ;;
    2)
        if [ $CONDA_AVAILABLE -eq 0 ]; then
            echo "Error: Conda not available. Choose option 3 or install conda."
            exit 1
        fi
        echo ""
        echo "Setting up conda environment..."
        conda create -n mdviz python=3.10 -y
        echo "Activating environment..."
        source $(conda info --base)/etc/profile.d/conda.sh
        conda activate mdviz
        echo "Installing OpenMM..."
        conda install -c conda-forge openmm -y
        echo "Installing other dependencies..."
        pip install -r requirements.txt
        echo ""
        echo "✓ Setup complete!"
        echo ""
        echo "Activate environment with:"
        echo "  conda activate mdviz"
        echo ""
        echo "Then generate data with:"
        echo "  python simulate.py --type water --steps 500"
        ;;
    3)
        echo ""
        echo "Creating virtual environment..."
        python3 -m venv venv
        echo "Activating environment..."
        source venv/bin/activate
        echo "Installing dependencies..."
        pip install -r requirements.txt
        echo ""
        echo "✓ Setup complete!"
        echo ""
        echo "Activate environment with:"
        echo "  source venv/bin/activate"
        echo ""
        echo "Then generate data with:"
        echo "  python simulate.py --type water --steps 500"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "Setup complete!"
echo "======================================"
