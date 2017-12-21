## Web app for CNN model

#### Requirements
- npm
- @angular/cli
- python
- Training data. Sample training data can be found [here](http://web.stanford.edu/~ericyi/project_page/part_annotation/index.html). Please copy it under 'PartAnnotation'.
- A trained model, put it under '/trained_model' folder along with a label file. For example:
~~~
app --
    |-- trained_model
        | -- model-2.index
        | -- model-2.meta
        | -- model-2.data-00000-of-00001
        | -- model-2.label
~~~
Within the .label file, simply given a list of class labels which are corresponding to the output from provided model.

#### Dependencies
- [PyntCloud](http://pyntcloud.readthedocs.io/en/latest/installation.html)
- [flask](http://flask.pocoo.org)
- [h5py](http://www.h5py.org/)

#### How to run

Before running:
~~~
$ cd angular
$ npm install
~~~

If the infinite loop encountered while installing node-gyp (May on windows). Run following script instead:
~~~
$ npm install --ignore-script --unsafe-perm
~~~

For running:
~~~
$ bash run.bash
~~~

For cleaning up:
~~~
$ bash clean.bash
~~~