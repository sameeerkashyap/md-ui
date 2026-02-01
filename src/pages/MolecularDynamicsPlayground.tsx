import { useState, useEffect } from 'react';
import MolecularView from '../components/MolecularView';
import Controls from '../components/Controls';
import FileUploader from '../components/FileUploader';
import { TrajectoryData } from '../types/simulation';
import defaultTrajectoryData from '../data/4HHB_animated.json';

const defaultTrajectory = defaultTrajectoryData as unknown as TrajectoryData;

export default function MolecularDynamicsPlayground() {
    const [trajectory, setTrajectory] = useState<TrajectoryData>(defaultTrajectory);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const totalFrames = trajectory.frames?.length || 0; // Safe access

    useEffect(() => {
        setCurrentFrame(0);
        setIsPlaying(true);
    }, [trajectory]);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentFrame((prev) => (prev + 1) % totalFrames);
            }, 50); // 20 FPS roughly
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalFrames]);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <FileUploader
                onDataLoaded={setTrajectory}
                onUploadStart={() => setIsLoading(true)}
                onUploadEnd={() => setIsLoading(false)}
            />

            {isLoading && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Processing PDB...</h2>
                        <p className="text-white/60">Parsing atomic structure</p>
                    </div>
                </div>
            )}

            <MolecularView trajectory={trajectory} currentFrame={currentFrame} />
            <Controls
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentFrame={currentFrame}
                totalFrames={totalFrames}
                onFrameChange={setCurrentFrame}
            />
        </div>
    );
}
