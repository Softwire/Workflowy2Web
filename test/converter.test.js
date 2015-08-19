var async = {
  series: function(arr, cb) {
    cb();
  }
};
describe('converter', function() {
  // Define mocks
  var converter;
  var mockZip = {
    file: function() {},
    generate: function() {
      return 'generatedZip';
    }
  };
  var mockOutline = {
    process: function() {
      return [
        {
          filePath: 'path1',
          content: 'content1'
        },
        {
          filePath: 'path2',
          content: 'content2'
        }
      ];
    }
  };
  beforeEach(function() {
    converter = new Converter($($.parseXML('')), 'The Title');
    spyOn(mockZip, 'file');
    spyOn(mockZip, 'generate').and.callThrough();
    spyOn(async, 'series').and.callThrough();
    spyOn(window, 'Outline').and.returnValue(mockOutline);
    spyOn(window, 'JSZip').and.returnValue(mockZip);
  });

  describe('GetZippedHtmlFiles', function() {
    it('adds pages to the zip file for each page returned from the outline', function(done) {
      converter.GetZippedHtmlFiles(function() {
        expect(mockZip.file.calls.count()).toEqual(2);
        expect(mockZip.file).toHaveBeenCalledWith('path1', 'content1');
        expect(mockZip.file).toHaveBeenCalledWith('path2', 'content2');
        done();
      });
    });
    
    it('adds static files to the zip', function(done) {
      converter.GetZippedHtmlFiles(function() {
        expect(async.series.calls.count()).toEqual(1);
        expect(async.series.calls.mostRecent().args[0].length).toEqual(13);
        done();
      });
    });
    
    it('calls callback function with generated zip file', function(done) {
      converter.GetZippedHtmlFiles(function(generatedZip) {
        expect(mockZip.generate.calls.count()).toEqual(1);
        expect(mockZip.generate.calls.mostRecent().args[0].type).toEqual('blob');
        expect(generatedZip).toEqual('generatedZip');
        done();
      });
    });
  });
});