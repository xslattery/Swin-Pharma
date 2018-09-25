export default (state = {}, action) => {
  switch (action.type) {
    case "LOAD_FETCHED_ALERTS":
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};
