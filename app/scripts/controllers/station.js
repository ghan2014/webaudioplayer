'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:MetadataCtrl
 * @description
 * # MetadataCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('StationCtrl', ['$http', '$rootScope', '$scope','station','broadcastData',function ($http, $rootScope, $scope, station, broadcastData) {

    //$scope.metadata = metadata; // this is NOT right
    this.station = station; // this is right
    this.broadcastData = broadcastData; // this is right

    $scope.$on(broadcastData.events.playerOnError, function(){ 
      broadcastData.setInfoPanel('NoStationInfo');
    });

    if(broadcastData.wpPlayer.nStationId){
      var path = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId;
      station.getStation(path);
    }else{
      $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Missing Station ID'});
    }


  }]);
