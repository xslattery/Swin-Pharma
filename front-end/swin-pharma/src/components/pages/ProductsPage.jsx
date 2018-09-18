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
import IconButton from '@material-ui/core/IconButton';
import { func } from 'prop-types';

function resolveFieldDisplayName(fieldName) {
    var definitions = {
        'productCode': 'Product #',
        'brand': 'Brand Name',
        'name': 'Product Name',
        'sku': 'SKU',
        'cost': 'Supply Cost',
        'price': 'Retail Price',
        'stockLevel': 'Stock Level',
    }
    for (var d in definitions) {
        if (d == fieldName) return definitions[d];
    }
    return fieldName;
}

const DeleteButton = ({ productCode }) => {
    return (
        <IconButton
            onClick={((productCode) => {
                return () => {
                    if (window.confirm('Are you sure you want to delete product ' + productCode)) {
                        axios.delete(appConfig.serverRoot + 'api/Inventory/' + productCode)
                            .then((res) => {
                                this.props.fetchProducts()
                            });
                    }
                }
            })(productCode)
            }
        >
            <DeleteIcon fontSize="small" />
        </IconButton >
    )
}

class ProductsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingEditDialogue: false,
            editDialogueProductCode: "",
            editDialogueFieldName: "",
            editDialogueFieldValue: ""
        }
    }
    getProductById(id) {
        for (var p in this.props.products.data) {
            if (p == id) return this.props.products.data[p];
        }
        return "";
    }
    EditableField(text, productCode, fieldName) {
        return (
            <a
                className="editable-field"
                href="#"
                onClick={() => {
                    this.setState({
                        showingEditDialogue: true,
                        editDialogueProductCode: productCode,
                        editDialogueFieldName: fieldName,
                        editDialogueFieldValue: this.getProductById(productCode)[fieldName]
                    })
                }}
            >
                {text}
                <span className="editable-field-icon"><EditIcon fontSize="inherit" /></span>
            </a>
        )
    }
    closeEditDialogue = () => {
        this.setState({ ...this.state, showingEditDialogue: false });
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
                alert('An unexpected error occurred while adding a new product.');
                window.location.reload();
            });
    }
    editProduct() {

        // prep data
        var data = {
            ...this.props.products.data[this.state.editDialogueProductCode]
        }
        data[this.state.editDialogueFieldName] = this.state.editDialogueFieldValue;

        // submit update request
        axios({
            method: 'PUT',
            url: appConfig.serverRoot + 'api/Inventory/' + this.state.editDialogueProductCode,
            data: data
        })
            .then(() => {
                this.props.fetchProducts()
            })
            .catch(function (error) {
                alert('An unexpected error occurred while editing product.');
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
                                    autoComplete="off"
                                    name="Name"
                                    label="Product Name"
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
                                <TableCell numeric>{resolveFieldDisplayName('productCode')}</TableCell>
                                <TableCell>{resolveFieldDisplayName('brand')}</TableCell>
                                <TableCell>{resolveFieldDisplayName('name')}</TableCell>
                                <TableCell>{resolveFieldDisplayName('sku')}</TableCell>
                                <TableCell numeric>{resolveFieldDisplayName('cost')}</TableCell>
                                <TableCell numeric>{resolveFieldDisplayName('price')}</TableCell>
                                <TableCell numeric>{resolveFieldDisplayName('stockLevel')}</TableCell>
                                <TableCell numeric>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.products.index.map(productCode => {
                                var thisProduct = this.props.products.data[productCode];
                                return (
                                    <TableRow key={productCode}>
                                        <TableCell numeric>{productCode}</TableCell>
                                        <TableCell>{this.EditableField(thisProduct.brand, productCode, "brand")}</TableCell>
                                        <TableCell>{this.EditableField(thisProduct.name, productCode, "name")}</TableCell>
                                        <TableCell>{this.EditableField(thisProduct.sku, productCode, "sku")}</TableCell>
                                        <TableCell numeric>{this.EditableField(thisProduct.cost, productCode, "cost")}</TableCell>
                                        <TableCell numeric>{this.EditableField(thisProduct.price, productCode, "price")}</TableCell>
                                        <TableCell numeric>{this.EditableField(thisProduct.stockLevel, productCode, "stockLevel")}</TableCell>
                                        <TableCell numeric>
                                            <DeleteButton />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ViewFrame>
                <Dialog
                    open={this.state.showingEditDialogue}
                    onClose={this.closeEditDialogue}
                >
                    <DialogTitle>{this.getProductById(this.state.editDialogueProductCode).name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>

                        </DialogContentText>
                        <TextField
                            autoFocus
                            value={this.state.editDialogueFieldValue}
                            margin="dense"
                            id="name"
                            label={resolveFieldDisplayName(this.state.editDialogueFieldName)}
                            onChange={() => { this.setState({ ...this.state, editDialogueFieldValue: this.value }) }}
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="secondary"
                            onClick={this.closeEditDialogue}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.editProduct();
                                this.submitFieldChange();
                            }}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function (state) {
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