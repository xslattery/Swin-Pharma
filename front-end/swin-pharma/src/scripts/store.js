import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = compose(middlewareEnhancer);

export default () => {
    var initialState = {
        test: "aaa"
    };
    return createStore(
        rootReducer,
        initialState,
        // composedEnhancers,
    );
}