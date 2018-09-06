// import React from 'react';
// import PropTypes from 'prop-types';
// import deburr from 'lodash/deburr';
// import keycode from 'keycode';
// import Downshift from 'downshift';
// import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import Popper from '@material-ui/core/Popper';
// import Paper from '@material-ui/core/Paper';
// import MenuItem from '@material-ui/core/MenuItem';
// import Chip from '@material-ui/core/Chip';

// function renderInput(inputProps) {
//     const { InputProps, classes, ref, ...other } = inputProps;
  
//     return (
//       <TextField
//         InputProps={{
//           inputRef: ref,
//           classes: {
//             root: classes.inputRoot,
//           },
//           ...InputProps,
//         }}
//         {...other}
//       />
//     );
//   }

//   function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
//     const isHighlighted = highlightedIndex === index;
//     const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;
  
//     return (
//       <MenuItem
//         {...itemProps}
//         key={suggestion.label}
//         selected={isHighlighted}
//         component="div"
//         style={{
//           fontWeight: isSelected ? 500 : 400,
//         }}
//       >
//         {suggestion.label}
//       </MenuItem>
//     );
//   }
//   renderSuggestion.propTypes = {
//     highlightedIndex: PropTypes.number,
//     index: PropTypes.number,
//     itemProps: PropTypes.object,
//     selectedItem: PropTypes.string,
//     suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
//   };

//   function getSuggestions(value) {
//     const inputValue = deburr(value.trim()).toLowerCase();
//     const inputLength = inputValue.length;
//     let count = 0;
  
//     return inputLength === 0
//       ? []
//       : suggestions.filter(suggestion => {
//           const keep =
//             count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
  
//           if (keep) {
//             count += 1;
//           }
  
//           return keep;
//         });
//   }
  
//   class DownshiftMultiple extends React.Component {
//     state = {
//       inputValue: '',
//       selectedItem: [],
//     };
  
//     handleKeyDown = event => {
//       const { inputValue, selectedItem } = this.state;
//       if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
//         this.setState({
//           selectedItem: selectedItem.slice(0, selectedItem.length - 1),
//         });
//       }
//     };
  
//     handleInputChange = event => {
//       this.setState({ inputValue: event.target.value });
//     };
  
//     handleChange = item => {
//       let { selectedItem } = this.state;
  
//       if (selectedItem.indexOf(item) === -1) {
//         selectedItem = [...selectedItem, item];
//       }
  
//       this.setState({
//         inputValue: '',
//         selectedItem,
//       });
//     };
  
//     handleDelete = item => () => {
//       this.setState(state => {
//         const selectedItem = [...state.selectedItem];
//         selectedItem.splice(selectedItem.indexOf(item), 1);
//         return { selectedItem };
//       });
//     };
  