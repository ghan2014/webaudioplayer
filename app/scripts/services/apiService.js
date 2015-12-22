'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Apis
 * @description
 * # Apis
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('apiService', function () {

    // track apis
    var _sAPIHost = 'http://tau.nanocosm.com';
    // station apis
    var _sRestAPIHost = 'http://tau-api.nanocosm.com:8780/apis/stations/';

    // Private constructor
    function ApisManager() {
        this.sAPIHost = _sAPIHost;
        this.sRestAPIHost = _sRestAPIHost;
    }

    // Public API for configuration
    this.setData = function (sAPIHost) {
        _sAPIHost = sAPIHost;
    };
    // Public API for configuration
    this.setRestAPIHost = function (sRestAPIHost) {
        _sRestAPIHost = sRestAPIHost;
    };

    // Method for instantiating
    this.$get = function () {
        return new ApisManager();
    };

});