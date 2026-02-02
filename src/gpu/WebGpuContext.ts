/**
 * WebGPU Context Manager
 * 
 * This file handles WebGPU initialization and buffer management.
 * It provides utilities to set up the GPU and create buffers for molecular data.
 */

export interface WebGPUContextResult {
    device: GPUDevice;
    adapter: GPUAdapter;
    canvas?: HTMLCanvasElement;
}

/**
 * Initialize WebGPU
 * 
 */
export async function initWebGPU(): Promise<WebGPUContextResult | null> {
    // STEP 1: Check if WebGPU is available in the browser
    // TODO: Add this check:
    if (!navigator.gpu) {
        console.warn('WebGPU not supported in this browser');
        return null;
    }

    // STEP 2: Request a GPU adapter (represents the physical GPU)
    // TODO: Add this code:
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error('Failed to get GPU adapter');
        return null;
    }

    // STEP 3: Request a GPU device (the logical connection to GPU)
    // TODO: Add this code:
    const device = await adapter.requestDevice();

    // STEP 4: Set up error handling
    // TODO: Add this code:
    device.lost.then((info) => {
        console.error(`WebGPU device lost: ${info.message}`);
        // Handle graceful degradation to WebGL here
    });

    // STEP 5: Return the context
    // TODO: Add this return:
    return { device, adapter };

    // throw new Error('Not implemented - remove this line and uncomment TODOs above');
}

/**
 * Check WebGPU Support
 * 
 * TODO: Call this BEFORE trying to use WebGPU to show appropriate UI
 */
export function checkWebGPUSupport(): boolean {
    // STEP 1: Check if navigator.gpu exists
    // TODO: Add this check:
    return 'gpu' in navigator;

    // throw new Error('Not implemented - remove this line and uncomment TODO above');
}

/**
 * Create a GPU Storage Buffer
 * 
 * This is a helper function to create buffers that will hold atom data on the GPU.
 * 
 * TODO: Call this when uploading atom positions/colors to GPU
 * 
 * @param device - The GPU device from initWebGPU()
 * @param data - Float32Array containing atom data (positions, colors, etc.)
 * @param usage - Buffer usage flags (e.g., STORAGE | COPY_DST)
 */
export function createStorageBuffer(
    device: GPUDevice,
    data: Float32Array,
    usage: GPUBufferUsageFlags
): GPUBuffer {
    const size = data.byteLength;
    const buffer = device.createBuffer({
        size: size,
        usage: usage,
        mappedAtCreation: true
    })

    const mappedRange = buffer.getMappedRange();
    new Float32Array(mappedRange).set(data);
    buffer.unmap();

    return buffer;

    // throw new Error('Not implemented - remove this line and uncomment TODOs above');
}

/**
 * Helper: Create a read-only uniform buffer
 * 
 * Uniform buffers hold small amounts of data that don't change per-instance
 * (e.g., camera position, frame time, interpolation factor)
 * 
 * TODO: Use this for shader uniforms like:
 * - Current frame index
 * - Interpolation time (for smooth animation)
 * - Camera position (for LOD calculations)
 */
export function createUniformBuffer(
    device: GPUDevice,
    data: Float32Array
): GPUBuffer {
    // TODO: Similar to createStorageBuffer but with UNIFORM usage flag
    // const buffer = device.createBuffer({
    //     size: data.byteLength,
    //     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    //     mappedAtCreation: true,
    // });
    // new Float32Array(buffer.getMappedRange()).set(data);
    // buffer.unmap();
    // return buffer;

    throw new Error('Not implemented');
}

/**
 * Usage Example:
 * 
 * // In your MolecularView.tsx or a custom hook:
 * 
 * const [gpuContext, setGpuContext] = useState<WebGPUContextResult | null>(null);
 * 
 * useEffect(() => {
 *     async function setupGPU() {
 *         if (checkWebGPUSupport()) {
 *             const context = await initWebGPU();
 *             setGpuContext(context);
 *         } else {
 *             console.warn('WebGPU not supported, using WebGL fallback');
 *         }
 *     }
 *     setupGPU();
 * }, []);
 * 
 * // Later, when you have atom data:
 * if (gpuContext) {
 *     const atomPositions = new Float32Array([...]); // x, y, z for each atom
 *     const positionBuffer = createStorageBuffer(
 *         gpuContext.device,
 *         atomPositions,
 *         GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
 *     );
 * }
 */
