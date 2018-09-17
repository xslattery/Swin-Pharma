import axios from "axios";
import appConfig from '../scripts/config';

const updateProducts = (products) => {
    return {
        type: 'LOAD_FETCHED_PRODUCTS',
        payload: products
    }
}

const addAppProcessToStack = () => {
    return {
        type: 'ADD_APP_PROCESS_TO_STACK',
    }
}

const removeAppProcessFromStack = () => {
    return {
        type: 'REMOVE_APP_PROCESS_FROM_STACK',
    }
}

export const fetchProducts = () => {
    return (dispatch) => {
        dispatch(addAppProcessToStack());
        axios.get(appConfig.serverRoot + 'api/inventory').then((res) => {
            var rows = res.data;
            var products = {
                data: {},
                index: []
            };
            for (var i = 0; i < rows.length; i++) {
                var columns = rows[i].split(',');
                products.data[columns[0]] = {
                    name: columns[1],
                    brand: columns[2],
                    sku: columns[3],
                    cost: columns[4],
                    price: columns[5],
                    stockLevel: columns[6],
                }
                products.index[i] = columns[0];
            }
            dispatch(updateProducts(products));
            dispatch(removeAppProcessFromStack());
        });
    }
}