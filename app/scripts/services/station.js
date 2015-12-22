'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.StationCtrl
 * @description
 * # StationCtrl
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('station', ['$http','$rootScope', 'broadcastData',function ($http, $rootScope, broadcastData) {
    var station = {
        stationName : undefined
    };

    station.getStation = function(path){
        var req = broadcastData.getReq(path);

        $http(req).success(function(data){
            if(data.message){broadcastData.sInfoPanel = true;}
            station.stationName = data.title;

            var eventData = {
                stationName : station.stationName
            };

            $rootScope.$broadcast(broadcastData.events.stationReady, eventData);
        }).error(function(){ 
            broadcastData.sInfoPanel = 'StationError';
            $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'StationError'});
            return;
        });

    };

    return station;

  }]);
