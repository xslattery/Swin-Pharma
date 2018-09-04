import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

class ViewFrame extends Component {
    render() {
        return (
            <Paper style={{ padding: this.props.padding + 'rem' }} className="gl-frame">
                {this.props.children}
            </Paper>
        );
    }
}

ViewFrame.propTypes = {
    padding: PropTypes.number
};

ViewFrame.defaultProps = {
    padding: 1
};

export default ViewFrame;