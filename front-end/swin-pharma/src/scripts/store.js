import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = compose(middlewareEnhancer);

export default () => {
  var initialState = {
    appState: {
      activeProcesses: 0
    },
    products: {
      data: {},
      index: []
    },
    sales: {
      data: {},
      index: []
    },
    reportData: {
      rows: [],
      reportType: "Week",
      reportDate: "NULL"
    },
    alerts: {
      data: []
    }
  };
  return createStore(rootReducer, initialState, composedEnhancers);
};
