import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SalesPage from '../pages/SalesPage.jsx';

class PageRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path="/sales" component={SalesPage} />
            </Switch>
        );
    }
}

export default PageRouter;