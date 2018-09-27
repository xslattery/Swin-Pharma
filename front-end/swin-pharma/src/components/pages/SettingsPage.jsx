import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import ViewHeading from "../global/ViewHeading";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/EditTwoTone";

class SettingsPage extends Component {
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">App Settings</ViewHeading>
        <ViewFrame>
          <Typography variant="body1">
            Alert me when an items stock level drops below{" "}
            <span
              className="editable-field"
              onClick={() => {
                alert(0);
              }}
            >
              {1}
              <span className="editable-field-icon">
                <EditIcon fontSize="inherit" />
              </span>
            </span>
          </Typography>
        </ViewFrame>
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
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage);
