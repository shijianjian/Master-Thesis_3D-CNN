import os

from pyntcloud import PyntCloud
from flask import Flask, send_from_directory
from flask import json

from cnn.util.dbscan import *
from cnn.util.process_pointcloud import norm_point


app = Flask(__name__, static_url_path='public')

@app.route('/')
def hello_world():
    return app.send_static_file('file_path')


@app.route('/cluster')
def cluster_point_cloud():
    my_point_cloud = PyntCloud.from_file(os.path.join(os.getcwd(), 'ttt2.pts'), sep=" ", header=0, names=["x","y","z"])
    normalized_cloud = norm_point(my_point_cloud.xyz)
    labels = dbscan_labels(normalized_cloud, 0.02, 10, algorithm='ball_tree')
    cluster = find_cluster_points(normalized_cloud, labels)
        
    response = app.response_class(
        response=json.dumps(cluster),
        status=200,
        mimetype='application/json'
    )
    return response


if __name__ == "__main__":
    app.run()