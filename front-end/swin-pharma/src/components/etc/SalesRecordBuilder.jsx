import React, { Component, createRef } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import ProductSearch from "../etc/ProductSearch.jsx";
import appConfig from "../../scripts/config";
import { connect } from "react-redux";
import { fetchSales } from "../../actions/index";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import zeroFill from "../../scripts/zeroFill";
import { bindActionCreators } from "redux";
import qs from "qs";

class SalesRecordBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
    this.productSearch = createRef();
  }
  removeSalesRecordLine(itemId) {
    this.setState({
      rows: [
        ...this.state.rows.filter(r => {
          return r.itemId !== itemId;
        })
      ]
    });
  }
  rowWithIdExists(target) {
    var found = false;
    for (var i = 0; i < this.state.rows.length; i++) {
      if (this.state.rows[i].itemId === target) {
        found = true;
        break;
      }
    }
    return found;
  }
  addSalesRecordLine(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let jsonObject = {};
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }
    if (jsonObject.quantity < 1) {
      // invalid
      alert("Invalid line!");
    } else if (this.rowWithIdExists(jsonObject.itemId)) {
      // line already exists for this item
      alert("You have already listed this item in the current sale!");
    } else {
      this.setState({
        rows: [
          ...this.state.rows,
          { itemId: jsonObject.itemId, quantity: jsonObject.quantity }
        ]
      });

      //this.productSearch.current.reset();
      e.target.reset();
    }
  }
  submitSalesRecord(e) {
    e.preventDefault();
    axios.get(appConfig.serverRoot + "api/group").then(res => {
      var salesRecordId = res.data;
      var currentdate = new Date();
      var salesRecordDate =
        zeroFill(currentdate.getDate(), 2) +
        "/" +
        zeroFill(currentdate.getMonth(), 2) +
        "/" +
        (currentdate.getYear() + 1900);
      var salesRecordTime =
        zeroFill(currentdate.getHours(), 2) +
        ":" +
        zeroFill(currentdate.getMinutes(), 2);

      var requestsStillOut = 0;

      // submit post request for each row
      for (var i = 0; i < this.state.rows.length; i++) {
        (() => {
          var thisRow = this.state.rows[i];
          requestsStillOut++;
          axios
            .post(
              appConfig.serverRoot + "api/Sales",
              qs.stringify({
                groupId: salesRecordId,
                itemId: thisRow.itemId,
                date: salesRecordDate,
                time: salesRecordTime,
                quantity: thisRow.quantity,
                numberInGroup: i,
                lastInGroup: i == this.state.rows.length - 1 ? true : false
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              requestsStillOut--;
              if (requestsStillOut == 0) {
                this.props.fetchSales();
                this.setState({ rows: [] });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })();
      }
    });
  }
  table() {
    if (this.state.rows.length) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => {
              return (
                <TableRow key={row["itemId"]}>
                  <TableCell component="th" scope="row">
                    {this.props.products.data[row["itemId"]].name}
                  </TableCell>
                  <TableCell numeric>{row["quantity"]}</TableCell>
                  <TableCell numeric>
                    <Button
                      onClick={(itemId => {
                        return () => this.removeSalesRecordLine(itemId);
                      })(row["itemId"])}
                      size="small"
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    } else {
      return (
        <React.Fragment>
          <div style={{ height: "1rem" }} />
          <Typography
            style={{
              textAlign: "center",
              padding: "1rem",
              margin: 0,
              backgroundColor: "#eee"
            }}
          >
            Add a line to build sales record
          </Typography>
        </React.Fragment>
      );
    }
  }
  render() {
    return (
      <React.Fragment>
        <ViewFrame padding={0}>
          {this.table()}
          <div style={{ padding: "1rem" }}>
            <form
              onSubmit={this.addSalesRecordLine.bind(this)}
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={24}>
                <Grid item md={8} sm={12}>
                  <ProductSearch
                    inputRef={this.productSearch}
                    fullWidth
                    label="Product"
                    name="itemId"
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
                  <span style={{ width: "1rem", display: "inline-block" }} />
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={this.submitSalesRecord.bind(this)}
                    disabled={
                      this.state.rows.length === 0 &&
                      this.productSearch.value !== ""
                        ? true
                        : false
                    }
                  >
                    <DoneIcon className="left-icon icon-small" />
                    Complete
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </ViewFrame>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSales
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesRecordBuilder);
