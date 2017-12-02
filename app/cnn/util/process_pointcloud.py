"""
Point cloud data processing
"""
import numpy as np

def find_ranges(point_cloud):
    """
    Find min, max value for each aixs.
    """
    x_max = x_min = point_cloud[0][0]
    y_max = y_min = point_cloud[0][1]
    z_max = z_min = point_cloud[0][2]
  
    for ind, coor in enumerate(point_cloud):
        if coor[0] > x_max:
            x_max = coor[0]
        if coor[0] < x_min:
            x_min = coor[0]
        if coor[1] > y_max:
            y_max = coor[1]
        if coor[1] < y_min:
            y_min = coor[1]
        if coor[2] > z_max:
            z_max = coor[2]
        if coor[2] < z_min:
            z_min = coor[2]
            
    return ((x_min, x_max), (y_min, y_max), (z_min, z_max))


def segment_points(point_cloud, target_ranges):
    """
    Extract points in provided area.

    Recives orig point cloud data and a tuple of boundary tuples like:
        ((x_min, x_max), (y_min, y_max), (z_min, z_max))
    """
    
    target_x_range, target_y_range, target_z_range = target_ranges[0], target_ranges[1], target_ranges[2]
    
    points = []
    for ind, coor in enumerate(point_cloud):

        if coor[0] >= target_x_range[0] and coor[0] <= target_x_range[1]:
            if coor[1] >= target_y_range[0] and coor[1] <= target_y_range[1]:
                if coor[2] >= target_z_range[0] and coor[2] <= target_z_range[1]:
                    points.append(coor)
                    
    return points


def norm_point(point_cloud):
    """
    Normalize point cloud coordinates to (0,1)
    """
    ((x_min, x_max), (y_min, y_max), (z_min, z_max)) = find_ranges(point_cloud)
    
    biggest_value = np.max(np.asarray([x_max - x_min, y_max - y_min, z_max - z_min])) + 0.000000001

    normalized_points = []
    for ind, coor in enumerate(point_cloud):
        row = np.empty(len(coor))
        row[0] = (coor[0] - x_min)/biggest_value
        row[1] = (coor[1] - y_min)/biggest_value
        row[2] = (coor[2] - z_min)/biggest_value
        normalized_points.append(row.tolist())
        
    return normalized_points


def voxelize3D(pts, dim=[1,1,1]):
    """
    pts: receives .pts cloud point data. 2D array, arbitary sized X,Y,Z pairs. (We will only take x,y,z into account for now)
    dim: dimensioin of output voxelized data
    
    This function will locate the grid cube and calculate the density of each cube.
    The output will be normalized values.
    """
    assert(pts.shape[1]>=3), "pts file should contain at least x,y,z coordinate"
    assert(len(dim)==3), "Please provide 3-d grid size like [32,32,32]"
    
    if len(pts) > 1:
        # move all the axis to positive area.
        # minimum_val = [pts[0][0], pts[0][1], pts[0][2]]

        # # find the smallest 
        # for pair in pts:
        #     if pair[0] < minimum_val[0]:
        #         minimum_val[0] = pair[0]
        #     if pair[1] < minimum_val[1]:
        #         minimum_val[1] = pair[1]
        #     if pair[2] < minimum_val[2]:
        #         minimum_val[2] = pair[2]

        # # move it to first quadrant 
        # rectified_pts = np.empty(pts.shape)
        # for index, pair in enumerate(pts):
        #     point = np.zeros(3)
        #     point[0] = pair[0] - minimum_val[0]
        #     point[1] = pair[1] - minimum_val[1]
        #     point[2] = pair[2] - minimum_val[2]
        #     rectified_pts[index] = point

        # # biggest value in each axis 
        # maximum_val = pts[0][0]

        # for pair in rectified_pts:
        #     for val in pair:
        #         if val > maximum_val:
        #             maximum_val = val

        # normalize all the axises to (0,1)
        # normalized_pts = rectified_pts/maximum_val
        normalized_pts = norm_point(pts)
    
    else:
        # in case there is just one point
        normalized_pts = pts
    
    x_grid_length = 1/dim[0]
    y_grid_length = 1/dim[1]
    z_grid_length = 1/dim[2]
    
    output = np.zeros((dim[0],dim[1],dim[2]))
    
    epsilon = 0.000000000001 # we will have at least a 1.0 value which will exceed the index of grid
    # we can use a relativly small value to escape that to fit our data
    
    max_volume_size = 0
    
    for pair in normalized_pts:
        x_loc = int(pair[0]/(x_grid_length + epsilon))
        y_loc = int(pair[1]/(y_grid_length + epsilon))
        z_loc = int(pair[2]/(z_grid_length + epsilon))
        if output[x_loc, y_loc, z_loc] is None:
            output[x_loc, y_loc, z_loc] = 1
        else:
            output[x_loc, y_loc, z_loc] += 1
        
        if output[x_loc, y_loc, z_loc] > max_volume_size:
            max_volume_size = output[x_loc, y_loc, z_loc]
    
    output = output/max_volume_size    
            
    return output