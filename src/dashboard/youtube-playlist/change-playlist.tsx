import React from 'react';
import {render} from 'react-dom';
import {theme} from '../theme';

// material ui elements
import {ThemeProvider, InputLabel, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const ChangePlaylist: React.FC = () => {
    const [value, setValue] = React.useState('');
    const [table, setTable] = React.useState<Array<string>>([]);

    var playlist = '';

    document.addEventListener('dialog-opened', function() {
        nodecg.sendMessage('getPlaylists').then(result => {
            var keys = Object.keys(result);
            keys.shift();
            for(var i = 0; i < keys.length; i++) {
                keys[i] = keys[i].replace(/^ytPlaylist_/, '');
            }
            setTable(keys);
        }).catch(error => {
            console.error(error);
        });
    });

    document.addEventListener('dialog-confirmed', function() {
        nodecg.sendMessage('loadPlaylist', playlist);
        setValue('');
    })

    document.addEventListener('dialog-dismissed', function() {
        setValue('');
    })

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
        playlist = event.target.value;
    };

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth>
                <InputLabel id="playlist-select-label">Playlist</InputLabel>
                <Select
                    native
                    value={value}
                    inputProps={{
                        name: 'playlist',
                        id: 'Playlist-select',
                    }}
                    onChange={handleChange}
                >
                    {table.map((item: string, _index: any) => {
                        return(
                            <option value={item}>{item}</option>
                        )
                    })}
                </Select>
            </FormControl>
        </ThemeProvider>
    )
}

render(<ChangePlaylist />, document.getElementById('dash-change-playlist'))