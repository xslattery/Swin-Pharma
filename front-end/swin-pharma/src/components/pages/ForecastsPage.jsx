import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import ViewHeading from "../global/ViewHeading";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import SyncIcon from "@material-ui/icons/SyncTwoTone";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadTwoTone";
import ordinalOf from "../../scripts/monthOrdinals";
import { fetchForecastData } from "../../actions/index.js";
import { bindActionCreators } from "redux";
import config from "../../scripts/config";
import daysInMonth from "../../scripts/daysInMonth";

class SalesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportItemType: "PRODUCT",
      type: "Month",
      date: "00-00-0000"
    };
  }
  getTableHead() {
    return (
      <TableRow>
        <TableCell>Product Name</TableCell>
        {(() => {
          if (this.props.forecastData.reportType === "Week") {
            return (
              <React.Fragment>
                <TableCell>Sunday</TableCell>
                <TableCell>Monday</TableCell>
                <TableCell>Tuesday</TableCell>
                <TableCell>Wednesday</TableCell>
                <TableCell>Thursday</TableCell>
                <TableCell>Friday</TableCell>
                <TableCell>Saturday</TableCell>
              </React.Fragment>
            );
          } else {
            return (() => {
              var results = [];
              for (
                var i = 1;
                i <=
                daysInMonth(
                  this.state.date.split("-")[1],
                  this.state.date.split("-")[2]
                );
                i++
              ) {
                results.push(<TableCell>{ordinalOf(i)}</TableCell>);
              }
              return results;
            })();
          }
        })()}
      </TableRow>
    );
  }
  getTableData() {
    var result = [];
    var totals = [];
    var totalsForecast = [];
    result.push(
      this.props.forecastData.rows.map(r => (
        <TableRow>
          <TableCell>{r.name}</TableCell>
          {r.day.map((c, i) => {
            if (typeof totals[i] === typeof undefined) totals[i] = 0;
            totals[i] = totals[i] + parseInt(c);
            return <TableCell>${c}</TableCell>;
          })}
          {r.forecast.map((c, i) => {
            if (typeof totalsForecast[i] === typeof undefined)
              totalsForecast[i] = 0;
            totalsForecast[i] = totalsForecast[i] + parseInt(c);
            return (
              <TableCell style={{ backgroundColor: "#ffeeee" }}>${c}</TableCell>
            );
          })}
        </TableRow>
      ))
    );
    result.push(
      <TableRow>
        <TableCell>
          <b>Total:</b>
        </TableCell>
        {this.props.forecastData.rows[0].day.map((c, i) => {
          return (
            <TableCell>
              <b>${totals[i]}</b>
            </TableCell>
          );
        })}
        {this.props.forecastData.rows[0].forecast.map((c, i) => {
          return (
            <TableCell style={{ backgroundColor: "#ffeeee" }}>
              <b>${totalsForecast[i]}</b>
            </TableCell>
          );
        })}
      </TableRow>
    );
    return result;
  }
  getTable() {
    if (this.props.forecastData.type !== "NULL") {
      return (
        <Table style={{ maxWidth: "100%" }}>
          <TableHead>{this.getTableHead()}</TableHead>
          <TableBody>{this.getTableData()}</TableBody>
        </Table>
      );
    }
  }
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">Get Sales Report</ViewHeading>
        <ViewFrame>
          <Grid container spacing={24}>
            <Grid item md={4} sm={12}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel htmlFor="SQVC5AP5OZ">Report Type</InputLabel>
                <Select
                  value={this.state.type}
                  onChange={e => {
                    this.setState({ ...this.state, type: e.target.value });
                  }}
                  autoWidth
                >
                  <MenuItem value={"Week"}>Week</MenuItem>
                  <MenuItem value={"Month"}>Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={12}>
              <TextField
                id="0QNXJD43O3"
                fullWidth
                value={this.state.date}
                onChange={e => {
                  this.setState({ ...this.state, date: e.target.value });
                }}
                label="Date"
                type="date"
              />
            </Grid>
            <Grid item md={4} sm={12}>
              <RadioGroup
                name="report_item_type"
                onChange={e => {
                  this.setState({
                    ...this.state,
                    reportItemType: e.target.value
                  });
                }}
              >
                <FormControlLabel
                  value="PRODUCT"
                  control={
                    <Radio checked={this.state.reportItemType == "PRODUCT"} />
                  }
                  label="Individual products"
                />
                <FormControlLabel
                  value="BRAND"
                  control={
                    <Radio checked={this.state.reportItemType == "BRAND"} />
                  }
                  label="Group by brand"
                />
              </RadioGroup>
            </Grid>
            <Grid item md={6} sm={12}>
              <Button
                onClick={() => {
                  if (
                    document
                      .getElementById("0QNXJD43O3")
                      .value.match(/^[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}$/)
                  ) {
                    this.props.fetchForecastData(
                      this.state.type,
                      this.state.date,
                      this.state.reportItemType
                    );
                  } else {
                    alert("Invalid report request!");
                  }
                }}
                variant="contained"
                size="small"
                color="primary"
              >
                <SyncIcon className="left-icon icon-small" />
                Get Report
              </Button>
              <span style={{ width: "1rem", display: "inline-block" }} />
            </Grid>
          </Grid>
        </ViewFrame>
        {(() => {
          if (this.props.forecastData.reportDate !== "NULL") {
            return (
              <React.Fragment>
                <ViewHeading variant="title">
                  {this.props.forecastData.reportType === "Week"
                    ? "Weekly"
                    : "Montly"}{" "}
                  Sales Report For {this.props.forecastData.reportDate}
                </ViewHeading>
                <ViewFrame padding={0} overflowX="auto">
                  {this.getTable()}
                </ViewFrame>
              </React.Fragment>
            );
          } else {
          }
        })()}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchForecastData
    },
    dispatch
  );
};

export default connect(
  state => ({
    forecastData: state.forecastData
  }),
  mapDispatchToProps
)(SalesPage);
