'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('PlayerCtrl', ['$timeout', '$scope','$rootScope', 'player','broadcastData','metadata',function ($timeout, $scope, $rootScope, player, broadcastData, metadata) {

    var self = this; // so assign this to self to avoid the conflict 'this' in other functions

    self.metadata = metadata;//so wont conflict with 'this' when use metadata in functions
    self.broadcastData = broadcastData;

    self.button = 'Play';
    self.trackList_bool = false;
    self.show = false; // this is right
    self.volume = 0.5;
    player.setVolume({volume : self.volume});

    $scope.$on(broadcastData.events.stopNow, function(){ 
        self.button = 'Play';
        player.stopNow(); 
    });

    $scope.$on(broadcastData.events.newTrackReady, function(event, data){ 
        broadcastData.setInfoPanel('');
        //autoplay
        player.playNow(event, data); 
    });

    $scope.$on(broadcastData.events.playerOnError, function(event, data){ 
        player.playerOnError(event, data); 
        self.button = 'Play';
    });

    $scope.$on(broadcastData.events.timeUpdate, function(event, data) {

        if (data.currentTime > metadata.playTimeMSec) {
            return; // bad current time
        }
        metadata.currentTime = data.currentTime; //metadata.currentTime wont auto update in this scope, apply
        metadata.duration = data.duration; 
        metadata.percentage = data.percentage; 
        $timeout(function(){//not mess up degist cycle
            $scope.$apply();
        });
        
    });

    self.slider = {
        'options': {
        start: function () { 
        },
        stop: function () { 
            player.setVolume({volume : self.volume});
        }
    }};

    //public functions avaliable in the scope
    self.updateStation = function() {
        playStation();
    };

    // when click skip
    self.playAfterTrack = function() {

        if(typeof broadcastData.trackList.index === 'undefined'){
            //need to get playlist first
            playStation();
        }
        else
        {
            if (broadcastData.trackList.index === broadcastData.trackList.trackArray.length) {
                broadcastData.trackList.index = 0;
            }else{
                broadcastData.trackList.index++;
            }

            var eventData = {
                trackList : broadcastData.trackList
            };

            $rootScope.$broadcast(broadcastData.events.newTrackReady, eventData);
            self.button = 'Stop';
        }

    };


    // when click backward 15secs
    self.seeking = function(direction) {
        var pos = metadata.currentTime;
        if(direction === 'backward'){
            if(metadata.currentTime < 15){
                pos = 0;
            }else{
                pos = pos - 15;
            }
        }
        else if(direction === 'forward'){
            if(metadata.duration - metadata.currentTime < 15){
                pos = metadata.duration;
            }else{
                pos = pos + 15;
            }
        }  
        player.seek(pos); 
    };

    //
    self.playTrack = function(trackId){
        broadcastData.setTrackId(trackId);
        self.play(1);
    };

    // when click play or autoplay is on
    self.play = function(force) {
        if(typeof broadcastData.wpPlayer.nStationId !== 'undefined' && broadcastData.wpPlayer.nStationId){ //no use since not set yet
            if (self.button === 'Play' || typeof force !== 'undefined' && force === 1) {
                playStation();

/*
if(!!navigator.platform.match(/iPhone|iPod|iPad/)){
console.log('IOS devices!!!!');
                        //IOS has to play here. setMedia has to be in metadata.updateMetadata
                        var jplayer = broadcastData.jPlayer;
                        //if don't setMedia here, have to click twice to play for IOS
                        jplayer.jPlayer('setMedia',{m4a:'http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a'});
                        //use metadataPromise to get the promise
                        /*var path = broadcastData.sAPIHost+'/metadata/stations/'+broadcastData.wpPlayer.nStationId+'/currentTrack';
                        metadataPromise.get(path).then(function(track){
    console.log('INSIDE THE PROMISE'+track.data.assetPath);
                            jplayer.jPlayer('setMedia',{mp3:track.data.assetPath});
                            // can not put play here since the play can not be in the promise?
                            //jplayer.jPlayer('play');
                        }, function(track){
                            $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'playerError'});
                        });
                        jplayer.jPlayer('play');
                        //////end of for IOS
                    }
*/



            } else {
                self.button = 'Play'; //too early to change the play button!!
                $rootScope.$broadcast(broadcastData.events.stopNow);
            }
        }
        else{
            //$rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'MissingStationId'});
            broadcastData.sendNotice({'sNoticeName':'Error-NoStationId','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState': self.show});
        }
    };

    //private functions, calling by public functions
    function playStation() {
        var eventData = {stationName: broadcastData.wpPlayer.nStationId, playlistId: broadcastData.wpPlayer.nPlaylistId, trackId: broadcastData.wpPlayer.nTrackId, trackUid: broadcastData.wpPlayer.nTrackUsageId};
        self.button = 'Stop'; //too early to change the play button
        if(typeof broadcastData.wpPlayer.bAutoPlay === 'undefined' || broadcastData.wpPlayer.bAutoPlay  === 0){self.button = 'Play';}
        $rootScope.$broadcast(broadcastData.events.beforeStreamFirstTrack, eventData);
    }

    // show current playlist track list
    self.showTrackList = function() {
        self.trackList_bool = !self.trackList_bool;
    };

    self.toggleTrackList = function() {
        self.show = !self.show;
        var uuid = broadcastData.wpPlayer.trackId;
        if (typeof broadcastData.trackList !== 'undefined' && broadcastData.trackList.index !== 'undefined'){
            uuid = broadcastData.trackList.trackArray[broadcastData.trackList.index].id;
        }
        broadcastData.sendNotice({'sNoticeName':'TracksView_requestedFromPlayer','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'nTrackID':broadcastData.wpPlayer.trackId,'nUID':uuid,'sState': self.show});
    };
    
    //triggers for play, autoplay=true
    if(broadcastData.wpPlayer.bAutoPlay){self.play();}

  }]);
