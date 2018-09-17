import React, { Component, createRef } from 'react';
import ViewFrame from '../global/ViewFrame.jsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
import ProductSearch from '../etc/ProductSearch.jsx';

class SalesRecordBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
        this.productSearch = createRef();
    }
    addSalesRecordLine(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let jsonObject = {};
        for (const [key, value] of formData.entries()) {
            jsonObject[key] = value;
        }
        this.setState({
            rows: [
                ...this.state.rows,
                { 'item_id': jsonObject['item_id'], 'quantity': jsonObject['quantity'] }
            ]
        });
        this.productSearch.current.reset();
        e.target.reset();
    }
    table() {
        if (this.state.rows.length) {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell numeric>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows.map(row => {
                            return (
                                <TableRow key={row['item_id']}>
                                    <TableCell component="th" scope="row">
                                        {this.props.products.data[row['item_id']].name}
                                    </TableCell>
                                    <TableCell numeric>{row['quantity']}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )
        } else {
            return (
                <React.Fragment>
                    <div style={{ height: '1rem' }}></div>
                    <Typography style={{
                        textAlign: 'center',
                        padding: '1rem',
                        margin: 0,
                        backgroundColor: '#eee'
                    }}>
                        Add a line to build sales record
                    </Typography>
                </React.Fragment>
            )
        }
    };
    render() {
        return (
            <React.Fragment>
                <ViewFrame padding={0}>
                    {this.table()}
                    <div style={{ padding: '1rem' }} >
                        <form onSubmit={this.addSalesRecordLine.bind(this)} noValidate autoComplete="off" >
                            <Grid container spacing={24}>
                                <Grid item md={8} sm={12}>
                                    <ProductSearch
                                        inputRef={this.productSearch}
                                        fullWidth
                                        label="Product"
                                        name="item_id"
                                        pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                                    />
                                </Grid>
                                <Grid item md={4} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantity"
                                        name="quantity"
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
                                        Add Line
                                    </Button>
                                    <span style={{ width: '1rem', display: 'inline-block' }}></span>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        disabled={(this.state.rows.length && this.productSearch.value === "") ? false : true}
                                    >
                                        <DoneIcon className="left-icon icon-small" />
                                        Complete
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </ViewFrame>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        products: state.products,
    }
}

export default connect(
    mapStateToProps
)(SalesRecordBuilder);