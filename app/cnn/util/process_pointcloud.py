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
                    
    return np.asarray(points)


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
        normalized_points.append(row)
        
    return np.asarray(normalized_points)