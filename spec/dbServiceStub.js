var practitionerSearchMockValue = require('./practitionerSearch.mock');

class dbserviceStub {

    queryForPractitionerSearch(searchData){
        return new Promise((resolve, reject) => {
            if(searchData.searchQuery.$and == undefined && searchData.searchQuery.$text.$search.includes('Anuja')){
                resolve(practitionerSearchMockValue.promisedData);
            }
            else if(searchData.searchQuery.$and == undefined && searchData.searchQuery.$text.$search.includes('Misra')){
                resolve(practitionerSearchMockValue.promisedDataWithoutIdentifier);
            } 
            else if (searchData.searchQuery.$and == undefined && searchData.searchQuery.$text.$search.includes('Rajeev')){
                resolve(practitionerSearchMockValue.promisedDataMoreRecords);
            } 
            else {
                resolve(practitionerSearchMockValue.promisedDataWithIdentifier);
            }
        })
    }

    clientClose(){}
}

module.exports = dbserviceStub;