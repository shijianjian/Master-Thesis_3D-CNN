"""
MicroService for 3D point cloud CNN
"""

import os
import numpy as np
from pyntcloud import PyntCloud
import h5py
from flask import Flask, json, render_template, send_from_directory, request, redirect
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from tensorflow.python.client.device_lib import list_local_devices

from cnn.util.cluster import dbscan_labels, mean_shift_labels, k_means_label, find_cluster_points
from cnn.util.process_pointcloud import norm_point, voxelize3D
from cnn.prediction import predict
from cnn.training.data_process import get_folder_structure, data_reshape, data_shuffling, data_onehot_encode, find_data
from cnn.training.nn import conv_3d, max_pooling_3d
from cnn.training.cnn import set_placeholders, get_measurement, train_neural_network


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
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers['Cache-Control'] = 'public, max-age=0'
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
        cluster_algorithm = request.form['cluster_algorithm']
        # convert string to 2d numpy array
        pointcloud = request.form['pointcloud']
        import ast
        pointcloud = ast.literal_eval(pointcloud)
        normalized_cloud = norm_point(pointcloud)
        print(cluster_algorithm)

        if cluster_algorithm == 'dbscan':
            eps = float(request.form['epsilon'])
            min_points = int(request.form['minPoints'])
            algorithm = request.form['algorithm']
            labels = dbscan_labels(normalized_cloud, eps, min_points, algorithm=algorithm)
        elif cluster_algorithm == 'mean_shift':
            bandwidth = float(request.form['bandwidth'])
            max_iter = int(request.form['max_iter'])
            labels = mean_shift_labels(normalized_cloud, bandwidth=bandwidth, 
                                       max_iter=max_iter, n_jobs=4)
        elif cluster_algorithm == 'kmeans':
            n_clusters = int(request.form['n_clusters'])
            init = request.form['init']
            precompute_distances = request.form['precompute_distances']
            if precompute_distances != 'auto':
                if precompute_distances == 'true':
                    precompute_distances = True
                elif precompute_distances == 'false':
                    precompute_distances = False
                else:
                    raise TypeError("precompute_distances is not auto or True/False, it is " + precompute_distances)
            algorithm = request.form['algorithm']
            max_iter = int(request.form['max_iter'])
            labels = k_means_label(normalized_cloud, n_clusters=n_clusters, init=init,
                                   precompute_distances=precompute_distances, algorithm=algorithm,
                                   max_iter=max_iter, n_jobs=4)
        else:
            raise TypeError("Not supported method.")

        cluster = find_cluster_points(normalized_cloud, labels)
        return APP.response_class(
            response=json.dumps(cluster),
            status=200,
            mimetype='application/json'
        )
    else:
        return APP.response_class(
            response="Method doesn't support",
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
            tidied_points.append(vox_chan)
        elif len(pointcloud.shape) == 3:
            for _, val in enumerate(pointcloud):
                vox = voxelize3D(pointcloud, dim=[32, 32, 32])
                vox_chan = np.array(vox).reshape(vox.shape + (1, ))
                tidied_points.append(vox_chan)
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


@APP.route('/lab/conv', methods=['POST'])
@cross_origin()
def conv():
    if request.method == 'POST':
        import ast
        voxel = None
        kernel = None
        stride = None
        padding = None
        try:
            # convert string to proper format
            voxel = request.form['voxel']
            kernel = request.form['kernel']
            stride = int(request.form['stride'])
            padding = request.form['padding']
            voxel = ast.literal_eval(voxel)
            kernel = ast.literal_eval(kernel)
        except Exception as e:
            print('Error on recieving data')
            print(e)
        res = conv_3d(np.asarray(voxel), np.asarray(kernel), (stride, stride, stride), padding.upper())
        return APP.response_class(
            response=json.dumps(res.tolist()),
            status=200,
            mimetype='application/json'
        )

@APP.route('/lab/pool', methods=['POST'])
@cross_origin()
def pool():
    if request.method == 'POST':
        import ast
        voxel = None
        kernel_size = None
        stride = None
        padding = None
        try:
            # convert string to proper format
            voxel = request.form['voxel']
            kernel_size = request.form['kernel_size']
            stride = int(request.form['stride'])
            padding = request.form['padding']
            voxel = ast.literal_eval(voxel)
            kernel_size = ast.literal_eval(kernel_size)
        except Exception as e:
            print('Error on recieving data')
            print(e)

        res = max_pooling_3d(np.asarray(voxel), kernel_size, (stride, stride, stride), padding.upper())
        return APP.response_class(
            response=json.dumps(res.tolist()),
            status=200,
            mimetype='application/json'
        )


@APP.route('/datasets', methods=['GET'])
@cross_origin()
def get_datasets():
    data_path = os.path.join(APP_STATIC_PATH, 'h5dataset')
    res = []
    for file in os.listdir(data_path):
        if file.endswith(".h5"):
            res.append(file[:-3])
    return APP.response_class(
        response=json.dumps(res),
        status=200,
        mimetype='application/json'
    )


@APP.route('/dataset/build', methods=['POST'])
@cross_origin()
def build_datasets():

    import json
    aug_settings = None
    try:
        # convert string to proper format
        _aug_settings = request.form['aug_settings']
        aug_settings = json.loads(_aug_settings)
    except Exception as e:
        print('Error on recieving data')
        print(e)

    data_path = os.path.join(APP_STATIC_PATH, 'PartAnnotation')

    dim=[32,32,32]
    filename = aug_settings['filename']

    aug_method = []
    if aug_settings['augment']['noise']['enabled'] is True:
        aug_method.append('noise')
    if aug_settings['augment']['squeeze']['enabled'] is True:
        aug_method.append('sqeeze')
    if aug_settings['augment']['rotate']['enabled'] is True:
        aug_method.append('rotate')
    
    data, label = find_data(data_path=data_path, max_file_num=int(aug_settings['size']), augment_to_num=aug_settings['augment']['min_value'], 
                            folder_filter=(int(aug_settings['min_filter']), int(aug_settings['max_filter'])), 
                            aug_methods=tuple(aug_method))
    
    _shuffled_data_raw, _shuffled_label_raw = data_shuffling(data, label)
    
    _shuffled_data = data_reshape(_shuffled_data_raw, dim)
    _shuffled_label, _label_ref = data_onehot_encode(_shuffled_label_raw)

    # Create hdf5
    hdf5_path = os.path.join(os.path.join(APP_STATIC_PATH, 'h5dataset'), filename + '.h5')
    hdf5_file = h5py.File(hdf5_path, mode='w')

    hdf5_file.create_dataset("voxels", data=_shuffled_data[:])
    hdf5_file.create_dataset("labels", data=_shuffled_label[:])
    hdf5_file.create_dataset('label_ref', data=np.array(_label_ref).astype('|S9')) # ASCII
  
    res = {
        'status': 'Success',
        'filename': filename
    }
    return APP.response_class(
        response=json.dumps(res),
        status=200,
        mimetype='application/json'
    )


@APP.route('/train/cnn', methods=['POST'])
@cross_origin()
def train_cnn():
    print(request.method, request.form)
    if request.method == 'POST':
        tranining_settings = None
        dataset = None
        try:
            import json
            # convert string to proper format
            dataset = request.form['dataset']
            tranining_settings = json.loads(request.form['training_settings'])
            tranining_settings['device'] = "/" + tranining_settings['device'].lower()
            tranining_settings['trainset'] = int(tranining_settings['trainset'])
            tranining_settings['keep_rate'] = float(tranining_settings['keep_rate'])
            tranining_settings['seed'] = int(tranining_settings['seed'])
            tranining_settings['learning_rate'] = float(tranining_settings['learning_rate'])
            tranining_settings['epochs'] = int(tranining_settings['epochs'])
            tranining_settings['batch_size'] = int(tranining_settings['batch_size'])
        except Exception as e:
            print('Error on recieving data')
            print(e)

    import tensorflow as tf
    import h5py
    
    record_performance = False

    config = None
    if tranining_settings['device'].upper().startswith("GPU"):
        # GPU using BFC
        gpu_options = tf.GPUOptions(allocator_type = 'BFC')
        config = tf.ConfigProto(gpu_options=gpu_options)
        
    tf.reset_default_graph()

    # load data
    data_path = os.path.join(APP_STATIC_PATH, 'h5dataset', dataset + ".h5");
    h5_data = h5py.File(data_path, mode='r')
    data = h5_data.get("voxels")
    label = h5_data.get("labels")
    label_ref = h5_data.get("label_ref")
    print(label_ref)
    split_point = len(data) * tranining_settings['trainset']
    _x_train = data[:split_point]
    _y_train = label[:split_point]
    _x_test = data[split_point:]
    _y_test = label[split_point:]

    x_shape=[None, 32, 32, 32, 1]
    y_shape=[None, len(_y_train[0])]

    sess = tf.Session(config=config)
    with sess.as_default(): 
        placeholders = set_placeholders(x_shape, y_shape)
        
        measurments = get_measurement(placeholders, keep_rate=tranining_settings['keep_rate'], seed=tranining_settings['seed'], training=True, 
                                      learning_rate=tranining_settings['learning_rate'], device=tranining_settings['device'])
        
        summary = None
        if record_performance:
            tf.summary.scalar("cross_entropy", measurments['cost'])
            tf.summary.scalar("accuracy", measurments['accuracy'])
            summary_all = tf.summary.merge_all()
            logs_path = os.path.join(os.getcwd(), 'summaries')
            train_writer = tf.summary.FileWriter(os.path.join(logs_path, 'train'), graph=tf.get_default_graph())
            test_writer = tf.summary.FileWriter(os.path.join(logs_path, 'test'), graph=tf.get_default_graph())
            summary = {'summary': summary_all, 'train_writer': train_writer, 'test_writer': test_writer}
        
        sess.run(tf.global_variables_initializer())

        train_neural_network(_x_train, _y_train, _x_test, _y_test, placeholders, measurments, session=sess,
                            summary_op=summary, epochs=tranining_settings['epochs'],
                            batch_size=tranining_settings['batch_size'], device=tranining_settings['device'])
         
        if record_performance:
            summary['train_writer'].close()
            summary['test_writer'].close()

        return APP.response_class(
                response=json.dumps("success"),
                status=200,
                mimetype='application/json'
            )
        

@APP.route('/train/devices', methods=['GET'])
@cross_origin()
def get_available_devices():
    """
    Get all devices.
    """
    local_device_protos = list_local_devices()
    res = []
    for _, _x in enumerate(local_device_protos):
        res.append(_x.name[8:])
    return APP.response_class(
            response=json.dumps(res),
            status=200,
            mimetype='application/json'
        )


@APP.route('/folder_structure', methods=['GET'])
@cross_origin()
def folder_structure():
    res = get_folder_structure()
    return APP.response_class(
            response=json.dumps(res),
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
   