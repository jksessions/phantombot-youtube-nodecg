// load required dependencies
const WebSocket = require('ws');
const base64 = require('nodejs-base64-encode');

module.exports = nodecg => {
    const ws = new WebSocket(nodecg.bundleConfig.webSocketURL);
    var listeners = [],
        player = {},
        hasAPIKey = true,
        secondConnection = false,
        webSocket = false;
    const youtubeSonglist = nodecg.Replicant('youtubeSonglist');
    const youtubePlaylist = nodecg.Replicant('youtubePlaylist');
    const youtubeCurrentSong = nodecg.Replicant('youtubeCurrentSong');
    const youtubePlayPause = nodecg.Replicant('youtubePlayPause');
    const youtubePlayState = nodecg.Replicant('youtubePlayState');
    const youtubeVolume = nodecg.Replicant('youtubeVolume', {defaultValue: 10});
    const youtubePlayerReady = nodecg.Replicant('youtubePlayerReady', {defaultValue: false});

    
    var sendToSocket = (data) => {
        // Do not send any requests or any other data to the Core for processing if there is no key.
        if (!hasAPIKey) {
            return;
        }

        try {
            ws.send(JSON.stringify(data));
        } catch (ex) {
            nodecg.log.error('Failed to send message to socket: ' + ex.message);
        }
    };

     /*
     * @function to determine is a second connection was detected.
     */
    player.secondConnection = () => {
        return secondConnection;
    }

    /*
     * @function to determine if an API key exists.
     */
    player.hasAPIKey = () => {
        return hasAPIKey;
    }

    /*
     * @function gets the playlist.
     *
     * @param {String} callback_id
     */
    player.requestPlaylist = (callback_id) => {
        // Request the data.
        sendToSocket({
            query: 'playlist'
        });
    };

    /*
     * @function gets the request list.
     *
     * @param {String} callback_id
     */
    player.requestRequestList = (callback_id) => {
        // Request the data.
        sendToSocket({
            query: 'songlist'
        });
    };

    /*
     * @function deletes a song from the current playlist.
     */
    player.deleteFromPlaylist = () => {
        sendToSocket({
            command: 'deletecurrent'
        });
    };

    /*
     * @function "steals" a song and adds it to the default playlist.
     *
     * @param {String} song_id
     * @param {String} requester
     */
    player.addSongToPlaylist = (song_id, requester) => {
        // Update the data.
        sendToSocket({
            command: 'stealsong',
            youTubeID: (song_id === undefined ? '' : song_id),
            requester: (requester === undefined ? '' : requester)
        });
    };

    /*
     * @function adds a song to the queue.
     *
     * @param {String} song_id
     */
    player.requestSong = (song_id) => {
        // Add song to queue.
        sendToSocket({
            command: 'songrequest',
            search: song_id
        });
    };

    /*
     * @function removes a song from the default playlist.
     *
     * @param {String} song_id
     * @param {String} requester
     */
    player.removeSongFromPlaylist = (song_id) => {
        // Update the data.
        sendToSocket({
            deletepl: song_id
        });
    };

    /*
     * @function removes a song from the queue.
     *
     * @param {String} song_id
     * @param {String} requester
     */
    player.removeSongFromRequest = (song_id) => {
        // Update the data.
        sendToSocket({
            deletesr: song_id
        });
    };

    /*
     * @function shuffles the playlist.
     */
    player.shufflePlaylist = () => {
        // Update the data.
        sendToSocket({
            command: 'togglerandom'
        });
    };

    /*
     * @function loads a new playlist
     *
     * @param {String} playlist
     */
    player.loadPlaylist = (playlist) => {
        // Update the data.
        sendToSocket({
            command: 'loadpl',
            playlist: playlist
        });
    };

    /*
     * @function skips the current song.
     */
    player.skipSong = () => {
        sendToSocket({
            command: 'skipsong'
        });
    };

    /*
     * @function updates the player status.
     *
     * @param {Number} status
     */
    player.updateState = (status) => {
        sendToSocket({
            status: {
                state: status
            }
        });
    };

    /*
     * @function updates the current song.
     *
     * @param {String} id
     */
    player.updateSong = (id) => {
        sendToSocket({
            status: {
                currentid: id
            }
        });
    };

    /*
     * @function puts the player in ready mode.
     */
    player.ready = () => {
        sendToSocket({
            status: {
                ready: true
            }
        });
    };

    /*
     * @function sends error code from YouTube Player
     *
     * @param {Number} status
     */
    player.sendError = (status) => {
        sendToSocket({
            status: {
                errorcode: status
            }
        });
    };

    /*
     * @function updates the player volume.+
     *
     * @param {Number} volume
     */
    player.updateVolume = (volume) => {
        sendToSocket({
            status: {
                volume: volume
            }
        });
    };

    /*
     * @function puts the player in ready-pause mode.
     */
    player.readyPause = () => {
        sendToSocket({
            status: {
                readypause: true
            }
        });
    };

    /*
     * @function Gets all keys and values from a table
     *
     * @param {String}   callback_id
     * @param {String}   table
     * @param {Function} callback
     */
    player.dbQuery = (callback_id, table, callback) => {
        listeners[callback_id] = callback;

        sendToSocket({
            dbquery: true,
            query_id: callback_id,
            table: table
        });
    };

    /*
     * @function Updates a key and value in the database
     *
     * @param {String}   callback_id
     * @param {String}   table
     * @param {String}   key
     * @param {String}   value
     * @param {Function} callback
     */
    player.dbUpdate = (callback_id, table, key, value, callback) => {
        if (callback !== undefined) {
            listeners[callback_id] = callback;
        }

        sendToSocket({
            dbupdate: true,
            query_id: callback_id,
            update: {
                table: table,
                key: key,
                value: value
            }
        });
    };

    /*
     * @function adds a listener to the socket.
     *
     * @param {String}   listener_id
     * @param {Function} listener
     */
    player.addListener = (listener_id, listener) => {
        listeners[listener_id] = listener;
    };

    // Add a listener for the songrequest queue.
    player.addListener('songlist', (e) => {
        youtubeSonglist.value = e.songlist;
    });

    // Add a listener for the main playlist.
    player.addListener('playlist', (e) => {
        youtubePlaylist.value = e;
    });

    // Add a listener for the play event.
    player.addListener('play', (e) => {
        
        youtubeCurrentSong.value = {
            id: e.play,
            title: e.title,
            user: e.requester,
            duration: e.duration
        };
        youtubePlayPause.value = 'play';
    });

    // Add a listener for the pause event.
    player.addListener('pause', (e) => {
        if(youtubePlayPause.value === 'play'){
            youtubePlayPause.value = 'pause';
        } else if(youtubePlayPause.value === 'pause'){
            youtubePlayPause.value = 'play';
        }
    })

    player.addListener('setvolume', (e) => {
        youtubeVolume.value = e.setvolume;
        nodecg.log.info('Volume: ' + e.setvolume)
    })

    // authenticate once connected
    ws.on('open', function open() {
        nodecg.log.info('Phantombot Youtube Websocket Connected');
        sendToSocket({
            authenticate: nodecg.bundleConfig.webauthToken
        });
        keepAlive();
        webSocket = true;
    });
    
    ws.on('message', function incoming(data) {
        try {
            let message = JSON.parse(data);

            // Check this message here before doing anything else.
            if (message.secondconnection !== undefined) {
                if (message.secondconnection === true) {
                    secondConnection = true;
                    nodecg.log.error('Only one youtube instance allowed. Please close any panels and try again.');
                }
                return;
            }

            // Check this message here before doing anything else.
            if (message.authresult !== undefined) {
                if (message.authresult === false) {
                    nodecg.log.error('Failed to auth with the socket.');
                }
                return;
            }

            // Check to ensure that there is an API key.
            if (message.ytkeycheck !== undefined) {
                if (message.ytkeycheck === false) {
                    hasAPIKey = false;
                    nodecg.log.error("Missing YouTube API Key.");
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
    });

    ws.on('close', function close() {
        nodecg.log.error('Youtube Websocket Closed');
        cancelKeepAlive();
    })
    
    // check if youtube player is ready
    youtubePlayerReady.on('change', (newValue, oldValue) => {
        if(webSocket == true){
            if(newValue == true) {
                player.ready();
                nodecg.log.info('Player Ready');
            }
        }
    })

    // let phantombot know of the current state of the youtube player
    youtubePlayState.on('change', (newValue, oldValue) => {
        if(webSocket === true){
            player.updateState(newValue);
        }
    })

    // listen for commands from the dashboard
    nodecg.listenFor('youtubeCommand', (value, ack) => {
        if(value === 'skipSong'){
            player.skipSong();
        } else if(value === 'stealSong'){
            player.addSongToPlaylist();
        } else if(value === 'unstealSong'){
            player.deleteFromPlaylist();
        } else if(value === 'shufflePlaylist'){
            player.shufflePlaylist();
        } else if(value.command === 'setVolume'){
            player.updateVolume(value.volume);
        } else if(value.command === 'updateSong'){
            player.updateSong(value.song);
        } else if(value.command === 'removeSongFromPlaylist'){
            player.removeSongFromPlaylist(value.song);
        } else if(value.command === 'addSongToPlaylist'){
            player.addSongToPlaylist(value.song);
        } else if(value.command === 'removeSongFromRequest'){
            player.removeSongFromRequest(value.song);
        } else if(value.command === 'addSongToQueue'){
            player.requestSong(value.song);
        } else if(value.command === 'dbQuery'){
            player.dbQuery(value.callback_id, value.table, (e) => {
                if (ack && !ack.handled) {
                    ack(null, e);
                }
            })
        } else if(value.command === 'dbUpdate'){
            player.dbUpdate(value.callback_id, value.table, value.key, value.value);
        }
    })

    var timerID = 0; 
    function keepAlive() { 
        var timeout = 20000;  
        if (ws.readyState == ws.OPEN) {  
            ws.send('');  
        }  
        timerId = setTimeout(keepAlive, timeout);  
    }  
    function cancelKeepAlive() {  
        if (timerId) {  
            clearTimeout(timerId);  
        }  
    }
}