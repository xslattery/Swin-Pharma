import React, { Component } from 'react';
import AppBarMui from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FontAwesome from 'react-fontawesome';

class AppBar extends Component {
    render() {
        return (
            <React.Fragment>
                <AppBarMui position="static" color="inherit" id="gl-app-bar">
                    <Toolbar>
                        <Typography id="gl-main-logo" variant="title" color="inherit">
                            <FontAwesome id="gl-main-logo-icon" name="plus-square" /><span id="gl-main-logo-start">Swin</span><span id="gl-main-logo-end">Pharma</span>
                        </Typography>
                    </Toolbar>
                </AppBarMui>
            </React.Fragment>
        );
    }
}

export default AppBar;