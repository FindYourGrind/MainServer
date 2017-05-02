const WebSocketSource = require('./WebSocketSource');
const sourceConstants = require('./constants.json');

let app = require('../server');
let sourceProcessIDPool = new Set();

function createCommandMessage (command) {
    return JSON.stringify({ command: command })
}

function sendCommandToSourceProcess (sourceId, command) {
    app.emit(sourceConstants.SOURCE_PROCESS_PREFIX + sourceId, createCommandMessage(command));
}

class SourceManager {

    static createSourceProcess (sourceRecord) {
        let sourceId = sourceRecord.getId();

        if (!sourceProcessIDPool.has(sourceId)) {
            let logger = app.logger;
            let sourceProcess;

            switch (sourceRecord.type) {
                case 1:
                    sourceProcess = new WebSocketSource(sourceRecord);
                    break;
                default:
                    logger.warn('SourceManager: Unknown Source Type: ' + sourceRecord.type);
                    return;
            }

            sourceProcessIDPool.add(sourceId);
            sourceProcess.execute();
        }
    }

    static deleteSourceProcess (sourceRecordId) {
        if (sourceProcessIDPool.has(sourceRecordId)) {
            sendCommandToSourceProcess(sourceRecordId, sourceConstants.DELETE_PROCESS_COMMAND);
            sourceProcessIDPool.delete(sourceRecordId);
        }
    }

    static runSourceProcess (sourceRecordId) {
        if (sourceProcessIDPool.has(sourceRecordId)) {
            sendCommandToSourceProcess(sourceRecordId, sourceConstants.RUN_PROCESS_COMMAND);
        }
    }

    static stopSourceProcess (sourceRecordId) {
        if (sourceProcessIDPool.has(sourceRecordId)) {
            sendCommandToSourceProcess(sourceRecordId, sourceConstants.STOP_PROCESS_COMMAND);
        }
    }

    static updateSourceProcess (sourceRecordId) {
        if (sourceProcessIDPool.has(sourceRecordId)) {
            sendCommandToSourceProcess(sourceRecordId, sourceConstants.UPDATE_PROCESS_COMMAND);
        }
    }
}

module.exports = SourceManager;
