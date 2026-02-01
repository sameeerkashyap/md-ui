import React from 'react';

const Controls = ({ 
    isPlaying, 
    setIsPlaying, 
    currentFrame, 
    totalFrames, 
    onFrameChange 
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 flex items-center gap-6 shadow-2xl z-10 w-[90%] max-w-2xl">
            
            {/* Play/Pause Button */}
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                    isPlaying 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                }`}
            >
                {isPlaying ? (
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                    <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>

            {/* Slider and Info */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
                    <span>Frame Timeline</span>
                    <span>{currentFrame} / {totalFrames - 1}</span>
                </div>
                
                <input
                    type="range"
                    min="0"
                    max={totalFrames - 1}
                    value={currentFrame}
                    onChange={(e) => onFrameChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            {/* Frame Counter Badge */}
            <div className="hidden sm:flex flex-col items-end border-l border-gray-700 pl-4">
                <span className="text-2xl font-bold text-white font-mono leading-none">
                    {String(currentFrame).padStart(3, '0')}
                </span>
                <span className="text-[10px] text-gray-500 uppercase mt-1">Step</span>
            </div>
        </div>
    );
};

export default Controls;
