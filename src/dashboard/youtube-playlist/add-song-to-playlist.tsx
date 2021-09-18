import React from 'react';
import {render} from 'react-dom';
import {theme} from '../theme';

// material ui elements
import {ThemeProvider, TextField } from '@mui/material';

export const AddSongToPlaylist: React.FC = () => {
    const [value, setValue] = React.useState(null);

    document.addEventListener('dialog-confirmed', function() {
        nodecg.sendMessage('addSongToPlaylist', value);
        setValue(null);
    })

    document.addEventListener('dialog-dismissed', function() {
        setValue(null);
    })

    return (
        <ThemeProvider theme={theme}>
            <TextField fullWidth id="standard-basic" label="URL or Search term" variant="standard" value={value}/>
        </ThemeProvider>
    )
}

render(<AddSongToPlaylist />, document.getElementById('dash-add-song-to-playlist'))