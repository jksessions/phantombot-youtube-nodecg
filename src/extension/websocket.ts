import * as nodecgApiContext from './util/nodecg-api-context';
const nodecg = nodecgApiContext.get();
import * as WebSocket from 'ws';

const websocket = nodecg.Replicant<boolean>('websocket');

var listeners = [],
    websocketAddress = nodecg.bundleConfig.webSocketURL,
    authToken = nodecg.bundleConfig.webauthToken,
    ws = new WebSocket(websocketAddress);

function sendToSocket(data: JSON) {
    if(websocket.value == true) {
        try {
            ws.send(JSON.stringify(data));
        } catch (ex) {
            nodecg.log.error('Failed to send message to socket: ' + ex.message);
        }
    }
}

function addListener(listener_id: any, listener: any) {
    listeners[listener_id] = listener;
};

function websocketClose() {
    ws.close();
}

ws.on('open', function open() {
    nodecg.log.info('Phantombot Youtube Websocket Connected');
    ws.send(JSON.stringify({authenticate: authToken}));
})

ws.on('message', function incoming(data: string) {
    try {
        let message = JSON.parse(data);
        
        // Check this message here before doing anything else.
        if (message.secondconnection !== undefined) {
            if (message.secondconnection === true) {
                nodecg.log.error('Only one youtube instance allowed. Please close any panels and try again.');
                websocketClose();
            }
            return;
        }

        // Check this message here before doing anything else.
        if (message.authresult !== undefined) {
            if (message.authresult === false) {
                nodecg.log.error('Failed to auth with the socket. (No/Incorrect Auth Code)');
                websocketClose();
            } else if (message.authresult === true && message.authtype === 'read') {
                nodecg.log.error('Failed to auth with the socket. (Read only)');
                websocketClose();
            }else if (message.authresult === true && message.authtype === 'read/write') {
                nodecg.log.info('Authenticated successfully with PhantombotYT Websocket');
                websocket.value = true;
            }
            return;
        }

        // Check to ensure that there is an API key.
        if (message.ytkeycheck !== undefined) {
            if (message.ytkeycheck === false) {
                nodecg.log.error("Missing YouTube API Key in Phantombot Config.");
                websocketClose();
            }
            return;
        }

        if (message.query_id !== undefined) {
            if (listeners[message.query_id] !== undefined) {
                listeners[message.query_id](message);
                delete listeners[message.query_id];
            }
        } else if (message.command !== undefined) {
            if (typeof message.command === 'object') {
                let keys = Object.keys(message.command);

                for (let i = 0; i < keys.length; i++) {
                    if (listeners[keys[i]] !== undefined) {
                        listeners[keys[i]](message.command);
                        return;
                    }
                }
            } else {
                if (listeners[message.command] !== undefined) {
                    listeners[message.command](message);
                }
            }
        } else {
            let keys = Object.keys(message);

            for (let i = 0; i < keys.length; i++) {
                if (listeners[keys[i]] !== undefined) {
                    listeners[keys[i]](message);
                    return;
                }
            }
        }
    } catch (ex) {
        nodecg.log.error('Failed to parse message from socket: ' + ex.message);
    }
})

ws.on('close', function close() {
    nodecg.log.error('Youtube Websocket Closed');
    websocket.value = false;
})