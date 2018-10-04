export default (state = {}, action) => {
  switch (action.type) {
    case "LOAD_FETCHED_SALES":
      return {
        data: action.payload.data,
        index: action.payload.index,
        meta: {
          ...state.meta,
          startingIndex: action.payload.meta.startingIndex
        }
      };
    case "UPDATE_SALES_ROWS_PER_PAGE":
      return {
        data: state.data,
        index: state.index,
        meta: { ...state.meta, rowsPerPage: action.payload }
      };
    case "SALES_CHANGE_PAGE":
      return {
        data: state.data,
        index: state.index,
        meta: {
          ...state.meta,
          startingIndex: action.payload * state.meta.rowsPerPage
        }
      };
    case "UPDATE_TOTAL_SALES_COUNT":
      return {
        data: state.data,
        index: state.index,
        meta: { ...state.meta, totalSalesCount: action.payload }
      };
    default:
      return state;
  }
};
