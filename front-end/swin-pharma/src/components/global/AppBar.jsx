import React, { Component } from 'react';
import AppBarMui from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';

class AppBar extends Component {
    render() {
        return (
            <React.Fragment>
                <AppBarMui position="static" color="inherit" id="gl-app-bar">
                    <LinearProgress color="secondary" style={{ minHeight: '2px', minWidth: '100%', opacity: (this.props.appState.activeProcesses > 0 ? 1 : 0), transition: 'opacity 0.2s ease-in-out' }} />
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

const mapStateToProps = state => {
    return {
        appState: state.appState,
    }
}

export default connect(
    mapStateToProps
)(AppBar);