'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:CommunicateCtrl
 * @description
 * # CommunicateCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('CommunicateCtrl', ['$rootScope', '$scope','broadcastData','station',function ($rootScope, $scope, broadcastData, station) {

    this.broadcastData = broadcastData; // this is right
    this.station = station; // this is right

    // play or stop commands from page, need pkg.stationID
    // should call a function in station controller to get station info, so stationName show
    // should call a function in player controller, so trigger the play or stop events

    this.execute_xtnl_command = function(targetSelector, targetCtrl, ctrlArgs){

      var vv = {};  
      vv.ctrlMethodReturn = {};

      //remember the pre-playlistid
      vv.prePlaylistId = broadcastData.wpPlayer.nPlaylistId;

      if ( angular.element( document.querySelector( targetSelector ) ).scope()) {
        vv.scope = angular.element( document.querySelector( targetSelector ) ).scope(); //get angular element scope
        vv.ctrl = vv.scope[targetCtrl];

        // setStationId, setAutoPlay
        vv.ctrlMethodReturn.setStationIdReturn = vv.ctrl.broadcastData.setStationId(ctrlArgs.notice.stationId);
        vv.ctrlMethodReturn.setPlaylistIdReturn = vv.ctrl.broadcastData.setPlaylistId(ctrlArgs.notice.playlistId);
        vv.ctrlMethodReturn.setTrackIdReturn = vv.ctrl.broadcastData.setTrackId(ctrlArgs.notice.trackId);
        vv.ctrlMethodReturn.setSessionIdReturn = vv.ctrl.broadcastData.setSessionId(ctrlArgs.notice.sessionId);
        vv.ctrlMethodReturn.setTrackUsageIdReturn = vv.ctrl.broadcastData.setTrackUsageId(ctrlArgs.notice.trackUid);
        vv.ctrlMethodReturn.setAutoPlayReturn = vv.ctrl.broadcastData.setAutoPlay(ctrlArgs.notice.autoplay);
        
        //set otice params globally
        LIVE365PLAYER.sessionId = ctrlArgs.notice.sessionId;
        LIVE365PLAYER.stationId = ctrlArgs.notice.stationId;
        LIVE365PLAYER.playlistId = ctrlArgs.notice.playlistId;
        LIVE365PLAYER.trackId = ctrlArgs.notice.trackId;
        LIVE365PLAYER.autoplay = ctrlArgs.notice.autoplay;
        LIVE365PLAYER.trackUsageId = ctrlArgs.notice.trackUid;

        //update station meta
        if(broadcastData.wpPlayer.nStationId){
          var path = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId;
          station.getStation(path);
        }else{
          $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Missing Station ID'});
        }

        //call play if at least has stationId and autoplay=1
        if (broadcastData.wpPlayer.nStationId && angular.element( document.querySelector( '.playerCtrl' ) ).scope()){
          vv.playerScope = angular.element( document.querySelector( '.playerCtrl') ).scope(); //get angular element scope
          //destroy the current playlist if no trackId passed in
          if(typeof ctrlArgs.notice.trackId === 'undefined' || ctrlArgs.notice.trackId.length === 0 || vv.prePlaylistId !== ctrlArgs.notice.playlistId){
            vv.ctrl.broadcastData.trackList = {};
          }
          
          if(typeof ctrlArgs.notice.autoplay !== 'undefined' && ctrlArgs.notice.autoplay !== 0){
            //force play
            vv.ctrlMethodReturn.playReturn = vv.playerScope.playerCtrl.play(1);
          }else{
            //stop
            vv.ctrlMethodReturn.playReturn = vv.playerScope.playerCtrl.play();
          }
          
        }
      
      }
      else {
        console.log('>>> LIVE365PLAYER execute_xtnl_command -  COULD NOT EXECUTE NG. PLAYER HAS NO Container');
      }

      return vv.ctrlMethodReturn;

    };

    this.getCurrentPlayingTrack = function(){
      var currentTrack = broadcastData.trackList.trackArray[broadcastData.trackList.index];
      var uuid = currentTrack.id;
      broadcastData.sendNotice({'sNoticeName':'TrackInfo_requestedFromSPAResponse','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'nTrackID':broadcastData.wpPlayer.nTrackId,'nUID':uuid,'sState':'playing'});
    };
    

  }]);
