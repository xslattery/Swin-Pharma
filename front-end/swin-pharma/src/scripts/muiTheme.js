import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
            main: '#EA2027'
        },
        secondary: {
            main: '#1289A7'
        }
    },
    typography: {
        fontFamily: [
            'Lato',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    MuiButton: {
        root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 48,
            padding: '0 30px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
    },
    shadows: [
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
        '0px 0px 0px #fff',
    ]
});