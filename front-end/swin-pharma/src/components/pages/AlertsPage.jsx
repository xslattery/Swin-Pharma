import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import ViewHeading from "../global/ViewHeading";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";

class AlertsPage extends Component {
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">Alerts</ViewHeading>
        <ViewFrame padding={0}>
          <List>
            {this.props.alerts.map((alert, i) => (
              <ListItem key={i} dense>
                <WarningIcon />
                <ListItemText>
                  <span style={{ color: "#FFC107" }}>Low Stock!</span>
                  &nbsp; You only have <b>{alert.quantity}</b> units in stock
                  for the item named <b>'{alert.name}'</b>
                </ListItemText>
                <IconButton>
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </ViewFrame>
      </React.Fragment>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    alerts: state.alerts.data
  };
};

export default connect(mapStateToProps)(AlertsPage);
