import * as nodecgApiContext from './util/nodecg-api-context';

// import types
import { youtubeSonglist } from '../../types/youtubeSonglist';
import { youtubePlaylist } from '../../types/youtubePlaylist';
import { youtubeCurrentSong } from '../../types/youtubeCurrentSong';

const nodecg = nodecgApiContext.get();

nodecg.Replicant<youtubeSonglist>('youtubeSonglist');
nodecg.Replicant<youtubePlaylist>('youtubePlaylist');
nodecg.Replicant<youtubeCurrentSong>('youtubeCurrentSong');
nodecg.Replicant<string>('youtubePlayPause', {
    defaultValue: 'pause'
});
nodecg.Replicant<number>('youtubePlayState');
nodecg.Replicant<number>('youtubeVolume', {
    defaultValue: 10
});
nodecg.Replicant<boolean>('youtubePlayerReady', {
    defaultValue: false
});
nodecg.Replicant<boolean>('websocket', {
    defaultValue: false
});