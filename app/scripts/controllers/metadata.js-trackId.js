'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:MetadataCtrl
 * @description
 * # MetadataCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('MetadataCtrl', ['$http', '$rootScope', '$scope','metadata','broadcastData','playlistMetadata',function ($http, $rootScope, $scope, metadata, broadcastData, playlistMetadata) {

    //$scope.metadata = metadata; // this is NOT right
    this.metadata = metadata; // this is right
    this.broadcastData = broadcastData; // this is right
    this.playlistMetadata = playlistMetadata;

    $scope.$on(broadcastData.events.stopNow, function(){
      metadata.reset();
      broadcastData.sendNotice({'sNoticeName':'Player_stop','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'stop'});
    });

    $scope.$on(broadcastData.events.beforeStreamFirstTrack, function(event, data){
      //if already palying a playlist
      if(typeof broadcastData.trackList.index !== 'undefined' && parseInt(broadcastData.trackList.index) < broadcastData.trackList.trackArray.length){
        //resume
        //if we switch tracks, find the index for that track, and set broadcastData.trackList.index = new track
        //if has trackid passed in, need a utility later to get the index!!!
          if(typeof data.trackId !== 'undefined' && data.trackId){
                //assume the same playlist(clear trackList in communicate if diff playlists), 
                //loop through the playlist tracks and find the index of passedin trackid
                for(var i=0;i<broadcastData.trackList.trackArray.length;i++){
                    if(parseInt(broadcastData.trackList.trackArray[i].trackId) === parseInt(data.trackId)){
                      if(typeof data.trackUid !== 'undefined' && data.trackUid){

                      }else{
                        broadcastData.trackList.index = i;
                        break;
                      }
                    }
                }
          }
          var eventData = {
            trackList : broadcastData.trackList,
            eventData : data
          };
          
          $rootScope.$broadcast(broadcastData.events.newTrackReady, eventData);

      }
      else{
        //need to fetch a new playlist based on data.stationName, data.playlistId, data.trackId
        //if just have stationId
        if(typeof data.stationName !== 'undefined' && (typeof data.playlistId === 'undefined' || !data.playlistId))
        {
          //get primary playlistId
          var path1 = broadcastData.sRestAPIHost + data.stationName + '/playlists/primary';
          var req = broadcastData.getReq(path1,'GET');
          $http(req).success(function(primaryPlaylist){

              broadcastData.wpPlayer.nPlaylistId = parseInt(primaryPlaylist.id);
              broadcastData.setInfoPanel('PlaylistMetadataLoaded');

              var path2 = broadcastData.sRestAPIHost + data.stationName + '/playlists/' + primaryPlaylist.id + '/tracks';
              metadata.updateMetadata(path2);

              //update playlistMetadat for displaying playlistName
              if(typeof broadcastData.wpPlayer.nPlaylistId !== 'undefined' && broadcastData.wpPlayer.nPlaylistId !== 0){
                var path3 = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId + '/playlists/' + broadcastData.wpPlayer.nPlaylistId;
                playlistMetadata.getPlaylistMetadata(path3).
                    then(function(pData) {
                      playlistMetadata.name = pData.name;
                    });
              }
              else{
                //$rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Missing Playlist ID'});
                broadcastData.setInfoPanel('Error-NoPlaylistMeta');
              }

          }).error(function(){
              console.log(' call to ' + req + ' failed' );
              broadcastData.setInfoPanel('Error-NoPrimaryPlaylist');

              return;
          });
/*
                    $http.get(path).then(
                      function(primaryPlaylist) {
console.log('Async Primary playlist id='+primaryPlaylist.data.id);
                        broadcastData.wpPlayer.nPlaylistId = parseInt(primaryPlaylist.id);
                        broadcastData.setInfoPanel('PlaylistMetadataLoaded');

                        var path = broadcastData.sRestAPIHost + data.stationName + '/playlists/' + primaryPlaylist.id + '/tracks';
                        metadata.updateMetadata(path);
                      },
                      function() {
                        console.log(' call to ' + path + ' failed' );
                        broadcastData.setInfoPanel('Error-NoPlaylist');
                      },
                      function() {
                       // report progress
                    });
*/

        }
        //if have stationId + playlistId - traclId
        else if(typeof data.stationName !== 'undefined' && typeof data.playlistId !== 'undefined' && (typeof data.trackId === 'undefined' || !data.trackId)){
          var path4 = broadcastData.sRestAPIHost + data.stationName + '/playlists/' + data.playlistId + '/tracks';
          broadcastData.wpPlayer.nPlaylistId = data.playlistId;
          metadata.updateMetadata(path4);

          //update playlistMetadat for displaying playlistName
          var path5 = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId + '/playlists/' + broadcastData.wpPlayer.nPlaylistId;
          playlistMetadata.getPlaylistMetadata(path5).
              then(function(pData) {
                playlistMetadata.name = pData.name;
              });
        }
        //if have stationId + playlistId + trackId
        else if(typeof data.stationName !== 'undefined' && typeof data.playlistId !== 'undefined' && typeof data.trackId !== 'undefined'){
          var path6 = broadcastData.sRestAPIHost + data.stationName + '/playlists/' + data.playlistId + '/tracks';
          broadcastData.wpPlayer.nTrackId = data.trackId;
          metadata.updateMetadata(path6);

          //update playlistMetadat for displaying playlistName
          var path7 = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId + '/playlists/' + broadcastData.wpPlayer.nPlaylistId;
          playlistMetadata.getPlaylistMetadata(path7).
              then(function(pData) {
                playlistMetadata.name = pData.name;
              });
        }

      }

    });

    $scope.$on(broadcastData.events.trackEnded, function(){
      updateSongLog();
      broadcastData.trackList.index++;
      var eventData = {
            trackList : broadcastData.trackList
          };
      $rootScope.$broadcast(broadcastData.events.newTrackReady, eventData);
    });

    $scope.$on(broadcastData.events.playerOnError, function(){ 
      broadcastData.setInfoPanel('NoTrackInfo');
    });

    function updateSongLog(){
      var path = broadcastData.sAPIHost + '/songLog';
      var post_data = {
        trackId : metadata.trackId,
        title : metadata.title,
        artist : metadata.artist,
        album : metadata.album,
        endAfterSec : metadata.lapsedTimer()
      };

      var resp = $http.post(path, post_data);
      resp.success(function(){
        console.log(' song' + metadata.title + ' logged' );
      });
      resp.error(function(){
        console.log(' call to ' + path + ' failed' );
      });
    } 

  }]);
