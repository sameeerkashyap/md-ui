/**
 * WebGPU Compute Pipeline Setup
 * 
 * This file handles:
 * 1. Loading and compiling the WGSL shader
 * 2. Creating the compute pipeline
 * 3. Running compute passes to update atom positions
 */

/**
 * Create the Atom Update Compute Pipeline
 * 
 * @param device - GPU device from WebGPUContext
 * @param shaderCode - The WGSL compute shader code (from atomUpdate.wgsl)
 */
export async function createAtomUpdatePipeline(
    device: GPUDevice,
    shaderCode: string
): Promise<GPUComputePipeline> {

    // Create shader module from WGSL code
    const shaderModule = device.createShaderModule({
        label: 'Atom Update Shader',
        code: shaderCode,
    });

    // Create the compute pipeline
    const pipeline = device.createComputePipeline({
        label: 'Atom Update Pipeline',
        layout: 'auto',  // Auto-generate layout from shader bindings
        compute: {
            module: shaderModule,
            entryPoint: 'main',  // The function name in your WGSL shader
        },
    });

    return pipeline;
}

/**
 * Run a Compute Pass
 * 
 * This executes the shader on the GPU to update atom positions.
 * 
 * @param device - GPU device
 * @param pipeline - The pipeline from createAtomUpdatePipeline()
 * @param bindGroup - The bind group connecting buffers to shader bindings
 * @param atomCount - Number of atoms to process
 */
export function runComputePass(
    device: GPUDevice,
    pipeline: GPUComputePipeline,
    bindGroup: GPUBindGroup,
    atomCount: number
): void {

    // Create a command encoder
    const commandEncoder = device.createCommandEncoder({
        label: 'Atom Update Commands',
    });

    // Begin a compute pass
    const passEncoder = commandEncoder.beginComputePass({
        label: 'Atom Update Pass',
    });

    // Tell the GPU which shader to run and what data to use
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);  // @group(0) in shader

    // Dispatch workgroups
    // Calculate how many workgroups we need
    // Each workgroup has 64 threads (from @workgroup_size(64))
    const workgroupSize = 64;
    const numWorkgroups = Math.ceil(atomCount / workgroupSize);
    passEncoder.dispatchWorkgroups(numWorkgroups);

    // Example: 10,000 atoms
    // - workgroupSize = 64
    // - numWorkgroups = Math.ceil(10000 / 64) = 157
    // - Total threads = 157 * 64 = 10,048 (extra 48 are skipped in shader)

    passEncoder.end();

    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);
}

/**
 * Create Bind Group
 * 
 * A bind group connects your GPU buffers to the shader's @binding() locations.
 * 
 * TODO: Call this ONCE after creating buffers
 * 
 * @param device - GPU device
 * @param pipeline - The compute pipeline
 * @param inputBuffer - Buffer containing current atom positions
 * @param outputBuffer - Buffer to write updated positions
 */
export function createBindGroup(
    device: GPUDevice,
    pipeline: GPUComputePipeline,
    inputBuffer: GPUBuffer,
    outputBuffer: GPUBuffer
): GPUBindGroup {

    // Get the bind group layout from the pipeline
    const bindGroupLayout = pipeline.getBindGroupLayout(0);  // @group(0)

    // Create the bind group
    const bindGroup = device.createBindGroup({
        label: 'Atom Update Bind Group',
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,  // @binding(0) in shader = atomsIn
                resource: {
                    buffer: inputBuffer,
                },
            },
            {
                binding: 1,  // @binding(1) in shader = atomsOut
                resource: {
                    buffer: outputBuffer,
                },
            },
        ],
    });

    return bindGroup;
}

/**
 * Usage:
 * 
 * // 1. Initialize (once)
 * const shaderCode = await fetch('/shaders/atomUpdate.wgsl').then(r => r.text());
 * const pipeline = await createAtomUpdatePipeline(device, shaderCode);
 * 
 * // 2. Create buffers (once)
 * const atomPositions = new Float32Array([...]); // x, y, z, radius per atom
 * const inputBuffer = createStorageBuffer(device, atomPositions, GPUBufferUsage.STORAGE);
 * const outputBuffer = device.createBuffer({
 *     size: atomPositions.byteLength,
 *     usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,  // Can be used for rendering!
 * });
 * 
 * // 3. Create bind group (once)
 * const bindGroup = createBindGroup(device, pipeline, inputBuffer, outputBuffer);
 * 
 * // 4. Run compute pass (every frame)
 * const animate = () => {
 *     runComputePass(device, pipeline, bindGroup, atomCount);
 *     // outputBuffer now contains updated positions!
 *     // Three.js can render from this buffer directly
 *     requestAnimationFrame(animate);
 * };
 * animate();
 */
