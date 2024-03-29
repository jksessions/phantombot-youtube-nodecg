import React from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// material ui elements
import { ThemeProvider, TextField } from "@mui/material";

/**
 * Add songs to the Queue
 * @returns Panel for adding songs to the Queue
 */
export const AddSongToQueue: React.FC = () => {
	const [value, setValue] = React.useState("");

	var song = "";

	document.addEventListener("dialog-confirmed", function () {
		if (song.length > 0) {
			nodecg.sendMessage("addSongToQueue", song);
		}
		setValue("");
		song = "";
	});

	document.addEventListener("dialog-dismissed", function () {
		setValue("");
		song = "";
	});

	/**
	 * changes values of variables as the text input changes
	 * @param event data from text input
	 */
	const handleValueChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setValue(event.target.value);
		console.log(value);
		song = event.target.value;
	};

	return (
		<ThemeProvider theme={theme}>
			<TextField
				fullWidth
				id="standard-basic"
				label="URL or Search term"
				variant="standard"
				value={value}
				onChange={handleValueChange}
			/>
		</ThemeProvider>
	);
};

render(<AddSongToQueue />, document.getElementById("dash-add-song-to-queue"));
