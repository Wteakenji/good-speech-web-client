import React, { Component } from 'react';
import Button from 'material-ui/Button';
import speechRecognition from '../services/speech-recognition';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('SpeechRecognizer', theme => ({
  center: {
    textAlign: 'center'
  },
  twoColumns: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 2.3em'
  },
  chrome: {
    width: '3em',
    verticalAlign: 'middle',
    marginRight: '1em'
  },
  chromeLegend: {
    paddingTop: '0.3em'
  }
}));

const isChrome = window.chrome && window.chrome.webstore;

class SpeechRecognizer extends Component {

  readingTimeout: null;

  static propTypes: {
    onSpeech: React.PropTypes.func.isRequired,
    classes: React.PropTypes.object.isRequired,
    langCode: React.PropTypes.String.isRequired,
    onReset: React.PropTypes.func.isRequired,
    displayResetButton: React.PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      reading: false
    }
    this.initSpeechRecognition(props);
    this.startReading = this.startReading.bind(this);
    this.stopReading = this.stopReading.bind(this);
  }

  initSpeechRecognition(props) {
    speechRecognition.init({
      interimResults: true,
      lang: props.langCode,
      onSpeech: this.handleSpeech.bind(this)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.langCode !== this.props.langCode) {
      this.initSpeechRecognition(nextProps);
    }
  }

  openGoogleChrome() {
    window.open('https://www.google.com/chrome/index.html', '_blank').focus();
  }

  handleSpeech(transcriptions) {
    clearTimeout(this.readingTimeout);
    this.readingTimeout = setTimeout(this.stopReading, 5000);
    this.props.onSpeech(transcriptions);
  }

  startReading() {
    this.setState({
      reading: true
    });
    speechRecognition.start();
  }

  stopReading() {
    this.setState({
      reading: false
    });
    speechRecognition.stop();
  }

  render() {
    const classes = this.props.classes;

    if (!isChrome) {
      return (
        <div className={classes.center}>
          <Button raised color='accent' onClick={this.openGoogleChrome}>
            <img alt='Google Chrome' src='/chrome.svg' className={classes.chrome}/>
            <span className={classes.chromeLegend}>Speech recognition is only supported by Google Chrome</span>
          </Button>
        </div>
      );
    }

    if (this.state.reading) {
      return (
        <div className={classes.center}>
          <Button raised color='accent' onClick={this.stopReading}>
            <i className='material-icons'>mic_off</i> Stop reading
          </Button>
        </div>
      );
    }

    if (this.props.displayResetButton) {
      return (
        <div className={classes.twoColumns}>
          <Button onClick={this.props.onReset}>
            <i className='material-icons'>replay</i> Reset
          </Button>
          <Button raised color='primary' onClick={this.startReading}>
            <i className='material-icons'>mic</i> Continue reading
          </Button>
        </div>
      );
    }

    return (
      <div className={classes.center}>
        <Button raised color='primary' onClick={this.startReading}>
          <i className='material-icons'>mic</i> Start reading
        </Button>
      </div>
    );
  }
}


export default withStyles(styleSheet)(SpeechRecognizer);
