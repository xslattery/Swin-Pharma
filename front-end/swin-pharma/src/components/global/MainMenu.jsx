import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import BubbleChartIcon from "@material-ui/icons/BubbleChartTwoTone";
import BarChartIcon from "@material-ui/icons/BarChartTwoTone";
import WidgetsIcon from "@material-ui/icons/WidgetsTwoTone";
import NotificationsIcon from "@material-ui/icons/NotificationsTwoTone";
import TrendingUpIcon from "@material-ui/icons/TrendingUpTwoTone";
import SettingsIcon from "@material-ui/icons/SettingsTwoTone";
import Badge from "@material-ui/core/Badge";

const primaryNavItems = [
  { display: "Sales", path: "/sales", icon: BubbleChartIcon },
  { display: "Products", path: "/products", icon: WidgetsIcon },
  { display: "Reports", path: "/reports", icon: BarChartIcon },
  { display: "Forecasts", path: "/forecasts", icon: TrendingUpIcon },
  {
    display: "Alerts",
    path: "/alerts",
    icon: null,
    getIcon: getAlertsListItemIcon
  }
];

const secondaryNavItems = [
  { display: "Settings", path: "/settings", icon: SettingsIcon }
];

function getAlertsListItemIcon(alertsCount) {
  if (alertsCount > 0) {
    return (
      <Badge color="error" badgeContent={alertsCount}>
        <NotificationsIcon />
      </Badge>
    );
  } else {
    return <NotificationsIcon />;
  }
}

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname
    };
  }
  handleNavItemClick(dest) {
    this.setState({
      path: dest
    });
    this.props.history.push(dest);
  }
  getNavItem(display, path, Icon, getIcon) {
    return (
      <ListItem
        key={path}
        button
        className="covert-link"
        onClick={() => {
          this.handleNavItemClick(path);
        }}
        selected={path === this.state.path}
      >
        <ListItemIcon>
          {typeof getIcon === "function" ? (
            getIcon(this.props.alerts.length)
          ) : (
            <Icon />
          )}
        </ListItemIcon>
        <ListItemText primary={display} />
      </ListItem>
    );
  }
  render() {
    return (
      <React.Fragment>
        <div id="gl-main-menu">
          <List component="nav">
            {primaryNavItems.map(n => {
              return this.getNavItem(
                n.display,
                n.path,
                n.icon,
                typeof n.getIcon === "function" ? n.getIcon : null
              );
            })}
          </List>
          <Divider />
          <List component="nav">
            {secondaryNavItems.map(n =>
              this.getNavItem(
                n.display,
                n.path,
                n.icon,
                typeof n.getIcon === "function" ? n.getIcon : null
              )
            )}
          </List>
        </div>
        <div id="gl-main-menu-daemon" />
      </React.Fragment>
    );
  }
}

export default connect(state => ({ alerts: state.alerts.data }))(
  withRouter(MainMenu)
);
