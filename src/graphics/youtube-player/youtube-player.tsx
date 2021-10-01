import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import ReactPlayer from "react-player/youtube";

import { useReplicant } from "../use-replicant";

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
	var playerReady = false;

	const opts = {
		iv_load_policy: 3,
		controls: 0,
		autoplay: 1,
		rel: 0,
		disablekb: 1,
	};

	function onEnded() {
		youtubePlayState.value = 0;
	}

	function onBuffer() {
		youtubePlayState.value = 3;
	}

	function onPlay() {
		youtubePlayState.value = 1;
		setYoutubePlayPause(true);
	}

	function onPause() {
		youtubePlayState.value = 2;
		setYoutubePlayPause(false);
	}

	function onProgress(event: any) {
		youtubeDuration.value = {
			current: event.playedSeconds,
			max: duration,
		};
	}

	function onUnstarted() {
		youtubePlayState.value = -1;
		setYoutubePlayPause(true);
	}

	function onReady() {
		youtubePlayerReady.value = true;
		playerReady = true;
	}

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
