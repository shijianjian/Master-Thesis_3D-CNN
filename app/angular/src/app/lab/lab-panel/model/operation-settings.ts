import { PointCloudCalculations } from "../../../common/camera/util/pointcloud-loader";

export interface ConvSettings {
    kernel: number[][][];
    stride: number;
    padding: string;
}

export interface PoolingSettings {
    size: PointCloudCalculations.GridSize;
    stride: number;
    padding: string;
}
