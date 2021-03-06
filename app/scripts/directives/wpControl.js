'use strict';

/**
 * @ngdoc directive
 * @name webPlayerMiniAppApp.directive:wpControl
 * @description
 * # wpControl
 */
angular.module('webPlayerMiniAppApp')
    .directive('wpControl', function (Themer) {
    	console.log('------wpcontrol directive');
        return {
            restrict: 'E', // directive only for use as html element
            transclude: true, // we want to allow contents to have access to scope above us if it wants (do not contain contents in our scope)
            link: function (scope, element) {
            	console.log('---- wpcontrol link');
                Themer.showTheme(scope, element, 'control');
            }
        };
    });
