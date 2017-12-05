"""
Cluster algorithm for clustering points within a point cloud.

[x, y, z] or [x, y, z, r, g, b] is only acceptable shape for a good performance.
"""
import numpy as np
from sklearn.cluster import dbscan
from sklearn.cluster import mean_shift
from sklearn.cluster.k_means_ import k_means

# https://github.com/NLeSC/PattyAnalytics/blob/master/patty/segmentation/dbscan.py
def dbscan_labels(pointcloud, epsilon, minpoints,
                  rgb_weight=0, algorithm='ball_tree'):
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


def mean_shift_labels(pointcloud, bandwidth=None, max_iter=300, n_jobs=1):
    '''
    Find an array of point-labels of clusters found by the DBSCAN algorithm.
    Parameters
    ----------
    X : array-like, shape=[n_samples, n_features]
        Input data.
    bandwidth : float, optional
        Kernel bandwidth.
        If bandwidth is not given, it is determined using a heuristic based on
        the median of all pairwise distances. This will take quadratic time in
        the number of samples. The sklearn.cluster.estimate_bandwidth function
        can be used to do this more efficiently.
    seeds : array-like, shape=[n_seeds, n_features] or None
        Point used as initial kernel locations. If None and bin_seeding=False,
        each data point is used as a seed. If None and bin_seeding=True,
        see bin_seeding.
    bin_seeding : boolean, default=False
        If true, initial kernel locations are not locations of all
        points, but rather the location of the discretized version of
        points, where points are binned onto a grid whose coarseness
        corresponds to the bandwidth. Setting this option to True will speed
        up the algorithm because fewer seeds will be initialized.
        Ignored if seeds argument is not None.
    min_bin_freq : int, default=1
       To speed up the algorithm, accept only those bins with at least
       min_bin_freq points as seeds.
    cluster_all : boolean, default True
        If true, then all points are clustered, even those orphans that are
        not within any kernel. Orphans are assigned to the nearest kernel.
        If false, then orphans are given cluster label -1.
    max_iter : int, default 300
        Maximum number of iterations, per seed point before the clustering
        operation terminates (for that seed point), if has not converged yet.
    n_jobs : int
        The number of jobs to use for the computation. This works by computing
        each of the n_init runs in parallel.
    Returns
    -------
    cluster_centers : array, shape=[n_clusters, n_features]
        Coordinates of cluster centers.
    labels : array, shape=[n_samples]
        Cluster labels for each point.
    '''

    # Set bandwidth to None if it is 0
    if bandwidth == 0:
        bandwidth = None
    
    _, labels = mean_shift(np.asarray(pointcloud), bandwidth=bandwidth, seeds=None, bin_seeding=False,
                           min_bin_freq=1, cluster_all=True, max_iter=max_iter, n_jobs=n_jobs)
    return labels


def k_means_label(pointcloud, n_clusters, init, precompute_distances, n_init=10,
                  max_iter=300, tol=1e-4, random_state=None, n_jobs=1, algorithm="auto"):
    """
    Returns
    --------
    centroid, labels, inertia, best_n_iter
    """
    res = k_means(pointcloud, n_clusters, init=init, precompute_distances=precompute_distances,
                  n_init=n_init, max_iter=max_iter, verbose=False,
                  tol=tol, random_state=random_state, copy_x=True, n_jobs=n_jobs,
                  algorithm=algorithm, return_n_iter=False)

    return res[1]


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
            res.update({val: li})
    renew_dict = dict()
    for idx, key in enumerate(res):
        renew_dict.update({str(key): res[key]})
    return renew_dict
