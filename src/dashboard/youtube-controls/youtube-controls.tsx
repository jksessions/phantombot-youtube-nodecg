import React, {useState} from 'react';
import {render} from 'react-dom';
import styled from 'styled-components';
import {theme} from '../theme';

// material ui elements
import { ThemeProvider } from '@material-ui/styles';
import {Button, ButtonGroup, Grid, Slider} from '@material-ui/core';
import '@material-ui/icons';



export const YoutubeControls: React.FC = () => {

    return (
        <ThemeProvider theme={theme}>
            <Grid container>

            </Grid>
        </ThemeProvider>
    );
}

render(<YoutubeControls />, document.getElementById('dash-youtube-controls'))