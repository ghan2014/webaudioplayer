'use strict';

describe('Controller: StationCtrl', function () {

  // load the controller's module
  beforeEach(module('webPlayerMiniAppApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should be loaded', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
