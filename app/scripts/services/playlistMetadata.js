'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.playlistMetadata
 * @description
 * # playlistMetadata Service
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('playlistMetadata', ['$http','$rootScope', 'broadcastData',function ($http, $rootScope, broadcastData) {

    var playlistMetadata = {
        name : undefined,
        id : undefined,
        coverArt : undefined
    };

    playlistMetadata.getPlaylistMetadata = function(path) {
        var req = broadcastData.getReq(path);

        return $http(req).then(
            function (response) {
                    $rootScope.$broadcast(broadcastData.events.playlistMetadataReady, {'playlistName':response.data.name});
                        playlistMetadata.name = response.data.name;
                        playlistMetadata.id = response.data.id;
                        playlistMetadata.coverArt = response.data.coverArtUrl;
                    return {
                        name : response.data.name,
                        id : response.data.id,
                        coverArt : response.data.coverArtUrl
                    };
            });
    };

    return playlistMetadata;

}]);


