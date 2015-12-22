'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.StationCtrl
 * @description
 * # StationCtrl
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('session', ['$http',function ($http) {
    var session = {
        sessionId : undefined
    };

    var getMockSession = function(){
        var req = {
                method: 'POST',
                url: 'https://tau-api.nanocosm.com/apis/auth/',
                data: {'email' : 'webdev+02@live365.com', 'password' : 'test'}
            };

        $http(req).success(function(data){
            session.sessionId = data.sessionId;

        }).error(function(){ 
            console.log('Failed to get mock session');
        });
    };

    getMockSession();

    return session;

  }]);
