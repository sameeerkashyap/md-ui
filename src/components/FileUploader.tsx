import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parsePDB } from '../utils/pdbParser';
import { TrajectoryData } from '../types/simulation';

interface FileUploaderProps {
    onDataLoaded: (data: TrajectoryData) => void;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

export default function FileUploader({ onDataLoaded, onUploadStart, onUploadEnd }: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            if (onUploadStart) onUploadStart();

            const reader = new FileReader();

            reader.onabort = () => { console.log('file reading was aborted'); if (onUploadEnd) onUploadEnd(); };
            reader.onerror = () => { console.log('file reading has failed'); if (onUploadEnd) onUploadEnd(); };
            reader.onload = () => {
                const textStr = reader.result as string;
                console.log(`Analyzing ${file.name}...`);

                // Small timeout to allow UI to render the loading state before blocking
                setTimeout(() => {
                    try {
                        const data = parsePDB(textStr, file.name);
                        console.log("Parsed Data:", data);
                        onDataLoaded(data);
                    } catch (e) {
                        console.error("Failed to parse PDB:", e);
                        alert("Failed to parse PDB file. Check format.");
                    } finally {
                        if (onUploadEnd) onUploadEnd();
                    }
                }, 100);
            };
            reader.readAsText(file);
        });
    }, [onDataLoaded, onUploadStart, onUploadEnd]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'chemical/x-pdb': ['.pdb'] } });

    return (
        <div className="absolute top-4 left-4 z-50 w-64">
            <div
                {...getRootProps()}
                className={`
                    p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer backdrop-blur-md
                    ${isDragActive ? 'border-emerald-400 bg-emerald-900/30' : 'border-white/20 bg-black/40 hover:border-white/50'}
                `}
            >
                <input {...getInputProps()} />
                <div className="text-center text-white/80 font-medium text-sm">
                    {isDragActive ? (
                        <p className="text-emerald-300">Drop PDB here...</p>
                    ) : (
                        <div>
                            <p>📂 Drop PDB File</p>
                            <p className="text-xs text-white/40 mt-1">Visualize new protein</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
