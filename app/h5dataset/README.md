This folder would contain all the generated h5 files.

Put your own HDF5 file here.

Notice that you should name the data as:
"voxel" : contains all voxel grid data.
"label" : contains one-hot encoded labels cooresponding to your "voxel" keyset files. 
	Exp: [1, 0]
"label_ref" : human readable label list corresponding to one-hot labels. 
	Exp: ['airplane', 'human']
