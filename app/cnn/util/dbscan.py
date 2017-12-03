"""
DBSCAN algorithm for clustering points within a point cloud.
"""

from sklearn.cluster import dbscan

# https://github.com/NLeSC/PattyAnalytics/blob/master/patty/segmentation/dbscan.py
def dbscan_labels(pointcloud, epsilon, minpoints, rgb_weight=0, algorithm='ball_tree'):
    '''
    Find an array of point-labels of clusters found by the DBSCAN algorithm.
    Parameters
    ----------
    pointcloud : pcl.PointCloud
        Input pointcloud.
    epsilon : float
        Neighborhood radius for DBSCAN.
    minpoints : integer
        Minimum neighborhood density for DBSCAN.
    rgb_weight : float, optional
        If non-zero, cluster on color information as well as location;
        specifies the relative weight of the RGB components to spatial
        coordinates in distance computations.
        (RGB values have wildly different scales than spatial coordinates.)
    Returns
    -------
    labels : Sequence
        A sequence of labels per point. Label -1 indicates a point does not
        belong to any cluster, other labels indicate the cluster number a
        point belongs to.
    '''

    if rgb_weight > 0:
        X = pointcloud.to_array()
        X[:, 3:] *= rgb_weight
    else:
        X = pointcloud

    _, labels = dbscan(X, eps=epsilon, min_samples=minpoints, algorithm=algorithm)
    return labels


def find_cluster_points(point_cloud, labels):
    """
    Group relative points together.
    Inputs:
        point_cloud:
            x,y,z based point cloud
        labels:
            label comes back from dbscan_labels
    Returns:
        A dict of grouped points according to label.
    """
    res = dict()
    for idx, val in enumerate(labels):
        if val not in res:
            li = list()
            li.append(point_cloud[idx])
            res.update({val: li})
        else:
            li = res[val]
            li.append(point_cloud[idx])
            res.update( {val: li} )
    renew_dict = dict()
    for idx, key in enumerate(res):
        renew_dict.update({str(key): res[key]})
    return renew_dict
