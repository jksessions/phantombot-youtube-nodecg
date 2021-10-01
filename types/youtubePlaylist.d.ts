export interface youtubePlaylistItem {
	duration: string;
	song: string;
	title: string;
}

export interface youtubePlaylist {
	playlist: Array<youtubePlaylistItem>;
	playlistname: string;
}
