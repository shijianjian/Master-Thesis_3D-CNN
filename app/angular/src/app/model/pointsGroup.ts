import { CameraSettings } from "./camera-settings";

export interface PointsGroup {
    points: number[][];
    camera: CameraSettings;
    result?: string;
}

export interface ClusterSettings {
    points: number[][];
    epsilon: number;
    minPoints: number;
}