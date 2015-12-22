'use strict';

describe('Service: themer', function () {

  // load the service's module
  beforeEach(module('webPlayerMiniAppApp'));

  // instantiate service
  var themer;
  beforeEach(inject(function (_themer_) {
    themer = _themer_;
  }));

  it('should do something', function () {
    expect(!!themer).toBe(true);
  });

});
