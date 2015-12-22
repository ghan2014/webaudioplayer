'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Metadata
 * @description
 * # Metadata
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('metadata', ['$http','$rootScope','broadcastData',function ($http, $rootScope, broadcastData) {

    var start = Math.floor(Date.now());
    var metadata = {
        startTimer : undefined,
        resetTimer : undefined,
        laspedTimer : undefined,
        updateMetadata : undefined,
        filename : undefined,
        nextPath : undefined,
        trackId : undefined,
        id : undefined,
        title : '',
        artist : '',
        album : '',
        imageURL : '',
        playTimeMSec : 0,
        offsetMSec : 0,
        currentTime: 0,
        duration: 0,
        percentage: 0,
        retry:0,
        preFilename: undefined,
        codec:undefined
    };

    metadata.reset = function(){
        metadata.startTime = undefined;
        metadata.resetTimer();
        metadata.trackId = undefined;
        metadata.id = undefined;
        metadata.title = '';
        metadata.artist = '';
        metadata.album = '';
        metadata.imageURL = '';
        metadata.filename = undefined;
        metadata.nextPath = undefined;
        metadata.playTimeMSec = 0;
        metadata.offsetMSec = 0;
        metadata.currentTime = 0;
        metadata.duration = 0;
        metadata.percentage = 0;
        metadata.retry = 0;
        metadata.preFilename = undefined;
        metadata.codec = undefined;
    };

    metadata.startTimer = function(){
        metadata.startTime = Math.floor(Date.now());
    };

    metadata.lapsedTimer = function(){
        if(metadata.startTime){
            var current = Math.floor(Date.now());
            return Math.floor((current - metadata.startTime) / 1000);
        }
        return 0;
    };

    metadata.resetTimer = function(){
        metadata.startTime = undefined;
    };

    metadata.resetMetadata = function(currentTrack){
            metadata.trackId = currentTrack.trackId;
            metadata.id = currentTrack.id;
            metadata.title = currentTrack.title;
            metadata.artist = currentTrack.artist;
            metadata.album = currentTrack.album;
            metadata.imageURL = currentTrack.imageURL;
            metadata.startTimer();
            metadata.playTimeMSec = currentTrack.playTimeMSec/1000;
            metadata.offsetMSec = currentTrack.offsetMSec/1000;
            metadata.currentTime = 0;
            metadata.duration = 0;
            metadata.percentage = 0;
            metadata.codec = currentTrack.codec;
            start = Math.floor(Date.now());
    };


    metadata.updateMetadata = function(path){
        var req = broadcastData.getReq(path);
        
        $http(req).success(function(trackList){
            if(!trackList.length){broadcastData.sInfoPanel = true;}
        
            metadata.trackId = trackList[0].trackId;
            metadata.id = trackList[0].id;
            metadata.title = trackList[0].title;
            metadata.artist = trackList[0].artist;
            metadata.album = trackList[0].album;
            metadata.imageURL = trackList[0].imageURL;
            metadata.startTimer();
            metadata.preFilename = metadata.filename;
            metadata.filename = trackList[0].filename;
            metadata.nextPath = trackList[0].nextPath;
            metadata.playTimeMSec = trackList[0].playTimeMSec/1000;
            metadata.offsetMSec = trackList[0].offsetMSec/1000;
            metadata.currentTime = 0;
            metadata.duration = 0;
            metadata.percentage = 0;
            metadata.codec = trackList[0].codec;

            start = Math.floor(Date.now());

            //if has trackid passed in
            var nIndex = 0;
            if(typeof broadcastData.wpPlayer.nTrackUsageId !== 'undefined' && broadcastData.wpPlayer.nTrackUsageId){
                //loop through the playlist tracks and find the index of passedin trackid
                for(var i=0;i<trackList.length;i++){
                    if(trackList[i].id === broadcastData.wpPlayer.nTrackUsageId){
                        nIndex = i;
                        break;
                    }
                }
            }
            else if(typeof broadcastData.wpPlayer.nTrackId !== 'undefined' && broadcastData.wpPlayer.nTrackId){
                //loop through the playlist tracks and find the index of passedin trackid
                for(var i=0;i<trackList.length;i++){
                    if(parseInt(trackList[i].trackId) === parseInt(broadcastData.wpPlayer.nTrackId)){
                        nIndex = i;
                        break;
                    }
                }
            }
            
            broadcastData.trackList = {trackArray:trackList, index:nIndex};

            var eventData = {
                trackList : broadcastData.trackList
            };

            $rootScope.$broadcast(broadcastData.events.newTrackReady, eventData);

        }).error(function(){
            
            broadcastData.sInfoPanel = 'playerError';
            $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'playerError'});
            return;
        });
    };

    metadata.progressPercent = function() { 
        return (metadata.currentTime/metadata.duration)*100;
    };

    return metadata;

  }]);
