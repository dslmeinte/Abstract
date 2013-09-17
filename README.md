Abstract
========

*Abstract* is a model editor for JavaScript.
It is thoroughly inspired on the [Concrete Model Editor](https://github.com/mthiede/concrete) by Martin Thiede.

## Project's name

The reason this project is called *Abstract* is that Martin's model editor is based on manipulating the *concrete*
syntax of the model being edited, while I want to do the opposite: manipulate the *abstract* syntax of the model in edit,
after which the concrete syntax -i.e., the model's visualization- should update automatically accordingly.


## Project's goals

These are as follows:
* Convenient transport of model and meta model through easy model format in JSON (```jsmf```).
* Programmatic mapping from model to widgets-based visualization.
* Configuration of behavior to guide in-model navigation and facilitate expression editing.


## Dependencies

*Abstract* has the following dependencies: JS in a browser (dûh), jQuery (redistributed) and [jsmf](https://github.com/dslmeinte/jsmf).
(The latter may be switched to [ecore.js](https://github.com/ghillairet/ecore.js) at some later point.)
Other dependencies like ```_``` (i.e., [Underscore](http://underscorejs.org)) and a JS-FRP library might come to rear their heads as well...


## License

*Abstract* is licensed under the terms of the MIT license, see the included MIT-LICENSE file.


