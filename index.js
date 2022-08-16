var express = require('express')
var app = express()
var http = require('http');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
dotenv.config();
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const patientSearchClass = require('./patientSearch');
const practitionerSearchClass = require('./practitionerSearch');
const fhirSearchClass = require('./fhirSearch');
const Logger =require('./logger');
const patientsearch = new patientSearchClass();
const practitionersearch = new practitionerSearchClass();
const fhirsearch = new fhirSearchClass();
const logger = new Logger();
const dbserviceFhir = require('./dbServiceFhir');
var mongoservice = new dbserviceFhir();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});


app.post('/patientSearch', function (req, res) {
  patientsearch.search(req).then(results => {
    res.json(results);
  },
    error => {
      let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage: error,sLine:19,sFile:'index',sStackTrace:''}))
      logger.LogError(oLogItem = logItem,oRequest=req,sCorrelationID='');
      res.json(error);
    });
});

app.get('/practitionerSearch', function (req, res) { 
  practitionersearch.search(req).then(results => {
    res.json(results);
  },
    error => {
      let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage: error,sLine:19,sFile:'index',sStackTrace:''}))
      logger.LogError(oLogItem = logItem,oRequest=req,sCorrelationID='');
      res.json(error);
    });
});

app.get('/fhirSearch', function (req, res) { 
  fhirsearch.search(req).then(results => {
    res.json(results);
  },
    error => {
      let logItem = logger.FillLoglevels(({LogLevel: "error",lnErrorID:'0',sShortMessage:'',sFullMessage: error,sLine:19,sFile:'index',sStackTrace:''}))
      logger.LogError(oLogItem = logItem,oRequest=req,sCorrelationID='');
      res.json(error);
    });
});

app.get('/checkConnectivity', function (req, res) {
  mongoservice.checkConnection().then(results => {
    res.json(results);
  });   
});

app.get('/alive', function (req, res) {
  res.send("Up and running !!!");
  let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:'server Up and running',sLine:19,sFile:'index',sStackTrace:''}))
  logger.Log(oLogItem = logItem,oRequest=req,sCorrelationID='');
});

server.listen(port, function () {
  console.log('server.. running on port ' + port + "!!");
  let logItem = logger.FillLoglevels(({LogLevel: "Info",lnErrorID:'0',sShortMessage:'',sFullMessage:`Server started at http://localhost:${port}`,sLine:19,sFile:'index',sStackTrace:''}))
  logger.Log(oLogItem = logItem,oRequest='',sCorrelationID='');
 
})

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node.js docs)
  })
