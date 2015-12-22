'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:ShareCtrl
 * @description
 * # ShareCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('ShareCtrl', ['$rootScope', '$scope','share','broadcastData',function ($rootScope, $scope, share, broadcastData) {

    var self = this;

    self.share = share; // this is right
    self.broadcastData = broadcastData; // this is right

    self.show = false; // this is right

    $scope.$on(broadcastData.events.playerOnError, function(){ 
      broadcastData.setInfoPanel('NoStationInfo');
    });

    if(broadcastData.wpPlayer.nStationId && broadcastData.wpPlayer.nPlaylistId){
      var path = broadcastData.sRestAPIHost + broadcastData.wpPlayer.nStationId;
      share.fb(path);
    }
    else{
      $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Missing Episode ID'});
    }

    this.toggleShare = function(){
      self.show = !self.show;
      var uuid = broadcastData.wpPlayer.trackId;
      var trackid = broadcastData.wpPlayer.trackId;
      if (typeof broadcastData.trackList !== 'undefined' && broadcastData.trackList.index !== 'undefined'){
          uuid = broadcastData.trackList.trackArray[broadcastData.trackList.index].id;
          trackid = broadcastData.trackList.trackArray[broadcastData.trackList.index].trackId;
      }
      broadcastData.sendNotice({'sNoticeName':'ShareView_requestedFromPlayer','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'nTrackID':trackid,'nUID':uuid,'sState': self.show});
    };

  }]);
