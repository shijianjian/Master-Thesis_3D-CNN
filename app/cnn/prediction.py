import os
import numpy as np
import tensorflow as tf

model_path = os.path.join(os.getcwd(), 'trained_model', 'model-2')

def predict(voxels, model_path, output_format='weights', device_name='cpu:0'):
    """
    Output_format can be 'weights' or 'probs'.
    
    'weights' will output the weight straight away which can be treated as confident.
    
    'probs' will output the corresponding probabilities for each class.
    """

    config = tf.ConfigProto(allow_soft_placement = True)
    with tf.Session(graph=tf.Graph(), config=config) as sess:
        with tf.device(device_name):

            saver = tf.train.import_meta_graph(model_path + ".meta")
            saver.restore(sess, model_path)

            graph = tf.get_default_graph()
            x_input = graph.get_tensor_by_name('inputs/x_input:0')
            y_input = graph.get_tensor_by_name('inputs/y_input:0')
            pred = graph.get_collection('logits')
            accuracy = graph.get_tensor_by_name('acc:0')
            
            res = []
            
            if output_format is 'weights':
                for _, val in enumerate(voxels):
                    y = sess.run(pred, feed_dict={x_input: [val]})
                    res.append(np.asarray(y[0]))
                return res
            
            elif output_format is 'probs':
                for _, val in enumerate(voxels):
                    y = sess.run(pred, feed_dict={x_input: [val]})
                    res.append(tf.nn.softmax(np.asarray(y[0])).eval())
                return res


def count_prob(probs, cube_labels, threshold=0.7):
    """
    Input with softmax probabilities and label class for each voxel.
    """
    li = dict()
    cubes = dict()
    for _, val in enumerate(probs):
        _max = np.argmax(val)
        if val[0][_max] > threshold:
            if _max not in li:
                li.update({_max:1})
                m_li = list()
                m_li.append(cube_labels[_])
                cubes.update({_max: m_li})
            else:
                li.update({_max: li[_max]+1})
                m_li = cubes[_max]
                m_li.append(cube_labels[_])
                cubes.update({_max: m_li})
    return li, cubes


def count_confidence(confidence, cube_labels, threshold=3):
    """
    Input with predicted weight and label class for each voxel.
    """
    li = dict()
    cubes = dict()
    for _, val in enumerate(confidence):
        _max = np.argmax(val)
        if val[0][_max] > threshold:
            if _max not in li:
                li.update({_max:1})
                m_li = list()
                m_li.append(cube_labels[_])
                cubes.update({_max: m_li})
            else:
                li.update({_max: li[_max]+1})
                m_li = cubes[_max]
                m_li.append(cube_labels[_])
                cubes.update({_max: m_li})
    return li, cubes