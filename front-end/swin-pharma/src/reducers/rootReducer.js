import { combineReducers } from 'redux';
import appState from './appState';
import products from './products';

export default combineReducers({
    products,
    appState
});