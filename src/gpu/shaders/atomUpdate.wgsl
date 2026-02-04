/**
 * Atom Update Compute Shader (WGSL)
 * 
 * This shader runs on the GPU and updates atom positions in parallel.
 * Each GPU thread processes ONE atom.
 * 
 * For 100,000 atoms, this runs 100,000 threads simultaneously!
 */

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// These connect to the buffers in TypeScript

// Binding 0: Input atom positions (read-only)
// Each vec4 contains: (x, y, z, radius)
@group(0) @binding(0) 
var<storage, read> atomsIn: array<vec4<f32>>;

// Binding 1: Output atom positions (write)
// The shader will write updated positions here
@group(0) @binding(1) 
var<storage, read_write> atomsOut: array<vec4<f32>>;

// Binding 2: Uniforms (optional - for interpolation/animation)
// Contains global parameters like:
// - interpolationFactor (0.0 to 1.0 for smooth frame transitions)
// - currentTime (for animations)
// TODO: Uncomment this when you need animation:
// struct Uniforms {
//     interpolationFactor: f32,
//     currentTime: f32,
//     padding: vec2<f32>,  // Align to 16 bytes
// }
// @group(0) @binding(2) 
// var<uniform> uniforms: Uniforms;

// Binding 3: Next frame positions (for trajectory interpolation)
// TODO: Uncomment this when implementing trajectory playback:
// @group(0) @binding(3) 
// var<storage, read> atomsNextFrame: array<vec4<f32>>;


// ============================================================================
// COMPUTE SHADER MAIN FUNCTION
// ============================================================================

// @workgroup_size(64) means each workgroup has 64 threads
// For 10,000 atoms: ceil(10000 / 64) = 157 workgroups
// GPU runs all 157 workgroups in parallel!
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    
    // Get the atom index for this thread
    let atomIndex = id.x;
    
    // Bounds check (prevent out-of-bounds access)
    if atomIndex >= arrayLength(&atomsIn) {
        return;  // Exit early for extra threads
    }
    
    // Read the input atom data
    let currentPosition = atomsIn[atomIndex];
    
    // Simple pass-through (no transformation for now)
    atomsOut[atomIndex] = currentPosition;
    
    // The atomsOut buffer is directly used by Three.js for rendering!
}