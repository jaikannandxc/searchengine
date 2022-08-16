var dotenv = require('dotenv');
const dbserviceFhir = require('./dbServiceFhir');
var model = require('./model');
var modelClass = new model();
dotenv.config();
const mongoservice = new dbserviceFhir();
const loggersearch =require('./logger');
const logger = new loggersearch();
class fhirSearch {
    constructor() {
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
                            //mongoservice.clientClose();
                    },
                        error => {
                            reject(error)
                            let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:error,sLine:14,sFile:'fhirSearch',sStackTrace:''}))
                            var  oLogItem = logItem;
                            var oRequest = '';
                             var sCorrelationID='';
                            logger.LogError(oLogItem,oRequest,sCorrelationID)
                        });
                    }
                    else{
                        reject(modelClass.constructResponse("Fail",null,5,"Invalid Model Data"));
                        let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Invalid Model Data',sLine:14,sFile:'fhirSearch',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.LogError(oLogItem,oRequest,sCorrelationID)
                    }
                }
                else {
                     reject(modelClass.constructResponse("Fail",null,1,"Validation failed ,not enough search criteria"));
                     let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Validation failed ,not enough search criteria',sLine:14,sFile:'fhirSearch',sStackTrace:''}))
                     var  oLogItem = logItem;
                     var oRequest = '';
                    var sCorrelationID='';
                     logger.LogError(oLogItem,oRequest,sCorrelationID)
                }
            }
        });
    }
   
    validator(requestData) {
        if (requestData.TypedText !== undefined && requestData.TypedText.length > 2 ) {
            return true;
        }        
        else {
            return false;
        }        
    }

    buildInput(req){
        var inputData = {"TypedText":"","Region":"","MappedIDs":"","Gender":""};
        inputData.TypedText = req.query.searchText;
        if (req.query.identifier !== undefined)
        {
            inputData.MappedIDs = req.query.identifier;
        } 
        if (req.query.gender !== undefined)
        {
            inputData.Gender = req.query.gender;
        } 
        return  inputData  
    }

    queryBuilder(requestData) {
        var searchData = '';
        var query;   
        var genderValue ='';      
        if (requestData !== undefined) {
            if (requestData.Gender && requestData.Gender !== ''){
                genderValue = requestData.Gender;
            }
            if (requestData.TypedText && requestData.TypedText !== '') {  
                // Existing Code -- start 
                    // let textCount = requestData.TypedText.split(' ');
                    // if (textCount.length > 1){
                    //     var searchText= this.getQueryData(requestData.TypedText)
                    //     query = {$or:[{'name.given':{'$in':textCount}},{'name.family':{'$in':textCount}}]};                    
                    // }
                    // else{
                    //     var searchText = new RegExp(["^", requestData.TypedText, "$"].join(""), "i"); 
                    //     if (gender !=='')
                    //     {
                    //         query = {$or:[{'name.given':searchText},{'name.family':searchText}],'gender':gender};
                    //     }
                    //     else{
                    //         query = {$or:[{'name.given':searchText},{'name.family':searchText}]}; 
                    //     }
                                        
                    // }
                //Existing code  -- End
                if (genderValue !==''){
                    query = [{'$search': {'index': 'lucene_name_family','text': {'query': requestData.TypedText,'path': {'wildcard': '*'}}}},{$match : {gender : genderValue}}]
                }
                else{
                    query = [{'$search': {'index': 'lucene_name_family','text': {'query': requestData.TypedText,'path': {'wildcard': '*'}}}}]
                }
                searchData = { searchParam: "Name", searchQuery: query };
            }
        }       
        let logItem = logger.FillLoglevels(({LogLevel: "info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:99,sFile:'patientSearch',sStackTrace:''}))
        var oLogItem = logItem;
        var oRequest = '';
        var sCorrelationID='';
        logger.Log(oLogItem,oRequest,sCorrelationID)
        return searchData;
    }
    
    getQueryData(data) {        
        var modifiedData = data.split(' ').map(function (str) {
            return  "'"+ str+"'" ;
          }).join(',');
        return modifiedData;
    }

    queryDb(searchData) {
        return new Promise((resolve, reject) => {
            mongoservice.queryForPatientSearch(searchData).then(results => {
                var projection = modelClass.projection;
                if (results && results.length > 30) {
                    resolve(modelClass.constructResponse("Success",results,2,"More than 31 records returned"));
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'Success',sFullMessage:'More than 31 records returned',sLine:140,sFile:'fhirSearch',sStackTrace:''}))
                    var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                    logger.Log(oLogItem,oRequest,sCorrelationID);
                }                
                else {
                    resolve(modelClass.constructResponse("Success",results,0,null));
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:'Success',sLine:140,sFile:'index',sStackTrace:''}))
                    var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                    logger.Log(oLogItem ,oRequest,sCorrelationID);
                }
            },
                error => {
                    reject(modelClass.constructResponse("Fail",null,9,error));
                    let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'9',sShortMessage:'Fail',sFullMessage:error,sLine:140,sFile:'fhirSearch',sStackTrace:''}))
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

module.exports = fhirSearch; 