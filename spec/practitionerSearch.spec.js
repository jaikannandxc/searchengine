var PractitionerSearch = require('../practitionerSearch');
var DbService = require('./dbServiceStub');
var mongoservice = new DbService();
var practitionerSearchMockValue = require('./practitionerSearch.mock');


describe("PractitionerSearch Test suite", function() {
  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it("To get the proper output for searchText", function(done) {
    const validRequest = practitionerSearchMockValue.validRequest;
   
    new PractitionerSearch(mongoservice).search(validRequest).then(results => {
      expect(results).toEqual(practitionerSearchMockValue.promisedData_1);
      done();
    },error => {
      expect(false).toBeTruthy();
      done();
    })
  });

  it("To get the proper output for mapped ids", function(done) {
    const validRequestWithIds = practitionerSearchMockValue.validRequestWithIds;
    
    new PractitionerSearch(mongoservice).search(validRequestWithIds).then(results => {
      expect(results.entry.length).toEqual(1);
      done();
    },error => {
      expect(false).toBeTruthy();
      done();
    })
  });

  it("To check the search criteria with empty ids", function(done) {
    const validRequestWithEmptyIds = practitionerSearchMockValue.validRequestWithEmptyIds;

    new PractitionerSearch(mongoservice).search(validRequestWithEmptyIds).then(results => {
      expect(results.entry.length).toEqual(2);
      done();
    },error => {
      expect(false).toBeTruthy();
      done();
    })
  });

  it("To check the search criteria with empty searchtext", function(done) {
    const invalidRequest = practitionerSearchMockValue.invalidRequest;
    const outputText = practitionerSearchMockValue.outputText;

    new PractitionerSearch(mongoservice).search(invalidRequest).then(results => {
      expect(false).toBeTruthy();
      done();
    },
    error => {
      expect(error.outcome.details).toEqual(outputText);
      done();
    })
  });

  it("To check the search criteria is undefined", function(done) {
    const emptyRequest = practitionerSearchMockValue.emptyRequest;
    const emptyResText = practitionerSearchMockValue.emptyResText;

    new PractitionerSearch(mongoservice).search(emptyRequest).then(results => {
      expect(false).toBeTruthy();
      done();
    },
    error => {
      expect(error.status).toEqual(emptyResText);
      done();
    })
  });
  
  it("To check the search criteria with 2 character", function(done) {
    const invalidRequest_1 = practitionerSearchMockValue.invalidRequest_1;
    const outputText = practitionerSearchMockValue.outputText;

    new PractitionerSearch(mongoservice).search(invalidRequest_1).then(results => {
      expect(false).toBeTruthy();
      done();
    },
    error => {
      expect(error.outcome.details).toEqual(outputText);
      done();
    })
  });

  it("To check the search criteria with both values undefined", function(done) {
    const invalidRequest_2 = practitionerSearchMockValue.invalidRequest_2;
    const outputText = practitionerSearchMockValue.outputText;

    new PractitionerSearch(mongoservice).search(invalidRequest_2).then(results => {
      expect(false).toBeTruthy();
      done();
    },
    error => {
      expect(error.outcome.details).toEqual(outputText);
      done();
    })
  });

  it("To check the searched data have more than 30 records", function(done) {
     const validRequest_1 = practitionerSearchMockValue.validRequest_1;
     const outputText_1 = practitionerSearchMockValue.outputText_1;
   
     new PractitionerSearch(mongoservice).search(validRequest_1).then(results => {
      expect(results.outcome.details).toEqual(outputText_1);
       done();
     },error => {
       expect(false).toBeTruthy();
       done();
     })
   });

   it("To check query framed properly for searchtext alone", function(done) {
    const queryBuilderInput = practitionerSearchMockValue.queryBuilderInput;
  
     var finalQuery =  new PractitionerSearch(mongoservice).queryBuilder(queryBuilderInput);
     expect(finalQuery).toEqual(practitionerSearchMockValue.framedQuery);
      done();
  });

  it("To check query framed properly for searchtext and ids", function(done) {
    const queryBuilderInput_1 = practitionerSearchMockValue.queryBuilderInput_1;
  
    var finalQuery =  new PractitionerSearch(mongoservice).queryBuilder(queryBuilderInput_1);
    expect(finalQuery).toEqual(practitionerSearchMockValue.framedQuery_1);
    done();
  });

});