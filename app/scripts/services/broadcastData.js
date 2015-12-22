'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.broadcastData
 * @description
 * # broadcastData
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('broadcastData', function () {
    
    var _bValidated =  false;

    var _sAPIHost = 'http://tau.nanocosm.com';
    var _sRestAPIHost = 'https://tau-api.nanocosm.com:443/apis/stations/';
    var _sSessionId = '';
    if(typeof LIVE365PLAYER.sessionId !== 'undefined'){_sSessionId = LIVE365PLAYER.sessionId;}
    var _nTrackUsageId = '';
    if(typeof LIVE365PLAYER.trackUsageId !== 'undefined'){_nTrackUsageId = LIVE365PLAYER.trackUsageId;}

    var _events = {
        beforeStreamFirstTrack: 'beforeStreamFirstTrack',
        trackEnded: 'trackEnded',
        newTrackReady: 'newTrackReady',
        stopNow: 'stopNow',
        timeUpdate: 'timeUpdate',
        playerOnError: 'playerOnError',
        stationReady: 'stationReady'
    };

    var debug = false;

    var _jPlayer = $('#jquery_jplayer_1').jPlayer({
        preload : 'none',
        cssSelectorAncestor: '#jp_progrss_time',
        cssSelector:
          {
          play: '.icon-play1',
          pause: '.icon-pause1',
          seekBar: '.ui-slider',
          playBar: '.ui-slider-range',
          currentTime: '.jp-current-time',
          duration: '.jp-duration'
          },
        supplied : 'mp3,m4a',
        swfPath: 'bower_components/jplayer/dist/jplayer',
        solution: 'flash,html',

        errorAlerts : debug,
        consoleAlerts : debug,
        warningAlerts :  debug
    });
    var isiPad = navigator.userAgent.match(/iPad/i) !== null;
    if(isiPad){
        var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
        var kickoff = function () {
            _jPlayer.jPlayer('play');
            document.documentElement.removeEventListener(click, kickoff, true);
        };
        document.documentElement.addEventListener(click, kickoff, true);
    }


    $('#sliderVolume').slider({
        value : 50,
        max: 100,
        range: 'min',
        animate: true,
         orientation: 'vertical',

        slide: function(event, ui) {
            var volume = ui.value / 100;
            $('#jquery_jplayer_1').jPlayer('volume', volume);
        }
    });

    // Private constructor
    function BroadcastDataManager(_wpPlayer, _sInfoPanel, _getReq) {

        this.wpPlayer = _wpPlayer;
        this.sAPIHost = _sAPIHost;
        this.sSessionId = _sSessionId;
        this.sRestAPIHost = _sRestAPIHost;
        this.events = _events;
        this.bValidated = _bValidated;
        this.jPlayer = _jPlayer;

        this.sInfoPanel = _sInfoPanel;
        this.trackList = {};

        this.setTrackUsageId = function(nTrackUsageId){this.wpPlayer.nTrackUsageId = nTrackUsageId;};
        this.setSessionId = function(sSessionId){this.sSessionId = sSessionId;};
        this.setValidated = function(bValidated){this.bValidated = bValidated;};
        this.setInfoPanel = function(sInfoPanel){this.sInfoPanel = sInfoPanel;};
        this.setStationId = function(nStationId){this.wpPlayer.nStationId = nStationId;};
        this.setPlaylistId = function(nPlaylistId){this.wpPlayer.nPlaylistId = nPlaylistId;};
        this.setTrackId = function(nTrackId){this.wpPlayer.nTrackId = nTrackId;};
        this.setAutoPlay = function(bAutoPlay){this.wpPlayer.bAutoPlay = bAutoPlay;};
        this.getReq = _getReq;

        this.sendNotice = function(pkg){
            if(typeof top.aaGlobalee !== 'undefined'){
                top.aaGlobalee.pgMediator.receiveNotice({
                    'notice':{
                        'noticeName':pkg.sNoticeName,
                        'stationID':pkg.nStationID,
                        'playlistID':pkg.nPlaylistID,
                        'trackID':pkg.nTrackID,
                        'uID':pkg.nUID,
                        'state':pkg.sState
                    }
                });
            }else{
                //console.log('CAN NOT CALL GLOBALEE! top=' + top);
            }
        };
    }

    // Public API for configuration
    this.setData = function (sAPIHost) {
        _sAPIHost = sAPIHost;
    };
    // Public API for configuration
    this.setRestAPIHost = function (sRestAPIHost) {
        _sRestAPIHost = sRestAPIHost;
    };

    this.setSessionId = function (sSessionId) {
        _sSessionId = sSessionId;
    };

    this.setTrackUsageId = function (nTrackUsageId) {
        _nTrackUsageId = nTrackUsageId;
    };

    // Method for instantiating
    this.$get = ['$location','$http',function ($location) {

            //was outside of get, but $location can only DI in $get
            var oParams = $location.search() || {}; // read params from url

            // public API to get request
            function getReq(path, method){
                var auth = 'Live365 ' + _sSessionId;
                if(typeof LIVE365PLAYER.sessionId !== 'undefined'){
                   auth = 'Live365 ' + LIVE365PLAYER.sessionId; 
                }

                var head = {'Authorization': auth};
                if (!method){
                    method = 'GET';
                }

                return {
                    method: method,
                    url: path,
                    headers: head
                };
            }

            // Setup our player object
            var sid = 0;
            var pid = 0;
            var tid = 0;
            var tuid = 0;
            var aplay = oParams.autoplay;
            if(typeof LIVE365PLAYER.stationId !== 'undefined'){sid = parseInt(LIVE365PLAYER.stationId);}
            if(typeof LIVE365PLAYER.playlistId !== 'undefined'){pid = parseInt(LIVE365PLAYER.playlistId);}
            if(typeof LIVE365PLAYER.trackId !== 'undefined'){tid = parseInt(LIVE365PLAYER.trackId);}
            if(typeof LIVE365PLAYER.trackUsageId !== 'undefined'){tuid = parseInt(LIVE365PLAYER.trackUsageId);}
            if(typeof LIVE365PLAYER.autoplay !== 'undefined'){aplay = parseInt(LIVE365PLAYER.autoplay);}
            var _wpPlayer = {
                    nStationId  :   oParams.station_id || oParams.stationid || sid,        // station id*
                    nPlaylistId :   oParams.playlist_id || oParams.playlistid || pid,        // playlist id*
                    nTrackId    :   oParams.track_id || oParams.trackid || tid,        // track id*
                    nTrackUsageId    :   oParams.track_uid || oParams.trackUid || tuid,    
                    bAutoPlay   :   !!(aplay && (aplay === 'true' || aplay === '1')),
                    nThemeId    :   oParams.theme_id || 1,          // theme number (optional)
                    sLogoImg    :   oParams.logo_img || '',         // image url (optional)
                    sLogoUrl    :   oParams.logo_url || '',         // image clickthrough link (optional)
                    sLogoAlt    :   oParams.logo_text || '',        // text instead of image or image alt text (optional)
                    referrer    :   document.referrer
                };

            var _sInfoPanel =  'playerInit'; //playerInit(no station id passed in), playerLoading(loading tracks), playerError(all kinds of player errors), playerSuccess(track loaded and player palys)

            //check if valid, integer. was in AppCtrl but since wpInfo.js run before AppCtrl, so wpPlayer.sInfoPanel never got updated
            _wpPlayer.nStationId = parseInt(_wpPlayer.nStationId); //treat number param as string
            _wpPlayer.nPlaylistId = parseInt(_wpPlayer.nPlaylistId);
            _wpPlayer.nTrackId = parseInt(_wpPlayer.nTrackId);
            _wpPlayer.nTrackUsageId = parseInt(_wpPlayer.nTrackUsageId);

            if(_wpPlayer.nStationId && (typeof _wpPlayer.nStationId === 'number') && (_wpPlayer.nStationId % 1 === 0)){
                //use playlistId
                if(_wpPlayer.nPlaylistId && (typeof _wpPlayer.nPlaylistId === 'number') && (_wpPlayer.nPlaylistId % 1 === 0)){

                    _sInfoPanel = 'PlayerLoaded';

                }
                else{//sync ajax call to get default playlistId
                    
                    var path = _sRestAPIHost + _wpPlayer.nStationId + '/playlists/primary';

                    var req = getReq(path,'GET');

                    req.async = false;

                    $.ajax(req).success(function(defaultPlaylist){

                        _wpPlayer.nPlaylistId = parseInt(defaultPlaylist.id);
                        _sInfoPanel = 'PlaylistMetadataLoaded';
                    
                    }).error(function(){
                        console.log(' call to ' + req + ' failed' );
                        _sInfoPanel = 'Error-NoPlaylist';

                    });

/*
                    $http(req).success(function(defaultPlaylist){
console.log(' async Pppppppppppppppprimary playlist id='+defaultPlaylist.id);
                        _wpPlayer.nPlaylistId = parseInt(defaultPlaylist.id);
                        _sInfoPanel = 'PlaylistMetadataLoaded';

                        //return new BroadcastDataManager(_wpPlayer,_sInfoPanel,getReq);
                    
                    }).error(function(){
                        console.log(' call to ' + req + ' failed' );
                        _sInfoPanel = 'Error-NoPlaylist';

                    });


 
                    $http.get(path).then(
                      function(defaultPlaylist) {
console.log('sync Pppppppppppppppprimary playlist id='+defaultPlaylist.data.id);
                        _wpPlayer.nPlaylistId = parseInt(defaultPlaylist.data.id);
                        _sInfoPanel = 'PlaylistMetadataLoaded';
                      },
                      function() {
                        console.log(' call to ' + path + ' failed' );
                        _sInfoPanel = 'Error-NoPlaylist';
                      },
                      function() {
                       // report progress
                    });

*/
                }

            }

            else{

                _sInfoPanel = 'Error-NoStation';
            }

            return new BroadcastDataManager(_wpPlayer,_sInfoPanel,getReq);
    }];

});