import * as nodecgApiContext from './util/nodecg-api-context';
const nodecg = nodecgApiContext.get();
import { sendToSocket, addListener } from './websocket';

// import types
import { youtubeSonglist } from '../../types/youtubeSonglist';
import { youtubePlaylist } from '../../types/youtubePlaylist';
import { youtubeCurrentSong } from '../../types/youtubeCurrentSong';

// create replicants
const youtube_Songlist = nodecg.Replicant<youtubeSonglist>('youtubeSonglist');
const youtube_Playlist = nodecg.Replicant<youtubePlaylist>('youtubePlaylist');
const youtube_Current_Song = nodecg.Replicant<youtubeCurrentSong>('youtubeCurrentSong');
const youtubePlayPause = nodecg.Replicant<boolean>('youtubePlayPause');
const youtubePlayState = nodecg.Replicant<number>('youtubePlayState');
const youtubeVolume = nodecg.Replicant<number>('youtubeVolume');
const youtubePlayerReady = nodecg.Replicant < boolean > ('youtubePlayerReady');

// Add song to playlist function
export function addSongToPlaylist(song_id?: string, requester?: string) {
    // Update the data.
    sendToSocket({
        command: 'stealsong',
        youTubeID: (song_id === undefined ? '' : song_id),
        requester: (requester === undefined ? '' : requester)
    });
};

// dbQuery function
export function dbQuery(callback_id:string, table:string, callback:object) {
    addListener(callback_id, callback);

    sendToSocket({
        dbquery: true,
        query_id: callback_id,
        table: table
    });
};

export function dbUpdate(callback_id:string, table:string, key:string, value:string, callback?:object) {
    if (callback !== undefined) {
        addListener(callback_id, callback);
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


// check if youtube player is ready
youtubePlayerReady.on('change', (newValue, _oldValue) => {
    sendToSocket({
        status: {
            ready: newValue
        }
    });
    nodecg.log.info('Player Ready: ' + newValue);
})

// let phantombot know of the current state of the youtube player
youtubePlayState.on('change', (newValue, _oldValue) => {
    sendToSocket({
        status: {
            state: newValue
        }
    });
})

// listen for any youtube errors
addListener('playerError', (e: any) => {
    nodecg.log.error("Skipping song, YouTube has thrown an error: " + e);
    sendToSocket({
        status: {
            errorcode: e
        }
    })
});

// Add a listener for the songrequest queue.
addListener('songlist', (e: any) => {
    youtube_Songlist.value = e.songlist;
});

// Add a listener for the main playlist.
addListener('playlist', (e: any) => {
    youtube_Playlist.value = e;
});

// Add a listener for the play event.
addListener('play', (e: any) => {
    
    youtube_Current_Song.value = {
        id: e.play,
        title: e.title,
        user: e.requester,
        duration: e.duration
    };
    youtubePlayPause.value = true;
});

// Add a listener for the pause event.
addListener('pause', (_e: any) => {
    if(youtubePlayPause.value === true){
        youtubePlayPause.value = false;
    } else if(youtubePlayPause.value === false){
        youtubePlayPause.value = true;
    }
})

addListener('setvolume', (e: any) => {
    youtubeVolume.value = e.setvolume;
    nodecg.log.info('Volume: ' + e.setvolume)
})

// listen for skipSong command
nodecg.listenFor('skipSong', (_value, _ack) => {
    sendToSocket({
        command: 'skipsong'
    });
})

// listen for stealSong command
nodecg.listenFor('stealSong', (_value, _ack) => {
    addSongToPlaylist();
})

// listen for unstealSong command
nodecg.listenFor('unstealSong', (_value, _ack) => {
    sendToSocket({
        command: 'deletecurrent'
    });
})

// listen for shufflePlaylist command
nodecg.listenFor('shufflePlaylist', (_value, _ack) => {
    sendToSocket({
        command: 'togglerandom'
    });
})

// listen for loadPlaylist command
nodecg.listenFor('loadPlaylist', (value, _ack) => {
    sendToSocket({
        command: 'loadpl',
        playlist: value
    });
})

// listen for setVolume command
nodecg.listenFor('setVolume', (value, _ack) => {
    sendToSocket({
        status: {
            volume: value
        }
    });
})

// listen for updateSong command
nodecg.listenFor('updateSong', (value, _ack) => {
    sendToSocket({
        status: {
            currentid: value
        }
    });
})

// listen for removeSongFromPlaylist command
nodecg.listenFor('removeSongFromPlaylist', (value, _ack) => {
    sendToSocket({
        deletepl: value
    });
})

// listen for addSongToPlaylist command
nodecg.listenFor('addSongToPlaylist', (value, _ack) => {
    addSongToPlaylist(value);
})

// listen for removeSongFromRequest command
nodecg.listenFor('removeSongFromRequest', (value, _ack) => {
    sendToSocket({
        deletesr: value
    });
})

// listen for addSongToQueue command
nodecg.listenFor('addSongToQueue', (value, _ack) => {
    sendToSocket({
        command: 'songrequest',
        search: value
    });
})

// listen for ytSettings command
nodecg.listenFor('ytSettings', (_value, ack) => {
    dbQuery('yt_settings', 'ytSettings', (e:any) => {
        if (ack && !ack.handled) {
            ack(null, e);
        }
    })
})

// listen for getPlaylists command
nodecg.listenFor('getPlaylists', (_value, ack) => {
    dbQuery('get_playlists', 'yt_playlists_registry', (e:any) => {
        if (ack && !ack.handled) {
            ack(null, e);
        }
    })
})

// listen for dbQuery command
nodecg.listenFor('dbQuery', (value, ack) => {
    dbQuery(value.callback_id, value.table, (e:any) => {
        if (ack && !ack.handled) {
            ack(null, e);
        }
    })
})

// listen for dbUpdate command
nodecg.listenFor('dbUpdate', (value, _ack) => {
    dbUpdate(value.callback_id, value.table, value.key, value.value);
})
