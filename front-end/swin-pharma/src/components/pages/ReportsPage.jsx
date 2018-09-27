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
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import SyncIcon from "@material-ui/icons/SyncTwoTone";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadTwoTone";
import ordinalOf from "../../scripts/monthOrdinals";
import { fetchReportData } from "../../actions/index.js";
import { bindActionCreators } from "redux";
import config from "../../scripts/config";

class SalesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "Month",
      date: "00/00/0000"
    };
  }
  getTableHead() {
    return (
      <TableRow>
        <TableCell>Product Name</TableCell>
        {(() => {
          if (this.props.reportData.reportType === "Week") {
            return (
              <React.Fragment>
                <TableCell>Monday</TableCell>
                <TableCell>Tuesday</TableCell>
                <TableCell>Wednesday</TableCell>
                <TableCell>Thursday</TableCell>
                <TableCell>Friday</TableCell>
                <TableCell>Saturday</TableCell>
                <TableCell>Sunday</TableCell>
              </React.Fragment>
            );
          } else {
            return this.props.reportData.rows[0].values.map((c, i) => (
              <TableCell>{ordinalOf(i + 1)}</TableCell>
            ));
          }
        })()}
      </TableRow>
    );
  }
  getTableData() {
    if (this.props.reportData.reportType === "Week") {
      var totals = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
      var result = [];
      for (var r in this.props.reportData.rows) {
        var thisRow = this.props.reportData.rows[r];
        totals = {
          mon: totals.mon + parseInt(thisRow.mon),
          tue: totals.tue + parseInt(thisRow.tue),
          wed: totals.wed + parseInt(thisRow.wed),
          thu: totals.thu + parseInt(thisRow.thu),
          fri: totals.fri + parseInt(thisRow.fri),
          sat: totals.sat + parseInt(thisRow.sat),
          sun: totals.sun + parseInt(thisRow.sun)
        };
        result.push(
          <TableRow>
            <TableCell>{thisRow.name}</TableCell>
            <TableCell>${thisRow.mon}</TableCell>
            <TableCell>${thisRow.tue}</TableCell>
            <TableCell>${thisRow.wed}</TableCell>
            <TableCell>${thisRow.thu}</TableCell>
            <TableCell>${thisRow.fri}</TableCell>
            <TableCell>${thisRow.sat}</TableCell>
            <TableCell>${thisRow.sun}</TableCell>
          </TableRow>
        );
      }
      console.log(totals);
      result.push(
        <TableRow>
          <TableCell>
            <b>Total:</b>
          </TableCell>
          <TableCell>
            <b>${totals.mon}</b>
          </TableCell>
          <TableCell>
            <b>${totals.tue}</b>
          </TableCell>
          <TableCell>
            <b>${totals.wed}</b>
          </TableCell>
          <TableCell>
            <b>${totals.thu}</b>
          </TableCell>
          <TableCell>
            <b>${totals.fri}</b>
          </TableCell>
          <TableCell>
            <b>${totals.sat}</b>
          </TableCell>
          <TableCell>
            <b>${totals.sun}</b>
          </TableCell>
        </TableRow>
      );
      return result;
    } else {
      var result = [];
      var totals = [];
      result.push(
        this.props.reportData.rows.map(r => (
          <TableRow>
            <TableCell>{r.name}</TableCell>
            {r.values.map((c, i) => {
              if (typeof totals[i] === typeof undefined) totals[i] = 0;
              totals[i] = totals[i] + parseInt(c);
              return <TableCell>${c}</TableCell>;
            })}
          </TableRow>
        ))
      );
      result.push(
        <TableRow>
          <TableCell>
            <b>Total:</b>
          </TableCell>
          {this.props.reportData.rows[0].values.map((c, i) => {
            return (
              <TableCell>
                <b>${totals[i]}</b>
              </TableCell>
            );
          })}
        </TableRow>
      );
      return result;
    }
  }
  getTable() {
    if (this.props.reportData.type !== "NULL") {
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
            <Grid item md={6} sm={12}>
              <FormControl
                style={{
                  width: "100%"
                }}
              >
                <InputLabel htmlFor="SQVC5AP5OZ">Report Type</InputLabel>
                <Select
                  value={this.state.type}
                  onChange={e => {
                    this.setState({
                      ...this.state,
                      type: e.target.value
                    });
                  }}
                  //   input={<Input id="SQVC5AP5OZ" />}
                  autoWidth
                >
                  <MenuItem value={"Week"}>Week</MenuItem>
                  <MenuItem value={"Month"}>Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} sm={12}>
              <TextField
                id="0QNXJD43O3"
                fullWidth
                value={this.state.date}
                onChange={e => {
                  this.setState({
                    ...this.state,
                    date: e.target.value
                  });
                }}
                label="Date"
                type="date"
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <Button
                onClick={() => {
                  if (
                    document
                      .getElementById("0QNXJD43O3")
                      .value.match(/^[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}$/)
                  ) {
                    this.props.fetchReportData(
                      this.state.type,
                      this.state.date
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
              <Button
                onClick={() => {
                  var dummyIframe = document.createElement("iframe");
                  dummyIframe.style.display = "none";
                  dummyIframe.style.width = "0px";
                  dummyIframe.style.height = "0px";
                  document.body.appendChild(dummyIframe);
                  dummyIframe.src =
                    config.serverRoot +
                    "api/Report/" +
                    this.props.reportData.reportType +
                    "/report.csv?date=" +
                    this.state.date;
                }}
                variant="contained"
                size="small"
                color="primary"
              >
                <CloudDownloadIcon className="left-icon icon-small" />
                Export CSV
              </Button>
            </Grid>
          </Grid>
        </ViewFrame>
        {(() => {
          if (this.props.reportData.reportDate !== "NULL") {
            return (
              <React.Fragment>
                <ViewHeading variant="title">
                  {this.props.reportData.reportType === "Week"
                    ? "Weekly"
                    : "Montly"}{" "}
                  Sales Report For {this.props.reportData.reportDate}
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
      fetchReportData
    },
    dispatch
  );
};

export default connect(
  state => ({
    reportData: state.reportData
  }),
  mapDispatchToProps
)(SalesPage);
