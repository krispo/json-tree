# Fully editable JSON tree

An AngularJS directive used for displaying and editing JSON data in a tree view. It works independently of jQuery (only internal angular's jqLite).
Available operations with nodes:

* `add` new nodes,
* `reset` node values to null,
* `remove` node completely,
* `change` node value,
* `convert` type of the node (to object, array, string, number, boolean, null) implicitly,
* `drag` and `sort` tree nodes (via pressed `Ctrl`).

## How to use

Add scripts to your main html:
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js"></script>
<script src="https://rawgit.com/krispo/json-tree/master/json-tree.js"></script>
```

Inject `json-tree` directive into angular module and push some data to the controller:
```javascript
angular.module('myApp', ['json-tree'])
       .controller('myCtrl', function('$scope'){
           $scope.jsonData = { /* JSON data */ };
           })
```

and in html again you can use it like:
```html
<div ng-app='myApp'>
    <div ng-controller='myCtrl'>
        <json-tree json='jsonData'></json-tree>
    </div>
</div>
```

By default, it is used a **high** edit level that allows you to add new nodes,
reset node values to null, completely remove node, change value and type of the node (to object, array, string, number, boolean, null),
drag and sort tree nodes.

If you want to operate only with key-values of the nodes and avoid transformation of json tree, you can add **low** `edit-level` attribute like:
```html
<json-tree json='jsonData' edit-level='low'></json-tree>
```

You can completely refresh directive by using directive internal refresh function. To access this function just add `node` attribute like:
```html
<json-tree json='jsonData' edit-level='low' node='nodeOptions'></json-tree>
```
and then use it in controller as:
```javascript
$scope.nodeOptions.refresh();
```

Drag and sort your tree nodes via pressed `Ctrl` key.

Add more style to prettify the view. See complete example in `example.html` file.

---
For more details of technically usage, please, watch example [online](https://rawgithub.com/krispo/json-tree/master/example.html) and test it.
There is given a short instruction.