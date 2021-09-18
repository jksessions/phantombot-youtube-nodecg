import * as nodecgApiContext from './util/nodecg-api-context';

// Import types
import {youtubeSonglist} from '../../types/youtubeSonglist';
import {youtubePlaylist} from '../../types/youtubePlaylist';
import {youtubeCurrentSong} from '../../types/youtubeCurrentSong';
import {youtubeDuration} from '../../types/youtubeDuration';

const nodecg = nodecgApiContext.get();

nodecg.Replicant < youtubeSonglist > ('youtubeSonglist');
nodecg.Replicant < youtubePlaylist > ('youtubePlaylist');
nodecg.Replicant < youtubeCurrentSong > ('youtubeCurrentSong');
nodecg.Replicant < string > ('youtubePlayPause', {
	defaultValue: 'pause'
});
nodecg.Replicant < number > ('youtubePlayState');
nodecg.Replicant < number > ('youtubeVolume', {
	defaultValue: 10
});
nodecg.Replicant < boolean > ('youtubePlayerReady', {
	defaultValue: false
});
nodecg.Replicant < boolean > ('websocket', {
	defaultValue: false
});
nodecg.Replicant<boolean>('youtubeMute', {
	defaultValue: false
});
nodecg.Replicant<youtubeDuration>('youtubeDuration', {
	defaultValue: {
		current: 0,
		max: 60
	}
})