import React, { Component } from 'react';
import ViewFrame from '../global/ViewFrame.jsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ViewHeading from '../global/ViewHeading';
import { connect } from 'react-redux';
import appConfig from '../../scripts/config';
import axios from 'axios';
import SalesRecordBuilder from '../etc/SalesRecordBuilder';

let id = 0;
function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

class SalesPage extends Component {
    addSalesRecord(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        axios({
            method: 'post',
            url: appConfig.serverRoot + 'api/Inventory',
            data: data,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                alert('An unexpected error occurred while adding a new product.');
                window.location.reload();
            });
    }
    render() {
        return (
            <React.Fragment>
                <ViewHeading variant="title">
                    Add a sales record
                </ViewHeading>
                <SalesRecordBuilder />
                <ViewHeading variant="title">
                    Recent Sales
                </ViewHeading>
                <ViewFrame padding={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell numeric>Sale #</TableCell>
                                <TableCell numeric>Product Name</TableCell>
                                <TableCell numeric>Quantity</TableCell>
                                <TableCell numeric>Date</TableCell>
                                <TableCell numeric>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.sales.index.map(saleId => {
                                var thisRow = this.props.sales.data[saleId];
                                return (
                                    <TableRow key={saleId}>
                                        <TableCell component="th" scope="row">{thisRow.group_id}</TableCell>
                                        <TableCell numeric>{this.props.products.data[thisRow.item_id].name}</TableCell>
                                        <TableCell numeric>{thisRow.quantity}</TableCell>
                                        <TableCell numeric>{thisRow.date}</TableCell>
                                        <TableCell numeric>{thisRow.time}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ViewFrame>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        products: state.products,
        sales: state.sales,
    }
}

export default connect(
    mapStateToProps
)(SalesPage);