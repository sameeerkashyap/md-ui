import { RGBColor } from "../types/simulation";

/**
 * Converts an RGBColor object (where r, g, b are 0-1) to an HTML hex string (e.g. "#FF0000").
 * 
 * @param color The RGBColor object with 0-1 normalized values
 * @returns A hex string like "#abcdef"
 */
export function rgbToHex(color: RGBColor): string {
    // If the color object is missing, default to white
    if (!color) return '#ffffff';

    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    // Convert to hex and pad with zeros if needed
    const toHex = (n: number) => {
        const hex = Math.max(0, Math.min(255, n)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
