import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

const PORT = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL : 'http://localhost:8000';
const socket = io.connect(PORT);

class App extends Component {
  state = {
    isSignIn: true,
    messageCountUser: '',
    username: undefined,
    message: '',
    dataMessage: [],
    typing: false,
    usernameTyping: undefined,
  };

  componentDidMount() {
    socket.on('login', data => {
      this.setState({ isSignIn: false });
      this.addParticipantsMessage(data);
    });

    socket.on('user-joined', data => {
      this.addParticipantsMessage(data);
    });

    socket.on('new-message', (data) => {
      this.updateMessage(data)
    });

    socket.on('typing', (data) => {
      this.addChatTyping(data);
    });
  }

  addChatTyping = (data) => {
    this.setState({usernameTyping: data.username, typing: true});
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });

    if(name ==='message' && value) {
      this.setState({ typing: true });
      socket.emit('typing');
    } else {
      this.setState({ typing: false });
      socket.emit('stop-typing');
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { username } = this.state;
    socket.emit('add-user', username);
    this.setState({
      username: '',
    })
  };

  handleSubmitMessage = e => {
    e.preventDefault();
    const { message, dataMessage, username } = this.state;
    socket.emit('new-message', message);
    this.setState({
      dataMessage: [...dataMessage, { username, message, me: true }],
      message: '',
    })
  }

  addParticipantsMessage = data => {
    if (data.numUsers === 1) {
      this.setState({ messageCountUser: "there's 1 participant" });
    } else {
      this.setState({
        messageCountUser: `there are ${data.numUsers} participants`,
      });
    }
  };

  updateMessage = data => {
    const { dataMessage } = this.state;
    this.setState({ dataMessage: [...dataMessage, {...data, me: false}] })
  }

  render() {
    const { isSignIn, messageCountUser, dataMessage, message, username } = this.state;

    return (
      <div className="App">
        {isSignIn ? (
          <form onSubmit={this.handleSubmit}>
            <h1>{messageCountUser}</h1>
            <input name="username" type="text" value={username} onChange={this.handleChange} />
          </form>
        ) : (
          <form onSubmit={this.handleSubmitMessage}>
            <h1>{messageCountUser}</h1>
            <input name="message" type="text" value={message} onChange={this.handleChange} />
          </form>
        )}
        {dataMessage && dataMessage.map((item, index) => (
          <React.Fragment key={item.username+index}>
            <h1>{item.me ? 'Me:' : `Username: ${item.username}`}</h1>
            <p>{item.message}</p>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default App;
