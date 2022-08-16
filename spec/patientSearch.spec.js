var Patientsearch = require('../patientSearch');
 var patientsearch = new Patientsearch();
 var Loggersearch = require('../logger');


  //search
  describe("Patientsearch Test suite", function() {
    beforeEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
  
  

    it("testcase 1", function(done) {
      var input = {
            "body":
              {
                  "UHID":"ANM1.0000421121",
                  "Mobile":"9962599691",
                  "Age":"AGE1980",
                  "DOB":"DOB19801126",
                  "Gender": "HOMBRE",
                  "Name":"TEST CATEGORY S",
                  "Pincode":"600042",
                  "TypedText":"ANM1.0000421121 TEST CATEGORY S 9962599691 600042 DOB19801126 AGE1980 HOMBRE"
              }
            };    
      patientsearch.search(input).then(results => {
        expect(input.body.UHID).toEqual(results.data[0].identifier[0].value);
        done();
      })
    });

    it("testcase 2", function(done) {
      var input = {
            "body":
              {
                  "UHID":"ANM1.0000421121",
                  "Mobile":"",
                  "Age":"",
                  "DOB":"",
                  "Gender": "",
                  "Name":"",
                  "Pincode":"",
                  "TypedText":"ANM1.0000421121"
              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.UHID).toEqual(results.data[0].identifier[0].value); 
        done();
      })
    });

    it("testcase 3", function(done) {
      var input = {
            "body":
              {
                  "UHID":"",
                  "Mobile":"9962599691",
                  "Age":"",
                  "DOB":"",
                  "Gender": "",
                  "Name":"",
                  "Pincode":"",
                  "TypedText":"9962599691"
              }
            };
    
      patientsearch.search(input).then(results => {
        results.data[0].telecom.forEach(element => {
          if(element.system === 'phone' && element.use === 'mobile'){
            expect(input.body.Mobile).toEqual(element.value);
          }
      }) 
        done();
      })
    });

    it("testcase 4", function(done) {
      var input = {
            "body":
              {
                  "UHID":"ANM1.0000421121",
                  "Mobile":"9962599691",
                  "Age":"",
                  "DOB":"",
                  "Gender": "",
                  "Name":"",
                  "Pincode":"",
                  "TypedText":"ANM1.0000421121 9962599691"
              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.UHID).toEqual(results.data[0].identifier[0].value); 
        done();
      })
    });

    // it("testcase 5", function(done) {
    //   var input = {
    //         "body":
    //           {
    //               "UHID":"",
    //               "Mobile":"",
    //               "Age":"",
    //               "DOB":"DOB19801126",
    //               "Gender": "",
    //               "Name":"",
    //               "Pincode":"",
    //               "TypedText":"DOB19801126",
    //           }
    //         };
    //   patientsearch.search(input).then(results => {
    //     expect(results.outcome.code).toBe(1); 
    //     done();
    //   })
    // });

    it("testcase 6", function(done) {
      var input = {
            "body":
              {
                  "UHID":"",
                  "Mobile":"",
                  "Age":"",
                  "DOB":"DOB19801126",
                  "Gender": "",
                  "Name":"TEST CATEGORY S",
                  "Pincode":"",
                  "TypedText":"TEST CATEGORY S DOB19801126"
              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.Name).toEqual(results.data[0].name[0].given[0]+ ' ' + results.data[0].name[0].family); 
        done();
      })
    });

    it("testcase 7", function(done) {
      var input = {
            "body":
              {
                  "UHID":"",
                  "Mobile":"",
                  "Age":"",
                  "DOB":"DOB19801126",
                  "Gender": "HOMBRE",
                  "Name":"TEST CATEGORY S",
                  "Pincode":"",
                  "TypedText":"TEST CATEGORY S DOB19801126 HOMBRE"

              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.Name).toEqual(results.data[0].name[0].given[0] + ' ' + results.data[0].name[0].family); 
        done();
      })
    });

    // it("testcase 8", function(done) {
    //   var input = {
    //         "body":
    //           {
    //               "UHID":"",
    //               "Mobile":"",
    //               "Age":"",
    //               "DOB":"DOB19801126",
    //               "Gender": "HOMBRE",
    //               "Name":"",
    //               "Pincode":"",
    //               "TypedText":"DOB19801126 HOMBRE"
    //           }
    //         };

    //   patientsearch.search(input).then(results => {
    //      expect(results.outcome.code).toBe(1);  
    //     done();
    //   })
    // });

    it("testcase 9", function(done) {
      var input = {
            "body":
              {
                  "UHID":"",
                  "Mobile":"",
                  "Age":"AGE1980",
                  "DOB":"DOB19801126",
                  "Gender": "HOMBRE",
                  "Name":"TEST CATEGORY S",
                  "Pincode":"600042",
                  "TypedText":"TEST CATEGORY S 600042 DOB19801126 AGE1980 HOMBRE"
              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.Name).toEqual(results.data[0].name[0].given[0] + ' ' + results.data[0].name[0].family); 
        done();
      })
    });

    // it("testcase 10", function(done) {
    //   var input = {
    //         "body":
    //           {
    //               "UHID":"",
    //               "Mobile":"",
    //               "Age":"",
    //               "DOB":"",
    //               "Gender": "",
    //               "Name":"CATEGORY S",
    //               "Pincode":"",
    //               "TypedText":"CATEGORY S"
    //           }
    //         };

    //   patientsearch.search(input).then(results => {
    //      expect(results.outcome.code).toBe(1); 
    //     done();
    //   })
    // });

    it("testcase 11", function(done) {
      var input = {
            "body":
              {
                  "UHID":"",
                  "Mobile":"",
                  "Age":"AGE1980",
                  "DOB":"",
                  "Gender": "HOMBRE",
                  "Name":"TEST CATEGORY S",
                  "Pincode":"",
                  "TypedText":"TEST CATEGORY S AGE1980 HOMBRE"
              }
            };
    
      patientsearch.search(input).then(results => {
        expect(input.body.Name).toEqual(results.data[0].name[0].given[0]+ ' ' + results.data[0].name[0].family); 
        done();
      })
    });

   it("testcase 12", function(done) {
            var input = {
                  "body":
                    {
                        "UHID":"",
                        "Mobile":"",
                        "Age":"",
                        "DOB":"",
                        "Gender": "HOMBRE",
                        "Name":"TEST CATEGORY S",
                        "Pincode":"600042",
                        "TypedText":"TEST CATEGORY S 600042 HOMBRE"
                    }
                  };
          
            patientsearch.search(input).then(results => {
              expect(input.body.Name).toEqual(results.data[0].name[0].given[0]+ ' ' + results.data[0].name[0].family); 
              done();
            })
          });
      


    // it("testcase 13", function(done) {
    //   var input = {
    //         "body":
    //           {
    //               "UHID":"",
    //               "Mobile":"",
    //               "Age":"AGE1980",
    //               "DOB":"",
    //               "Gender": "HOMBRE",
    //               "Name":"",
    //               "Pincode":"600042",
    //               "TypedText":"600042 AGE1980 HOMBRE"
    //           }
    //         };
    
    //   patientsearch.search(input).then(results => {
    //      expect(results.outcome.code).toBe(1); 
    //     done();
    //   })
    // });
    
  });
