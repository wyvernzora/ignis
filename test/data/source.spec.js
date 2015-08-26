/**
 * test/data/source.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');

var Ignis          = require('../../lib/ignis').Ignis;
var Source         = require('../../lib/data/source');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;



describe('source(1)', function() {

  beforeEach(function() {
    this.ns = new Ignis();
    Source.default(this.ns);
  });

  it('should connect if sync callback succeeds', function() {

    var fake = { test: 0 };
    var promise = this.ns.source('test', i => fake);

    expect(this.ns.startup).be.fulfilled.then(i => {
      expect(this.ns.source('test')).to.equal(fake);
    });

  });

  it('should connect if async callback succeeds', function() {

    var fake = { test: 1 };
    var promise = this.ns.source('test', function() {
      return Bluebird.resolve(fake);
    });

    expect(this.ns.startup).be.fulfilled.then(i => {
      expect(this.ns.source('test')).to.equal(fake);
    });

  });

  it('should reject if sync callback fails', function() {
    var fake = { test: 2 };
    var promise = this.ns.source('test', function() {
      throw new Error('Test Error');
    });

    expect(this.ns.startup).to.be.rejectedWith('Test Error');
  });

  it('should reject if async callback fails', function() {
    var fake = { test: 2 };
    var promise = this.ns.source('test', function() {
      return Bluebird.reject(new Error('Test Error'));
    });

    expect(this.ns.startup).to.be.rejectedWith('Test Error');
  });

  it('should reject on attempt to overwrite the connection', function() {
    var fake = { test: 4 };
    this.ns.source('test', function() { return fake; });
    expect(this.ns.startup).be.fulfilled.then(i => {
      this.ns.source('test', () => { return { test: 5 }; });
      expect(this.ns.startup).to.be.rejectedWith('Data source exists: test');
    });
  });

  it('should correctly pass parameters to the callback', function() {

    var fake = { foo: 'bar' };
    this.ns.source('test', function(a, b) {
      expect(a).to.equal(0);
      expect(b).to.equal(1);
      return fake;
    }, 0, 1);

    expect(this.ns.startup).to.be.fulfilled;

  });

  it('should reject if callback returns a falsy value', function() {

    this.ns.source('test', function() { return null; });
    expect(this.ns.startup).to.be
      .rejectedWith('Data source callback returned falsy value.');

  });

  it('should throw if data source is not found', function() {
    expect(i => {
      this.ns.source('no-such-source');
    }).to.throw('Data source not found: no-such-source');
  });

});
