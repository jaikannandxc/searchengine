

var dotenv = require('dotenv');
var model = require('./model');
var modelClass = new model();
dotenv.config();
var client;
const log4js = require('log4js');
var loglevel = process.env.LOGLEVEL;
var Logger;

class logger {
  constructor() {
    log4js.configure({
      appenders: {
        searchLogs: { type: 'file', filename: 'search.log', maxLogSize: 10485760, backups: 3, compress: true },
        console: { type: 'console' }
      },
      categories: {
        Error: { appenders: ['console', 'searchLogs'], level: loglevel },
        Info: { appenders: ['console', 'searchLogs'], level: loglevel },
        default: { appenders: ['console', 'searchLogs'], level: 'trace' }
      }

    });

    if (loglevel == 'Info')
      Logger = log4js.getLogger(loglevel);
    if (loglevel == 'Error')
      Logger = log4js.getLogger(loglevel);
  }

  FillLoglevels(item) {
    modelClass.logItem.LogLevel = item.LogLevel;
    modelClass.logItem.lnErrorID = item.lnErrorID;
    modelClass.logItem.sShortMessage = item.sShortMessage;
    modelClass.logItem.sFullMessage = item.sFullMessage;
    modelClass.logItem.sLine = item.sLine;
    modelClass.logItem.sFile = item.sFile;
    modelClass.logItem.sStackTrace = item.sStackTrace;
    return (modelClass.logItem);
  }

  Log(oLogItem, oRequest, sCorrelationID) {
    if (oLogItem != null) {
      Logger.info(oLogItem);
      return
    }
  }

  LogError(oLogItem, oRequest, sCorrelationID) {
    if (oLogItem != null) {
      Logger.error(oLogItem);
      return
    }
  }
}

module.exports = logger;

