import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import SalesPage from "../pages/SalesPage.jsx";
import ProductsPage from "../pages/ProductsPage";
import ReportsPage from "../pages/ReportsPage.jsx";
import ForecastsPage from "../pages/ForecastsPage.jsx";
import AlertsPage from "../pages/AlertsPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";

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
        <Route path="/forecasts" component={ForecastsPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/settings" component={SettingsPage} />
      </Switch>
    );
  }
}

export default PageRouter;
