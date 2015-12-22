'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.MetadataPromise
 * @description
 * # MetadataPromise
 * Service in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
  .factory('metadataPromise', ['$http', function ($http) {
    // reusable application-wide business logic that does not to be further configured in 'model.config'.sharable data.
    console.log('------------metadata PROMISE service ');
    var metadataPromise = {};

    metadataPromise.get = function(path){
        console.log('-----------Getting metadata promise from ' + path);
        return $http({
            method: 'GET',
            url: path,
            params: {}
        });    
    };
    return metadataPromise;

  }]);