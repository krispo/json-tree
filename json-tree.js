(function(){

    'use strict';

    angular.module('json-tree', [])

        .directive('jsonTree', ['$compile', function($compile){
            return {
                restrict: 'EA',
                scope: {
                    json: '=',
                    node: '=?',
                    childs: '=?',
                    editLevel: '@'
                },
                controller: function($scope){

                    /* initialize container for child nodes */
                    $scope.childs = {};

                    /* define auxiliary functions */
                    $scope.utils = {

                        /* prettify json view */
                        wrap: {
                            start: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '[';
                                    case 'object': return '{';
                                    default: return '';
                                };
                            },
                            middle: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '...';
                                    case 'object': return '...';
                                    default: return '';
                                };
                            },
                            end: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return ']';
                                    case 'object': return '}';
                                    default: return '';
                                };
                            },
                            isLastIndex: function(node, index){
                                if (node === undefined || node === null) return true
                                else return index >= node.length();
                            }
                        },

                        /* collapse/expand node by clicking */
                        clickNode: function(node){
                            node.isCollapsed = !node.isCollapsed;
                        },

                        /* add new node to the collection */
                        addNode: function(key, value){
                            var json = null;
                            try {
                                json = JSON.parse(value);
                            } catch (e){}

                            /* add element to the object */
                            if ($scope.node.type() === 'object') {
                                if (json !== null){
                                    $scope.json[key] = json
                                } else {
                                    $scope.json[key] = value
                                }

                            }
                            /* add element(s) to the array */
                            else if ($scope.node.type() === 'array') {
                                if (json !== null) {
                                    if (json.constructor === Array){
                                        /* push new array elements to the array */
                                        $scope.json.push.apply($scope.json, json);
                                    } else {
                                        /* push single element to the array */
                                        $scope.json.push(json);
                                    }
                                } else {
                                    $scope.json.push(value);
                                }
                            };
                            $scope.refresh();
                        },

                        /* reset node value by key to default == null */
                        resetNode: function(key){
                            $scope.json[key] = null;
                            $scope.refresh();
                        },

                        /* remove node by key from json */
                        removeNode: function(key){
                            if ($scope.node.type() === 'object')
                                delete $scope.json[key]
                            else if ($scope.node.type() === 'array')
                                $scope.json.splice(key, 1);
                            $scope.refresh();
                        },

                        /* validate text if input to the form */
                        validateNode: function(key){
                            /* check if null or "" */
                            if (!$scope.json[key])
                                $scope.json[key] = null;

                            /* try to convert string to number */
                            else if (!isNaN(+$scope.json[key]) && isFinite($scope.json[key]))
                                $scope.json[key] = +$scope.json[key];

                            /* try to parse string to json */
                            else {
                                if ($scope.node.isHighEditLevel){ /* if high editable level */
                                    try {
                                        var json = JSON.parse($scope.json[key]);
                                        $scope.json[key] = json;
                                        $scope.refresh();
                                    } catch (e){}
                                } else { /* if low editable level */
                                    /* check if boolean input -> then refresh */
                                    if ($scope.json[key] === "true" || $scope.json[key] === "false") {
                                        $scope.json[key] = JSON.parse($scope.json[key]);
                                        $scope.refresh();
                                    }
                                }
                            }
                        },

                        /* to skip ordering in ng-repeat */
                        keys: function(obj){
                            return (obj instanceof Object) ? Object.keys(obj) : [];
                        },

                        /* get type for variable val */
                        getType: function(val){
                            if (val === null) return 'null'
                            else if (val === undefined) return 'undefined'
                            else if (val.constructor === Array) return 'array'
                            else if (val.constructor === Object) return 'object'
                            else if (val.constructor === String) return 'string'
                            else if (val.constructor === Number) return 'number'
                            else if (val.constructor === Boolean) return 'boolean'
                            else if (val.constructor === Function) return 'function'
                        }
                    };

                    /* define properties of the current node */
                    $scope.node = {

                        /* check node is collapsed */
                        isCollapsed: true,

                        /* check editing level is high */
                        isHighEditLevel: $scope.editLevel !== "low",

                        /* check current node is object or array */
                        isObject: function(){
                            return angular.isObject($scope.json)
                        },

                        /* get type for current node */
                        type: function(){
                            return $scope.utils.getType($scope.json);
                        },

                        /* calculate collection length for object or array */
                        length: function(){
                            return ($scope.json instanceof Object) ? (Object.keys($scope.json).length) : 1
                        },

                        /* refresh template view */
                        refresh: function(){
                            $scope.refresh();
                        }
                    };
                },
                link: function(scope, element, attrs){

                    /* define child scope and template */
                    var childScope = scope.$new(),
                        template =
                        '<span ng-bind="utils.wrap.start(node)"></span>' +
                        '<span ng-bind="node.isCollapsed ? utils.wrap.middle(node) : \'&nbsp;&nbsp;&nbsp;\'" ng-click="utils.clickNode(node)"></span>' +
                        '<ul ng-hide="node.isCollapsed">' +
                            '<li ng-repeat="key in utils.keys(json) track by key">' +
                                '<span class="key" ng-click="utils.clickNode(childs[key])">{{ key }}: </span>' +
                                '<span ng-hide="childs[key].isObject()">' +
                                    '<input ng-show="childs[key].type() === \'boolean\'" type="checkbox" ng-model="json[key]"/>' +
                                    '<input type="text" ng-model="json[key]" ng-change="utils.validateNode(key)" ng-disabled="childs[key].type() === \'function\'" placeholder="null"/>' +
                                '</span>' +
                                '<json-tree json="json[key]" edit-level="{{editLevel}}" node="childs[key]" ng-show="childs[key].isObject()"></json-tree>' +
                                '<span class="reset" ng-dblclick="utils.resetNode(key)" ng-show="node.isHighEditLevel"> ~ </span>' +
                                '<span class="remove" ng-dblclick="utils.removeNode(key)" ng-show="node.isHighEditLevel">-</span>' +
                                '<span class="comma" ng-hide="utils.wrap.isLastIndex(node, $index + 1)">,</span>' +
                            '</li>' +
                        '</ul>' +
                        '<span ng-bind="utils.wrap.end(node)"></span>' +
                        '<span class="add" ng-show="node.isHighEditLevel && node.isObject()" ng-click="addTpl = !addTpl; inputKey = null; inputValue = null"> + </span>' +
                        '<span ng-show="(addTpl && node.isHighEditLevel) || false">' +
                            '<span ng-show="node.type() === \'object\'"><input type="text" ng-model="inputKey" placeholder="key"/>: <input type="text" ng-model="inputValue" placeholder="value"/></span>' +
                            '<span ng-show="node.type() === \'array\'"><input type="text" ng-model="inputValue" placeholder="value"/></span>' +
                            '<button ng-click="utils.addNode(inputKey, inputValue); addTpl = false">+</button><button ng-click="addTpl = false">c</button>' +
                        '</span>';

                    /* define build template function */
                    scope.build = function(_scope){
                        if (scope.node.isObject()){
                            element.html('').append($compile(template)(_scope));
                        }
                    };

                    /* define refresh function */
                    scope.refresh = function(){
                        childScope.$destroy();
                        childScope = scope.$new();
                        scope.build(childScope);
                    };

                    /* build template view */
                    scope.build(childScope);
                }
            }
        }])
})()