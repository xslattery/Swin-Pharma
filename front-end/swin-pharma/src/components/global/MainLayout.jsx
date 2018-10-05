import React, { Component } from "react";
import AppBar from "./AppBar.jsx";
import MainMenu from "./MainMenu.jsx";
import PageRouter from "./PageRouter.jsx";

class MainLayout extends Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <AppBar />
        </div>
        <MainMenu />
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          <div
            style={{
              flexGrow: "1",
              height: "auto",
              marginTop: "60px",
              marginLeft: "240px",
              overflow: "hidden"
            }}
          >
            <PageRouter />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MainLayout;
