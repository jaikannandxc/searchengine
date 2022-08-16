class modelClass {
    constructor() {
    }
    responseData = {
    status : "",
    data : null,
    outcome : {
        code: 0,
        details: null,
        }
    }
	
     logItem = {
        LogLevel :null ,
        lnErrorID:null,
        sShortMessage :null,
        sFullMessage :null,
        sLine:null,
        sFile:null,
        sStackTrace:null
        }

    projection = { score: { $meta: "textScore" }, resourceType:1, telecom: 1, address: 1, _id: 1, id: 1, birthDate: 1, name: 1, identifier: 1, meta: 1, gender: 1, GENDER: 1,TEXTIndex:1, extension:1 };
    noscoreprojection = {  resourceType:1, telecom: 1, address: 1, _id: 1, id: 1, birthDate: 1, name: 1, identifier: 1, meta: 1, gender: 1, GENDER: 1,TEXTIndex:1, extension:1 };
    constructResponse(st, dt, ec, ed) {
        this.responseData.status = st;
        this.responseData.data = dt;
        this.responseData.outcome.code = ec;
        this.responseData.outcome.details = ed;
        return this.responseData;
    }
}

//Errorcode 0 - no error
//Errorcode 1 - Validation failed ,not enough search criteria.
//Errorcode 2 - More than 31 records returned.
//Errorcode 3 - Request is Empty.
//Errorcode 4 - No Records Found !!
//Errorcode 5 - Invalid Model data !!
//Errorcode 9 - Exception.

module.exports = modelClass;
