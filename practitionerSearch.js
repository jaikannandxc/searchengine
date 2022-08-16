var dotenv = require('dotenv');
const dbservice = require('./dbService');
var model = require('./practitioner-model');
var modelClass = new model();
dotenv.config();
var mongoservice = new dbservice();
const loggersearch =require('./logger');
const logger = new loggersearch();
class practitionerSearch {

    constructor(service) {
        // for testing purpose we do the dependency injection
        if(service != undefined){
            mongoservice = service; 
        }    
    }

    search(req) {
        return new Promise((resolve, reject) => {
            if (req === undefined) {        
                reject(modelClass.constructResponse("Fail",null,3,"Request is Empty"));
            }
            else {
                var requestData = this.buildInput (req)                             
                if (this.validator(requestData)) {
                    var query = this.queryBuilder(requestData);
                    if (query && query !== '') {
                    this.queryDb(query).then(results => {
                        resolve(results);
                            mongoservice.clientClose();
                    },
                        error => {
                            reject(error)
                            let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:error,sLine:29,sFile:'practitionerSearch',sStackTrace:''}))
                            var  oLogItem = logItem;
                            var oRequest = '';
                             var sCorrelationID='';
                            logger.LogError(oLogItem,oRequest,sCorrelationID)
                        });
                    }
                    else{
                        reject(modelClass.constructResponse("Fail",null,5,"Invalid Model Data"));
                        let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Invalid Model Data',sLine:38,sFile:'practitionerSearch',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.LogError(oLogItem,oRequest,sCorrelationID)
                    }
                }
                else {
                     reject(modelClass.constructResponse("Fail",null,1,"Validation failed ,not enough search criteria"));
                     let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Validation failed ,not enough search criteria',sLine:47,sFile:'practitionerSearch',sStackTrace:''}))
                     var  oLogItem = logItem;
                     var oRequest = '';
                    var sCorrelationID='';
                     logger.LogError(oLogItem,oRequest,sCorrelationID)
                }
            }
        });
    }

    buildInput(req){
        var inputData = {"TypedText":"","Region":"","MappedIDs":""};
        inputData.TypedText = req.query.searchText;
        if (req.query.identifier !== undefined)
        {
            inputData.MappedIDs = req.query.identifier;
        } 
        return  inputData  
    }

    validator(requestData) {
        if (requestData.TypedText !== undefined && requestData.TypedText.length > 2 ) {
            return true;
        }        
        else {
            return false;
        }
    }

    queryBuilder(requestData) {
        var searchData = '';
        var query;
        var textIndexQuery = '';
        if (requestData !== undefined) {
            if (requestData.TypedText && requestData.TypedText !== '') {
                if (requestData.Region && requestData.Region != ''){
                    requestData.TypedText += " " + "RGN" + requestData.Region;
                }
                //requestData.TypedText = requestData.TypedText +' '+'Live';
                query = { $text: { $search: this.getTextIndex(requestData.TypedText) } }, { score: { $meta: "textScore" } }
                searchData = { searchParam: "TEXTIndex", searchQuery: query, textIndexQuery };
                if (requestData.MappedIDs !== ""){
                    var mappedIDs = requestData.MappedIDs.split(",");
                    query = {$and: [{$text: {$search: this.getTextIndex(requestData.TypedText)}},{id:{$in:mappedIDs}}]}, { score: { $meta: "textScore" } }
                    searchData = { searchParam: "TEXTIndex", searchQuery: query, textIndexQuery };
                }
            }
        }       
        let logItem = logger.FillLoglevels(({LogLevel: "info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:92,sFile:'practitionerSearch',sStackTrace:''}))
        var oLogItem = logItem;
        var oRequest = '';
        var sCorrelationID='';
        logger.Log(oLogItem,oRequest,sCorrelationID)
        return searchData;
    }

    getTextIndex(data) {
        let dt = data.split(' ');
        let modifiedData = '';
        let qt = '\"';
        dt.forEach(i => {
            if (i.trim().length > 0)
                modifiedData += qt + i + qt + " ";
        })
        return modifiedData;
    }

    queryDb(searchData) {
        return new Promise((resolve, reject) => {
            mongoservice.queryForPractitionerSearch(searchData).then(results => {
                var projection = modelClass.projection;
                if (results && results.length > 30) {
                    resolve(modelClass.constructResponse("Success",results,2,"More than 31 records returned"));
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'Success',sFullMessage:'More than 31 records returned',sLine:119,sFile:'practitionerSearch',sStackTrace:''}))
                    var  oLogItem = logItem;
                    var oRequest = '';
                    var sCorrelationID='';
                    logger.Log(oLogItem,oRequest,sCorrelationID);
                }
                else {                                    
                    resolve(modelClass.constructResponse("Success",results,0,null));
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:'Success',sLine:127,sFile:'index',sStackTrace:''}))
                    var  oLogItem = logItem;
                    var oRequest = '';
                    var sCorrelationID='';
                    logger.Log(oLogItem ,oRequest,sCorrelationID);
                }
            },
                error => {
                    reject(modelClass.constructResponse("Fail",null,9,error));
                    let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'9',sShortMessage:'Fail',sFullMessage:error,sLine:136,sFile:'practitionerSearch',sStackTrace:''}))
                    var  oLogItem = logItem;
                    var oRequest = '';
                    var sCorrelationID='';
		            logger.LogError(oLogItem,oRequest,sCorrelationID)
                     
                    mongoservice.clientClose();
                }
            );
        });
    }
}

module.exports = practitionerSearch; 