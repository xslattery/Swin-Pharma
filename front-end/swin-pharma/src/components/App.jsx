import React, { Component } from "react";
import "../styles/App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../scripts/muiTheme";
import MainLayout from "./global/MainLayout.jsx";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchProducts, fetchSales, fetchAlerts } from "../actions/index";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.start = this.start.bind(this);
    this.sync = this.sync.bind(this);
  }
  componentDidMount() {
    this.start(10);
  }
  start(syncIntervalTime /* time in seconds */) {
    this.sync();
    window.setInterval(this.sync, syncIntervalTime * 1000);
  }
  sync() {
    this.props.fetchProducts();
    this.props.fetchAlerts();
  }
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <MainLayout />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchProducts,
      fetchSales,
      fetchAlerts
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(App);
