import React, { Component } from 'react';
import '../styles/App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../scripts/muiTheme';
import MainLayout from './global/MainLayout.jsx';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App" >
            <MainLayout />
          </div >
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;