'use strict';

/**
 * @ngdoc directive
 * @name webPlayerMiniAppApp.directive:wpMain
 * @description
 * # wpMain
 */
angular.module('webPlayerMiniAppApp')
    .directive('wpMain', function (Themer) {
    	console.log('3-----wpMain directive');
        return {
            restrict: 'E', // directive only for use as html element
            transclude: true, // we want to allow contents to have access to scope above us if it wants (do not contain contents in our scope)
            link: function (scope, element) {
            	console.log('5--wpMain link function----'+element);
                Themer.showTheme(scope, element, 'main');
            }
        };
    });
