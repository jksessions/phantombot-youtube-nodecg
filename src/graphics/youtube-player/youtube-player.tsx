import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import ReactPlayer from "react-player/youtube";

import { useReplicant } from "../use-replicant";
import { useListenFor } from "../use-listen-for";

import { youtubeCurrentSong } from "../../../types/youtubeCurrentSong.d";

const firstSong: youtubeCurrentSong = {
	id: "dQw4w9WgXcQ",
	title: "",
	duration: "",
	user: "",
};

var duration: number;

export const YoutubePlayer: React.FC = () => {
	const [youtubeCurrentSong, _setYoutubeCurrentSong] = useReplicant<
		any,
		youtubeCurrentSong
	>("youtubeCurrentSong", firstSong);
	const [youtubePlayPause, setYoutubePlayPause] = useReplicant<any, boolean>(
		"youtubePlayPause",
		true
	);
	const [youtubeMute, _setYoutubeMute] = useReplicant<any, boolean>(
		"youtubeMute",
		false
	);
	const [youtubeVolume, _setYoutubeVolume] = useReplicant<any, number>(
		"youtubeVolume",
		10
	);
	const youtubePlayState = nodecg.Replicant<number>("youtubePlayState");
	const youtubeDuration = nodecg.Replicant("youtubeDuration");
	const youtubePlayerReady = nodecg.Replicant<boolean>("youtubePlayerReady");

	const youtubeTarget = useRef<ReactPlayer>(null);

	const [currentSong, setCurrentSong] = useState<string>(
		"https://youtu.be/dQw4w9WgXcQ"
	);

	const mainBody = document.getElementById("dash-youtube-player")!;
	/**
	 * TODO: #4 implement the reconnect functionality to the websocket and check for player readyness on reconnect
	 */
	var playerReady = false;

	const opts = {
		iv_load_policy: 3,
		controls: 0,
		autoplay: 1,
		rel: 0,
		disablekb: 1,
	};

	useListenFor('websocketActive', () => {
		youtubePlayerReady.value = playerReady;
	})


	/**
	 * Lets Phantombot know the song is finished and ready for a new song
	 * * sets PlayState to `0`
	 */
function onEnded() {
		youtubePlayState.value = 0;
	}

	/**
	 * Lets Phantombot know the player is buffering
	 * * sets PlayState to `3`
	 */
	function onBuffer() {
		youtubePlayState.value = 3;
	}

	/**
	 * Lets Phantombot know the player is playing
	 * * sets PlayState to `1`
	 * * sets PlayPause to `true`
	 */
	function onPlay() {
		youtubePlayState.value = 1;
		setYoutubePlayPause(true);
	}

	/**
	 * Lets Phantombot know the player is paused
	 * * sets PlayState to `2`
	 * * sets PlayPause to `false`
	 */
	function onPause() {
		youtubePlayState.value = 2;
		setYoutubePlayPause(false);
	}

	/**
	 * sends elapsed time across the NodeCG bundle
	 * @param event current time elapsed of the player in seconds
	 */
	function onProgress(event: any) {
		youtubeDuration.value = {
			current: event.playedSeconds,
			max: duration,
		};
	}

	/**
	 * Lets Phantombot know the player is unstarted and ready to play.
	 * Starts the player going
	 * * sets PlayState to `-1`
	 * * sets PlayPause to `true`
	 */
	function onUnstarted() {
		youtubePlayState.value = -1;
		setYoutubePlayPause(true);
	}

	/**
	 * Lets Phantombot know the player is initilised.
	 */
	function onReady() {
		youtubePlayerReady.value = true;
		playerReady = true;
	}

	/**
	 * Updates the duration of the song across the NodeCg bundle
	 * @param event duration of the song in seconds
	 */
	function onDuration(event: number) {
		duration = event;
	}

	nodecg.listenFor("youtubeSeek", (message: number) => {
		youtubeTarget.current?.seekTo(message, "seconds");
	});

	useEffect(() => {
		if (youtubePlayPause) {
			mainBody.style.display = "block";
		} else if (!youtubePlayPause) {
			mainBody.style.display = "none";
		}
	}, [youtubePlayPause]);

	useEffect(() => {
		console.log(youtubeCurrentSong);
		setCurrentSong("https://youtu.be/" + youtubeCurrentSong.id);
	}, [youtubeCurrentSong]);

	return (
		<div>
			<ReactPlayer
				ref={youtubeTarget}
				url={currentSong}
				playing={youtubePlayPause}
				onReady={onReady}
				onEnded={onEnded}
				onBuffer={onBuffer}
				onPlay={onPlay}
				onPause={onPause}
				onProgress={onProgress}
				onDuration={onDuration}
				config={{
					playerVars: opts,
					onUnstarted: onUnstarted,
				}}
				width="1920px"
				height="1080px"
				progressInterval={500}
				volume={youtubeVolume / 100}
				muted={youtubeMute}
			></ReactPlayer>
		</div>
	);
};
render(<YoutubePlayer />, document.getElementById("dash-youtube-player"));
