import os
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from pyntcloud import PyntCloud

from cnn.util.process_pointcloud import find_ranges

def plot_voxel_points(voxelgrid, point_cloud, output_name=None, cmap="Oranges", axis=True):
    """
    Plot voxel grid and point cloud together,
    Mainly used for object detection

    Can be used separatly either. Just set another one as None.
    """
    if voxelgrid is not None:
        # For Voxel Grid
        scaled_shape = voxelgrid.shape

        vector = voxelgrid
        points = np.argwhere(vector)

        s_m = plt.cm.ScalarMappable(cmap=cmap)
        rgb = s_m.to_rgba(vector.reshape(-1)[vector.reshape(-1) > 0])

        camera_position = points.max(0) + abs(points.max(0))

        look = points.mean(0)

        if axis:
            axis_size = points.ptp() * 1.5
        else:
            axis_size = 0
    
    if point_cloud is not None:
        # For point cloud
        filename = 'pyntcloud_plot'
        
        path = os.path.join(os.getcwd(), filename + ".pts")
        # Fit point cloud into Voxel Grid
        (x_min, x_max), (y_min, y_max), (z_min, z_max) = find_ranges(point_cloud)
        new_point_cloud = np.empty(point_cloud.shape)
        for idx, row in enumerate(point_cloud):
            _r = np.empty(row.shape)
            _r[0] = (row[0] - x_min)/(x_max - x_min)*scaled_shape[0]
            _r[1] = (row[1] - y_min)/(y_max - y_min)*scaled_shape[1]
            _r[2] = (row[2] - z_min)/(z_max - z_min)*scaled_shape[2]
            new_point_cloud[idx] = _r
        point_cloud = new_point_cloud
        
        # Orange by default
        colors = np.repeat([[255, 125, 0]], point_cloud.shape[0], axis=0)
        colors = colors.astype(np.uint8)
        points_df = pd.DataFrame(point_cloud, columns=["x", "y", "z"])
        for n, i in enumerate(["red", "green", "blue"]):
            points_df[i] = colors[:, n]

        cloud = PyntCloud(points_df)
        cloud.to_file("{}.ply".format(filename), also_save=["mesh"])
        
        if voxelgrid is None:
            camera_position = (point_cloud.max(0) + abs(point_cloud.max(0))).tolist()
            look = cloud.xyz.mean(0).tolist()

    placeholders = {}

    placeholders["POINTS_X"] = points[:, 0].tolist()
    placeholders["POINTS_Y"] = points[:, 1].tolist()
    placeholders["POINTS_Z"] = points[:, 2].tolist()

    placeholders["R"] = rgb[:, 0].tolist()
    placeholders["G"] = rgb[:, 1].tolist()
    placeholders["B"] = rgb[:, 2].tolist()

    placeholders["S_x"] = 1
    placeholders["S_y"] = 1
    placeholders["S_z"] = 1

    placeholders["CAMERA_X"] = camera_position[0]
    placeholders["CAMERA_Y"] = camera_position[1]
    placeholders["CAMERA_Z"] = camera_position[2]

    placeholders["LOOK_X"] = look[0]
    placeholders["LOOK_Y"] = look[1]
    placeholders["LOOK_Z"] = look[2]

    placeholders["AXIS_SIZE"] = axis_size

    placeholders["N_VOXELS"] = sum(vector.reshape(-1) > 0)

    placeholders["FILENAME"] = "\"" + filename + "\""
    placeholders["POINT_SIZE"] = 0.001

    if output_name is None:
        output_name = "plotVG.html"

    return placeholders
