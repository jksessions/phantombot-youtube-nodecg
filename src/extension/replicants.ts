import * as nodecgApiContext from "./util/nodecg-api-context";

import { youtubeSonglist } from "../../types/youtubeSonglist";
import { youtubePlaylist } from "../../types/youtubePlaylist";
import { youtubeCurrentSong } from "../../types/youtubeCurrentSong";
import { youtubeDuration } from "../../types/youtubeDuration";

const nodecg = nodecgApiContext.get();

nodecg.Replicant<youtubeSonglist>("youtubeSonglist");
nodecg.Replicant<youtubePlaylist>("youtubePlaylist");
nodecg.Replicant<youtubeCurrentSong>("youtubeCurrentSong");
nodecg.Replicant<boolean>("youtubePlayPause", {
	defaultValue: true,
	persistent: false,
});
nodecg.Replicant<number>("youtubePlayState");
nodecg.Replicant<number>("youtubeVolume", {
	defaultValue: 10,
});
nodecg.Replicant<boolean>("youtubePlayerReady", {
	defaultValue: false,
	persistent: false,
});
nodecg.Replicant<boolean>("websocket", {
	defaultValue: false,
	persistent: false,
});
nodecg.Replicant<boolean>("youtubeMute", {
	defaultValue: false,
});
nodecg.Replicant<youtubeDuration>("youtubeDuration", {
	defaultValue: {
		current: 0,
		max: 60,
	},
});
