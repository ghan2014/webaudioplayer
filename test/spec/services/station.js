'use strict';

describe('Service: station', function () {

  // load the service's module
  beforeEach(module('webPlayerMiniAppApp'));

  // instantiate service
  var station;
  beforeEach(inject(function (_station_) {
    station = _station_;
  }));

  it('should do something', function () {
    expect(!!station).toBe(true);
  });

});
