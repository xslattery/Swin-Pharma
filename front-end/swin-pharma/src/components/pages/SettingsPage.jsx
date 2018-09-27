import React, { Component } from "react";
import ViewFrame from "../global/ViewFrame.jsx";
import ViewHeading from "../global/ViewHeading";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class SettingsPage extends Component {
  render() {
    return (
      <React.Fragment>
        <ViewHeading variant="title">App Settings</ViewHeading>
        <ViewFrame />
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
