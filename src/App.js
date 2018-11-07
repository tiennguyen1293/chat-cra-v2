import React, { Component } from 'react';
import socket from 'socket.io-client';
import './App.css';

class App extends Component {
  state = {
    text: undefined,
  };
  componentDidMount() {
    const ioClient = socket.connect('http://localhost:8000');
    ioClient.on('seq-num', msg => console.info(msg));
  }
  handleChange = e => {
    const text = e.target.value;
    this.setState({ text });
  };

  render() {
    const { text } = this.state;
    console.log(text);
    return (
      <div className="App">
        <input type="text" onChange={this.handleChange} />
        <p>{text}</p>
      </div>
    );
  }
}

export default App;
