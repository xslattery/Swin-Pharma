import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import BarChartIcon from "@material-ui/icons/BarChart";
import WidgetsIcon from "@material-ui/icons/Widgets";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingsIcon from "@material-ui/icons/Settings";
import Badge from "@material-ui/core/Badge";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: window.location.pathname
    };
    // window.setInterval(() => {
    //   if (window.location.pathname !== this.state.currentPage) {
    //     this.setState({
    //       currentPage: window.location.pathname
    //     });
    //   }
    // }, 200);
  }
  handleClick(dest){
    this.setState({
      currentPage: dest
    });
  }
  getAlertsListItem() {
    if (this.props.alerts.length > 0) {
      return (
        <Link className="covert-link" to="/alerts" onClick={() => { this.handleClick("/alerts")}}>
          <ListItem button selected={this.state.currentPage === "/alerts"}>
            <ListItemIcon>
              <Badge color="error" badgeContent={this.props.alerts.length}>
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Alerts" />
          </ListItem>
        </Link>
      );
    } else {
      return (
        <Link className="covert-link" to="/alerts" onClick={() => { this.handleClick("/alerts")}}>
          <ListItem button selected={this.state.currentPage === "/alerts"}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Alerts" />
          </ListItem>
        </Link>
      );
    }
  }
  render() {
    return (
      <React.Fragment>
        <div id="gl-main-menu">
          <List component="nav">
            <Link className="covert-link" to="/sales" onClick={() => { this.handleClick("/sales")}}>
              <ListItem button selected={this.state.currentPage === "/sales"}>
                <ListItemIcon>
                  <BubbleChartIcon />
                </ListItemIcon>
                <ListItemText primary="Sales" />
              </ListItem>
            </Link>
            <Link className="covert-link" to="/products" onClick={() => { this.handleClick("/products")}}>
              <ListItem
                button
                selected={this.state.currentPage === "/products"}
              >
                <ListItemIcon>
                  <WidgetsIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>
            </Link>
            <Link className="covert-link" to="/reports" onClick={() => { this.handleClick("/reports")}}>
              <ListItem button selected={this.state.currentPage === "/reports"}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItem>
            </Link>
            {this.getAlertsListItem()}
          </List>
          <Divider />
          <List component="nav">
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
        <div id="gl-main-menu-daemon" />
      </React.Fragment>
    );
  }
}

export default connect(state => ({ alerts: state.alerts.data }))(MainMenu);
