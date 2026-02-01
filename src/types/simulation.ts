export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface Atom {
  x: number;
  y: number;
  z: number;
  element: string;
  name: string;
  residue: string;
  chain: string;
  residue_index?: number;
  color: RGBColor;
}

export interface SimulationBounds {
  min: Coordinates;
  max: Coordinates;
  center: Coordinates;
}

export interface SimulationMetadata {
  source: string;
  title: string;
  num_frames: number;
  num_atoms: number;
  bounds: SimulationBounds;
}

export interface TrajectoryData {
  metadata: SimulationMetadata;
  frames: Atom[][];
}
