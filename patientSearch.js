var dotenv = require('dotenv');
const dbservice = require('./dbService');
var model = require('./model');
var modelClass = new model();
dotenv.config();
const mongoservice = new dbservice();
const loggersearch =require('./logger');
const logger = new loggersearch();
class patientSearch {
    constructor() {
    }

    search(req) {
        return new Promise((resolve, reject) => {
            if (req === undefined || Object.keys(req.body).length === 0
                && req.body.constructor === Object) {
                reject(modelClass.constructResponse("Fail",null,3,"Request is Empty"));
            }
            else {
                var requestData = JSON.parse(JSON.stringify(req.body));
                if (this.validator(requestData)) {
                    var query = this.queryBuilder(requestData);
                    if (query && query !== '') {
                    this.queryDb(query).then(results => {
                        resolve(results);
                            mongoservice.clientClose();
                    },
                        error => {
                            reject(error)
                            let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:error,sLine:14,sFile:'patientSearch',sStackTrace:''}))
                            var  oLogItem = logItem;
                            var oRequest = '';
                             var sCorrelationID='';
                            logger.LogError(oLogItem,oRequest,sCorrelationID)
                        });
                    }
                    else{
                        reject(modelClass.constructResponse("Fail",null,5,"Invalid Model Data"));
                        let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Invalid Model Data',sLine:14,sFile:'patientSearch',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.LogError(oLogItem,oRequest,sCorrelationID)
                    }
                }
                else {
                     reject(modelClass.constructResponse("Fail",null,1,"Validation failed ,not enough search criteria"));
                     let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage:'Validation failed ,not enough search criteria',sLine:14,sFile:'patientSearch',sStackTrace:''}))
                     var  oLogItem = logItem;
                     var oRequest = '';
                    var sCorrelationID='';
                     logger.LogError(oLogItem,oRequest,sCorrelationID)
                }
            }
        });
    }

    validator(requestData) {
        var bandDetails = this.manipulateBand(requestData);
        if (bandDetails.indexOf("direct") != -1) {
            return true;
        }
        else if (bandDetails.indexOf("high") != -1 && bandDetails.indexOf("medium") != -1) {
            return true;
        }
        else if (bandDetails.indexOf("high") != -1 && bandDetails.indexOf("low") != -1 && bandDetails.match(/low/g).length > 1) {
            return true;
        }
        else if (bandDetails.indexOf("medium") != -1 && bandDetails.indexOf("low") != -1) {
            return true;
        }
        else if(bandDetails.indexOf("medium") != -1 && bandDetails.match(/medium/g).length > 1)
        {
            return true;
        }
        else {
            return false;
        }
    }

    manipulateBand(requestData) {
        //UHID-D , Mobile -D ,Age-L , DOB -h, Gender-L, Name-medium, Pincode-l, Region-l, TypedText
        let band = '';
        if (requestData.UHID && requestData.UHID !== '') {
            band += "direct,";
        }
        if (requestData.Mobile && requestData.Mobile !== '') {
            band += "direct,";
        }
        if (requestData.Age && requestData.Age !== '') {
            band += "low,";
        }
        if (requestData.DOB && requestData.DOB !== '') {
            band += "high,";
        }
        if (requestData.Gender && requestData.Gender !== '') {
            band += "low,";
        }
        if (requestData.Name && requestData.Name !== '') {
            let nme = requestData.Name.split(' ');
            if (nme.length > 1) {
                nme.forEach(i => {
                    if (i.trim().length > 0)
                       band += "medium,";
                })
            } else {
                band += "medium,";
            }
        }
        if (requestData.Pincode && requestData.Pincode !== '') {
            band += "low,";
        }
        if (requestData.Region && requestData.Region !== '') {
            band += "low,";
        }
        return band;
    }

    queryBuilder(requestData) {
        var searchData = '';
        var query;
        var textIndexQuery = '';
        if (requestData !== undefined) {
            if (requestData.TypedText && requestData.TypedText !== '') {
                textIndexQuery = { $text: { $search: requestData.TypedText } }, { score: { $meta: "textScore" } };
            }
            if (requestData.UHID && requestData.UHID !== '') {
                query = { 'identifier.value': requestData.UHID };
                searchData = { searchParam: "UHID", searchQuery: query, textIndexQuery };
            }
            else if (requestData.Mobile && requestData.Mobile !== '') {
                query = { 'telecom.value': requestData.Mobile };
                searchData = { searchParam: "Mobile", searchQuery: query, textIndexQuery };
            }
            else if (requestData.TypedText && requestData.TypedText !== '') {
                if (requestData.Region && requestData.Region != ''){
                    requestData.TypedText += " " + "RGN" + requestData.Region;
                }
                query = { $text: { $search: this.getTextIndex(requestData.TypedText) } }, { score: { $meta: "textScore" } }
                searchData = { searchParam: "TEXTIndex", searchQuery: query, textIndexQuery };
            }
        }
       
        let logItem = logger.FillLoglevels(({LogLevel: "info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:99,sFile:'patientSearch',sStackTrace:''}))
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
            mongoservice.queryForPatientSearch(searchData).then(results => {
                var projection = modelClass.projection;
                if (results && results.length > 30) {
                    resolve(modelClass.constructResponse("Success",results,2,"More than 31 records returned"));
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'Success',sFullMessage:'More than 31 records returned',sLine:140,sFile:'patientSearch',sStackTrace:''}))
                    var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                    logger.Log(oLogItem,oRequest,sCorrelationID);
                }
                else if (results && results.length == 0) {
                    if (searchData.searchParam === 'UHID') {
                        resolve(modelClass.constructResponse("Success",null,4,"No records found"));
                        let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'Success',sFullMessage:'No records found',sLine:140,sFile:'patientSearch',sStackTrace:''}))
			var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.Log(oLogItem ,oRequest,sCorrelationID);
                    }
                    else {
                        if (searchData.textIndexQuery !== '') {
                            mongoservice.clientConnect();
                            console.log("Patientsearch projection", projection)
                            mongoservice.db.collection("PatientSearch").find(searchData.textIndexQuery).project(projection).sort({ score: { $meta: "textScore" } }).limit(31).toArray(function (err, attResults) {
                            if (err) {
                                    console.log("Patient Search Error", err)                                    
                                    reject(modelClass.constructResponse("Fail",null,5,"Invalid Error Data"));
                            }
                            if (attResults && attResults.length == 0) {
                                    resolve(modelClass.constructResponse("Success",null,4,"No records found"));
                                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'No records found"',sFullMessage:'No records found',sLine:140,sFile:'patientSearch',sStackTrace:''}))
                                    var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                                    logger.Log(oLogItem ,oRequest,sCorrelationID);

                            }
                                else if (attResults && attResults.length > 30) {
                                    resolve(modelClass.constructResponse("Success", attResults, 2, "More than 31 records returned"));
                                    let logItem = logger.FillLoglevels(({ LogLevel: "Info", lnErrorID: '0', sShortMessage: 'Success', sFullMessage: 'More than 31 records returned', sLine: 140, sFile: 'patientSearch', sStackTrace: '' }))
                                    var oLogItem = logItem;
                                    logger.Log(oLogItem,'', '');
                                }
                            else {
                                    resolve(modelClass.constructResponse("Success",attResults,0,null));
                                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'Success',sFullMessage:'No records found',sLine:140,sFile:'patientSearch',sStackTrace:''}))
                                    var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                                    logger.Log(oLogItem,oRequest,sCorrelationID);
                            }
                        });
                        }
                        else{
                            reject(modelClass.constructResponse("Fail",null,5,"Invalid Model Data"));
                            let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'9',sShortMessage:'Fail',sFullMessage:'Invalid Model Data',sLine:140,sFile:'patientSearch',sStackTrace:''}))
                            var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                            logger.LogError(oLogItem ,oRequest,sCorrelationID)
                        }
                    }
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
                    let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'9',sShortMessage:'Fail',sFullMessage:error,sLine:140,sFile:'patientSearch',sStackTrace:''}))
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

module.exports = patientSearch; 