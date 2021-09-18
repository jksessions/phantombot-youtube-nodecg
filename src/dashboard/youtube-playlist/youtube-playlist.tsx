import React from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// Material ui elements
import { CssBaseline, ThemeProvider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Typography, Toolbar, Stack } from "@mui/material";
import { PlayArrow, Add, Shuffle, Upload, Delete } from "@mui/icons-material";

import { useReplicant } from "../use-replicant";

import { youtubePlaylist, youtubePlaylistItem } from "../../../types/youtubePlaylist.d";

export const Playlist: React.FC = () => {
    const [youtubePlaylist, _setYoutubePlaylist] = useReplicant<any, youtubePlaylist>('youtubePlaylist', {playlistname: 'NULL', playlist: [{song: 'null', title: 'null', duration: 'null'}]});

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    function shuffle() {
        nodecg.sendMessage('shufflePlaylist');
    }

    function playSong(song: string) {
        nodecg.sendMessage('updateSong', song);
    }

    function removeSong(song: string) {
        nodecg.sendMessage('removeSongFromPlaylist', song);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Playlist: {youtubePlaylist.playlistname}
                </Typography>
                <IconButton nodecg-dialog="add-song-to-playlist"><Add /></IconButton>
                <IconButton onClick={() => shuffle()}><Shuffle /></IconButton>
                <IconButton nodecg-dialog="change-playlist"><Upload /></IconButton>
            </Toolbar>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size='small'>
                    <TableHead>
                        <TableCell padding='checkbox'>#</TableCell>
                        <TableCell>Song</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell padding='none'>Actions</TableCell>
                    </TableHead>
                    <TableBody>
                        {youtubePlaylist.playlist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: youtubePlaylistItem, index: any) => {
                            return (
                                <TableRow>
                                    <TableCell align="right" padding="checkbox">{index + 1}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell align="right" padding="none">
                                        <Stack spacing={0} direction="row" alignItems="right">
                                            <IconButton onClick={() => playSong(row.song)}><PlayArrow /></IconButton>
                                            <IconButton onClick={() => removeSong(row.song)}><Delete /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={youtubePlaylist.playlist.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </ThemeProvider>
    )
}

render(<Playlist />, document.getElementById('dash-youtube-playlist'));