'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Events
 * @description
 * # Events
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('eventService', function () {

    var _events = {
        beforeStreamFirstTrack: 'beforeStreamFirstTrack',
        trackEnded: 'trackEnded',
        newTrackReady: 'newTrackReady',
        stopNow: 'stopNow',
        timeUpdate: 'timeUpdate',
        playerOnError: 'playerOnError',
        stationReady: 'stationReady'
    };

    // Private constructor
    function EventsManager() {
        this.events = _events;
        this.addEvents = function(eventName){this.events.eventName = eventName;};
    }

    // Method for instantiating
    this.$get = function () {
        console.log('in the events services constructor');
        return new EventsManager();
    };

});