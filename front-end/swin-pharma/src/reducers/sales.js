export default (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_FETCHED_SALES':
            return {
                data: action.payload.data,
                index: action.payload.data,
                meta: {
                    ...state.meta,
                    startingIndex: action.meta.startingIndex,
                }
              }
        default:
            return state
    }
}