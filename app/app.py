"""
MicroService for 3D point cloud CNN
"""

import os
import numpy as np
from pyntcloud import PyntCloud
from flask import Flask, json, render_template, send_from_directory, request, redirect
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from cnn.util.cluster import dbscan_labels, find_cluster_points
from cnn.util.process_pointcloud import norm_point, voxelize3D
from cnn.plot.camera_config import plot_voxel_points
from cnn.prediction import predict

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
        pointcloud = None
        eps = None
        min_points = None
        try:
            # convert string to 2d numpy array
            pointcloud = request.form['pointcloud']
            eps = float(request.form['epsilon'])
            min_points = float(request.form['minPoints'])
            algorithm = request.form['algorithm']
            import ast
            pointcloud = ast.literal_eval(pointcloud)
        except Exception as e:
            print('Error on recieving points')
            print(e)
    normalized_cloud = norm_point(pointcloud)
    labels = dbscan_labels(normalized_cloud, eps, min_points, algorithm=algorithm)
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


@APP.route('/models', methods=['GET'])
@cross_origin()
def get_models():
    model_path = os.path.join(APP_STATIC_PATH, 'trained_model')
    res = []
    for file in os.listdir(model_path):
        if file.endswith(".meta"):
            res.append(file[:-5])
    return APP.response_class(
        response=json.dumps(res),
        status=200,
        mimetype='application/json'
    )


@APP.route('/predict', methods=['POST'])
@cross_origin()
def prediction():
    if request.method == 'POST':
        import ast
        pointcloud = None
        try:
            # convert string to 2d numpy array
            pointcloud = request.form['pointcloud']
            model = request.form['model']
            pointcloud = ast.literal_eval(pointcloud)
        except Exception as e:
            print('Error on recieving points or model')
            print(e)
        print('Using model:', model)
        model_path = os.path.join(os.getcwd(), 'trained_model', model)

        if pointcloud is None:
            return APP.response_class(
                response='No points found',
                status=400,
                mimetype='application/json'
            )    
        tidied_points = []
        pointcloud = np.asarray(pointcloud)
        if len(pointcloud.shape) == 2:
            vox = voxelize3D(pointcloud, dim=[32, 32, 32])
            vox_chan = np.array(vox).reshape(vox.shape + (1, ))
            tidied_points.append(vox_chan);
        elif len(pointcloud.shape) == 3:
            for _, val in enumerate(pointcloud):
                vox = voxelize3D(pointcloud, dim=[32, 32, 32])
                vox_chan = np.array(vox).reshape(vox.shape + (1, ))
                tidied_points.append(vox_chan);
        else:
            return APP.response_class(
                response='Invalid points',
                status=400,
                mimetype='application/json'
            )
        res = predict(tidied_points, model_path, output_format='weights', device_name='cpu:0')
        _max = np.argmax(res)

        try:
            with open(model_path + '.label') as f:
                content = f.readlines()
            # Only read the first line
            label = ast.literal_eval(content[0])
            print("Label file found")
            _max = label[_max]
        except FileNotFoundError:
            print("Label file not found")
        return APP.response_class(
            response=json.dumps(str(_max)),
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
        pointcloud = None
        voxels = None
        try:
            # convert string to 2d numpy array
            pointcloud = request.form['pointcloud']
            import ast
            pointcloud = ast.literal_eval(pointcloud)
        except Exception as e:
            print('Error on recieving points')
            print(e)

        try:
            voxels = request.form['voxels']
        except Exception as e:
            print('Error on recieving voxels')
            print(e)

        name = request.form['name']
        
        settings = plot_voxel_points(voxels, np.asarray(pointcloud), filename=name)

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
   