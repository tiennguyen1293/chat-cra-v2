import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:8000');

class App extends Component {
  state = {
    text: undefined,
  };

  componentDidMount() {}

  handleChange = e => {
    const text = e.target.value;
    socket.emit('new-message', text);
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
