# Editable JSON tree

An AngularJS directive used for displaying and editing JSON data in a tree view.

## How to use

Add scripts to your main html:
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js"></script>
<script src="https://raw2.github.com/krispo/json-tree/master/json-tree.js"></script>
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

Add more style to prettify the view (see example.html).

---
watch it [online](https://rawgithub.com/krispo/json-tree/master/example.html).