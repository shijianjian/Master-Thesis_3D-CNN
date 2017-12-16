"""
Process point cloud data folder
"""
import os

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

def find_data(data_path=None, max_file_num=None, folder_filter=(None, None)):
    """
    Find file in each folder according to the 'data_path'.
    
    Giving the max number of files via `max_file_num`, it will read first `max_file_num` in each folder. Read all if there is no enough file inside.
    
    `folder_filter` is a tuple like (100, 2000) which indicates the number of files will between 100 and 2000.
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
                for pts_data in os.scandir(target_dir_path):
                    if (max_file_num is None) or (count < max_file_num):
                        data.append(os.path.join(data_path, entry.name, 'points', pts_data.name))
                        label.append(entry.name)
                        count += 1
                    else:
                        break
    return data, label