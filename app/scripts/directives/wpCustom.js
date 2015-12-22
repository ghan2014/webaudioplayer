'use strict';

/**
 * @ngdoc directive
 * @name webPlayerMiniAppApp.directive:wpCustom
 * @description
 * # wpCustom
 */
angular.module('webPlayerMiniAppApp')
    .directive('wpCustom', function (Themer) {
        return {
            restrict: 'E', // directive only for use as html element
            transclude: true, // we want to allow contents to have access to scope above us if it wants (do not contain contents in our scope)
            link: function (scope, element) {
            	console.log('---- wpcustom link');
                Themer.showTheme(scope, element, 'custom');
            }
        };
    });
