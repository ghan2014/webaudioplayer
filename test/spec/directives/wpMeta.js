'use strict';

describe('Directive: wpMeta', function () {

  // load the directive's module
  beforeEach(module('webPlayerMiniAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('meta directive should contain image', inject(function ($compile) {
    var result = element[0].querySelectorAll('.metadatas');
    element = angular.element('result');
    element = $compile(element)(scope);
    angular.element(result).hasClass('findme')
    //expect(element.img.toBe('this is the meta directive');
  }));
});
