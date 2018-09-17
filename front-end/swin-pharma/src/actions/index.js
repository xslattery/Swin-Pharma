import axios from "axios";
import appConfig from '../scripts/config';

const updateProducts = (products) => {
    return {
        type: 'LOAD_FETCHED_PRODUCTS',
        payload: products
    }
}

const updateSales = (sales) => {
    return {
        type: 'LOAD_FETCHED_SALES',
        payload: sales
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

export const fetchSales = () => {
    return (dispatch) => {
        dispatch(addAppProcessToStack());
        axios.get(appConfig.serverRoot + 'api/Sales').then((res) => {
            var rows = res.data;
            var sales = {
                data: {},
                index: []
            };
            for (var i = 0; i < rows.length; i++) {
                var columns = rows[i].split(',');
                sales.data[columns[0]] = {
                    group_id: columns[1],
                    item_id: columns[2],
                    date: columns[3],
                    time: columns[4],
                    quantity: columns[5],
                    number_in_group: columns[6],
                    last_in_group: columns[7],
                }
                sales.index[i] = columns[0];
            }
            dispatch(updateSales(sales));
            dispatch(removeAppProcessFromStack());
        });
    }
}