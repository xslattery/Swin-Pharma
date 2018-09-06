import axios from "axios";
import appConfig from 'config';

function fetchProducts() {
    return function() {
        return axios.get(appConfig.serverRoot+'api/');
    };
}