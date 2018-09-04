import React, { Component } from 'react';
import ViewFrame from '../global/ViewFrame.jsx';
import ViewHeading from '../global/ViewHeading';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import appConfig from '../../scripts/config';
import axios from 'axios';

const rows = [
    {
        productCode: 'P123456',
        name: 'Nature\'s Way Kids Smart Vita Gummies Multi Vitamin & Vegies 60 Gummies',
        description: 'To help support healthy growth & development.  Berry flavour pastille.',
        sku: 'P123456',
        cost: 2.49,
        price: 7.49,
        stockLevel: 12
    },
    {
        productCode: 'P123457',
        name: 'Healthy Care Propolis Toothpaste 120g',
        description: 'Healthy Care Propolis Toothpaste is an unique toothpaste containing Propolis. It not only protects your teeth from decay but it also promotes healthy gums and fresh breath. It builds a protective barrier against teeth sensitivity due to heat, cold, acids, sweets and brushing.',
        sku: 'P123456',
        cost: 1.20,
        price: 2.49,
        stockLevel: 19
    },
    {
        productCode: 'P123458',
        name: 'Healthy Care Lecithin 1200mg 100',
        description: 'To help support healthy growth & development.  Berry flavour pastille.',
        sku: 'P123456',
        cost: 1.99,
        price: 6.49,
        stockLevel: 4
    },
    {
        productCode: 'P123459',
        name: 'A2 Milk Powder Full Cream 1kg',
        description: '',
        sku: 'P123456',
        cost: 4.19,
        price: 13.49,
        stockLevel: 12
    },
    {
        productCode: 'P123461',
        name: 'Healthy Care CoEnzyme Q10 150mg 100 Capsules',
        description: 'Supports heart health. Supports production of energy in muscles. Maintains healthy heart tissue.',
        sku: 'P123456',
        cost: 8.10,
        price: 21.44,
        stockLevel: 9
    },
];

class SalesPage extends Component {
    postForm(e) {
        e.preventDefault();
        var data = new FormData();
        data.append('Name', 'name');
        data.append('Description', 'description');
        data.append('Barcode', 'barcode');
        data.append('PurchasePrice', 'purchasePrice');
        data.append('RetailPrice', 'retailPrice');
        data.append('Quanity', 10);
        axios({
            method: 'post',
            url: appConfig.serverRoot + 'api/inventory',
            data: data,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        return (
            <React.Fragment>
                <ViewHeading variant="title">
                    Add a new product
                </ViewHeading>
                <ViewFrame>
                    <form onSubmit={this.postForm} noValidate autoComplete="off" >
                        <Grid container spacing={24}>
                            <Grid item md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                                />
                            </Grid>
                            <Grid item md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rowsMax="4"
                                    label="Description"
                                />
                            </Grid>
                            <Grid item md={4} sm={12}>
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                                />
                            </Grid>
                            <Grid item md={4} sm={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="s">Wholesale Cost</InputLabel>
                                    <Input
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="s">Retail Price</InputLabel>
                                    <Input
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                >
                                    <AddIcon className="left-icon icon-small" />
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </ViewFrame>
                <ViewHeading variant="title">
                    Your products
                </ViewHeading>
                <ViewFrame padding={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock Level</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => {
                                return (
                                    <TableRow key={row.productCode}>
                                        <TableCell>{row.productCode}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.sku}</TableCell>
                                        <TableCell>{row.cost}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{row.stockLevel}</TableCell>
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

const mapStateToProps = function (state) {
    return {
        test: state.test,
    }
}

export default connect(
    mapStateToProps
)(SalesPage);