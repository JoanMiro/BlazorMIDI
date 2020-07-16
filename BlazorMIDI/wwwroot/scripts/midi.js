var midi = function () {
    var access = null;
    var status = "Uninitialized";

    function initialize(handler) {
        var success = function (midiAccess) {
            access = midiAccess;
            handler.invokeMethodAsync("Success");
        };
        var failure = message => handler.invokeMethodAsync("Failure", message);
        navigator.requestMIDIAccess({ sysex: true })
            .then(success, failure);
    }

    function getStatus() {
        return status;
    }
    function getInputPorts() {
        var ret = [];
        access.inputs.forEach(input => ret.push({
            id: input.id,
            name: input.name,
            type: input.type,
            manufacturer: input.manufacturer,
            version: input.version
        }));
        return ret;
    }

    function getOutputPorts() {
        var ret = [];
        access.outputs.forEach(output => ret.push({
            id: output.id,
            name: output.name,
            type: output.type,
            manufacturer: output.manufacturer,
            version: output.version
        }));
        return ret;
    }
    function addMessageHandler(portId, handler) {
        access.inputs.get(portId).onmidimessage = function (message) {
            // We need to base64-encode the data explicitly, so let's create a new object.
            var jsonMessage = { data: window.btoa(message.data), timestamp: message.timestamp };
            handler.invokeMethodAsync("OnMessageReceived", jsonMessage);
        };
    }

    return {
        initialize: initialize,
        getStatus: getStatus,
        getInputPorts: getInputPorts,
        getOutputPorts: getOutputPorts,
        addMessageHandler: addMessageHandler
    };
}();