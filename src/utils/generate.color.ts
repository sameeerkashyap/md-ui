export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;  // hash * 31 + char
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}



export function generateChainColor(chainID: string): string {

    const hash = hashString(chainID);

    const hue = (hash * 137.508) % 360;

    const saturation = 70;  // Vibrant but not oversaturated
    const lightness = 60;   // Readable on dark backgrounds
    //   
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;


}