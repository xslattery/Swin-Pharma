export default (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_FETCHED_PRODUCTS':
            return action.payload
        default:
            return state
    }
}