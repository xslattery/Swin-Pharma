import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

class ViewFrame extends Component {
    render() {
        return (
            <Paper className="gl-frame" style={{ boxShadow: 'znone' }}>
                {this.props.children}
            </Paper>
        );
    }
}

export default ViewFrame;