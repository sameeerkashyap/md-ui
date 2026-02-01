import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Center } from "@react-three/drei";
import BackboneView from "./BackboneView";
import { TrajectoryData } from "../types/simulation";


export default function MolecularView({ trajectory, currentFrame }: { trajectory: TrajectoryData, currentFrame: number }) {
    const atoms = trajectory?.frames?.[currentFrame];

    if (!atoms) return <div className="absolute inset-0 flex items-center justify-center text-white/50">No Data</div>;

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
                <color attach="background" args={['#FFFF']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Center>
                    <BackboneView atoms={atoms} />
                    {/* Optional: Keep partial ghost cloud if requested, but for now we replace it for clarity */}
                    {/* <AtomInstances atoms={atoms} /> */}
                </Center>
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    )
}
