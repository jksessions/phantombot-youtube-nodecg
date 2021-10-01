import React from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// material ui elements
import {
	CssBaseline,
	ThemeProvider,
	Button,
	Grid,
	Slider,
	Stack,
	Divider,
} from "@mui/material";
import {
	PlayArrow,
	Pause,
	SkipNext,
	Star,
	Delete,
	VolumeDown,
	VolumeUp,
	VolumeMute,
} from "@mui/icons-material";

import { useReplicant } from "../use-replicant";

import { youtubeDuration as YoutubeDuration } from "../../../types/youtubeDuration.d";
import { youtubeCurrentSong as YoutubeCurrentSong } from "../../../types/youtubeCurrentSong.d";

/**
 * Controls for player
 * @returns Youtube player control panel and info
 */
export const YoutubeControls: React.FC = () => {
	const [youtubePlayPause, setyoutubePlayPause] = useReplicant<any, boolean>(
		"youtubePlayPause",
		true
	);
	const [youtubeMute, setYoutubeMute] = useReplicant<any, boolean>(
		"youtubeMute",
		false
	);
	const [youtubeVolume, setYoutubeVolume] = useReplicant<any, number>(
		"youtubeVolume",
		10
	);
	const [youtubeDuration, _setYoutubeDuration] = useReplicant<any, YoutubeDuration>("youtubeDuration", { current: 0, max: 60 });
	const [youtubeCurrentSong, _setyoutubeCurrentSong] = useReplicant<any, YoutubeCurrentSong>("youtubeCurrentSong", {
		duration: "NULL",
		id: "NULL",
		title: "NULL",
		user: "NULL",
	});

	const [playState, setPlayState] = React.useState(false);
	const [canSlide, setCanSlide] = React.useState(true);
	const [currentTime, setCurrentTime] = React.useState(0);

	React.useEffect(() => {
		if (!youtubePlayPause && playState) {
			setPlayState(false);
		}
		if (youtubePlayPause && !playState) {
			setPlayState(true);
		}
		if (canSlide == true) {
			setCurrentTime(youtubeDuration.current);
		}
	});

	/**
	 * Checks `youtubePlayPause` and returns the opposite
	 * @returns opposite of `youtubePlayPause`
	 */
	function playPause(): boolean {
		var play = true;
		if (youtubePlayPause) {
			play = false;
		} else if (!youtubePlayPause) {
			play = true;
		}
		return play;
	}

	/**
	 * Converts seconds into a readable format
	 * @param value time in seconds
	 * @returns readable time value formatted as `1:00`
	 */
	function convertTime(value: number) {
		return (
			Math.floor(value / 60) +
			":" +
			(value % 60
				? Math.floor(value % 60) > 9
					? "" + Math.floor(value % 60)
					: "0" + Math.floor(value % 60)
				: "00")
		);
	}

	/**
	 * Sends the skip song command to Phantombot
	 */
	function skipSong() {
		nodecg.sendMessage("skipSong");
	}

	/**
	 * Adds the current song to the playlist
	 */
	function stealSong() {
		nodecg.sendMessage("stealSong");
	}

	/**
	 * Removes current song from the playlist
	 */
	function unstealSong() {
		nodecg.sendMessage("unstealSong");
	}

	/**
	 * Sets the volume of the youtube player
	 * @param _event unused variable
	 * @param newValue youtube volume in a number between 0-100
	 */
	const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
		setYoutubeVolume(newValue as number);
	};

	/**
	 * Seeks the youtube player
	 * @param _event unused variable
	 * @param newValue time value in seconds
	 */
	const handleTimeChange = (_event: Event, newValue: number | number[]) => {
		setCanSlide(false);
		nodecg.sendMessage("youtubeSeek", newValue as number);
		setCurrentTime(newValue as number);
	};
	
	/**
	 * Allows the slider to move again after letting go
	 * @param _event unused variable
	 * @param _value unused variable
	 */
	const commitTimeChange = (
		_event: React.SyntheticEvent | Event,
		_value: number | Array<number>
	) => {
		setCanSlide(true);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Grid
				container
				justifyContent="center"
				spacing={1}
				wrap="nowrap"
				alignContent="stretch"
			>
				<Grid item xs>
					<Button
						variant="contained"
						fullWidth={true}
						onClick={() => setyoutubePlayPause(playPause())}
					>
						{playState ? <Pause /> : <PlayArrow />}
					</Button>
				</Grid>
				<Grid item xs>
					<Button
						variant="contained"
						fullWidth={true}
						onClick={() => skipSong()}
					>
						<SkipNext />
					</Button>
				</Grid>
				<Grid item xs>
					<Button
						variant="contained"
						fullWidth={true}
						onClick={() => setYoutubeMute(!youtubeMute)}
					>
						{youtubeMute || youtubeVolume === 0 ? (
							<VolumeMute />
						) : youtubeVolume > 50 ? (
							<VolumeUp />
						) : (
							<VolumeDown />
						)}
					</Button>
				</Grid>
				<Grid item xs>
					<Button
						variant="contained"
						fullWidth={true}
						onClick={() => stealSong()}
					>
						<Star />
					</Button>
				</Grid>
				<Grid item xs>
					<Button
						variant="contained"
						fullWidth={true}
						onClick={() => unstealSong()}
					>
						<Delete />
					</Button>
				</Grid>
			</Grid>
			<Divider />
			<Grid
				container
				justifyContent="center"
				spacing={1}
				wrap="nowrap"
				alignContent="stretch"
			>
				<Grid item xs>
					<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
						<VolumeDown />
						<Slider
							aria-label="Volume"
							value={youtubeVolume}
							onChange={handleVolumeChange}
							valueLabelDisplay="auto"
						/>
						<VolumeUp />
					</Stack>
				</Grid>
			</Grid>
			<Grid
				container
				justifyContent="center"
				spacing={1}
				wrap="nowrap"
				alignContent="stretch"
			>
				<Grid item xs>
					<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
						<span>{convertTime(youtubeDuration.current)}</span>
						<Slider
							min={0}
							step={0.1}
							aria-label="Volume"
							value={currentTime}
							onChange={handleTimeChange}
							onChangeCommitted={commitTimeChange}
							valueLabelFormat={convertTime}
							valueLabelDisplay="auto"
							max={youtubeDuration.max}
						/>
						<span>{convertTime(youtubeDuration.max)}</span>
					</Stack>
				</Grid>
			</Grid>
			<p>
				<b>Title:</b> <span>{youtubeCurrentSong.title}</span>
			</p>
			<p>
				<b>URL:</b>{" "}
				<span>
					<a href={"https://youtu.be/" + youtubeCurrentSong.id} target="_blank">
						{"https://youtu.be/" + youtubeCurrentSong.id}
					</a>
				</span>
			</p>
			<p>
				<b>Requested by:</b> <span>{youtubeCurrentSong.user}</span>
			</p>
		</ThemeProvider>
	);
};

render(<YoutubeControls />, document.getElementById("dash-youtube-controls"));
