var dotenv = require('dotenv');
var model = require('./model');
var modelClass = new model();
var async = require('async');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const loggersearch =require('./logger');
const logger = new loggersearch();
class dbserviceFhir {
    db;
    url = process.env.SEARCHENGINE_FHIR_CONNECTIONSTRING;
    dbName = process.env.SEARCHENGINE_FHIR_DB;
    client;
    constructor() {
        this.client = new MongoClient(this.url);
        this.getconnection();
    }

    async  clientConnect() {
        this.client.connect();
        //this.db = this.client.db(this.dbName);
    }

    async getconnection(){
        await this.clientConnect();
    }


    // clientConnect() {
    //     this.client.connect();
    //     this.db = this.client.db(this.dbName);
    // }
    clientClose() {
        this.client.close();
    }

    queryForPatientSearch(searchData) {
        return new Promise((resolve, reject) => {
            try {
                    //this.clientConnect();
                    if (this.client && this.client.topology && this.client.topology.isConnected()){
                        var connected = this.client.topology.isConnected()
                        console.log('connected',connected);
                    }
                    this.client.db(this.dbName).collection("Patient").aggregate(searchData.searchQuery).limit(31).toArray(function (err, results) {                       
                    resolve(results);
                    let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:searchData,sLine:24,sFile:'dbserviceFhir',sStackTrace:''}))
                    var  oLogItem = logItem;
                    var oRequest = '';
                    var sCorrelationID='';
                    logger.Log(oLogItem,oRequest,sCorrelationID);
                    });               
            }
            catch (err) {
                reject(err);
                this.clientClose();
                let logItem = logger.FillLoglevels(({LogLevel: "Error",lnErrorID:'0',sShortMessage:'',sFullMessage:err,sLine:24,sFile:'dbserviceFhir',sStackTrace:''}))
                var  oLogItem = logItem;
                var oRequest = '';
                var sCorrelationID='';
                logger.LogError(oLogItem,oRequest,sCorrelationID);
                return
            }
        })
    }

    checkConnection1() {
        var connectionResponse = false ;
        return new Promise((resolve, reject) => {
            this.client.connect((err) => {
                if (err) {
                    connectionResponse = false;
                } else {
                    connectionResponse = true;
                }
                resolve(connectionResponse);
            });
        });
    }

    checkConnection() {
        var connectionResponse ;
        return new Promise((resolve, reject) => {
            this.clientConnect();
            this.db.collection("Patient").find({'active':true}).limit(31).toArray(function (err, results) {                       
            if (err) {
                connectionResponse = "Not-connected";
            }
            else{
                connectionResponse = "connected";
            }
            resolve(connectionResponse);
            });  
        })
    }
    
}

module.exports = dbserviceFhir;
