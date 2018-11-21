import React, { Suspense } from 'react';
import io from 'socket.io-client';

import { PORT_SERVER } from 'const';
import FormUser from 'components/FormUser';
import FormMessage from 'components/FormMessage';

import './App.css';

const Message = React.lazy(() => import('components/Message'));

const socket = io.connect(PORT_SERVER);

class App extends React.Component {
  state = {
    isSignIn: true,
    userCurrent: undefined,
    messageCountUser: '',
    username: '',
    message: '',
    listMessages: [],
    typing: false,
    isOthersTyping: false,
  };

  componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    socket.on('login', data => {
      this.showNumberUser(data);
    });

    socket.on('user-joined', data => {
      this.showNumberUser(data);
    });

    socket.on('new-message', (data) => {
      this.getLogsNewMessgage(data);
    });

    socket.on('typing', (data) => {
      this.addChatTyping(data);
    });

    socket.on('stop-typing', data => {
      this.setState({ typing: false });
    });
  }

  addChatTyping = (data) => {
    const { userCurrent } = this.state;
    this.setState({
      isOthersTyping: data.username !== userCurrent,
      typing: true,
    });
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });

    if (name === 'message' && value) {
      socket.emit('typing');
    } else {
      socket.emit('stop-typing');
    }
  }

  handleFocus = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'message' && value) {
      socket.emit('typing');
    }
  }

  handleBlur = (e) => {
    socket.emit('stop-typing');
  }

  handleSubmitUser = e => {
    e.preventDefault();
    const { username } = this.state;
    socket.emit('add-user', username);
    socket.emit('stop-typing');

    this.setState({
      userCurrent: username,
      isSignIn: false,
    });
  };

  handleSubmitMessage = e => {
    e.preventDefault();
    const { message, listMessages, username } = this.state;
    socket.emit('new-message', message);
    socket.emit('stop-typing');

    this.setState({
      listMessages: [...listMessages, { username, message, me: true }],
      message: '',
    });
  }

  showNumberUser = data => {
    if (data.numUsers === 1) {
      this.setState({ messageCountUser: "there's 1 participant" });
    } else {
      this.setState({
        messageCountUser: `there are ${data.numUsers} participants`,
      });
    }
  };

  getLogsNewMessgage = data => {
    const { listMessages } = this.state;
    this.setState({ listMessages: [...listMessages, { ...data, me: false }] });
  }

  render() {
    const {
      isSignIn,
      messageCountUser,
      listMessages,
      message,
      userCurrent,
      isOthersTyping,
      typing,
    } = this.state;

    return (
      <div className="App">
        {isSignIn ? (
          <FormUser
            handleSubmitUser={this.handleSubmitUser}
            username={userCurrent}
            messageCountUser={messageCountUser}
            handleChangeInput={this.handleChange}
            handleFocusInput={this.handleFocus}
            handleBlurInput={this.handleBlur}
          />
        ) : (
          <FormMessage
            handleSubmitMessage={this.handleSubmitMessage}
            message={message}
            messageCountUser={messageCountUser}
            handleChangeInput={this.handleChange}
            handleFocusInput={this.handleFocus}
            handleBlurInput={this.handleBlur}
          />
        )}
        {listMessages && (
          listMessages.map((item, index) => (
            <Suspense key={item.username + index} fallback={<div>Loading...</div>}>
              <Message
                username={item.username}
                userCurrent={item.me}
                message={item.message}
              />
            </Suspense>
          ))
        )}
        {isOthersTyping && typing && <h3>...</h3>}
      </div>
    );
  }
}

export default App;
