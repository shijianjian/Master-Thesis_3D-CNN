"""
Process point cloud data folder
"""
import os
import numpy as np
from pyntcloud import PyntCloud

DATA_PATH = os.path.join(os.getcwd(), "PartAnnotation")

def get_folder_structure(data_path=None, file_ext=('.pts', '.ptx'), details=False):
    """
    Get all folder names under data_path.

    Along with the number of points under each folder and its filenames.
    """
    if data_path is None:
        data_path = DATA_PATH

    res = []
    for entry in os.scandir(data_path):
        if entry.is_dir():
            points_path = os.path.join(data_path, entry.name, 'points')
            folder_dict = {}
            folder_list = []
            num = 0
            for _file in os.listdir(points_path):
                if _file[-4:] in file_ext:
                    if details:
                        folder_list.append(_file)
                    num += 1
            folder_dict.update({'size': num})
            folder_dict.update({'name': entry.name})
            if details:
                folder_dict.update({'points': folder_list})
            res.append(folder_dict)

    return res


def find_data(data_path=None, max_file_num=None, augment_to_num=None, folder_filter=(None, None), aug_methods=('rotate', 'sqeeze', 'noise')):
    """
    Find file in each folder according to the 'data_path'.
    
    Giving the max number of files via `max_file_num`, it will read first `max_file_num` in each folder. Read all if there is no enough file inside.
    
    `folder_filter` is a tuple like (100, 2000) which indicates the number of files will between 100 and 2000.

    'aug_method' is a tuple contains all chosen augmentation methods, including 'rotate', 'squeeze' and 'noise'.
    """
    
    min_th, max_th = folder_filter
    if max_file_num is not None and folder_filter is not None:
        if min_th is not None:
            assert(max_file_num > min_th), "`max_file_num` should be greater than `" + min_th + "` in " + folder_filter
        
    if data_path is None:
        data_path = DATA_PATH

    data = []
    label = []
    for entry in os.scandir(data_path):
        if entry.is_dir():
            target_dir_path = os.path.join(data_path, entry.name, 'points')
            path, dirs, files = os.walk(target_dir_path).__next__()
            file_count = len(files)
            if (min_th is None or file_count >= min_th) and (max_th is None or file_count <= max_th):
                count = 0

                all_files = os.scandir(target_dir_path);
                if augment_to_num is not None and len(all_files) < augment_to_num:
                    files_need_augment = augment_to_num - len(all_files)
                    for _ in range(files_need_augment):
                        idx = np.random.randint(len(all_files))
                        data = PyntCloud(os.path.join(target_dir_path, all_files[idx])).xyz
                        new_data = augment_data(data, aug_method)
                        import uuid
                        unique_filename = "_aug_" + str(_) + "_" + str(uuid.uuid4())
                        write_to_file(new_data, unique_filename)

                for pts_data in os.scandir(target_dir_path):
                    if (max_file_num is None) or (count < max_file_num):
                        data.append(os.path.join(data_path, entry.name, 'points', pts_data.name))
                        label.append(entry.name)
                        count += 1
                    else:
                        break
                
    return data, label


def label_cates(labels):
    cates = []
    for l in labels:
        if l not in cates:
            cates.append(l)
    return cates


def data_onehot_encode(labels):
    """
    Recieves an array of labels.
    """
    cates = label_cates(labels)
    # one-hot
    onehot = []
    for l in labels:
        x = np.zeros(len(cates))
        x[cates.index(l)] = 1.0
        onehot.append(x)
    return onehot, cates


def data_reshape(data, dim=[32,32,32]):
    """
    Will read and voxelize the data
    """
    x_reshaped = []
    
    for i in range(len(data)):
        if i % 20 == 0:
            print("Process: ", str('{0:.2f}'.format(i/len(data))) + "%", end='\r')
        my_point_cloud = PyntCloud.from_file(data[i], sep=" ", header=0, names=["x","y","z"])
        vox = voxelize3D(my_point_cloud.xyz, dim=dim)
        vox_chan = np.array(vox).reshape(vox.shape + (1,))
        x_reshaped.append(vox_chan)
        
    print("Process: ", " 100% ")        
    return x_reshaped


def data_swap(data, index_a, index_b):
    temp = data[index_a]
    data[index_a] = data[index_b]
    data[index_b] = temp
    return data

def data_random_position(data):
    import random
    return random.randint(0,len(data)-1)

def data_shuffling(data, label):
    for i in range(len(data)):
        target = data_random_position(data)
        data = data_swap(data, i, target)
        label = data_swap(label, i, target)
    return data, label


def write_to_file(xyz, filename='xyz'):
    import os
    f = open(os.path.join(os.getcwd(), filename + ".pts"), "w") 
    
    for point in xyz:
        st = ""
        for item in point:
            st += str(item) + " "
        f.write(st.strip() + "\n")

    f.close() 


def voxelize3D(pts, dim=[1,1,1]):
    """
    pts: receives .pts cloud point data. 2D array, arbitary sized X,Y,Z pairs. (We will only take x,y,z into account for now)
    dim: dimensioin of output voxelized data
    
    This function will locate the grid cube and calculate the density of each cube.
    The output will be normalized values.
    """
    assert(pts.shape[1]>=3), "pts file should contain at least x,y,z coordinate"
    assert(len(dim)==3), "Please provide 3-d grid size like [32,32,32]"
    
    # move all the axis to positive area.
    minimum_val = [pts[0][0], pts[0][1], pts[0][2]]

    # find the smallest 
    for pair in pts:
        if pair[0] < minimum_val[0]:
            minimum_val[0] = pair[0]
        if pair[1] < minimum_val[1]:
            minimum_val[1] = pair[1]
        if pair[2] < minimum_val[2]:
            minimum_val[2] = pair[2]
            
    # move it to first quadrant 
    rectified_pts = np.empty(pts.shape)
    for index, pair in enumerate(pts):
        point = np.zeros(3)
        point[0] = pair[0] - minimum_val[0]
        point[1] = pair[1] - minimum_val[1]
        point[2] = pair[2] - minimum_val[2]
        rectified_pts[index] = point
    
    # biggest value in each axis 
    maximum_val = pts[0][0]
    
    for pair in rectified_pts:
        for val in pair:
            if val > maximum_val:
                maximum_val = val
     
    # normalize all the axises to (0,1)
    normalized_pts = rectified_pts/maximum_val
    
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


def density_converter(voxelgrid):
    idx = voxelgrid > 0
    val = np.ones(voxelgrid.shape) * idx
    return val


def augment_data(pointcloud, methods):
    """
    Data Augmentation.
    'pointcloud': A matrix with exact 3 columns represents x, y, z. 
    'methods': A list of choosen methods, including 'rotate', 'squeeze', 'noise'.
    """
    pts = pointcloud
    if 'rotate' in methods:
        for axis in range(3):
            pts = rotate(pts, axis, angle_degree=np.random.rand()*360)

    if 'squeeze' in methods:
        pts = squeeze_pts(pts, axis=np.random.randint(3), percentage=np.random.rand()*30)

    if 'noise' in methods:
        pts = add_noise(pts, noise_percentage=np.random.rand()*20)

    return pts
    

# Rotation
def rotate(pts, axis=0, angle_degree=30):
    """
    Rotate the pts point cloud by a specific angle.
    
    axis = 0 : rotate around x-axis
    axis = 1 : rotate around y-axis
    axis = 2 : rotate around z-axis
    
    angle_degree : how much degree you want to rotate the point cloud.
    
    Algorithm comes in: https://uk.mathworks.com/matlabcentral/answers/123763-how-to-rotate-entire-3d-data-with-x-y-z-values-along-a-particular-axis-say-x-axis
    """
    if axis == 0: 
        return rotate_by_x(pts, angle_degree)
    if axis == 1: 
        return rotate_by_y(pts, angle_degree)
    if axis == 2: 
        return rotate_by_z(pts, angle_degree)
    
def rotate_by_x(pts, angle_degree=30):
    import numpy as np
    degree = np.deg2rad(angle_degree)
    res = np.empty(pts.shape)
    for index, point in enumerate(pts):
        new_point = np.zeros(3)
        new_point[0] = point[0] # x
        new_point[1] = point[1]*np.cos(degree) - point[2]*np.sin(degree) # y
        new_point[2] = point[1]*np.sin(degree) + point[2]*np.cos(degree) # z
        res[index] = new_point
        
    return res

    
def rotate_by_y(pts, angle_degree=30):
    import numpy as np
    degree = np.deg2rad(angle_degree)
    res = np.empty(pts.shape)
    for index, point in enumerate(pts):
        new_point = np.zeros(3)
        new_point[0] = point[0]*np.cos(degree) + point[2]*np.sin(degree) # x
        new_point[1] = point[1] # y
        new_point[2] = point[2]*np.cos(degree) - point[0]*np.sin(degree) # z
        res[index] = new_point
        
    return res

    
def rotate_by_z(pts, angle_degree=30):
    import numpy as np
    degree = np.deg2rad(angle_degree)
    res = np.empty(pts.shape)
    for index, point in enumerate(pts):
        new_point = np.zeros(3)
        new_point[0] = point[0]*np.cos(degree) - point[1]*np.sin(degree) # x
        new_point[1] = point[0]*np.sin(degree) + point[1]*np.cos(degree) # y
        new_point[2] = point[2] # z
        res[index] = new_point
        
    return res


# Squeeze
def squeeze_pts(pts, axis=0, percentage=10):
    if axis==0:
        return squeeze_by_x(pts, percentage, axis)
    if axis==1:
        return squeeze_by_y(pts, percentage, axis)
    if axis==2:
        return squeeze_by_z(pts, percentage, axis)
    
def squeeze_by_axis(pts, percentage, axis):
    
    v = (100-percentage)/100
    output = np.empty(pts.shape)
    
    assert(v>=0 and v<=1), "Percentage should between 0 and 100"
    
    for index, point in enumerate(pts):
        output[index] = point
        output[index][axis] = output[index][axis]*v
        
    return output


def add_noise(pts, noise_percentage=0.05):
    
    noise_size = int(noise_percentage*len(pts))
    
    max_x = min_x = pts[0][0]
    max_y = min_y = pts[0][1]
    max_z = min_z = pts[0][2]
    
    for point in pts:
        if max_x < point[0]:
            max_x = point[0]
        if max_y < point[1]:
            max_y = point[1]
        if max_z < point[2]:
            max_z = point[2]
            
        if min_x < point[0]:
            min_x = point[0]
        if min_y < point[1]:
            min_y = point[1]
        if min_y < point[2]:
            min_y = point[2]
            
    import numpy as np
    
    noise_pts = np.empty((noise_size, 3))
    noise_x = np.random.randn(noise_size)*(max_x - min_x)/2
    noise_y = np.random.randn(noise_size)*(max_y - min_y)/2
    noise_z = np.random.randn(noise_size)*(max_z - min_z)/2
    
    for i, _ in enumerate(range(noise_size)):
        pos = np.random.randint(0,len(pts)-1)
        noise_pts[i][0] = pts[pos][0] + noise_x[i]
        noise_pts[i][1] = pts[pos][1] + noise_y[i]
        noise_pts[i][2] = pts[pos][2] + noise_z[i]
        
    return np.concatenate((pts, noise_pts))


# Crop data
def crop(point_cloud, ratio=((0, 1), (0, 1), (0, 1))):
    
    normed_point = norm_point(point_cloud)
    
    res = []
    
    for idx, row in enumerate(normed_point):
        if row[0] > ratio[0][0] and row[0] < ratio[0][1]:
            if row[1] > ratio[1][0] and row[1] < ratio[1][1]:
                if row[2] > ratio[2][0] and row[2] < ratio[2][1]:
                    res.append(row)
                    
    return np.asarray(res)