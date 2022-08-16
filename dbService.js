var dotenv = require('dotenv');
var model = require('./model');
var modelClass = new model();
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const loggersearch =require('./logger');
const logger = new loggersearch();
class dbservice {
    db;
    url = process.env.SEARCHENGINE_CONNECTIONSTRING;
    dbName = process.env.SEARCHENGINE_DB;
    client;
    constructor() {
        this.client = new MongoClient(this.url);
    }
    clientConnect() {
        this.client.connect();
        this.db = this.client.db(this.dbName);
    }
    clientClose() {
        this.client.close();
    }

    queryForPatientSearch(searchData) {
        return new Promise((resolve, reject) => {
            try {
                this.clientConnect();
                var projection = modelClass.projection;
                var noscoreprojection = modelClass.noscoreprojection;
                if (searchData.searchParam === 'UHID' || searchData.searchParam === 'Mobile') {
                    this.db.collection("PatientSearch").find(searchData.searchQuery).project(noscoreprojection).limit(31).toArray(function (err, results) {
                        resolve(results);
                        let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:24,sFile:'dbservice',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.Log(oLogItem ,oRequest,sCorrelationID);
                    });
                }
                else {
                    //this.db.collection("PatientSearch").find(searchData.searchQuery).project(projection).limit(31).toArray(function (err, results) {
                        this.db.collection("PatientSearch").find(searchData.searchQuery).project(projection).sort({ score: { $meta: "textScore" } }).limit(31).toArray(function (err, results) {
                        resolve(results);
                        let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:24,sFile:'dbservice',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.Log(oLogItem,oRequest,sCorrelationID);


                    });
                }
            }
            catch (err) {
                reject(err);
                this.clientClose();
                let logItem = logger.FillLoglevels(({LogLevel: "Error",lnErrorID:'0',sShortMessage:'',sFullMessage:err,sLine:24,sFile:'dbservice',sStackTrace:''}))
                var  oLogItem = logItem;
                var oRequest = '';
                var sCorrelationID='';
                logger.LogError(oLogItem,oRequest,sCorrelationID);
                return
            }
        })
    }

    queryForPractitionerSearch(searchData) {
        return new Promise((resolve, reject) => {
            try {
                this.clientConnect();
                var projection = modelClass.projection;                
                this.db.collection("PractitionerSearch").find(searchData.searchQuery).limit(31).toArray(function (err, results) {
                        resolve(results);
                        let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:72,sFile:'dbservice',sStackTrace:''}))
                        var  oLogItem = logItem;
                        var oRequest = '';
                        var sCorrelationID='';
                        logger.Log(oLogItem,oRequest,sCorrelationID);


                    });
                
            }
            catch (err) {
                reject(err);
                this.clientClose();
                let logItem = logger.FillLoglevels(({LogLevel: "Error",lnErrorID:'0',sShortMessage:'',sFullMessage:err,sLine:85,sFile:'dbservice',sStackTrace:''}))
                var  oLogItem = logItem;
                var oRequest = '';
                var sCorrelationID='';
                logger.LogError(oLogItem,oRequest,sCorrelationID);
                return
            }
        })
    }
}

module.exports = dbservice;
