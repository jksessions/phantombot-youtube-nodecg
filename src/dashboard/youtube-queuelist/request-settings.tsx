import React from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// material ui elements
import { ThemeProvider, TextField } from "@mui/material";

export const RequestSettings: React.FC = () => {
	const [DJNameValue, setDJNameValue] = React.useState("");
	const [maxSongsValue, setMaxSongsValue] = React.useState("");
	const [maxDurationValue, setMaxDurationValue] = React.useState("");
	const [voteCountValue, setVoteCountValue] = React.useState("");

	var DJName = "",
		maxSongs = "",
		maxDuration = "",
		voteCount = "";

	document.addEventListener("dialog-opened", function () {
		nodecg
			.sendMessage("ytSettings")
			.then((result) => {
				setDJNameValue(result.playlistDJname);
				setMaxSongsValue(result.songRequestsMaxParallel);
				setMaxDurationValue(result.songRequestsMaxSecondsforVideo);
				setVoteCountValue(result.voteCount);

				DJName = result.playlistDJname;
				maxSongs = result.songRequestsMaxParallel;
				maxDuration = result.songRequestsMaxSecondsforVideo;
				voteCount = result.voteCount;
			})
			.catch((error) => {
				console.error(error);
			});
	});

	document.addEventListener("dialog-confirmed", function () {
		if (DJName.length > 0) {
			nodecg.sendMessage("dbUpdate", {
				callback_id: "dj_name_up",
				table: "ytSettings",
				key: "playlistDJname",
				value: String(DJName),
			});
		}

		if (parseInt(maxSongs) > 0) {
			nodecg.sendMessage("dbUpdate", {
				callback_id: "max_song_up",
				table: "ytSettings",
				key: "songRequestsMaxParallel",
				value: String(maxSongs),
			});
		}

		if (parseInt(maxDuration) > 0) {
			nodecg.sendMessage("dbUpdate", {
				callback_id: "max_song_len_up",
				table: "ytSettings",
				key: "songRequestsMaxSecondsforVideo",
				value: String(maxDuration),
			});
		}

		if (parseInt(voteCount) > 0) {
			nodecg.sendMessage("dbUpdate", {
				callback_id: "vote_count",
				table: "ytSettings",
				key: "voteCount",
				value: String(voteCount),
			});
		}
	});

	const handleDJNameChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setDJNameValue(event.target.value);
		DJName = event.target.value;
	};

	const handleMaxSongsChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setMaxSongsValue(event.target.value);
		maxSongs = event.target.value;
	};

	const handleMaxDurationChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setMaxDurationValue(event.target.value);
		maxDuration = event.target.value;
	};

	const handleVoteCountChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setVoteCountValue(event.target.value);
		voteCount = event.target.value;
	};

	return (
		<ThemeProvider theme={theme}>
			<TextField
				fullWidth
				label="DJ Name"
				variant="standard"
				value={DJNameValue}
				onChange={handleDJNameChange}
			/>
			<TextField
				fullWidth
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				label="Maximum Songs"
				variant="standard"
				value={maxSongsValue}
				onChange={handleMaxSongsChange}
			/>
			<TextField
				fullWidth
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				label="Maximum Duration"
				variant="standard"
				value={maxDurationValue}
				onChange={handleMaxDurationChange}
			/>
			<TextField
				fullWidth
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				label="Vote Skip Count"
				variant="standard"
				value={voteCountValue}
				onChange={handleVoteCountChange}
			/>
		</ThemeProvider>
	);
};

render(<RequestSettings />, document.getElementById("dash-request-settings"));
