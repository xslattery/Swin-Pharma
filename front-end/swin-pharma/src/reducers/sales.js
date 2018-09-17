export default (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_FETCHED_SALES':
            return action.payload
        default:
            return state
    }
}