import * as nodecgApiContext from "./util/nodecg-api-context";
const nodecg = nodecgApiContext.get();
import WebSocket from "ws";

const websocket = nodecg.Replicant<boolean>("websocket");
const youtubePlayerReady = nodecg.Replicant<boolean>("youtubePlayerReady");

var listeners: any = [],
	websocketAddress = nodecg.bundleConfig.webSocketURL,
	authToken = nodecg.bundleConfig.webauthToken,
	connection: WebSocket,
	websocketActive = false;

function websocketOpen() {
	const ws = new WebSocket(websocketAddress);

	ws.on("open", function open() {
		connection = ws;
		websocketActive = true;
		nodecg.log.info("Phantombot Youtube Websocket Connected");
		ws.send(JSON.stringify({ authenticate: authToken }));
	});

	ws.on("message", function incoming(data: string) {
		try {
			let message = JSON.parse(data);

			// pong if pinged
			if (message.ping !== undefined) {
				ws.send(
					JSON.stringify({
						pong: "pong",
					})
				);
			}

			// Check this message here before doing anything else.
			if (message.secondconnection !== undefined) {
				if (message.secondconnection === "true") {
					nodecg.log.error(
						"Only one youtube instance allowed. Please close any panels and try again."
					);
					websocketClose();
				}
				return;
			}

			// Check this message here before doing anything else.
			if (message.authresult !== undefined) {
				if (message.authresult == "false") {
					nodecg.log.error(
						"Failed to auth with the socket. (No/Incorrect Auth Code)"
					);
					websocketClose();
				} else if (message.authresult == "true") {
					if (message.authtype == "read") {
						nodecg.log.error("Failed to auth with the socket. (Read only)");
						websocketClose();
					} else if (message.authtype == "read/write") {
						nodecg.log.info(
							"Authenticated successfully with PhantombotYT Websocket"
						);
						websocket.value = true;
					}
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
				if (typeof message.command === "object") {
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
		} catch (ex: any) {
			nodecg.log.error("Failed to parse message from socket: " + ex.message);
		}
	});

	ws.on("close", function close() {
		nodecg.log.error("Youtube Websocket Closed");
		websocket.value = false;
		websocketActive = false;
	});

	ws.on("error", function error(event) {
		nodecg.log.error("WebSocket error: ", event);
	});
}

websocketOpen();

export function sendToSocket(data: any) {
	if (websocket.value == true) {
		try {
			connection.send(JSON.stringify(data));
		} catch (ex: any) {
			nodecg.log.error("Failed to send message to socket: " + ex.message);
		}
	}
}

export function addListener(listener_id: any, listener: any) {
	listeners[listener_id] = listener;
}

function websocketClose() {
	connection.close();
	youtubePlayerReady.value = false;
}

websocket.on("change", (newValue, _oldValue) => {
	if (newValue) {
		nodecg.sendMessage("websocketActive");
	}
});

nodecg.listenFor("websocketToggle", () => {
	if (websocketActive) {
		websocketClose();
	} else if (!websocketActive) {
		websocketOpen();
	}
});
