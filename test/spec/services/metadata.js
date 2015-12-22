'use strict';

describe('Service: Metadata', function () {

  // load the service's module
  beforeEach(module('webPlayerMiniAppApp'));

  // instantiate service
  var Metadata;
  beforeEach(inject(function (_Metadata_) {
    Metadata = _Metadata_;
  }));

  it('should do something', function () {
    expect(!!Metadata).toBe(true);
  });

});
