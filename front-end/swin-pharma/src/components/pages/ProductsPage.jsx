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
import { fetchProducts } from '../../actions/index';
import { bindActionCreators } from '../../../../../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/redux';

class SalesPage extends Component {
    componentDidMount() {
        this.props.fetchProducts();
    }
    newProduct(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var fetchProducts = () => { this.props.fetchProducts() }
        axios({
            method: 'POST',
            url: appConfig.serverRoot + 'api/Inventory',
            data: data
        })
            .then(fetchProducts)
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
                    Add a new product
                </ViewHeading>
                <ViewFrame>
                    <form onSubmit={this.newProduct.bind(this)} noValidate autoComplete="off" >
                        <Grid container spacing={24}>
                            <Grid item md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    name="Brand"
                                    pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                                />
                            </Grid>
                            <Grid item md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rowsMax="4"
                                    name="Name"
                                    label="Name"
                                />
                            </Grid>
                            <Grid item md={3} sm={12}>
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    name="Barcode"
                                    pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                                />
                            </Grid>
                            <Grid item md={3} sm={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="s">Wholesale Cost</InputLabel>
                                    <Input
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        name="PurchasePrice"
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="s">Retail Price</InputLabel>
                                    <Input
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        name="RetailPrice"
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Stock Level"
                                    name="Quantity"
                                    type="number"
                                />
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
                                <TableCell>Brand</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock Level</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.products.index.map(productCode => {
                                var thisProduct = this.props.products.data[productCode];
                                return (
                                    <TableRow key={productCode}>
                                        <TableCell>{productCode}</TableCell>
                                        <TableCell>{thisProduct.brand}</TableCell>
                                        <TableCell>{thisProduct.name}</TableCell>
                                        <TableCell>{thisProduct.sku}</TableCell>
                                        <TableCell>{thisProduct.cost}</TableCell>
                                        <TableCell>{thisProduct.price}</TableCell>
                                        <TableCell>{thisProduct.stockLevel}</TableCell>
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
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchProducts: fetchProducts
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SalesPage);