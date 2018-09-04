import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SalesPage from '../pages/SalesPage.jsx';
import ProductsPage from '../pages/ProductsPage';
import ReportsPage from '../pages/ReportsPage.jsx';
import AlertsPage from '../pages/AlertsPage.jsx';

class PageRouter extends Component {

    componentDidMount() {
        if (window.location.pathname === "/") {
            window.location = "/sales";
        }
    }

    render() {
        return (
            <Switch>
                <Route path="/sales" component={SalesPage} />
                <Route path="/products" component={ProductsPage} />
                <Route path="/reports" component={ReportsPage} />
                <Route path="/alerts" component={AlertsPage} />
            </Switch>
        );
    }
}

export default PageRouter;