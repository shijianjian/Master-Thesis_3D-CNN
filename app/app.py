"""
MicroService for 3D point cloud CNN
"""

import os
import numpy as np
from pyntcloud import PyntCloud
from flask import Flask, json, render_template, send_from_directory, request, redirect
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from cnn.util.dbscan import dbscan_labels, find_cluster_points
from cnn.util.process_pointcloud import norm_point
from cnn.plot.camera_config import plot_voxel_points

APP = Flask(__name__)
CORS(APP)
APP.config['CORS_HEADERS'] = 'Content-Type'
APP.config['supports_credentials'] = 'True'

@APP.after_request
def after_request(response):
    """
    Response headers.
    """
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


APP_STATIC_PATH = os.getcwd()
APP.static_folder = APP_STATIC_PATH
APP.template_folder = APP_STATIC_PATH

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = set(['pts'])
APP.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@APP.route('/', methods=['GET'])
@cross_origin()
def index():
    """
    Index Page.
    """
    return render_template('index.html')


@APP.route('/<path:path>')
@cross_origin()
def send_js(path):
    """
    Service static resources
    """
    return send_from_directory(APP_STATIC_PATH, path)


@APP.route('/cluster', methods=['POST'])
@cross_origin()
def cluster_point_cloud():
    """
    Output point cloud cluster according to the configuration.
    """
    if request.method == 'POST':
        points = None
        try:
            # convert string to 2d numpy array
            points = request.form['points']
            import ast
            points = ast.literal_eval(points)
        except Exception as e:
            print('Error on recieving points')
            print(e)
    normalized_cloud = norm_point(points)
    labels = dbscan_labels(normalized_cloud, 0.02, 10, algorithm='ball_tree')
    cluster = find_cluster_points(normalized_cloud, labels)
 
    return APP.response_class(
        response=json.dumps(cluster),
        status=200,
        mimetype='application/json'
    )

@APP.route('/plot/points/<path:filename>', methods=['GET'])
@cross_origin()
def get_points(filename):
    """
    Calculate camera settings.

    'filename': the relative path of the file uploaded previously in APP.config['UPLOAD_FOLDER'].
    """
    my_point_cloud = PyntCloud.from_file(os.path.join(APP.config['UPLOAD_FOLDER'], filename), sep=" ", header=0, names=["x", "y", "z"])
    normalized_cloud = norm_point(my_point_cloud.xyz)
    return APP.response_class(
        response=json.dumps(normalized_cloud),
        status=200,
        mimetype='application/json'
    )



@APP.route('/upload', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def upload_file():
    """
    Upload point cloud file.
    """
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            os.makedirs(APP.config['UPLOAD_FOLDER'], exist_ok=True)
            file.save(os.path.join(APP.config['UPLOAD_FOLDER'], filename))
            return "File uploaded"

    return index()


@APP.route('/plot/settings', methods=['POST'])
@cross_origin()
def render():
    """
    Calculate camera settings.

    points: recives XYZ coordinates.
    """
    if request.method == 'POST':
        points = None
        voxels = None
        try:
            # convert string to 2d numpy array
            points = request.form['points']
            import ast
            points = ast.literal_eval(points)
        except Exception as e:
            print('Error on recieving points')
            print(e)

        try:
            voxels = request.form['voxels']
        except Exception as e:
            print('Error on recieving voxels')
            print(e)

        name = request.form['name']
        
        settings = plot_voxel_points(voxels, np.asarray(points), filename=name)

        return APP.response_class(
            response=json.dumps(settings),
            status=200,
            mimetype='application/json'
        )


def allowed_file(filename):
    """
    Filter files according to file extensions.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    APP.run()
   