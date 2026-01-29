import React, { useState } from 'react';
import { Code, Zap, Database, Eye, Layers, PlayCircle, Download } from 'lucide-react';

const MolecularDynamicsBlueprint = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Project Overview",
      icon: <Eye size={24} />,
      color: "from-blue-500 to-cyan-500",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">Molecular Dynamics Visualizer</h3>
            <p className="text-gray-300 text-lg">
              Build a real-time 3D visualization of protein/molecular simulations using pre-computed MD data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-cyan-400 mb-2">What You'll Build</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Load MD trajectory data (PDB/XYZ format)</li>
                <li>• Render 10k+ atoms in real-time</li>
                <li>• WebGPU compute for physics updates</li>
                <li>• Interactive playback controls</li>
                <li>• Visual styles: ball-and-stick, space-filling</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Tech Stack</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <span className="text-blue-400">React</span> - UI & controls</li>
                <li>• <span className="text-blue-400">Three.js</span> - 3D rendering</li>
                <li>• <span className="text-blue-400">WebGPU</span> - Compute shaders</li>
                <li>• <span className="text-blue-400">MDAnalysis/PyMol</span> - Data prep</li>
                <li>• <span className="text-blue-400">Vite</span> - Build tool</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-400 mb-2">⏱️ Time Estimate: 8-10 hours</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Setup & data preparation: 2 hours</p>
              <p>• Three.js rendering: 3 hours</p>
              <p>• WebGPU integration: 2 hours</p>
              <p>• React controls & polish: 2 hours</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Data Preparation",
      icon: <Database size={24} />,
      color: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-purple-300">Step 1: Generate MD Data (Simplest Path)</h3>

          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-400 mb-3">Option A: Use Pre-made Data (Fastest - 10 min)</h4>
            <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400 mb-3">
              # Download sample protein trajectory<br />
              wget http://www.rcsb.org/pdb/files/1AKI.pdb<br />
              <br />
              # Or use a small water box simulation<br />
              # Available at: github.com/mdanalysis/mdanalysis-data
            </div>
            <p className="text-sm text-gray-400">
              ✅ Recommended for one-day build. Use existing trajectory files from protein data banks.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-400 mb-3">Option B: Run Simple Simulation (1-2 hours)</h4>
            <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400 mb-3">
              pip install openmm<br />
              <br />
              # Python script to run 1000-step water simulation<br />
              from openmm.app import *<br />
              from openmm import *<br />
              from openmm.unit import *<br />
              <br />
              # Load PDB<br />
              pdb = PDBFile('input.pdb')<br />
              forcefield = ForceField('amber14-all.xml')<br />
              system = forcefield.createSystem(pdb.topology)<br />
              <br />
              # Run 1000 steps<br />
              integrator = LangevinIntegrator(300*kelvin, 1/picosecond, 0.002*picoseconds)<br />
              simulation = Simulation(pdb.topology, system, integrator)<br />
              simulation.reporters.append(PDBReporter('trajectory.pdb', 10))<br />
              simulation.step(1000)
            </div>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-cyan-400 mb-3">Convert to JSON for Web</h4>
            <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400">
              # Python script: pdb_to_json.py<br />
              import json<br />
              <br />
              def parse_pdb_frame(lines):<br />
              {'    '}atoms = []<br />
              {'    '}for line in lines:<br />
              {'        '}if line.startswith('ATOM'):<br />
              {'            '}atoms.append({'{'})<br />
              {'                '}'x': float(line[30:38]),<br />
              {'                '}'y': float(line[38:46]),<br />
              {'                '}'z': float(line[46:54]),<br />
              {'                '}'element': line[76:78].strip(),<br />
              {'                '}'name': line[12:16].strip()<br />
              {'            '}<br />
              {'    '}return atoms<br />
              <br />
              # Output: trajectory.json<br />
              # {'{'}frames: [[{'{'}x,y,z,element{'}'},...], ...]{'}'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Project Setup",
      icon: <Code size={24} />,
      color: "from-green-500 to-emerald-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-green-300">Step 2: Project Structure</h3>

          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/30">
            <div className="font-mono text-sm text-green-400">
              npm create vite@latest md-visualizer -- --template react<br />
              cd md-visualizer<br />
              npm install three @react-three/fiber @react-three/drei<br />
              npm install --save-dev @webgpu/types
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-green-400 mb-3">File Structure</h4>
            <div className="font-mono text-sm text-gray-300 space-y-1">
              <div>md-visualizer/</div>
              <div>├── src/</div>
              <div>│   ├── App.jsx                    # Main app</div>
              <div>│   ├── components/</div>
              <div>│   │   ├── MoleculeViewer.jsx    # Three.js scene</div>
              <div>│   │   ├── Controls.jsx          # Playback controls</div>
              <div>│   │   └── AtomRenderer.jsx      # Atom instancing</div>
              <div>│   ├── compute/</div>
              <div>│   │   ├── webgpu.js             # WebGPU setup</div>
              <div>│   │   └── shaders.wgsl          # Compute shaders</div>
              <div>│   └── data/</div>
              <div>│       └── trajectory.json        # MD data</div>
              <div>└── package.json</div>
            </div>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-cyan-400 mb-3">Key Dependencies Explained</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <span className="text-green-400">three</span> - Core 3D rendering</li>
              <li>• <span className="text-green-400">@react-three/fiber</span> - React renderer for Three.js</li>
              <li>• <span className="text-green-400">@react-three/drei</span> - Useful helpers (OrbitControls, etc.)</li>
              <li>• <span className="text-green-400">@webgpu/types</span> - TypeScript types for WebGPU</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Three.js Rendering",
      icon: <Layers size={24} />,
      color: "from-orange-500 to-red-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-300">Step 3: Three.js Molecule Renderer</h3>

          <div className="bg-gray-900 p-4 rounded-lg border border-orange-500/30 overflow-x-auto">
            <div className="font-mono text-xs text-green-400 whitespace-pre">
              {`// src/components/MoleculeViewer.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const AtomInstances = ({ atoms }) => {
  const meshRef = useRef();
  
  // Create instanced mesh for performance
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(atoms.length * 3);
    const colors = new Float32Array(atoms.length * 3);
    
    const colorMap = {
      'C': [0.2, 0.2, 0.2],  // Carbon: gray
      'O': [1.0, 0.0, 0.0],  // Oxygen: red
      'N': [0.0, 0.0, 1.0],  // Nitrogen: blue
      'H': [1.0, 1.0, 1.0],  // Hydrogen: white
    };
    
    atoms.forEach((atom, i) => {
      positions[i * 3] = atom.x;
      positions[i * 3 + 1] = atom.y;
      positions[i * 3 + 2] = atom.z;
      
      const color = colorMap[atom.element] || [0.5, 0.5, 0.5];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    });
    
    return { positions, colors };
  }, [atoms]);
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, atoms.length]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial vertexColors />
      <instancedBufferAttribute
        attach="attributes-position"
        args={[positions, 3]}
      />
      <instancedBufferAttribute
        attach="attributes-color"
        args={[colors, 3]}
      />
    </instancedMesh>
  );
};

export default function MoleculeViewer({ trajectoryData, currentFrame }) {
  const atoms = trajectoryData.frames[currentFrame] || [];
  
  return (
    <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AtomInstances atoms={atoms} />
      <OrbitControls />
      <gridHelper args={[50, 50]} />
    </Canvas>
  );
}`}
            </div>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-400 mb-3">🎨 Rendering Optimizations</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <span className="text-orange-400">InstancedMesh</span> - Render 10k+ atoms efficiently</li>
              <li>• <span className="text-orange-400">BufferGeometry</span> - Direct GPU memory access</li>
              <li>• <span className="text-orange-400">useMemo</span> - Cache geometry between frames</li>
              <li>• <span className="text-orange-400">Level of Detail</span> - Lower poly spheres for distant atoms</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "WebGPU Compute",
      icon: <Zap size={24} />,
      color: "from-yellow-500 to-amber-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-yellow-300">Step 4: WebGPU Acceleration (Optional)</h3>

          <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">
              <span className="text-yellow-400 font-semibold">Note:</span> For a one-day project, you can skip WebGPU and use Three.js alone. Add WebGPU later for:
            </p>
            <ul className="space-y-1 text-sm text-gray-300 ml-4">
              <li>• Real-time force calculations</li>
              <li>• Interpolation between frames</li>
              <li>• Custom physics simulations</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-yellow-500/30 overflow-x-auto">
            <div className="font-mono text-xs text-green-400 whitespace-pre">
              {`// src/compute/webgpu.js - Simple position interpolation
export async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error('WebGPU not supported');
  }
  
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  
  return { device };
}

export function createInterpolationPipeline(device, numAtoms) {
  // WGSL shader for smooth frame interpolation
  const shaderCode = \`
    struct Atom {
      positionA: vec3<f32>,
      positionB: vec3<f32>,
    }
    
    @group(0) @binding(0) var<storage, read> atomsIn: array<Atom>;
    @group(0) @binding(1) var<storage, read_write> atomsOut: array<vec3<f32>>;
    @group(0) @binding(2) var<uniform> interpolation: f32;
    
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let idx = global_id.x;
      if (idx >= arrayLength(&atomsIn)) { return; }
      
      let atom = atomsIn[idx];
      atomsOut[idx] = mix(atom.positionA, atom.positionB, interpolation);
    }
  \`;
  
  const shaderModule = device.createShaderModule({ code: shaderCode });
  
  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: shaderModule,
      entryPoint: 'main',
    },
  });
  
  return pipeline;
}

// Usage: Smooth transitions between MD frames
export function interpolateFrame(device, pipeline, frameA, frameB, t) {
  // Create buffers, bind groups, dispatch compute shader
  // Returns interpolated positions
}`}
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-yellow-400 mb-3">When to Use WebGPU</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-400 font-semibold mb-2">✅ Good Use Cases:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• 50k+ particles</li>
                  <li>• Custom force calculations</li>
                  <li>• Real-time physics</li>
                  <li>• Particle collisions</li>
                </ul>
              </div>
              <div>
                <p className="text-red-400 font-semibold mb-2">❌ Skip For:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Playing pre-computed data</li>
                  <li>• &lt;10k particles</li>
                  <li>• Simple visualization</li>
                  <li>• One-day projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "React Controls",
      icon: <PlayCircle size={24} />,
      color: "from-pink-500 to-rose-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-pink-300">Step 5: Interactive Controls</h3>

          <div className="bg-gray-900 p-4 rounded-lg border border-pink-500/30 overflow-x-auto">
            <div className="font-mono text-xs text-green-400 whitespace-pre">
              {`// src/App.jsx
import React, { useState, useEffect } from 'react';
import MoleculeViewer from './components/MoleculeViewer';
import trajectoryData from './data/trajectory.json';

export default function App() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const totalFrames = trajectoryData.frames.length;
  
  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 1000 / (30 * speed)); // 30 FPS * speed
    
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalFrames]);
  
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* 3D Viewer */}
      <div className="flex-1">
        <MoleculeViewer 
          trajectoryData={trajectoryData} 
          currentFrame={currentFrame} 
        />
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            
            <button
              onClick={() => setCurrentFrame(0)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              ⏮ Reset
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={totalFrames - 1}
                value={currentFrame}
                onChange={(e) => setCurrentFrame(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">
                Frame {currentFrame + 1} / {totalFrames}
              </div>
            </div>
          </div>
          
          {/* Speed Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm">Speed: {speed}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
}`}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-400 mb-3">Essential Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✅ Play/Pause animation</li>
                <li>✅ Scrub through frames</li>
                <li>✅ Speed control (0.1x - 3x)</li>
                <li>✅ Frame counter display</li>
                <li>✅ Reset to beginning</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-400 mb-3">Bonus Features (Day 2)</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Toggle rendering style</li>
                <li>• Select/highlight atoms</li>
                <li>• Measure distances</li>
                <li>• Export frames as images</li>
                <li>• Load custom PDB files</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Visual Demo",
      icon: <Eye size={24} />,
      color: "from-indigo-500 to-purple-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-300">What It Should Look Like</h3>

          {/* 3D Scene Mockup */}
          <div className="relative h-96 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 rounded-lg overflow-hidden border border-indigo-500/30">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-12 h-full">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>

            {/* Central molecule visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Protein core */}
              <div className="relative">
                {/* Atoms */}
                {[...Array(50)].map((_, i) => {
                  const angle = (i / 50) * Math.PI * 2;
                  const radius = 40 + Math.random() * 60;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const z = (Math.random() - 0.5) * 40;

                  const colors = ['bg-red-400', 'bg-blue-400', 'bg-gray-300', 'bg-yellow-200'];
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  const size = Math.random() > 0.7 ? 'w-4 h-4' : 'w-3 h-3';

                  return (
                    <div
                      key={i}
                      className={`absolute ${color} ${size} rounded-full shadow-lg animate-pulse`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: `translateZ(${z}px) translate(-50%, -50%)`,
                        opacity: 0.7 + Math.random() * 0.3,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  );
                })}

                {/* Bonds */}
                {[...Array(30)].map((_, i) => {
                  const angle = (Math.random() * Math.PI * 2);
                  const length = 40 + Math.random() * 60;

                  return (
                    <div
                      key={`bond-${i}`}
                      className="absolute w-0.5 bg-white/20"
                      style={{
                        left: '50%',
                        top: '50%',
                        height: `${length}px`,
                        transform: `rotate(${angle}rad) translateY(-50%)`,
                        transformOrigin: 'top center'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

            {/* Axis labels */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-red-500"></div>
                <span>X</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-500"></div>
                <span>Y</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span>Z</span>
              </div>
            </div>

            {/* Info overlay */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-2 rounded text-xs">
              <div className="text-cyan-400">10,342 atoms</div>
              <div className="text-gray-400">Frame 45/100</div>
            </div>
          </div>

          {/* Control Panel Mockup */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <button className="px-4 py-2 bg-blue-600 rounded text-sm font-semibold">
                ▶ Play
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded text-sm">
                ⏮ Reset
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded text-sm">
                📸 Snapshot
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Timeline</span>
                  <span>Frame 45 / 100</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-cyan-500"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Speed</span>
                  <span>1.5x</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-[50%] h-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="text-sm font-semibold text-red-400">Oxygen</span>
              </div>
              <p className="text-xs text-gray-400">2,341 atoms</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-semibold text-blue-400">Nitrogen</span>
              </div>
              <p className="text-xs text-gray-400">1,823 atoms</p>
            </div>

            <div className="bg-gray-700/20 border border-gray-500/30 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-300">Carbon</span>
              </div>
              <p className="text-xs text-gray-400">6,178 atoms</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quick Start Guide",
      icon: <Download size={24} />,
      color: "from-teal-500 to-cyan-500",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-teal-300">Complete Implementation Steps</h3>

          <div className="bg-teal-900/20 border border-teal-500/30 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-teal-400 mb-4">⚡ Fastest Path (1 Day)</h4>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Get Sample Data (15 min)</h5>
                  <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 mb-2">
                    wget https://files.rcsb.org/download/1AKI.pdb<br />
                    # Or use: github.com/mdanalysis/mdanalysis-data
                  </div>
                  <p className="text-sm text-gray-400">Download a small protein structure. Skip simulation for day 1.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Convert to JSON (30 min)</h5>
                  <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 mb-2">
                    pip install biopython<br />
                    python pdb_to_json.py 1AKI.pdb trajectory.json
                  </div>
                  <p className="text-sm text-gray-400">Parse PDB format into web-friendly JSON.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Setup React + Three.js (1 hour)</h5>
                  <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 mb-2">
                    npm create vite@latest md-viz -- --template react<br />
                    npm install three @react-three/fiber @react-three/drei
                  </div>
                  <p className="text-sm text-gray-400">Initialize project with all dependencies.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Implement Atom Renderer (2-3 hours)</h5>
                  <p className="text-sm text-gray-400 mb-2">
                    Create InstancedMesh component for atoms. Use sphere geometry with CPK coloring.
                  </p>
                  <p className="text-xs text-teal-400">See "Three.js Rendering" tab for complete code</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Add Playback Controls (1-2 hours)</h5>
                  <p className="text-sm text-gray-400 mb-2">
                    Build React UI with play/pause, timeline scrubber, and speed control.
                  </p>
                  <p className="text-xs text-teal-400">See "React Controls" tab for implementation</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">Polish & Test (1-2 hours)</h5>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Add loading states</li>
                    <li>• Optimize render performance</li>
                    <li>• Add camera presets</li>
                    <li>• Style the UI</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-400 mb-3">💡 Pro Tips</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <span className="text-amber-400">Start simple:</span> Single frame first, then add animation</li>
              <li>• <span className="text-amber-400">Skip WebGPU initially:</span> Three.js alone handles 10k atoms fine</li>
              <li>• <span className="text-amber-400">Use console.time():</span> Profile rendering performance</li>
              <li>• <span className="text-amber-400">Test with small data:</span> 100 atoms before loading full protein</li>
            </ul>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-cyan-400 mb-3">📚 Helpful Resources</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Data Sources:</p>
                <ul className="text-cyan-300 space-y-1">
                  <li>• RCSB Protein Data Bank</li>
                  <li>• MDAnalysis sample data</li>
                  <li>• OpenMM tutorials</li>
                </ul>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Documentation:</p>
                <ul className="text-cyan-300 space-y-1">
                  <li>• Three.js InstancedMesh</li>
                  <li>• React Three Fiber</li>
                  <li>• WebGPU Fundamentals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Molecular Dynamics Visualizer
          </h1>
          <p className="text-xl text-gray-400">
            Complete Blueprint: React + Three.js + WebGPU
          </p>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg transition-all ${activeStep === idx
                    ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-105`
                    : 'bg-gray-800/50 text-gray-500 hover:bg-gray-800'
                  }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {step.icon}
                  <span className="text-xs font-semibold hidden md:block">
                    {step.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={`bg-gradient-to-br ${steps[activeStep].color} p-1 rounded-xl mb-8`}>
          <div className="bg-gray-900 rounded-lg p-8">
            {steps[activeStep].content}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-6 py-3 bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition"
          >
            ← Previous
          </button>

          <div className="text-center text-sm text-gray-500">
            Step {activeStep + 1} of {steps.length}
          </div>

          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-6 py-3 bg-blue-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Next →
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>💡 Click through each step for complete implementation details</p>
        </div>
      </div>
    </div>
  );
};

export default MolecularDynamicsBlueprint;
