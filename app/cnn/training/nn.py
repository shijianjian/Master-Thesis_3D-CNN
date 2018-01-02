"""
Conv Net algorithm implementation by hand
"""

import math
import numpy as np

def conv_3d(data, kernel, stride=(1,1,1), padding='SAME'):
    
    padded_target = do_padding(data, kernel.shape, stride, padding)
    
    outsize_x = int((padded_target.shape[0] - kernel.shape[0])/stride[0] + 1)
    outsize_y = int((padded_target.shape[1] - kernel.shape[1])/stride[1] + 1)
    outsize_z = int((padded_target.shape[2] - kernel.shape[2])/stride[2] + 1)
    output = np.zeros((outsize_x, outsize_y, outsize_z))
    
    for i in range(outsize_x):
        for j in range(outsize_y):
            for k in range(outsize_z):
                i_start = i * stride[0]
                j_start = j * stride[1]
                k_start = k * stride[2]
                
                value = padded_target[i_start:i_start+kernel.shape[0], j_start:j_start+kernel.shape[1], k_start:k_start+kernel.shape[2]]
                output[i, j, k] = np.sum(value*kernel)
    print(output.shape)
    return output


def max_pooling_3d(target, pool_size, stride, padding="valid"):
    
    padded_target = do_padding(target, pool_size, stride, padding)
    
    outsize_x = int((padded_target.shape[0] - pool_size[0])/stride[0] + 1)
    outsize_y = int((padded_target.shape[1] - pool_size[1])/stride[1] + 1)
    outsize_z = int((padded_target.shape[2] - pool_size[2])/stride[2] + 1)
    output = np.zeros((outsize_x, outsize_y, outsize_z))
    
    for i in range(outsize_x):
        for j in range(outsize_y):
            for k in range(outsize_z):
                i_start = i*stride[0]
                j_start = j*stride[1]
                k_start = k*stride[2]

                output[i, j, k] = np.max(target[i_start:i_start+2, j_start:j_start+2, k_start:k_start+2])
                    
    return output

def do_padding(target, kernel_size, stride, padding='SAME'):
    # Algorithm comes from https://github.com/tensorflow/tensorflow/commit/a276e0999ab4223ac36d75221028d3e8835c60ae
    print(padding, padding == 'SAME')
    if padding == 'SAME':
        pad_left, pad_right = same_padding(target.shape[0], kernel_size[0], stride[0])
        pad_top, pad_bottom = same_padding(target.shape[1], kernel_size[1], stride[1])
        pad_front, pad_back = same_padding(target.shape[2], kernel_size[2], stride[2])
        if len(target.shape) == 3:
            padded_target = np.pad(target, [(pad_left, pad_right), (pad_top, pad_bottom), (pad_front, pad_back)], mode='constant')
        elif len(target.shape) == 4:
            padded_target = np.pad(target, [(pad_left, pad_right), (pad_top, pad_bottom), (pad_front, pad_back), (0,0)], mode='constant')
        else:
            raise TypeError("Not supported")
        
    elif padding == 'VALID':
        # no padding would be used
        border_x = valid_padding(target.shape[0], kernel_size[0], stride[0])
        border_y = valid_padding(target.shape[1], kernel_size[1], stride[1])
        border_z = valid_padding(target.shape[2], kernel_size[2], stride[2])
        if len(target.shape) == 3:
            padded_target = target[:border_x, :border_y, :border_z]
        elif len(target.shape) == 4:
            padded_target = target[:border_x, :border_y, :border_z, :]
        else:
            raise TypeError("Not supported")
        
    else:
        raise TypeError('Padding strategy `' + padding + '` not found.')
        
    print("Padded shape", padded_target.shape)
    return padded_target


def same_padding(size, kernel_size, stride):
    out_x = math.ceil(float(size) / float(stride))
    pad_along_x = max((out_x - 1) * stride + kernel_size - size, 0)
    pad_left = pad_along_x // 2
    pad_right = pad_along_x - pad_left
    return pad_left, pad_right


def valid_padding(size, kernel_size, stride):
    out_width = math.floor(float(size - kernel_size) / float(stride) + 1)
    border = (out_width-1)*stride + kernel_size
    return border