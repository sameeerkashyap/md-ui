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
 * TODO: Call this ONCE during initialization (after initWebGPU)
 * 
 * @param device - GPU device from WebGPUContext
 * @param shaderCode - The WGSL compute shader code (from atomUpdate.wgsl)
 */
export async function createAtomUpdatePipeline(
    device: GPUDevice,
    shaderCode: string
): Promise<GPUComputePipeline> {

    // ========================================================================
    // STEP 1: Create shader module from WGSL code
    // ========================================================================
    // This compiles your shader and checks for syntax errors
    const shaderModule = device.createShaderModule({
        label: 'Atom Update Shader',
        code: shaderCode,
    });

    // ========================================================================
    // STEP 2: Create the compute pipeline
    // ========================================================================
    // This tells the GPU how to run your compute shader
    const pipeline = device.createComputePipeline({
        label: 'Atom Update Pipeline',
        layout: 'auto',  // Auto-generate layout from shader bindings
        compute: {
            module: shaderModule,
            entryPoint: 'main',  // The function name in your WGSL shader
        },
    });

    // ========================================================================
    // STEP 3: Return the pipeline
    // ========================================================================
    // You'll use this pipeline object in runComputePass()
    return pipeline;
}

/**
 * Run a Compute Pass
 * 
 * This executes the shader on the GPU to update atom positions.
 * 
 * TODO: Call this EVERY FRAME (in your React component's animation loop)
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

    // ========================================================================
    // STEP 1: Create a command encoder
    // ========================================================================
    // This records GPU commands (like a recording buffer)
    const commandEncoder = device.createCommandEncoder({
        label: 'Atom Update Commands',
    });

    // ========================================================================
    // STEP 2: Begin a compute pass
    // ========================================================================
    // A "pass" is a single execution of the shader
    const passEncoder = commandEncoder.beginComputePass({
        label: 'Atom Update Pass',
    });

    // ========================================================================
    // STEP 3: Set the pipeline and bind group
    // ========================================================================
    // Tell the GPU which shader to run and what data to use
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);  // @group(0) in shader

    // ========================================================================
    // STEP 4: Dispatch workgroups
    // ========================================================================
    // Calculate how many workgroups we need
    // Each workgroup has 64 threads (from @workgroup_size(64))
    const workgroupSize = 64;
    const numWorkgroups = Math.ceil(atomCount / workgroupSize);
    passEncoder.dispatchWorkgroups(numWorkgroups);

    // Example: 10,000 atoms
    // - workgroupSize = 64
    // - numWorkgroups = Math.ceil(10000 / 64) = 157
    // - Total threads = 157 * 64 = 10,048 (extra 48 are skipped in shader)

    // ========================================================================
    // STEP 5: End the pass
    // ========================================================================
    passEncoder.end();

    // ========================================================================
    // STEP 6: Submit commands to GPU
    // ========================================================================
    // This actually executes the shader on the GPU
    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);

    // The updated positions are now in the atomsOut buffer on the GPU!
    // No need to read back to CPU - Three.js will use them directly
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

    // ========================================================================
    // STEP 1: Get the bind group layout from the pipeline
    // ========================================================================
    // The layout defines what buffers are expected
    const bindGroupLayout = pipeline.getBindGroupLayout(0);  // @group(0)

    // ========================================================================
    // STEP 2: Create the bind group
    // ========================================================================
    // This maps your actual buffers to the shader bindings
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
            // TODO: Add more bindings if you have uniforms or next frame buffer
        ],
    });

    // ========================================================================
    // STEP 3: Return the bind group
    // ========================================================================
    return bindGroup;
}

/**
 * Usage Example:
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
