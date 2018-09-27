import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import ViewHeading from "../global/ViewHeading";
import { connect } from "react-redux";
import appConfig from "../../scripts/config";
import axios from "axios";
import SalesRecordBuilder from "../etc/SalesRecordBuilder";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  fetchSales,
  updateSalesRowsPerPage,
  salesChangePage
} from "../../actions/index";
import { bindActionCreators } from "redux";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import qs from "qs";

function resolveFieldDisplayName(fieldName) {
  var definitions = {
    saleId: "Sale #",
    itemId: "Product #",
    quantity: "Quantity",
    date: "Date",
    time: "Time"
  };
  for (var d in definitions) {
    if (d === fieldName) return definitions[d];
  }
  return fieldName;
}

class SalesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingEditDialogue: false,
      editDialogueSaleId: "",
      editDialogueFieldName: "",
      editDialogueFieldValue: ""
    };
  }
  deleteButton(saleId) {
    return (
      <IconButton
        onClick={(saleId => {
          return () => {
            if (
              window.confirm("Are you sure you want to delete sale " + saleId)
            ) {
              axios
                .delete(appConfig.serverRoot + "api/Sales/" + saleId)
                .then(res => {
                  this.props.fetchSales(
                    this.props.sales.meta.startingIndex,
                    this.props.sales.meta.rowsPerPage
                  );
                });
            }
          };
        })(saleId)}
      >
        <DeleteIcon />
      </IconButton>
    );
  }
  addSalesRecord(e) {
    e.preventDefault();
    var data = new FormData(e.target);
    axios({
      method: "post",
      url: appConfig.serverRoot + "api/Inventory",
      data: data,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
        alert("An unexpected error occurred while adding a new product.");
        window.location.reload();
      });
  }
  getSaleById(id) {
    for (var s in this.props.sales.data) {
      if (s == id) return this.props.sales.data[s];
    }
    return "";
  }
  editSale() {
    // prep data
    var data = {
      ...this.props.sales.data[this.state.editDialogueSaleId]
    };
    delete data["lastInGroup"];
    delete data["numberInGroup"];
    data[this.state.editDialogueFieldName] = this.state.editDialogueFieldValue;
    console.log(data);
    // submit update request
    axios({
      method: "PUT",
      url: appConfig.serverRoot + "api/Sales/" + this.state.editDialogueSaleId,
      data: qs.stringify(data)
    })
      .then(() => {
        this.props.fetchSales(
          this.props.sales.meta.startingIndex,
          this.props.sales.meta.rowsPerPage
        );
      })
      .catch(function(error) {
        alert("An unexpected error occurred while editing sales record.");
        window.location.reload();
      });
  }
  EditableField(text, saleId, fieldName) {
    return (
      <a
        className="editable-field"
        href="#"
        onClick={() => {
          this.setState({
            showingEditDialogue: true,
            editDialogueSaleId: saleId,
            editDialogueFieldName: fieldName,
            editDialogueFieldValue: this.getSaleById(saleId)[fieldName]
          });
        }}
      >
        {text}
        <span className="editable-field-icon">
          <EditIcon fontSize="inherit" />
        </span>
      </a>
    );
  }
  closeEditDialogue = () => {
    this.setState({ ...this.state, showingEditDialogue: false });
  };
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">Add a sales record</ViewHeading>
        <SalesRecordBuilder />
        <ViewHeading variant="title">Recent Sales</ViewHeading>
        <ViewFrame padding={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell numeric>
                  {resolveFieldDisplayName("saleId")}
                </TableCell>
                <TableCell numeric>
                  {resolveFieldDisplayName("itemId")}
                </TableCell>
                <TableCell numeric>
                  {resolveFieldDisplayName("quantity")}
                </TableCell>
                <TableCell numeric>{resolveFieldDisplayName("date")}</TableCell>
                <TableCell numeric>{resolveFieldDisplayName("time")}</TableCell>
                <TableCell numeric>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.sales.index.map(saleId => {
                var thisRow = this.props.sales.data[saleId];
                return (
                  <TableRow key={saleId}>
                    <TableCell component="th" scope="row" numeric>
                      {thisRow.groupId}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(thisRow.itemId, saleId, "itemId")}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(thisRow.quantity, saleId, "quantity")}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(thisRow.date, saleId, "date")}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(thisRow.time, saleId, "time")}
                    </TableCell>
                    <TableCell numeric>{this.deleteButton(saleId)} </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={this.props.sales.meta.totalSalesCount}
                  rowsPerPage={this.props.sales.meta.rowsPerPage}
                  page={
                    this.props.sales.meta.startingIndex /
                    this.props.sales.meta.rowsPerPage
                  }
                  onChangePage={(e, newPage) => {
                    this.props.salesChangePage(newPage);
                    this.props.fetchSales(
                      newPage * this.props.sales.meta.rowsPerPage,
                      this.props.sales.meta.rowsPerPage
                    );
                  }}
                  onChangeRowsPerPage={e => {
                    this.props.updateSalesRowsPerPage(e.target.value);
                    this.props.fetchSales(
                      this.props.sales.meta.startingIndex,
                      e.target.value
                    );
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </ViewFrame>
        <Dialog
          open={this.state.showingEditDialogue}
          onClose={this.closeEditDialogue}
        >
          <DialogTitle>
            {this.getSaleById(this.state.editDialogueSaleId).name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText />
            <TextField
              autoFocus
              value={this.state.editDialogueFieldValue}
              margin="dense"
              id="name"
              label={resolveFieldDisplayName(this.state.editDialogueFieldName)}
              onChange={e => {
                this.setState({
                  ...this.state,
                  editDialogueFieldValue: e.target.value
                });
              }}
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.closeEditDialogue}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.editSale();
                this.closeEditDialogue();
              }}
            >
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
    sales: state.sales
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSales,
      updateSalesRowsPerPage,
      salesChangePage
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesPage);
