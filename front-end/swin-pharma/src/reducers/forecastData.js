export default (state = {}, action) => {
  switch (action.type) {
    case "LOAD_FETCHED_FORECAST_DATA":
      return action.payload;
    default:
      return state;
  }
};
