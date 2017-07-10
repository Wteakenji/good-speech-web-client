import React, { Component } from 'react';
import {diffChars} from 'diff';
import { withStyles, createStyleSheet } from 'material-ui/styles';


const styleSheet = createStyleSheet('TextFeedback', theme => ({
  added: {
    color: 'green'
  },
  removed: {
      color: 'red'
  }
}));


class TextFeedback extends Component {

  propTypes: {
    textToRead: React.PropTypes.string.isRequired,
    textReaded: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      diff: []
    };
    this.compareStrings = this.compareStrings.bind(this);
    this.cleanTextToRead = this.cleanTextToRead.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let textReaded = nextProps.textReaded;

    if (textReaded.length > 0) {
      this.compareStrings(textReaded);
    }
  }

  cleanTextToRead(textToRead) {
    return textToRead.toLowerCase().replace(/[.,]/g, "");
  }

  compareStrings(textReaded) {
    const textToRead = this.cleanTextToRead(this.props.textToRead);

    this.setState({
      diff: diffChars(textToRead, textReaded)
    })
  }

  render() {
    const classes = this.props.classes;

    return (
      <p>
        {this.state.diff.map((part, index) => {
          let feedback = part.added ? classes.added :
            part.removed ? classes.removed : 'default';

          return <span key={index} className={feedback}>{part.value}</span>
        })}
      </p>
    );
  }
}

export default withStyles(styleSheet)(TextFeedback);