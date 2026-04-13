export interface Floor {
  id: string;
  venueId: string;
  levelNumber: number;
  name: string;
  assetBundleUrl: string;
}

export interface POI {
  id: string;
  floorId: string;
  name: string;
  category: string;
  x: number;
  y: number;
  z: number;
}
