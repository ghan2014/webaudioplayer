'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.ControlFlags
 * @description
 * # ControlFlags
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('controlFlags', function () {

    //if a validate user
    var _bValidated =  false;

    // Private constructor
    function ControlFlagsManager(_sInfoPanel) {
        console.log(_sInfoPanel);
        this.bValidated = _bValidated;
        this.sInfoPanel = _sInfoPanel;

        this.setValidated = function(bValidated){this.bValidated = bValidated;};
        this.setInfoPanel = function(sInfoPanel){this.sInfoPanel = sInfoPanel;};
    }


    // Method for instantiating
    this.$get = function (parameters) {
        var _sInfoPanel =  'playerInit'; //playerInit(no station id passed in), playerLoading(loading tracks), playerError(all kinds of player errors), playerSuccess(track loaded and player palys)

        //check if valid, integer. was in AppCtrl but since wpInfo.js run before AppCtrl, so wpPlayer.sInfoPanel never got updated
        var nStationId = parseInt(parameters.wpPlayer.nStationId); //treat number param as string

        if(nStationId && (typeof nStationId === 'number') && (nStationId % 1 === 0)){
            console.log(nStationId);
            _sInfoPanel = 'playerLoaded';
        }
        else{
            console.log('station id error === '+_sInfoPanel);
            _sInfoPanel = 'playerError';
        }

        return new ControlFlagsManager(_sInfoPanel);
    };

});