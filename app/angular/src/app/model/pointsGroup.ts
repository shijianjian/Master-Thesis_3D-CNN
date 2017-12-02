import { CameraSettings } from "./camera-settings";

export interface PointsGroup {
    points: number[][];
    camera: CameraSettings;
    result?: string;
}