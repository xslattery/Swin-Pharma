import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';

class MainMenu extends Component {
    render() {
        return (
            <React.Fragment>
                <div id="gl-main-menu">
                    <List component="nav">
                        <Link className="covert-link" to="/sales">
                            <ListItem
                                button
                                selected={window.location.pathname === "/sales"}
                            >
                                <ListItemIcon>
                                    <BubbleChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sales" />
                            </ListItem>
                        </Link>
                        <Link className="covert-link" to="/products">
                            <ListItem
                                button
                                selected={window.location.pathname === "/products"}
                            >
                                <ListItemIcon>
                                    <AppsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItem>
                        </Link>
                        <Link className="covert-link" to="/reports">
                            <ListItem
                                button
                                selected={window.location.pathname === "/reports"}
                            >
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reports" />
                            </ListItem>
                        </Link>
                        <Link className="covert-link" to="/alerts">
                            <ListItem
                                button
                                selected={window.location.pathname === "/alerts"}
                            >
                                <ListItemIcon>
                                    <NotificationsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Alerts" />
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                    <List component="nav">
                        <ListItem
                            button
                        >
                            <ListItemText primary="Trash" />
                        </ListItem>
                        <ListItem
                            button
                        >
                            <ListItemText primary="Spam" />
                        </ListItem>
                    </List>
                </div>
                <div id="gl-main-menu-daemon"></div>
            </React.Fragment>
        );
    }
}

export default MainMenu;