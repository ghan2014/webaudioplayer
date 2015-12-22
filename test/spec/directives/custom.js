'use strict';

describe('Directive: custom', function () {

  // load the directive's module
  beforeEach(module('webPlayerMiniAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<custom></custom>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the custom directive');
  }));
});
