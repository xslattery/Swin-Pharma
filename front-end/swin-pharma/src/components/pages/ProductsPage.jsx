import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import ViewHeading from "../global/ViewHeading";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import TableRow from "@material-ui/core/TableRow";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import { connect } from "react-redux";
import appConfig from "../../scripts/config";
import axios from "axios";
import { fetchProducts } from "../../actions/index";
import { bindActionCreators } from "redux";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import qs from "qs";

function resolveFieldDisplayName(fieldName) {
  var definitions = {
    id: "Product #",
    brand: "Brand Name",
    name: "Product Name",
    barcode: "SKU",
    purchasePrice: "Supply Cost",
    retailPrice: "Retail Price",
    quantity: "Stock Level"
  };
  for (var d in definitions) {
    if (d == fieldName) return definitions[d];
  }
  return fieldName;
}

class ProductsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingEditDialogue: false,
      editDialogueProductCode: "",
      editDialogueFieldName: "",
      editDialogueFieldValue: ""
    };
  }
  deleteButton(productCode) {
    return (
      <IconButton
        onClick={(productCode => {
          return () => {
            if (
              window.confirm(
                "Are you sure you want to delete product " + productCode
              )
            ) {
              axios
                .delete(appConfig.serverRoot + "api/Inventory/" + productCode)
                .then(res => {
                  this.props.fetchProducts();
                });
            }
          };
        })(productCode)}
      >
        <DeleteIcon />
      </IconButton>
    );
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
  componentDidMount() {
    this.props.fetchProducts();
  }
  newProduct(e) {
    e.preventDefault();
    var data = new FormData(e.target);
    var fetchProducts = (form => {
      return () => {
        this.props.fetchProducts();
        form.reset();
      };
    })(e.target);
    axios({
      method: "POST",
      url: appConfig.serverRoot + "api/Inventory",
      data: data
    })
      .then(fetchProducts)
      .catch(function(error) {
        alert("An unexpected error occurred while adding a new product.");
        window.location.reload();
      });
  }
  editProduct() {
    // prep data
    var data = {
      ...this.props.products.data[this.state.editDialogueProductCode]
    };
    data["id"] = this.state.editDialogueProductCode;
    data[this.state.editDialogueFieldName] = this.state.editDialogueFieldValue;
    console.log(data);
    // submit update request
    axios({
      method: "PUT",
      url:
        appConfig.serverRoot +
        "api/Inventory/" +
        this.state.editDialogueProductCode,
      data: qs.stringify(data)
    })
      .then(() => {
        this.props.fetchProducts();
      })
      .catch(function(error) {
        alert("An unexpected error occurred while editing product.");
        window.location.reload();
      });
  }
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">Add a new product</ViewHeading>
        <ViewFrame>
          <form
            onSubmit={this.newProduct.bind(this)}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={24}>
              <Grid item md={6} sm={12}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <TextField
                  fullWidth
                  multiline
                  rowsMax="4"
                  autoComplete="off"
                  name="name"
                  label="Product Name"
                />
              </Grid>
              <Grid item md={3} sm={12}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="barcode"
                  pattern="[a-zA-Z \-_\\!\#\$\(\)]"
                />
              </Grid>
              <Grid item md={3} sm={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="s">Wholesale Cost</InputLabel>
                  <Input
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    name="purchasePrice"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="s">Retail Price</InputLabel>
                  <Input
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    name="retailPrice"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12}>
                <TextField
                  fullWidth
                  label="Stock Level"
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
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </ViewFrame>
        <ViewHeading variant="title">Your products</ViewHeading>
        <ViewFrame padding={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell numeric>{resolveFieldDisplayName("id")}</TableCell>
                <TableCell>{resolveFieldDisplayName("brand")}</TableCell>
                <TableCell>{resolveFieldDisplayName("name")}</TableCell>
                <TableCell>{resolveFieldDisplayName("barcode")}</TableCell>
                <TableCell numeric>
                  {resolveFieldDisplayName("purchasePrice")}
                </TableCell>
                <TableCell numeric>
                  {resolveFieldDisplayName("retailPrice")}
                </TableCell>
                <TableCell numeric>
                  {resolveFieldDisplayName("quantity")}
                </TableCell>
                <TableCell numeric>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.products.index.map(productCode => {
                var thisProduct = this.props.products.data[productCode];
                return (
                  <TableRow key={productCode}>
                    <TableCell numeric>{productCode}</TableCell>
                    <TableCell>
                      {this.EditableField(
                        thisProduct.brand,
                        productCode,
                        "brand"
                      )}
                    </TableCell>
                    <TableCell>
                      {this.EditableField(
                        thisProduct.name,
                        productCode,
                        "name"
                      )}
                    </TableCell>
                    <TableCell>
                      {this.EditableField(
                        thisProduct.barcode,
                        productCode,
                        "barcode"
                      )}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(
                        thisProduct.purchasePrice,
                        productCode,
                        "purchasePrice"
                      )}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(
                        thisProduct.retailPrice,
                        productCode,
                        "retailPrice"
                      )}
                    </TableCell>
                    <TableCell numeric>
                      {this.EditableField(
                        thisProduct.quantity,
                        productCode,
                        "quantity"
                      )}
                    </TableCell>
                    <TableCell numeric>
                      {this.deleteButton(productCode)}
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
          <DialogTitle>
            {this.getProductById(this.state.editDialogueProductCode).name}
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
                this.editProduct();
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

const mapStateToProps = function(state) {
  return {
    products: state.products
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchProducts: fetchProducts
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsPage);
