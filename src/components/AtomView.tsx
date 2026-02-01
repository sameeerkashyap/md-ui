
import { InstancedBufferAttribute, InstancedMesh, Object3D, Color } from "three";
import { useMemo, useRef, useLayoutEffect } from "react";
import { Atom } from "../types/simulation";

import { rgbToHex } from "../utils/colors";


const AtomInstances = ({ atoms }: { atoms: Atom[] }) => {
    // ... existing AtomInstances code ...
    const meshRef = useRef<InstancedMesh>(null);
    const dummy = useMemo(() => new Object3D(), []);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Log the first atom as requested
        if (atoms.length > 0) {
            console.log("First Atom Data:", atoms[0]);
        }


        atoms.forEach((atom, i) => {
            // Set Position
            dummy.position.set(atom.x, atom.y, atom.z);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);

            // Set Color
            // Use accurate color from data if available, otherwise fallback to element map
            let hexColor = '#FF00FF'; // Default magenta

            if (atom.color) {
                hexColor = rgbToHex(atom.color);
            } else {
                const colorMap: { [key: string]: string } = {
                    'C': '#909090',  // Carbon: Gray
                    'O': '#FF0D0D',  // Oxygen: Red
                    'N': '#3050F8',  // Nitrogen: Blue
                    'H': '#FFFFFF',  // Hydrogen: White
                    'S': '#FFFF30',  // Sulfur: Yellow
                };
                hexColor = colorMap[atom.element] || '#FF00FF';
            }

            const tempColor = new Color(hexColor);
            meshRef.current!.setColorAt(i, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [atoms, dummy]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, atoms.length]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial />
        </instancedMesh>
    );
}
