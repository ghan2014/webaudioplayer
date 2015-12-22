'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Player
 * @description
 * # Player
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('player', ['$http','$rootScope', 'broadcastData', 'metadata', function ($http, $rootScope, broadcastData, metadata) {

    // singleton
    var player = {};

    var jplayer = broadcastData.jPlayer;

    player.playNow = function(event, data){
        // otherwise the event.ended accumalated there
        jplayer.unbind($.jPlayer.event.ended);
        jplayer.unbind($.jPlayer.event.timeupdate);

        jplayer.one($.jPlayer.event.ended, function(){
            console.log(data.filename + 'ended in player');
            $rootScope.$broadcast(broadcastData.events.trackEnded, data);
        });

        jplayer.one($.jPlayer.event.play, function(){
            console.log(data.filename + 'call jplayer play');
            broadcastData.sendNotice({'sNoticeName':'Player_play','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'play'});
        });

        jplayer.one($.jPlayer.event.stop, function(){
            broadcastData.sendNotice({'sNoticeName':'Player_stop','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'stop'});
        });

        jplayer.one($.jPlayer.event.error, function(err){
            console.log(err);
            console.log('Bad asset on= ' + data.filename + ' preFilename=' +metadata.preFilename + ' filename=' + metadata.filename + ' retry=' + metadata.retry);
            //retry 3 times as mobile players did and tehn stop before fire off trackEnded event
            //$rootScope.$broadcast(broadcastData.events.trackEnded, data);

            if(err.jPlayer.error.type !== 'e_url' && metadata.retry < 3 && metadata.preFilename !== metadata.filename){
                metadata.retry++;
                var eventData = {stationName: broadcastData.wpPlayer.nStationId};
                $rootScope.$broadcast(broadcastData.events.beforeStreamFirstTrack, eventData);
            }
            else{
                metadata.retry = 0;
                $rootScope.$broadcast(broadcastData.events.stopNow);
                broadcastData.sendNotice({'sNoticeName':'Player_changeState','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'error'});
            }
        });
        //if(jplayer.data().jPlayer.status.paused){
        // Now we have a list of tracks instead of just one, but still need to play one by one since we need to ask for token for each track
        if(broadcastData.trackList.index === broadcastData.trackList.trackArray.length){
            broadcastData.trackList.index = 0;
        }
        var currentTrack = broadcastData.trackList.trackArray[broadcastData.trackList.index];

        if (broadcastData.trackList.index >= 0){
            //update meta data: title, artist, album, and imageURL
            metadata.resetMetadata(currentTrack);
            //set the trackId for broadcastData.wpPlayer.trackId
            broadcastData.wpPlayer.nTrackId = currentTrack.trackId;
        }

if(typeof broadcastData.wpPlayer.bAutoPlay === 'boolean' || broadcastData.wpPlayer.bAutoPlay === 1){
        if(broadcastData.trackList.trackArray.length > broadcastData.trackList.index){
                var codec = currentTrack.codec;
                //var trackId = currentTrack.trackId;
                var uuid = currentTrack.id;
                // call API to get token
                var tokenPath = broadcastData.sRestAPIHost + currentTrack.stationId + '/playlists/' + currentTrack.playlistId + '/tracks/' + currentTrack.id + '/access_token';
                var req = broadcastData.getReq(tokenPath, 'POST');
                req.data = { num : 1};

                $http(req).success(function(tokenData){

                    //call API to get media file
                    var mediaPath = broadcastData.sAPIHost + '/asset/stations/' + currentTrack.stationId + '/playlists/' + currentTrack.playlistId + '/tracks/' + uuid + '?token=' + tokenData.accessToken;


var isiPad = navigator.userAgent.match(/iPad/i) !== null;
//if(isiPad){codec = 'mp3'; mediaPath = 'http://f.ordify.net/audio/alarm.mp3';}
if(isiPad){
    //mediaPath = 'http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a';
    //mediaPath = 'http://www.jplayer.org/audio/m4a/bubble.m4a';
    //mediaPath = 'http://www.jplayer.org/audio/m4a/bubble';
    //mediaPath = 'assets/testios.m4a';
    //mediaPath = 'assets/testios';
    //mediaPath = mediaPath + '&a=b.m4a';
    mediaPath = metadata.filename;
}

                        if(codec === 'm4a'){
                            jplayer.jPlayer('setMedia',{
                                m4a: mediaPath
                            });
                            jplayer.jPlayer('play');

                            //broadcastData.trackList.index++;
                        }
                        else if(codec === 'mp3'){
                            jplayer.jPlayer('setMedia',{
                                mp3: mediaPath
                            });
                            jplayer.jPlayer('play');
                            //broadcastData.trackList.index++; 
                        }
                        else{
                            broadcastData.sInfoPanel = 'playerError';
                            $rootScope.$broadcast(broadcastData.events.playerOnError, {'playerErrorMessage' : 'Bad Format'});
                            return;
                        }
                        broadcastData.sendNotice({'sNoticeName':'CurrentTrack_playStarted','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'nTrackID':broadcastData.wpPlayer.nTrackId,'nUID':uuid,'sState':'playing'});

                }).error(function(){
                    console.log('call token failed');
                });    
        }
}

        jplayer.bind($.jPlayer.event.timeupdate,
            function(event) {
                $rootScope.$broadcast(broadcastData.events.timeUpdate, {currentTime: event.jPlayer.status.currentTime, duration: event.jPlayer.status.duration, percentage: event.jPlayer.status.currentPercentAbsolute});
        });
    };

    player.stopNow = function(){
        if(jplayer){ jplayer.jPlayer('stop');}
        broadcastData.sendNotice({'sNoticeName':'Player_stop','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'stop'});
    };

    player.setVolume = function(data){
        if(jplayer){ jplayer.jPlayer('volume', data.volume);}
    };


    player.isPaused = function(){
        var jpdata = jplayer.data('jPlayer');
        if(jpdata.status.paused){ return true; }
        return false;
    };

    player.playerOnError = function(){
        broadcastData.sendNotice({'sNoticeName':'Player_error','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'error'});
        if(jplayer){ jplayer.jPlayer('stop');}

    };

    player.seek = function(pos){
        if(jplayer){ 
            jplayer.jPlayer('play', pos); // Move play-head to 10% of the seekable length.
            
        }
        broadcastData.sendNotice({'sNoticeName':'Player_seek','nStationID':broadcastData.wpPlayer.nStationId,'nPlaylistID':broadcastData.wpPlayer.nPlaylistId,'sState':'15secs'});
    };

    return player;

  }]);
