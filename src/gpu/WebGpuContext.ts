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
    if (!navigator.gpu) {
        console.warn('WebGPU not supported in this browser');
        return null;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error('Failed to get GPU adapter');
        return null;
    }

    const device = await adapter.requestDevice();
    device.lost.then((info) => {
        console.error(`WebGPU device lost: ${info.message}`);
    });

    return { device, adapter };
}

export function checkWebGPUSupport(): boolean {
    return 'gpu' in navigator;
}

/**
 * Create a GPU Storage Buffer
 * 
 * This is a helper function to create buffers that will hold atom data on the GPU.
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
