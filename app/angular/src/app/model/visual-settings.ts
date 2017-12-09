
export interface PointsSettings {
    points: number[][];
    camera: VoxelPointsViews;
    result?: string;
}

export interface VoxelPointsViews {
    pointcloud: VisualSettings;
    voxelgrid: VisualSettings;
}

export interface CameraParams {
    position_x: number;
    position_y: number;
    position_z: number;
    look_x: number;
    look_y: number;
    look_z: number;
}

export interface VisualSettings {
    CAMERA_X?: number;
    CAMERA_Y?: number;
    CAMERA_Z?: number;
  
    LOOK_X?: number;
    LOOK_Y?: number;
    LOOK_Z?: number;
  
    POINTS_X?;
    POINTS_Y?;
    POINTS_Z?;
  
    R?;
    G?;
    B?;
  
    S_x?;
    S_y?;
    S_z?;
  
    N_VOXELS?;
    AXIS_SIZE?;
  
    FILENAME?: string;
    POINT_SIZE?: number;
}