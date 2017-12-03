## Web app for CNN model

#### Requirements
- npm
- @angular/cli
- python
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

#### How to run

For running:
~~~
$ bash run.bash
~~~

For cleaning up:
~~~
$ bash clean.bash
~~~