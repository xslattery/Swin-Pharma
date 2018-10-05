import { combineReducers } from "redux";
import appState from "./appState";
import products from "./products";
import sales from "./sales";
import reportData from "./reportData";
import forecastData from "./forecastData";
import alerts from "./alerts";

export default combineReducers({
  products,
  appState,
  sales,
  reportData,
  forecastData,
  alerts
});
