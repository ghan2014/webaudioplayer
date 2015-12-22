'use strict';

/**
 * @ngdoc function
 * @name webPlayerMiniAppApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the webPlayerMiniAppApp
 */
angular.module('webPlayerMiniAppApp')
  .controller('ProgressCtrl', ['broadcastData','metadata',function (broadcastData, metadata) {

    var self = this; // so assign this to self to avoid the conflict 'this' in other functions

    self.metadata = metadata;//so wont conflict with 'this' when use metadata in functions
    self.broadcastData = broadcastData;

  }]);
