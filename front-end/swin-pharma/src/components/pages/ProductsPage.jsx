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
import { bindActionCreators } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ProductsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingEditModal: false
        }
    }
    handleClickOpen = (productCode) => {
        this.setState({ showingEditModal: true });
    };

    handleClose = () => {
        this.setState({ showingEditModal: false });
    };
    componentDidMount() {
        this.props.fetchProducts();
    }
    newProduct(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var fetchProducts = ((form) => {
            return () => {
                this.props.fetchProducts()
                form.reset();
            }
        })(e.target);
        axios({
            method: 'POST',
            url: appConfig.serverRoot + 'api/Inventory',
            data: data
        })
            .then(fetchProducts)
            .catch(function (error) {
                alert(error);
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
                                <TableCell numeric>Product #</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell numeric>SKU</TableCell>
                                <TableCell numeric>Cost</TableCell>
                                <TableCell numeric>Price</TableCell>
                                <TableCell numeric>Stock Level</TableCell>
                                <TableCell numeric>Edit</TableCell>
                                <TableCell numeric>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.products.index.map(productCode => {
                                var thisProduct = this.props.products.data[productCode];
                                return (
                                    <TableRow key={productCode}>
                                        <TableCell numeric>{productCode}</TableCell>
                                        <TableCell>{thisProduct.brand}</TableCell>
                                        <TableCell>{thisProduct.name}</TableCell>
                                        <TableCell numeric>{thisProduct.sku}</TableCell>
                                        <TableCell numeric>{thisProduct.cost}</TableCell>
                                        <TableCell numeric>{thisProduct.price}</TableCell>
                                        <TableCell numeric>{thisProduct.stockLevel}</TableCell>
                                        <TableCell numeric>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    this.handleClickOpen(productCode);
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell numeric>
                                            <Button
                                                size="small"
                                                onClick={((productCode) => {
                                                    return () => {
                                                        axios.delete(appConfig.serverRoot + 'api/Inventory/' + productCode)
                                                            .then((res) => {
                                                                this.props.fetchProducts()
                                                            });
                                                    }
                                                })(productCode)}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ViewFrame>
                <Dialog
                    open={this.state.showingEditModal}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
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
)(ProductsPage);