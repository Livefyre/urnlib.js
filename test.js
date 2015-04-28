var expect = require('chai').expect;
var urnlib = require('./index.js');

describe('urn.test.js', function () {
    var urnStr = 'urn:livefyre:network=livefyre.com:site=123456:collection=100000';
    var urn = urnlib.parse(urnStr);

    describe('URN.parse', function() {
        it('Successfully parses a URN', function(done) {
            expect(urn.parts).to.eql([['network', 'livefyre.com'], ['site', '123456'], ['collection', '100000']]);
            expect(urn.toString()).to.equal(urnStr);
            done();
        });
    });
    describe('URN.getParent', function() {
        it('Successfully get a URN\'s parent(s)', function(done) {
            expect(urn.getParent(0).toString()).to.equal(urnStr);
            expect(urn.getParent(1).toString()).to.equal('urn:livefyre:network=livefyre.com:site=123456');
            expect(urn.getParent(2).toString()).to.equal('urn:livefyre:network=livefyre.com');
            done();
        });
    });
    describe('URN.getParentByName', function() {
        it('Successfully get a URN\'s parent(s) by name', function(done) {
            expect(urn.getParentByName('collection').toString()).to.equal(urnStr);
            expect(urn.getParentByName('site').toString()).to.equal('urn:livefyre:network=livefyre.com:site=123456');
            done();
        });
    });
    describe('URN.getType', function() {
        it('Successfully get a URN\'s type', function(done) {
            expect(urn.getType()).to.equal('collection');
            done();
        });
    });
    describe('URN.getId', function() {
        it('Successfully get a URN\'s ID', function(done) {
            expect(urn.getId()).to.equal('100000');
            done();
        });
    });
    describe('URN.add', function() {
        it('Successfully add an element to a URN', function(done) {
            var urn = new urnlib.URN();
            urn.add('thingType', 'thingId');
            expect(urn.toString()).to.equal('urn:livefyre:thingType=thingId');
            done();
        });
    });
    describe('URN.contains', function() {
        it('returns true if urn had all resources of input urn', function(done) {

            var urnAncestor = urnlib.parse('urn:livefyre:network=livefyre.com');
            expect(urnAncestor.contains(urn)).to.equal(true);

            urnAncestor = urnlib.parse('urn:livefyre:network=livefyre.com:site=123456');
            expect(urnAncestor.contains(urn)).to.equal(true);

            urnAncestor = urnlib.parse(
                    'urn:livefyre:network=livefyre.com:site=123456:collection=100000');
            expect(urnAncestor.contains(urn)).to.equal(true);

            urnAncestor = urnlib.parse('urn:livefyre:network=livefyre.com:site=666');
            expect(urnAncestor.contains(urn)).to.equal(false);

            urnAncestor = urnlib.parse('urn:livefyre:network=example.com');
            expect(urnAncestor.contains(urn)).to.equal(false);

            done();
        });

        it('should not break because urn is shorter', function(done) {
            var shortUrn = urnlib.parse('urn:livefyre:network=livefyre.com');
            var longUrn = urnlib.parse('urn:livefyre:network=livefyre.com:site=666');

            expect(longUrn.contains(shortUrn)).to.equal(false);

            done();
        });
    });
    describe('URN.fromUrlPath', function() {
        it('should ignore starting slash', function() {
            var urn = urnlib.fromUrlPath('/a/1');
            expect(urn.getId()).to.equal('1');
            expect(urn.getType()).to.equal('a');
        });
    });
});