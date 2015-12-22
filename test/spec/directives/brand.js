'use strict';

describe('Directive: brand', function () {

  // load the directive's module
  beforeEach(module('webPlayerMiniAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<brand></brand>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the brand directive');
  }));
});
