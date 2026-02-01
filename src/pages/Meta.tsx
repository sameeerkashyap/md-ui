import React, { useState } from 'react';
import { Layers, Box, Grid3x3, Database, FileJson, Atom } from 'lucide-react';

const TrajectoryDataExplainer = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Sample data structure for visualization
    const sampleData = {
        metadata: {
            source: "water_box_test",
            num_frames: 5,
            num_atoms: 81,
            bounds: {
                min: { x: -0.03, y: -0.01, z: -0.02 },
                max: { x: 0.72, y: 0.72, z: 0.63 },
                center: { x: 0.33, y: 0.34, z: 0.30 }
            }
        },
        frames: [
            [
                { x: 0.001, y: -0.014, z: 0.010, element: "O", name: "O", residue: "HOH", chain: "A", color: { r: 1.0, g: 0.0, b: 0.0 } },
                { x: 0.097, y: -0.014, z: 0.010, element: "H", name: "H1", residue: "HOH", chain: "A", color: { r: 1.0, g: 1.0, b: 1.0 } },
                { x: -0.022, y: 0.078, z: 0.010, element: "H", name: "H2", residue: "HOH", chain: "A", color: { r: 1.0, g: 1.0, b: 1.0 } }
            ]
        ]
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FileJson size={20} /> },
        { id: 'metadata', label: 'Metadata', icon: <Database size={20} /> },
        { id: 'frames', label: 'Frames', icon: <Layers size={20} /> },
        { id: 'atoms', label: 'Atoms', icon: <Atom size={20} /> },
        { id: 'usage', label: 'Usage', icon: <Grid3x3 size={20} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-cyan-400">trajectory.json Structure</h2>

                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/30">
                            <h3 className="text-xl font-semibold mb-4 text-blue-300">Top-Level Structure</h3>
                            <div className="bg-gray-900 p-4 rounded font-mono text-sm">
                                <div className="text-gray-500">{'{'}</div>
                                <div className="ml-4">
                                    <span className="text-cyan-400">"metadata"</span>: {'{'}
                                    <span className="text-gray-400">// System information</span> {'}'}
                                </div>
                                <div className="ml-4">
                                    <span className="text-cyan-400">"frames"</span>: [
                                    <span className="text-gray-400">// Array of animation frames</span> ]
                                </div>
                                <div className="text-gray-500">{'}'}</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <Database size={20} />
                                    Metadata
                                </h4>
                                <p className="text-sm text-gray-300 mb-2">Static information about your simulation:</p>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li>• Number of frames</li>
                                    <li>• Number of atoms</li>
                                    <li>• 3D bounding box</li>
                                    <li>• Source information</li>
                                </ul>
                            </div>

                            <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                                <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                    <Layers size={20} />
                                    Frames Array
                                </h4>
                                <p className="text-sm text-gray-300 mb-2">Animation timeline:</p>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li>• Each frame = one timestep</li>
                                    <li>• Contains all atom positions</li>
                                    <li>• Same atoms, different positions</li>
                                    <li>• Iterate to animate</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-2">📊 Data Shape Summary</h4>
                            <div className="font-mono text-sm text-gray-300 space-y-1">
                                <div>• <span className="text-cyan-400">Top level</span>: Object with 2 keys</div>
                                <div>• <span className="text-cyan-400">metadata</span>: Object (static info)</div>
                                <div>• <span className="text-cyan-400">frames</span>: Array[num_frames] of atom arrays</div>
                                <div>• <span className="text-cyan-400">Each frame</span>: Array[num_atoms] of atom objects</div>
                                <div>• <span className="text-cyan-400">Each atom</span>: Object with position, element, color, etc.</div>
                            </div>
                        </div>
                    </div>
                );

            case 'metadata':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-cyan-400">Metadata Object</h2>

                        <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/30">
                            <div className="font-mono text-sm">
                                <pre className="text-green-400">{JSON.stringify(sampleData.metadata, null, 2)}</pre>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-2">source (string)</h4>
                                <p className="text-sm text-gray-300">Where the data came from</p>
                                <div className="mt-2 font-mono text-xs text-gray-400">
                                    Examples: "openmm_simulation", "water_box_test", "protein_helix_test"
                                </div>
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-400 mb-2">num_frames (integer)</h4>
                                <p className="text-sm text-gray-300">Total number of animation frames</p>
                                <div className="mt-2 font-mono text-xs text-gray-400">
                                    Use this for: Timeline scrubber max value, progress bars, loop bounds
                                </div>
                            </div>

                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-400 mb-2">num_atoms (integer)</h4>
                                <p className="text-sm text-gray-300">Number of atoms per frame (constant)</p>
                                <div className="mt-2 font-mono text-xs text-gray-400">
                                    Use this for: Memory allocation, instanced mesh count, performance decisions
                                </div>
                            </div>

                            <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-orange-400 mb-2">bounds (object)</h4>
                                <p className="text-sm text-gray-300 mb-2">3D bounding box of the entire system</p>
                                <div className="ml-4 space-y-2">
                                    <div>
                                        <span className="text-orange-400 font-mono text-sm">min</span>
                                        <span className="text-gray-400 text-sm"> - Minimum x, y, z coordinates</span>
                                    </div>
                                    <div>
                                        <span className="text-orange-400 font-mono text-sm">max</span>
                                        <span className="text-gray-400 text-sm"> - Maximum x, y, z coordinates</span>
                                    </div>
                                    <div>
                                        <span className="text-orange-400 font-mono text-sm">center</span>
                                        <span className="text-gray-400 text-sm"> - Center point (for camera positioning)</span>
                                    </div>
                                </div>
                                <div className="mt-3 font-mono text-xs text-gray-400">
                                    Use this for: Camera positioning, scene scaling, frustum culling
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-3">💡 How to Use Metadata</h4>
                            <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400">
                                {`// Set camera to view entire scene
const distance = Math.max(
  metadata.bounds.max.x - metadata.bounds.min.x,
  metadata.bounds.max.y - metadata.bounds.min.y,
  metadata.bounds.max.z - metadata.bounds.min.z
) * 2;

camera.position.set(
  metadata.bounds.center.x + distance,
  metadata.bounds.center.y + distance,
  metadata.bounds.center.z + distance
);`}
                            </div>
                        </div>
                    </div>
                );

            case 'frames':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-cyan-400">Frames Array</h2>

                        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-lg border border-purple-500/30">
                            <h3 className="text-xl font-semibold mb-3 text-purple-300">Structure</h3>
                            <div className="bg-gray-900 p-4 rounded font-mono text-sm">
                                <div className="text-gray-500">"frames": [</div>
                                <div className="ml-4 text-cyan-400">
                                    [ /* Frame 0: Array of {sampleData.metadata.num_atoms} atoms */ ],
                                </div>
                                <div className="ml-4 text-cyan-400">
                                    [ /* Frame 1: Array of {sampleData.metadata.num_atoms} atoms */ ],
                                </div>
                                <div className="ml-4 text-cyan-400">
                                    [ /* Frame 2: Array of {sampleData.metadata.num_atoms} atoms */ ],
                                </div>
                                <div className="ml-4 text-gray-500">...</div>
                                <div className="ml-4 text-cyan-400">
                                    [ /* Frame {sampleData.metadata.num_frames - 1}: Array of {sampleData.metadata.num_atoms} atoms */ ]
                                </div>
                                <div className="text-gray-500">]</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                <div className="text-3xl font-bold text-blue-400 mb-2">
                                    {sampleData.metadata.num_frames}
                                </div>
                                <div className="text-sm text-gray-300">Total Frames</div>
                                <div className="text-xs text-gray-500 mt-2">frames.length</div>
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                <div className="text-3xl font-bold text-purple-400 mb-2">
                                    {sampleData.metadata.num_atoms}
                                </div>
                                <div className="text-sm text-gray-300">Atoms Per Frame</div>
                                <div className="text-xs text-gray-500 mt-2">frames[i].length</div>
                            </div>

                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                                <div className="text-3xl font-bold text-green-400 mb-2">
                                    {sampleData.metadata.num_frames * sampleData.metadata.num_atoms}
                                </div>
                                <div className="text-sm text-gray-300">Total Data Points</div>
                                <div className="text-xs text-gray-500 mt-2">frames × atoms</div>
                            </div>
                        </div>

                        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-3">⚠️ Important Properties</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <span className="text-amber-400">Same atom count</span>: Every frame has exactly {sampleData.metadata.num_atoms} atoms</li>
                                <li>• <span className="text-amber-400">Same atom order</span>: Atom at index 0 in frame 0 is the SAME atom at index 0 in frame 1</li>
                                <li>• <span className="text-amber-400">Only positions change</span>: x, y, z coordinates are different; everything else stays the same</li>
                                <li>• <span className="text-amber-400">Zero-indexed</span>: First frame is frames[0], last is frames[num_frames - 1]</li>
                            </ul>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-3">💡 How to Access Frames</h4>
                            <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 space-y-2">
                                <div>// Get a specific frame</div>
                                <div>const frame5 = data.frames[5];</div>
                                <div></div>
                                <div>// Animate through frames</div>
                                <div>for (let i = 0; i &lt; data.metadata.num_frames; i++) {'{'}</div>
                                <div>{'  '}const currentFrame = data.frames[i];</div>
                                <div>{'  '}renderFrame(currentFrame);</div>
                                <div>{'}'}</div>
                                <div></div>
                                <div>// Loop animation</div>
                                <div>const frameIndex = currentTime % data.metadata.num_frames;</div>
                                <div>const frame = data.frames[frameIndex];</div>
                            </div>
                        </div>
                    </div>
                );

            case 'atoms':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-cyan-400">Atom Objects</h2>

                        <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/30">
                            <div className="font-mono text-sm">
                                <pre className="text-green-400">{JSON.stringify(sampleData.frames[0][0], null, 2)}</pre>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-400 mb-2">x, y, z (floats)</h4>
                                <p className="text-sm text-gray-300 mb-2">3D position coordinates in nanometers</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    x: 0.001, y: -0.014, z: 0.010
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Three.js position (position.set(x, y, z))
                                </p>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-2">element (string)</h4>
                                <p className="text-sm text-gray-300 mb-2">Chemical element symbol</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    "O", "H", "C", "N", "S", "P", etc.
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Identifying atom type, custom coloring, filtering
                                </p>
                            </div>

                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-400 mb-2">name (string)</h4>
                                <p className="text-sm text-gray-300 mb-2">Atom name within residue</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    "O", "H1", "H2", "CA", "CB", etc.
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Tooltips, atom selection, debugging
                                </p>
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-400 mb-2">residue (string)</h4>
                                <p className="text-sm text-gray-300 mb-2">Residue/molecule name</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    "HOH" (water), "ALA", "GLY", "TYR" (amino acids)
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Grouping atoms, filtering by molecule type
                                </p>
                            </div>

                            <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-orange-400 mb-2">chain (string)</h4>
                                <p className="text-sm text-gray-300 mb-2">Protein chain identifier</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    "A", "B", "C", etc.
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Multi-chain proteins, color by chain
                                </p>
                            </div>

                            <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-pink-400 mb-2">color (object)</h4>
                                <p className="text-sm text-gray-300 mb-2">RGB color values (0.0 to 1.0)</p>
                                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-green-400">
                                    {'{ r: 1.0, g: 0.0, b: 0.0 }'} // Red (oxygen)
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    ✅ Use for: Three.js color (new THREE.Color(r, g, b))
                                </p>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-3">💡 Quick Access Patterns</h4>
                            <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400 space-y-3">
                                <div>
                                    <div className="text-gray-400">// Get position of atom 5 in frame 3</div>
                                    <div>const atom = data.frames[3][5];</div>
                                    <div>const pos = {'{ x: atom.x, y: atom.y, z: atom.z }'}</div>
                                </div>
                                <div className="border-t border-gray-700 pt-2"></div>
                                <div>
                                    <div className="text-gray-400">// Get all oxygen atoms in current frame</div>
                                    <div>const oxygens = currentFrame.filter(a =&gt; a.element === 'O');</div>
                                </div>
                                <div className="border-t border-gray-700 pt-2"></div>
                                <div>
                                    <div className="text-gray-400">// Track one atom across all frames</div>
                                    <div>const atomPath = data.frames.map(frame =&gt; frame[10]);</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'usage':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-cyan-400">How to Use in Your App</h2>

                        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 rounded-lg border border-green-500/30">
                            <h3 className="text-xl font-semibold mb-4 text-green-300">React Component Example</h3>
                            <div className="bg-gray-900 p-4 rounded font-mono text-xs overflow-x-auto">
                                <pre className="text-green-400">{`import { useState, useEffect } from 'react';

function MoleculeViewer() {
  const [data, setData] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Load trajectory data
  useEffect(() => {
    fetch('/trajectory.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const atoms = data.frames[currentFrame];
  const { num_frames, num_atoms } = data.metadata;

  return (
    <div>
      <h2>Frame {currentFrame + 1} / {num_frames}</h2>
      <p>{num_atoms} atoms</p>
      
      <input
        type="range"
        min="0"
        max={num_frames - 1}
        value={currentFrame}
        onChange={(e) => setCurrentFrame(Number(e.target.value))}
      />

      {/* Render atoms here */}
    </div>
  );
}`}</pre>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/30">
                            <h3 className="text-xl font-semibold mb-4 text-blue-300">Three.js Integration</h3>
                            <div className="bg-gray-900 p-4 rounded font-mono text-xs overflow-x-auto">
                                <pre className="text-green-400">{`import * as THREE from 'three';

function createAtomMesh(atoms) {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true }),
    atoms.length
  );

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  atoms.forEach((atom, i) => {
    // Set position
    matrix.setPosition(atom.x, atom.y, atom.z);
    instancedMesh.setMatrixAt(i, matrix);

    // Set color
    color.setRGB(atom.color.r, atom.color.g, atom.color.b);
    instancedMesh.setColorAt(i, color);
  });

  return instancedMesh;
}

// Usage
const atoms = trajectoryData.frames[currentFrame];
const mesh = createAtomMesh(atoms);
scene.add(mesh);`}</pre>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-400 mb-3">🎬 Animation Pattern</h4>
                                <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400">
                                    {`let frame = 0;

function animate() {
  frame = (frame + 1) % numFrames;
  
  const atoms = data.frames[frame];
  updateAtomPositions(atoms);
  
  requestAnimationFrame(animate);
}`}
                                </div>
                            </div>

                            <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-orange-400 mb-3">📊 Performance Tip</h4>
                                <div className="bg-gray-900 p-3 rounded font-mono text-xs text-green-400">
                                    {`// Update positions without recreating mesh
atoms.forEach((atom, i) => {
  matrix.setPosition(atom.x, atom.y, atom.z);
  mesh.setMatrixAt(i, matrix);
});
mesh.instanceMatrix.needsUpdate = true;`}
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-400 mb-3">✅ Key Lookups Checklist</h4>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-cyan-300 font-semibold mb-2">For Animation:</p>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• <span className="font-mono text-xs">data.metadata.num_frames</span></li>
                                        <li>• <span className="font-mono text-xs">data.frames[frameIndex]</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-cyan-300 font-semibold mb-2">For Rendering:</p>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• <span className="font-mono text-xs">atom.x, atom.y, atom.z</span></li>
                                        <li>• <span className="font-mono text-xs">atom.color.r, .g, .b</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-cyan-300 font-semibold mb-2">For Camera Setup:</p>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• <span className="font-mono text-xs">data.metadata.bounds</span></li>
                                        <li>• <span className="font-mono text-xs">data.metadata.center</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-cyan-300 font-semibold mb-2">For UI/Info:</p>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• <span className="font-mono text-xs">data.metadata.num_atoms</span></li>
                                        <li>• <span className="font-mono text-xs">atom.element, atom.residue</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-3">🔍 Common Gotchas</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <span className="text-amber-400">Units:</span> Positions are in nanometers (1 nm = 10 Angstroms)</li>
                                <li>• <span className="text-amber-400">Colors:</span> RGB values are 0.0-1.0, not 0-255</li>
                                <li>• <span className="text-amber-400">Frame indexing:</span> Zero-based (0 to num_frames - 1)</li>
                                <li>• <span className="text-amber-400">Atom order:</span> Must be consistent across all frames</li>
                                <li>• <span className="text-amber-400">File size:</span> Large systems = large files (consider pagination)</li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        trajectory.json Explained
                    </h1>
                    <p className="text-xl text-gray-400">
                        Complete guide to the molecular dynamics data structure
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 p-2 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-semibold">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>💡 Use this guide as a reference when building your molecular visualizer</p>
                </div>
            </div>
        </div>
    );
};

export default TrajectoryDataExplainer;