import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = compose(middlewareEnhancer);

export default () => {
    var initialState = {
        products: {
            data: {
                // 'P123456': {
                //     brand: 'Nature\'s Way',
                //     name: 'Kids Smart Vita Gummies',
                //     sku: 'P123456',
                //     cost: 2.49,
                //     price: 7.49,
                //     stockLevel: 12
                // },
                // 'P123457': {
                //     brand: 'Healthy Care',
                //     name: 'Propolis Toothpaste 120g',
                //     sku: 'P123456',
                //     cost: 1.20,
                //     price: 2.49,
                //     stockLevel: 19
                // },
                // 'P123458': {
                //     brand: 'Healthy Care',
                //     name: 'Lecithin 1200mg 100pk',
                //     sku: 'P123456',
                //     cost: 1.99,
                //     price: 6.49,
                //     stockLevel: 4
                // },
                // 'P123459': {
                //     brand: 'A2 Milk',
                //     name: 'Milk Powder Full Cream 1kg',
                //     sku: 'P123456',
                //     cost: 4.19,
                //     price: 13.49,
                //     stockLevel: 12
                // },
                // 'P123461': {
                //     brand: 'Healthy Care',
                //     name: 'CoEnzyme Q10 150mg 100 Capsules',
                //     sku: 'P123456',
                //     cost: 8.10,
                //     price: 21.44,
                //     stockLevel: 9
                // },
            },
            index: [
                // 'P123456', 'P123457', 'P123458', 'P123459', 'P123461'
            ]
        },

    };
    return createStore(
        rootReducer,
        initialState,
        composedEnhancers,
    );
}