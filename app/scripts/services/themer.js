'use strict';

/**
 * @ngdoc service
 * @name webPlayerMiniAppApp.Themer
 * @description
 * # Themer used to pull theme files and render them under a the current scope
 * Provider in the webPlayerMiniAppApp.
 */
angular.module('webPlayerMiniAppApp')
    .provider('Themer', function () {

        // Private variables
        var _sThemeUrl = 'views/themes/{{partial}}/theme_{{themeId}}.html';
        // Private constructor
        function ThemeFileManager($interpolate, $http, $compile, $q, parameterService) {
            var sThemeUrlStructure = $interpolate(_sThemeUrl);

            var getThemeTemplate = this.getThemeTemplate = function (sPartialName, nThemeId) {
                var d = $q.defer();
                var sThemeUrl = sThemeUrlStructure({partial: sPartialName, themeId: nThemeId });
                $http.get(sThemeUrl).
                    success(function (data) {
                        d.resolve(data);
                    }).
                    error(function () {
                        getThemeTemplate(sPartialName, 1); // default theme fallback
                    });
                return d.promise;
            };

            this.showTheme = function (scope, element, sPartialName) {
                getThemeTemplate(sPartialName, parameterService.wpPlayer.nThemeId).then(function(data){
                    element.html(data).show();
                    $compile(element.contents())(scope);
                });
            };
        }

        // Public API for configuration
        this.setThemeUrl = function (s) {
            _sThemeUrl = s;
        };

        // Method for instantiating
        this.$get = function ($interpolate, $http, $compile, $q, parameterService) {

            return new ThemeFileManager($interpolate, $http, $compile, $q, parameterService);
        };
    });
