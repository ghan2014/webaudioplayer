'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Parameters
 * @description
 * # Parameters
 * Service in the webPlayerMiniAppApp.
 */

angular.module('webPlayerMiniAppApp')
  .provider('parameters', function () {

    // Private constructor
    function ParametersManager(_wpPlayer) {
        console.log(_wpPlayer);
        this.wpPlayer = _wpPlayer;
    }

    // Method for instantiating
    this.$get = function ($location) {
        console.log($location.search());
        //was outside of get, but $location can only DI in $get
        var oParams = $location.search(); // read params from url
        // Setup our player object
        var _wpPlayer = {
                nStationId  :   oParams.station_id || 0,        // station id*
                bAutoPlay   :   !!(oParams.autoplay && (oParams.autoplay === 'true' || oParams.autoplay === '1')),
                nThemeId    :   oParams.theme_id || 1,          // theme number (optional)
                sLogoImg    :   oParams.logo_img || '',         // image url (optional)
                sLogoUrl    :   oParams.logo_url || '',         // image clickthrough link (optional)
                sLogoAlt    :   oParams.logo_text || '',        // text instead of image or image alt text (optional)
                referrer    :   document.referrer
        };

        return new ParametersManager(_wpPlayer);
    };

});