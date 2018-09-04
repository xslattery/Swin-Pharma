import React, { Component } from 'react';
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
                        <a className="covert-link" href="/sales">
                            <ListItem
                                button
                                selected={true}
                            >
                                <ListItemIcon>
                                    <BubbleChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sales" />
                            </ListItem>
                        </a>
                        <a className="covert-link" href="/inventory">
                            <ListItem
                                button
                                onClick={event => this.handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <AppsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inventory" />
                            </ListItem>
                        </a>
                        <a className="covert-link" href="/reports">
                            <ListItem
                                button
                                onClick={event => this.handleListItemClick(event, 1)}
                            >
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reports" />
                            </ListItem>
                        </a>
                        <a className="covert-link" href="/alerts">
                            <ListItem
                                button
                                onClick={event => this.handleListItemClick(event, 1)}
                            >
                                <ListItemIcon>
                                    <NotificationsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Alerts" />
                            </ListItem>
                        </a>
                    </List>
                    <Divider />
                    <List component="nav">
                        <ListItem
                            button
                            onClick={event => this.handleListItemClick(event, 2)}
                        >
                            <ListItemText primary="Trash" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={event => this.handleListItemClick(event, 3)}
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