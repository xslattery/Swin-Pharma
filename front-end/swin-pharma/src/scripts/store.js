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
      index: [],
<<<<<<< HEAD
      meta: []
=======
      meta: {
        total: 0,
        startingIndex: 0,
        rowsPerPage: 30
      }
>>>>>>> 6ffddd46183fd3811608a46b5e638ee411e3660a
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
