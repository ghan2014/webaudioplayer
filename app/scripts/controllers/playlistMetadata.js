'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:PlaylistMetadataCtrl
 * @description
 * # PlaylistMetadataCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('PlaylistMetadataCtrl', ['$http', '$rootScope', '$scope','broadcastData','playlistMetadata',function ($http, $rootScope, $scope,broadcastData, playlistMetadata) {

    var self = this;

    //$scope.metadata = metadata; // this is NOT right
    //self.playlistMetadata = playlistMetadata; // this is right
    self.playlistMetadata = playlistMetadata; // this is right
    self.broadcastData = broadcastData; // this is right
    self.show = false; // this is right

    $scope.$on(broadcastData.events.playerOnError, function(){ 
      broadcastData.setInfoPanel('NoPlaylistMetadataInfo');
    });

    if(typeof broadcastData.wpPlayer.nPlaylistId !== 'undefined' && broadcastData.wpPlayer.nPlaylistId !== 0){
      var path = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId + '/playlists/' + broadcastData.wpPlayer.nPlaylistId;
      playlistMetadata.getPlaylistMetadata(path).
          then(function(pData) {
            playlistMetadata.name = pData.name;
         });

    }
    else{
      $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Missing Playlist ID'});
    }

  }]);