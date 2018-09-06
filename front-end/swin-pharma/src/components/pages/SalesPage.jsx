import React, { Component } from 'react';
import ViewFrame from '../global/ViewFrame.jsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ViewHeading from '../global/ViewHeading';
import { connect } from 'react-redux';
import appConfig from '../../scripts/config';
import axios from 'axios';

let id = 0;
function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

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
                <ViewFrame>
                    <form onSubmit={this.addSalesRecord} noValidate autoComplete="off" >
                        <Grid container spacing={24}>
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
                                    <InputLabel htmlFor="s">Selling Price</InputLabel>
                                    <Input
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        name="Selling Price"
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
                    Recent Sales
                </ViewHeading>
                <ViewFrame padding={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell numeric>Calories</TableCell>
                                <TableCell numeric>Fat (g)</TableCell>
                                <TableCell numeric>Carbs (g)</TableCell>
                                <TableCell numeric>Protein (g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => {
                                return (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell numeric>{row.calories}</TableCell>
                                        <TableCell numeric>{row.fat}</TableCell>
                                        <TableCell numeric>{row.carbs}</TableCell>
                                        <TableCell numeric>{row.protein}</TableCell>
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