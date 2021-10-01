import React from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// Material ui elements
import {
	CssBaseline,
	ThemeProvider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	IconButton,
	Typography,
	Toolbar,
	Stack,
} from "@mui/material";
import { PlayArrow, Add, Delete, Settings } from "@mui/icons-material";

import { useReplicant } from "../use-replicant";

import {
	youtubeSonglist,
	youtubeSonglistItem,
} from "../../../types/youtubeSonglist.d";

/**
 * shows the queuelist panel in the NodeCG panel
 * @returns Queuelist panel
 */
export const Queuelist: React.FC = () => {
	const [youtubeSonglist, _setYoutubeSonglist] = useReplicant<
		any,
		youtubeSonglist
	>("youtubeSonglist", [
		{ song: "null", title: "null", duration: "null", requester: "null" },
	]);

	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [page, setPage] = React.useState(0);

	/**
	 * Plays a selected song
	 * @param song youtube ID of the selected song
	 */
	function playSong(song: string) {
		nodecg.sendMessage("updateSong", song);
		nodecg.sendMessage("removeSongFromRequest", song);
	}

	/**
	 * Removes a selected song from the queue
	 * @param song youtube ID of the selected song
	 */
	function removeSong(song: string) {
		nodecg.sendMessage("removeSongFromRequest", song);
	}

	/**
	 * Changes number of rows shown in the queue
	 * @param event number of rows as an event `event.target.value`
	 */
	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	/**
	 * Changes page number
	 * @param _event unused variable
	 * @param newPage page number
	 */
	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Queue
				</Typography>
				<IconButton nodecg-dialog="add-song-to-queue">
					<Add />
				</IconButton>
				<IconButton nodecg-dialog="request-settings">
					<Settings />
				</IconButton>
			</Toolbar>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
					<TableHead>
						<TableCell padding="checkbox">#</TableCell>
						<TableCell>Song</TableCell>
						<TableCell>Duration</TableCell>
						<TableCell>Requester</TableCell>
						<TableCell padding="none">Actions</TableCell>
					</TableHead>
					<TableBody>
						{youtubeSonglist
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: youtubeSonglistItem, index: any) => {
								return (
									<TableRow>
										<TableCell align="right" padding="checkbox">
											{index + 1}
										</TableCell>
										<TableCell padding="none">{row.title}</TableCell>
										<TableCell>{row.duration}</TableCell>
										<TableCell padding="none">{row.requester}</TableCell>
										<TableCell align="right" padding="none">
											<Stack spacing={0} direction="row" alignItems="right">
												<IconButton onClick={() => playSong(row.song)}>
													<PlayArrow />
												</IconButton>
												<IconButton onClick={() => removeSong(row.song)}>
													<Delete />
												</IconButton>
											</Stack>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={youtubeSonglist.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</ThemeProvider>
	);
};

render(<Queuelist />, document.getElementById("dash-youtube-queuelist"));
