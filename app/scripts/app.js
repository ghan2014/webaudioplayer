    'use strict';

    /**
     * @ngdoc overview
     * @name webPlayerMiniAppApp
     * @description
     * # webPlayerMiniAppApp
     *
     * Main module of the application.
     */
    angular
        .module('webPlayerMiniAppApp', [
            'ngAnimate',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ngTouch',
            'pascalprecht.translate',
            'ui.slider',
            'timer',
            'ui.bootstrap'
        ]
    );

    angular.module('webPlayerMiniAppApp')
        .filter('dateFormatFilter', function() {
          return function(duration/*secs*/, format) {
                var seconds = parseInt((duration)%60);
                var minutes = parseInt((duration/(60))%60);
                var hours = parseInt((duration/(60*60))%24);
                var HhMmSs = duration;

                //hours = (hours < 10) ? '0' + hours : hours;
                //minutes = (minutes < 10) ? '0' + minutes : minutes;
                seconds = (seconds < 10) ? '0' + seconds : seconds;

                if (format === 'mm:ss'){
                    HhMmSs = minutes + ':' + seconds;
                }
                else if(format === 'hh:mm:ss'){
                    minutes = (minutes < 10) ? '0' + minutes : minutes;
                    hours = (hours < 10) ? '0' + hours : hours;
                    HhMmSs = hours + ':' + minutes + ':' + seconds;
                }
                else{
                    HhMmSs = hours + ':' + minutes + ':' + seconds;
                }
                
                return HhMmSs;
            };
        });


    angular.module('webPlayerMiniAppApp').config(['$httpProvider','$locationProvider', 'ThemerProvider', 'broadcastDataProvider', function ($httpProvider,$locationProvider, ThemerProvider, broadcastDataProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        //ThemerProvider.setThemeUrl('views/themes/{{partial}}/theme_{{themeId}}.html'); // change this if we change folder and file structure for themes
        broadcastDataProvider.setData('http://tau.nanocosm.com'); 
        broadcastDataProvider.setRestAPIHost('https://tau-api.nanocosm.com:443/apis/stations/'); 
        broadcastDataProvider.setSessionId('BE966907290F49B5A87BD544F3DF10A7'); 
    }]);
