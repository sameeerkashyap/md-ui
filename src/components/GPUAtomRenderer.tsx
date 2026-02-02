/**
 * GPU Atom Renderer
 * 
 * This React component renders atoms using WebGPU compute shaders for performance.
 * It integrates WebGPU with Three.js/React Three Fiber.
 * 
 * ARCHITECTURE:
 * 1. Initialize WebGPU context (once on mount)
 * 2. Create GPU buffers from atom data (once)
 * 3. Create compute pipeline and bind group (once)
 * 4. Every frame:
 *    a. Run compute shader to update positions
 *    b. Three.js renders from GPU buffer (no CPU-GPU transfer!)
 */

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Atom } from '../types/simulation';
import { initWebGPU, createStorageBuffer, WebGPUContextResult, checkWebGPUSupport } from '../gpu/WebGpuContext';
import { createAtomUpdatePipeline, createBindGroup, runComputePass } from '../gpu/computePipeline';

interface GPUAtomRendererProps {
    atoms: Atom[];
    selectedChain: string | null;
    onSelect: (chainId: string) => void;
    onDeselect: () => void;
    enabled?: boolean;  // Toggle between GPU and CPU rendering
}

export default function GPUAtomRenderer({
    atoms,
    selectedChain,
    onSelect,
    onDeselect,
    enabled = true
}: GPUAtomRendererProps) {

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    // GPU context (device, adapter)
    // TODO: Initialize this in useEffect
    const [gpuContext, setGpuContext] = useState<WebGPUContextResult | null>(null);

    // GPU pipeline and bind group
    const pipelineRef = useRef<GPUComputePipeline | null>(null);
    const bindGroupRef = useRef<GPUBindGroup | null>(null);

    // GPU buffers (stay on GPU, never copied to CPU)
    const inputBufferRef = useRef<GPUBuffer | null>(null);
    const outputBufferRef = useRef<GPUBuffer | null>(null);

    // Three.js instanced mesh
    const meshRef = useRef<THREE.InstancedMesh | null>(null);

    // ========================================================================
    // STEP 1: Initialize WebGPU (runs once on component mount)
    // ========================================================================

    useEffect(() => {
        // TODO: Add async initialization
        async function init() {
            if (!checkWebGPUSupport()) {
                console.warn('WebGPU not supported, falling back to CPU rendering');
                return;
            }

            const context = await initWebGPU();
            if (!context) {
                console.error('Failed to initialize WebGPU');
                return;
            }
            setGpuContext(context);
        }

        if (enabled) {
            init();
        }

        // Cleanup on unmount
        return () => {
            // TODO: Destroy GPU buffers to prevent memory leaks
            inputBufferRef.current?.destroy();
            outputBufferRef.current?.destroy();
        };
    }, [enabled]);

    // ========================================================================
    // STEP 2: Create GPU Buffers (runs when atoms or GPU context changes)
    // ========================================================================

    useEffect(() => {
        if (!gpuContext || !atoms.length) return;

        // TODO: Convert atom data to Float32Array
        // Format: [x, y, z, radius, x, y, z, radius, ...]
        // 4 floats per atom
        const atomData = new Float32Array(atoms.length * 4);
        atoms.forEach((atom, i) => {
            atomData[i * 4 + 0] = atom.x;
            atomData[i * 4 + 1] = atom.y;
            atomData[i * 4 + 2] = atom.z;
            atomData[i * 4 + 3] = 1.0;  // radius (could use atom type for different sizes)
        });

        // TODO: Create input buffer (initial positions)
        inputBufferRef.current = createStorageBuffer(
            gpuContext.device,
            atomData,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        );

        // TODO: Create output buffer (updated positions)
        // This buffer is used for BOTH compute shader write AND Three.js rendering
        outputBufferRef.current = gpuContext.device.createBuffer({
            size: atomData.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: false,
        });

    }, [gpuContext, atoms]);

    // ========================================================================
    // STEP 3: Create Compute Pipeline (runs once after buffers are created)
    // ========================================================================

    useEffect(() => {
        if (!gpuContext || !inputBufferRef.current || !outputBufferRef.current) return;

        async function setupPipeline() {
            if (!gpuContext) return;

            try {
                // TODO: Load shader code
                // Option 1: Import as string (requires Vite raw plugin)
                // import shaderCode from './shaders/atomUpdate.wgsl?raw';

                // Option 2: Fetch at runtime
                const response = await fetch('/shaders/atomUpdate.wgsl');
                const shaderCode = await response.text();

                // TODO: For now, use inline shader for testing
                // const shaderCode = `
                //     @group(0) @binding(0) var<storage, read> atomsIn: array<vec4<f32>>;
                //     @group(0) @binding(1) var<storage, read_write> atomsOut: array<vec4<f32>>;

                //     @compute @workgroup_size(64)
                //     fn main(@builtin(global_invocation_id) id: vec3<u32>) {
                //         let atomIndex = id.x;
                //         if (atomIndex >= arrayLength(&atomsIn)) {
                //             return;
                //         }
                //         // Simple pass-through for testing
                //         atomsOut[atomIndex] = atomsIn[atomIndex];
                //     }
                // `;

                // TODO: Create pipeline
                const pipeline = await createAtomUpdatePipeline(
                    gpuContext.device,
                    shaderCode
                );
                pipelineRef.current = pipeline;

                // TODO: Create bind group
                const bindGroup = createBindGroup(
                    gpuContext.device,
                    pipeline,
                    inputBufferRef.current!,
                    outputBufferRef.current!
                );
                bindGroupRef.current = bindGroup;

            } catch (error) {
                console.error('Failed to create compute pipeline:', error);
            }
        }

        setupPipeline();
    }, [gpuContext, atoms]);

    // ========================================================================
    // STEP 4: Animation Loop (runs every frame)
    // ========================================================================

    useFrame((state, delta) => {
        if (!gpuContext || !pipelineRef.current || !bindGroupRef.current) return;

        // TODO: Run compute shader
        runComputePass(
            gpuContext.device,
            pipelineRef.current,
            bindGroupRef.current,
            atoms.length
        );

        // TODO: Update Three.js mesh from GPU buffer
        // The tricky part: We need to map the GPU buffer to Three.js
        // This requires reading the GPU buffer back to CPU (temporary limitation)
        // In the future, Three.js WebGPU renderer can use the buffer directly

        // For now, we'll use a hybrid approach:
        // 1. Compute shader updates positions
        // 2. Read back to CPU (once per frame)
        // 3. Update Three.js instance matrix

        // TODO: Read back GPU buffer (temporary workaround)
        async function updateMesh() {
            if (!meshRef.current || !outputBufferRef.current) return;

            // Create a staging buffer for readback
            const stagingBuffer = gpuContext!.device.createBuffer({
                size: atoms.length * 4 * 4,  // 4 floats * 4 bytes
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });

            // Copy GPU buffer to staging buffer
            const commandEncoder = gpuContext!.device.createCommandEncoder();
            commandEncoder?.copyBufferToBuffer(
                outputBufferRef.current, 0,
                stagingBuffer ?? 0, 0,
                atoms.length * 4 * 4
            );
            gpuContext!.device.queue.submit([commandEncoder.finish()]);

            // Map and read
            await stagingBuffer.mapAsync(GPUMapMode.READ);
            const data = new Float32Array(stagingBuffer.getMappedRange());

            // Update Three.js instance matrix
            const matrix = new THREE.Matrix4();
            for (let i = 0; i < atoms.length; i++) {
                const x = data[i * 4 + 0];
                const y = data[i * 4 + 1];
                const z = data[i * 4 + 2];
                matrix.setPosition(x, y, z);
                meshRef.current.setMatrixAt(i, matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;

            stagingBuffer.unmap();
            stagingBuffer.destroy();
        }
        updateMesh();
    });

    // ========================================================================
    // RENDERING
    // ========================================================================

    // If GPU not ready, show nothing (or fallback to BackboneView)
    if (!gpuContext) {
        return null;
    }

    // Group atoms by chain (same as BackboneView)
    const chains: { [chainId: string]: Atom[] } = {};
    atoms.forEach(atom => {
        if (atom.name === 'CA') {  // Only alpha carbons for backbone
            if (!chains[atom.chain]) {
                chains[atom.chain] = [];
            }
            chains[atom.chain].push(atom);
        }
    });

    return (
        <group>
            {/* Invisible background plane for click-to-deselect */}
            <mesh
                position={[0, 0, -50]}
                onClick={(e) => {
                    e.stopPropagation();
                    onDeselect();
                }}
            >
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {Object.entries(chains).map(([chainId, chainAtoms]) => {
                const points = chainAtoms.map(a => new THREE.Vector3(a.x, a.y, a.z));

                // Generate chain color dynamically (import generateChainColor if needed)
                const color = `hsl(${(chainId.charCodeAt(0) * 137.508) % 360}, 70%, 60%)`;

                const isSelected = selectedChain === chainId;
                const isDimmed = selectedChain !== null && selectedChain !== chainId;

                return (
                    <group
                        key={chainId}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent background click
                            onSelect(chainId);
                        }}
                    >
                        {/* Backbone Line - using drei Line component */}
                        <Line
                            points={points}
                            color={color}
                            lineWidth={isSelected ? 5 : 1}
                            opacity={isDimmed ? 0.05 : 1}
                            transparent={true}
                            dashed={false}
                        />

                        {/* Alpha Carbon Spheres */}
                        {chainAtoms.map((atom, i) => (
                            <mesh key={i} position={[atom.x, atom.y, atom.z]}>
                                <sphereGeometry args={[0.3, 8, 8]} />
                                <meshStandardMaterial
                                    color={color}
                                    opacity={isDimmed ? 0.1 : 1.0}
                                    transparent={true}
                                    emissive={isSelected ? color : '#7b7979ff'}
                                    emissiveIntensity={isSelected ? 0.1 : 0}
                                />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
}

/**
 * INTEGRATION GUIDE:
 * 
 * 1. In MolecularView.tsx, add a toggle:
 * 
 *    const useGPU = atomCount > 50000;  // Use GPU for large proteins
 * 
 *    {useGPU ? (
 *        <GPUAtomRenderer atoms={atoms} />
 *    ) : (
 *        <BackboneView atoms={atoms} />
 *    )}
 * 
 * 2. Test with small protein first (1BQ0, ~1000 atoms)
 *    - Should work identical to BackboneView
 *    - Verify no errors in console
 * 
 * 3. Test with large protein (1AON, ~50000 atoms)
 *    - Should see FPS improvement
 *    - GPU DevTools (Chrome) shows compute shader running
 * 
 * 4. Profile performance:
 *    - Chrome DevTools > Performance > Record
 *    - Look for GPU activity instead of JavaScript
 */
