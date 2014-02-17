(function(){

    'use strict';

    angular.module('json-tree', [])

        .directive('jsonTree', ['$compile', function($compile){
            return {
                restrict: 'EA',
                scope: {
                    json: '=',
                    node: '=?',
                    childs: '=?'
                },
                controller: function($scope){
                    /* initialize container for child nodes */
                    $scope.childs = {};

                    /* define auxiliary functions */
                    $scope.utils = {

                        /* prettify json view */
                        wrap: {
                            start: function(node){
                                if (node === undefined) return ''
                                else if (node.type === 'array') return '['
                                else if (node.type === 'object') return '{'
                                else return '';
                            },
                            middle: function(node){
                                if (node === undefined) return ''
                                else if (node.type === 'array') return '...'
                                else if (node.type === 'object') return '...'
                                else return '';
                            },
                            end: function(node){
                                if (node === undefined) return ''
                                else if (node.type === 'array') return ']'
                                else if (node.type === 'object') return '}'
                                else return '';
                            },
                            isLastIndex: function(node, index){
                                return index >= node.length()
                            }
                        },

                        /* collapse/expand node by clicking */
                        nodeClick: function(node){
                            node.isCollapsed = !node.isCollapsed;
                        },

                        /* validate text if input to the form */
                        validate: function(key){
                            /*check if null or "" */
                            if (!$scope.json[key])
                                $scope.json[key] = null

                            /* try to convert string to number */
                            else if (!isNaN(+$scope.json[key]) && isFinite($scope.json[key]))
                                $scope.json[key] = +$scope.json[key];
                        },

                        /* to skip ordering in ng-repeat */
                        keys: function(obj){
                            return obj ? Object.keys(obj) : [];
                        }
                    };

                    /* define properties of the current node */
                    $scope.node = {

                        isCollapsed: true,

                        isObject: function(){
                            return angular.isObject($scope.json)
                        },

                        type: function(){
                            var val = $scope.json;
                            if (val === null) return 'null'
                            else if (val === undefined) return 'undefined'
                            else if (val.constructor === Array) return 'array'
                            else if (val.constructor === Object) return 'object'
                            else if (val.constructor === String) return 'string'
                            else if (val.constructor === Number) return 'number'
                            else if (val.constructor === Boolean) return 'boolean'
                            else if (val.constructor === Function) return 'function'
                        }(),

                        length: function(){
                            return ($scope.json instanceof Object) ? (Object.keys($scope.json).length) : 1
                        }
                    };
                },
                link: function(scope, element, attrs){
                    var template =
                        '<span ng-bind="utils.wrap.start(node)"></span>' +
                        '<span ng-bind="node.isCollapsed ? utils.wrap.middle(node) : \'&nbsp;&nbsp;&nbsp;\'" ng-click="utils.nodeClick(node)"></span>' +
                        '<ul ng-hide="node.isCollapsed">' +
                            '<li ng-repeat="key in utils.keys(json) track by key">' +
                                '<span class="key" ng-click="utils.nodeClick(childs[key])">{{ key }}: </span>' +
                                '<span ng-switch="childs[key].type" ng-hide="childs[key].isObject()">' +
                                    '<input ng-switch-when="boolean" type="checkbox" ng-model="json[key]"/><span ng-switch-when="boolean" ng-bind="json[key]"></span>' +
                                    '<input ng-switch-default type="text" ng-model="json[key]" ng-change="utils.validate(key)" ng-disabled="childs[key].type === \'function\'" placeholder="null"/>' +
                                '</span>' +
                                '<json-tree json="json[key]" node="childs[key]" ng-show="childs[key].isObject()"></json-tree>' +
                                '<span ng-hide="utils.wrap.isLastIndex(node, $index + 1)">,</span>' +
                            '</li>' +
                        '</ul>' +
                        '<span ng-bind="utils.wrap.end(node)"></span>';

                    if (scope.node.isObject()){
                        element.html('').append($compile(template)(scope));
                    }
                }
            }
        }])
})()
