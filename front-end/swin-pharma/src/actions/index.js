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

export const fetchSales = (startingIndex, rowsPerPage) => {
  return dispatch => {
    dispatch(addAppProcessToStack());
    axios.get(appConfig.serverRoot + "api/Sales/Count").then(res => {
      dispatch({
        type: "UPDATE_TOTAL_SALES_COUNT",
        payload: res.data
      });
      dispatch(removeAppProcessFromStack());
    });
    dispatch(addAppProcessToStack());
    axios
      .get(
        appConfig.serverRoot +
          "api/Sales?start=" +
          startingIndex +
          "&count=" +
          rowsPerPage
      )
      .then(res => {
        var rows = res.data;
        var sales = {
          data: {},
          index: [],
          meta: {
            startingIndex
          }
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
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    axios
      .get(
        appConfig.serverRoot +
          "api/Forecast/Individual/" +
          type +
          "?todayDate=" +
          dd +
          "/" +
          mm +
          "/" +
          yyyy +
          "&date=" +
          date
      )
      .then(res => {
        console.log(res.data.row);
        var reportData = {
          rows: res.data.row,
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

export const updateSalesRowsPerPage = rowsPerPage => ({
  type: "UPDATE_SALES_ROWS_PER_PAGE",
  payload: rowsPerPage
});

export const salesChangePage = newPage => ({
  type: "SALES_CHANGE_PAGE",
  payload: newPage
});
