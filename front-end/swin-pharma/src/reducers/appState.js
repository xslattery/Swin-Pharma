export default (state = {}, action) => {
    switch (action.type) {
        case 'ADD_APP_PROCESS_TO_STACK':
            return {
                ...state,
                activeProcesses: ++state.activeProcesses
            }
        case 'REMOVE_APP_PROCESS_FROM_STACK':
            return {
                ...state,
                activeProcesses: --state.activeProcesses
            }
        default:
            return state
    }
}