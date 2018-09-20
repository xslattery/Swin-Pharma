import { combineReducers } from "redux";
import appState from "./appState";
import products from "./products";
import sales from "./sales";
import reportData from "./reportData";

export default combineReducers({
  products,
  appState,
  sales,
  reportData
});
