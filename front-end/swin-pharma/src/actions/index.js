import axios from "axios";
import appConfig from "../scripts/config";

const updateProducts = products => {
  return {
    type: "LOAD_FETCHED_PRODUCTS",
    payload: products
  };
};

const updateSales = sales => {
  return {
    type: "LOAD_FETCHED_SALES",
    payload: sales
  };
};

const updateReportData = reportData => {
  return {
    type: "LOAD_FETCHED_REPORT_DATA",
    payload: reportData
  };
};

const updateAlerts = alerts => {
  return {
    type: "LOAD_FETCHED_ALERTS",
    payload: alerts
  };
};

const addAppProcessToStack = () => {
  return {
    type: "ADD_APP_PROCESS_TO_STACK"
  };
};

const removeAppProcessFromStack = () => {
  return {
    type: "REMOVE_APP_PROCESS_FROM_STACK"
  };
};

export const fetchProducts = () => {
  return dispatch => {
    dispatch(addAppProcessToStack());
    axios.get(appConfig.serverRoot + "api/inventory").then(res => {
      var rows = res.data;
      var products = {
        data: {},
        index: []
      };
      for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(",");
        products.data[columns[0]] = {
          name: columns[1],
          brand: columns[2],
          barcode: columns[3],
          purchasePrice: columns[4],
          retailPrice: columns[5],
          quantity: columns[6]
        };
        products.index[i] = columns[0];
      }
      dispatch(updateProducts(products));
      dispatch(removeAppProcessFromStack());
    });
  };
};

export const fetchSales = () => {
  return dispatch => {
    dispatch(addAppProcessToStack());
    axios.get(appConfig.serverRoot + "api/Sales").then(res => {
      var rows = res.data;
      var sales = {
        data: {},
        index: []
      };
      for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(",");
        sales.data[columns[0]] = {
          groupId: columns[1],
          itemId: columns[2],
          quantity: columns[3],
          date: columns[4],
          time: columns[5],
          numberInGroup: columns[6],
          lastInGroup: columns[7]
        };
        sales.index[i] = columns[0];
      }
      dispatch(updateSales(sales));
      dispatch(removeAppProcessFromStack());
    });
  };
};

export const fetchReportData = (type, date) => {
  return dispatch => {
    dispatch(addAppProcessToStack());
    date = date.split("-");
    date = date[2] + "/" + date[1] + "/" + date[0];
    axios
      .get(appConfig.serverRoot + "api/Report/" + type + "?date=" + date)
      .then(res => {
        var rows = type === "Week" ? res.data.row : res.data.rows;
        var reportData = {
          rows,
          reportType: type,
          reportDate: date
        };
        dispatch(updateReportData(reportData));
        dispatch(removeAppProcessFromStack());
      });
  };
};

export const fetchAlerts = () => {
  return dispatch => {
    dispatch(addAppProcessToStack());
    axios.get(appConfig.serverRoot + "api/Notification?amount=5").then(res => {
      dispatch(updateAlerts(res.data.items));
      dispatch(removeAppProcessFromStack());
    });
  };
};
