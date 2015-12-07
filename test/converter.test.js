define([
  'src/converter',
  'test/mock/jszip.mock',
  'test/mock/async.mock'
], function(Converter, mockZip, async) {

  describe('converter', function() {
    var converter;
    var spies = new mockZip().spies;

    beforeEach(function() {
      converter = new Converter($($.parseXML('')), 'The Title');
      spyOn(async, 'series').and.callThrough();
    });

    afterEach(function() {
      spies.reset();
    });

    describe('GetZippedHtmlFiles', function() {
      it('adds pages to the zip file for each page returned from the outline', function(done) {
        converter.GetZippedHtmlFiles(function() {
          expect(spies.file.count).toEqual(2);
          expect(spies.file.args[0]).toEqual(['path1', 'content1']);
          expect(spies.file.args[1]).toEqual(['path2', 'content2']);
          done();
        });
      });

      it('adds static files to the zip', function(done) {
        converter.GetZippedHtmlFiles(function() {
          expect(async.series.calls.count()).toEqual(1);
          expect(async.series.calls.mostRecent().args[0].length).toEqual(9);
          done();
        });
      });

      it('calls callback function with generated zip file', function(done) {
        converter.GetZippedHtmlFiles(function(generatedZip) {
          expect(spies.generate.count).toEqual(1);
          expect(spies.generate.lastArg().type).toEqual('blob');
          expect(generatedZip).toEqual('generatedZip');
          done();
        });
      });
    });
  });
});