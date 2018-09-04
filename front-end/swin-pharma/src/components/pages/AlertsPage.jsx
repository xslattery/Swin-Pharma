import React, { Component } from 'react';
import ViewFrame from '../global/ViewFrame.jsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';

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
    render() {
        return (
            <React.Fragment>
                <ViewFrame>
                    <h2 className="no-margin">Alerts</h2>
                </ViewFrame>
                <ViewFrame>
                    <h1 className="no-margin">redux test: {this.props.test}</h1>
                </ViewFrame>
                <ViewFrame styles={{ padding: 0 }}>
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