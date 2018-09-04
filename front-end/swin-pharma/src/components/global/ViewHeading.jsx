import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

class ViewHeading extends Component {
    render() {
        return (
            <div className="gl-heading">
                <Typography variant={this.props.variant}>
                    {this.props.children}
                </Typography>
            </div>
        );
    }
}

export default ViewHeading;