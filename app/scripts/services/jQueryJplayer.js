'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Jplayer
 * @description
 * # Jplayer
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('jQueryJplayer', function () {

    var debug = false;

    var _jQueryjPlayer = $('#jquery_jplayer_1').jPlayer({
        preload : 'none',
        supplied : 'mp3, ogg',
        swfPath: 'bower_components/jplayer/dist/jplayer',
        solution: 'html, flash',

        errorAlerts : debug,
        consoleAlerts : debug,
        warningAlerts :  debug
    });

    // Private constructor
    function JplayerManager() {
        this.jplayer = _jQueryjPlayer;
        this.setMedia = function(media){this.jplayer.jPlayer('setMedia',{mp3: media});};
    }

    // Public API for configuration
    this.setMedia = function(media){
        _jQueryjPlayer.jPlayer('setMedia',{mp3: media});
    };

    // Method for instantiating
    this.$get = function () {
        return new JplayerManager();
    };
});