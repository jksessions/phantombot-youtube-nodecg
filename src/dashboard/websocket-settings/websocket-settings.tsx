import React, { useState } from "react";
import { render } from "react-dom";
import { theme } from "../theme";

// material ui elements
import {
	CssBaseline,
	ThemeProvider,
	Button,
    InputAdornment,
    IconButton,
    Input,
    FormControl,
    InputLabel
} from "@mui/material";
import {
    VisibilityOff,
    Visibility,
} from "@mui/icons-material";

import { useReplicant } from "../use-replicant";
import { useListenFor } from "../use-listen-for";

export const WebsocketSettings: React.FC = () => {
    const [websocket] = useReplicant<any, boolean>('websocket', false);
    const [showToken, setShowToken] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [websocketAddress, setWebsocketAddress] = useReplicant<any, string>("websocketAddress", '');
    const [websocketToken, setWebsocketToken] = useReplicant<any, string>("websocketToken", '');

    useListenFor('websocketStateChanged', () => {
        setButtonDisable(false);
    })

    const handleWebsocketAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebsocketAddress(event.target.value);
    }

    const handleWebsocketTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebsocketToken(event.target.value);
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowToken = () => {
        setShowToken(!showToken);
    }

    const handleButtonClick = () => {
        setButtonDisable(true);
        nodecg.sendMessage('websocketToggle');
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <FormControl fullWidth margin='normal'>
                <InputLabel htmlFor='websocket'>Websocket Address</InputLabel>
                <Input 
                    id='websocket'
                    fullWidth
                    value={websocketAddress}
                    onChange={handleWebsocketAddressChange}
                    disabled={(buttonDisable || websocket)?true:false}
                />
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel htmlFor='token'>Auth Token</InputLabel>
                <Input
                    id='token'
                    fullWidth
                    type={showToken?'text':'password'}
                    value={websocketToken}
                    onChange={handleWebsocketTokenChange}
                    disabled={(buttonDisable || websocket)?true:false}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label="toggle token visibility"
                                onClick={handleClickShowToken}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showToken?<VisibilityOff />: <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <Button 
                fullWidth
                color={websocket?"error":"success"}
                onClick={handleButtonClick}
                disabled={buttonDisable}
            >
                {websocket?"Stop":"Start"}
            </Button>
        </ThemeProvider>
    )
};

render(<WebsocketSettings />, document.getElementById("dash-websocket-settings"))