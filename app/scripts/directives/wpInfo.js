'use strict';

/**
 * @ngdoc directive
 * @name webPlayerMiniAppApp.directive:wpInfo
 * @description
 * # wpInfo
 */
angular.module('webPlayerMiniAppApp')
    .directive('wpInfo', ['broadcastData',function (broadcastData) {
        console.log('2----wpInfo directive');
        console.log(broadcastData.sInfoPanel);

        return {
            templateUrl: 'views/info.html',
            restrict: 'E',
            controller: function ($scope) {
                console.log('4---wpInfo directive--info controller');
                
                console.log(broadcastData.sInfoPanel);

                switch (broadcastData.sInfoPanel) {
                    case 'playerInit':
                        $scope.show = true;
                        $scope.init = true;
                        break;
                    case 'playerLoading':
                        $scope.show = true;
                        $scope.loading = true;
                        break;
                    case 'playerError':
                        $scope.show = true;
                        $scope.error = true;
                        break;
                    case 'playerSuccess':
                        $scope.show = false;
                        break;
                    default:
                        $scope.show = false;
                        break;
                }
            }
        };
    }]);
