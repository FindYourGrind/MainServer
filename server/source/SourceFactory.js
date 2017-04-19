let app = require('../server');
let systemStarted = false;

const WEB_SOCKET_SOURCE_TYPE = 1;

class SourceFactory {

    static onSystemStart() {
        if (!systemStarted) {

            systemStarted = true
        }
    }

    static createSource(sourcePayload) {
        let me = this;
        let processor = me.getSourceProcessor(sourcePayload.type);

        processor.on('workspace-' + sourcePayload.workspaceId + '-event-' + sourcePayload.eventName, function (data) {
            app.models.ValueHolder.find({
                where: {
                    id: sourcePayload.connections
                }
            }).then(models => {
                models.forEach(function (model) {
                    model.updateAttribute('value', data).then(instance => {

                    }, err => {
                        debugger;
                    });
                })
            }, err => {
                debugger;
            });
        });
    }

    static updateSource(sourcePayload) {

    }

    getSourceProcessor(sourceType) {
        let processor = null;

        switch (sourceType) {
            case WEB_SOCKET_SOURCE_TYPE:
                processor = app.wsInstance;
                break;
        }

        return processor;
    }
}

export default SourceFactory;
